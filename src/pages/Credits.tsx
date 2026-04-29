import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  ArrowRight, 
  Plus, 
  Info, 
  ShieldCheck,
  Zap,
  TrendingDown,
  Trash2,
  Loader2,
  X,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { Card } from '../components/UI';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { useTranslation } from '../lib/i18n';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function CreditsPage() {
  const { t } = useTranslation();
  const [credits, setCredits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Form State
  const [bankName, setBankName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [remainingBalance, setRemainingBalance] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [installmentsTotal, setInstallmentsTotal] = useState('');
  const [installmentsPaid, setInstallmentsPaid] = useState('');
  const [paymentFrequency, setPaymentFrequency] = useState('mensual');
  const [interestRate, setInterestRate] = useState('');
  const [interestType, setInterestType] = useState('TEA');
  const [totalToReturn, setTotalToReturn] = useState('');

  // UI States
  const [selectedCredit, setSelectedCredit] = useState<any>(null);
  const [viewingCredit, setViewingCredit] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 16));

  useEffect(() => {
    if (selectedCredit) {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      setPaymentDate(now.toISOString().slice(0, 16));
    }
  }, [selectedCredit]);

  useEffect(() => {
    if (totalAmount && interestRate) {
      const capital = parseFloat(totalAmount);
      const rate = parseFloat(interestRate) / 100;
      let total = capital;
      if (interestType === 'Monto Fijo') {
        total = capital + parseFloat(interestRate);
      } else {
        total = capital * (1 + rate);
      }
      setTotalToReturn(total.toFixed(2));
      setRemainingBalance(total.toFixed(2));
    }
  }, [totalAmount, interestRate, interestType]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) fetchCredits(user.id);
    });
  }, []);

  const fetchCredits = async (userId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('credits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setCredits(data);
      if (viewingCredit) {
        const updated = data.find(c => c.id === viewingCredit.id);
        if (updated) setViewingCredit(updated);
      }
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!bankName || !user || !totalToReturn) return;
    setSaving(true);

    const { error } = await supabase.from('credits').insert({
      user_id: user.id,
      bank_name: bankName,
      total_amount: parseFloat(totalToReturn),
      remaining_balance: parseFloat(totalToReturn),
      monthly_payment: parseFloat(monthlyPayment) || (parseFloat(totalToReturn) / parseInt(installmentsTotal)),
      due_date: dueDate,
      installments_total: parseInt(installmentsTotal),
      installments_paid: parseInt(installmentsPaid) || 0,
      payment_frequency: paymentFrequency,
      interest_rate: parseFloat(interestRate),
      interest_type: interestType,
      total_to_return: parseFloat(totalToReturn)
    });

    if (!error) {
      setShowForm(false);
      resetForm();
      fetchCredits(user.id);
    }
    setSaving(false);
  };

  const handleAbono = async (creditToPay: any, amountToPay: number) => {
    if (!creditToPay || !user) return;
    setIsPaying(true);

    try {
      const { data: transactions } = await supabase.from('transactions').select('amount, type').eq('user_id', user.id);
      const currentBalance = (transactions || []).reduce((acc, tx) => {
        return tx.type === 'income' ? acc + Number(tx.amount) : acc - Number(tx.amount);
      }, 0);

      if (currentBalance < amountToPay) {
        alert(`Saldo insuficiente. Saldo actual: S/ ${currentBalance.toLocaleString()}. Necesitas S/ ${amountToPay.toLocaleString()}.`);
        setIsPaying(false);
        return;
      }

      const { error: txError } = await supabase.from('transactions').insert({
        user_id: user.id,
        amount: amountToPay,
        type: 'expense',
        category: 'Créditos',
        description: `Abono a crédito ${creditToPay.bank_name} (Cuota ${(creditToPay.installments_paid || 0) + 1})`,
        date: new Date().toISOString().split('T')[0],
        credit_id: creditToPay.id
      });

      if (txError) throw txError;

      let nextDate = null;
      if (creditToPay.due_date) {
        const date = new Date(creditToPay.due_date + 'T12:00:00');
        date.setMonth(date.getMonth() + 1);
        nextDate = date.toISOString().split('T')[0];
      }

      const newPaid = (creditToPay.installments_paid || 0) + 1;
      const { error: creditError } = await supabase
        .from('credits')
        .update({
          remaining_balance: creditToPay.remaining_balance - amountToPay,
          installments_paid: newPaid,
          due_date: nextDate,
          status: newPaid >= creditToPay.installments_total ? 'completado' : 'activo'
        })
        .eq('id', creditToPay.id);

      if (creditError) throw creditError;

      setSelectedCredit(null);
      fetchCredits(user.id);
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setIsPaying(false);
    }
  };

  const resetForm = () => {
    setBankName('');
    setTotalAmount('');
    setRemainingBalance('');
    setMonthlyPayment('');
    setDueDate('');
    setInstallmentsTotal('');
    setInstallmentsPaid('');
    setPaymentFrequency('mensual');
    setInterestRate('');
    setInterestType('TEA');
    setTotalToReturn('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar este crédito?')) return;
    const { error } = await supabase.from('credits').delete().eq('id', id);
    if (!error && user) {
      fetchCredits(user.id);
      setViewingCredit(null);
    }
  };

  const totalDebt = credits.reduce((acc, curr) => acc + Number(curr.remaining_balance), 0);
  const totalLimit = credits.reduce((acc, curr) => acc + Number(curr.total_amount), 0);
  const usagePercentage = totalLimit > 0 ? Math.round((totalDebt / totalLimit) * 100) : 0;

  return (
    <div className="space-y-10 pb-12 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">{t('nav.credits')}</h1>
          <p className="text-slate-400">Gestiona tus líneas de crédito y préstamos activos.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? t('cancel') : t('add.credit')}
        </button>
      </div>

      {showForm && (
        <Card className="p-8 bg-slate-900/80 border-indigo-500/30">
          <h3 className="text-xl font-bold text-white mb-8">Registrar Nuevo Crédito</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Banco / Entidad</label>
              <input type="text" value={bankName} onChange={e => setBankName(e.target.value)} placeholder="Ej: BCP, BBVA" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500" />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Capital Solicitado</label>
              <input type="number" value={totalAmount} onChange={e => setTotalAmount(e.target.value)} placeholder="0.00" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500" />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Frecuencia de Pago</label>
              <select value={paymentFrequency} onChange={e => setPaymentFrequency(e.target.value)} className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500">
                <option value="mensual">Mensual</option>
                <option value="semanal">Semanal</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tasa / Interés</label>
              <div className="flex gap-2">
                <input type="number" value={interestRate} onChange={e => setInterestRate(e.target.value)} placeholder="Ej: 15" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500" />
                <select value={interestType} onChange={e => setInterestType(e.target.value)} className="w-24 bg-[#0f172a] border border-white/10 rounded-xl px-2 py-3 text-sm text-white outline-none focus:border-indigo-500">
                  <option value="TEA">TEA %</option>
                  <option value="TEM">TEM %</option>
                  <option value="Monto Fijo">S/ Fijo</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest text-indigo-400">Total a Devolver (Est.)</label>
              <div className="w-full bg-indigo-500/10 border border-indigo-500/30 rounded-xl px-4 py-3 text-sm text-white font-bold">
                S/ {totalToReturn || '0.00'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Monto de Cuota (Opcional)</label>
              <input type="number" value={monthlyPayment} onChange={e => setMonthlyPayment(e.target.value)} placeholder="Auto-calculado si vacío" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500" />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Próximo Vencimiento</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Letras Totales</label>
                <input type="number" value={installmentsTotal} onChange={e => setInstallmentsTotal(e.target.value)} placeholder="24" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500" />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pagadas</label>
                <input type="number" value={installmentsPaid} onChange={e => setInstallmentsPaid(e.target.value)} placeholder="0" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500" />
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button onClick={handleSave} disabled={saving} className="px-10 py-3 bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
              {saving ? <Loader2 className="animate-spin" /> : t('save')}
            </button>
          </div>
        </Card>
      )}

      {/* Credit Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-l-4 border-indigo-500 border-white/5">
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Deuda Total</p>
           <p className="text-3xl font-black text-white">{t('currency')}{totalDebt.toLocaleString()}</p>
        </Card>
        <Card className="p-6 border-l-4 border-violet-500 border-white/5">
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Capacidad Utilizada</p>
           <p className="text-3xl font-black text-white">{usagePercentage}%</p>
           <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-violet-500 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)] transition-all" style={{ width: `${usagePercentage}%` }}></div>
           </div>
        </Card>
        <Card className="p-6 border-l-4 border-emerald-500 border-white/5">
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Préstamos Activos</p>
           <p className="text-3xl font-black text-white">{credits.filter(c => c.status !== 'completado').length}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-slate-500">
            <Loader2 className="animate-spin mr-2" /> {t('loading')}
          </div>
        ) : credits.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-slate-500 italic">
            {t('no.data')}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {credits.map(loan => {
              const progress = loan.total_amount > 0 ? Math.round(((loan.total_amount - loan.remaining_balance) / loan.total_amount) * 100) : 0;
              return (
                <Card 
                  key={loan.id} 
                  onClick={() => setViewingCredit(loan)}
                  className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-indigo-500/50 transition-all cursor-pointer group border-white/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-indigo-500/10">
                      <Zap size={24} className={loan.status === 'completado' ? 'text-emerald-400' : 'text-indigo-400'} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">{loan.bank_name}</h4>
                      <p className="text-xs text-slate-500 font-medium">
                        Letra {loan.installments_paid || 0} de {loan.installments_total} • {loan.payment_frequency}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex-1 max-w-md hidden sm:block">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      <span>Pendiente: S/ {Number(loan.remaining_balance).toLocaleString()}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Próximo Vencimiento</p>
                      <p className="text-sm font-bold text-white">
                        {loan.due_date ? format(new Date(loan.due_date + 'T12:00:00'), 'dd MMM', { locale: es }) : 'Finalizado'}
                      </p>
                    </div>
                    <ArrowRight size={20} className="text-slate-600 group-hover:text-indigo-400 transition-all" />
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* DETALLE FRAME (MODAL) */}
      {viewingCredit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <Card className="w-full max-w-2xl p-10 relative animate-in zoom-in-95 duration-300 border-indigo-500/30 bg-slate-950">
            <button onClick={() => setViewingCredit(null)} className="absolute top-8 right-8 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-all">
              <X size={24} />
            </button>

            <div className="flex items-center gap-6 mb-10">
              <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-2xl shadow-indigo-500/10">
                <CreditCard size={40} className="text-indigo-400" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white">{viewingCredit.bank_name}</h3>
                <p className="text-slate-400 font-medium">Detalle Maestro de Crédito</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Deuda Total Proyectada</p>
                  <p className="text-2xl font-bold text-white">S/ {Number(viewingCredit.total_amount).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 text-indigo-400">Saldo Pendiente Real</p>
                  <p className="text-3xl font-black text-white">S/ {Number(viewingCredit.remaining_balance).toLocaleString()}</p>
                </div>
              </div>
              <div className="space-y-6 bg-white/5 p-6 rounded-3xl border border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Letras Totales</span>
                  <span className="text-lg font-bold text-white">{viewingCredit.installments_total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Letras Pagadas</span>
                  <span className="text-lg font-bold text-emerald-400">{viewingCredit.installments_paid || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Letras Pendientes</span>
                  <span className="text-lg font-bold text-indigo-400">
                    {viewingCredit.installments_total - (viewingCredit.installments_paid || 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => handleDelete(viewingCredit.id)}
                className="py-4 bg-rose-500/10 text-rose-400 font-bold rounded-2xl hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={18} /> Eliminar Crédito
              </button>
              <button 
                onClick={() => handleAbono(viewingCredit, viewingCredit.monthly_payment)}
                disabled={isPaying || viewingCredit.status === 'completado'}
                className="py-4 bg-indigo-500 text-white font-bold rounded-2xl hover:bg-indigo-400 transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2"
              >
                {isPaying ? <Loader2 className="animate-spin" /> : (
                  <>
                    <CheckCircle2 size={18} /> 
                    {viewingCredit.status === 'completado' ? 'CRÉDITO PAGADO' : `PAGAR CUOTA (S/ ${viewingCredit.monthly_payment?.toLocaleString()})`}
                  </>
                )}
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Floating Calendar Button */}
      <button 
        onClick={() => setShowCalendar(true)}
        className="fixed bottom-12 right-12 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl shadow-indigo-500/40 flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-40 group"
      >
        <Calendar size={28} />
      </button>

      {/* Calendar Overlay (Simplified) */}
      {showCalendar && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
           <Card className="w-full max-w-4xl p-8 relative animate-in zoom-in-95 duration-300 bg-slate-950/90">
              <button onClick={() => setShowCalendar(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-all"><X size={24} /></button>
              <h3 className="text-3xl font-bold text-white mb-8">Calendario de Pagos</h3>
              <div className="grid grid-cols-7 gap-4 mb-8">
                 {Array.from({ length: 31 }).map((_, i) => {
                   const day = i + 1;
                   const hasPayment = credits.some(c => c.due_date && new Date(c.due_date + 'T12:00:00').getDate() === day);
                   return (
                     <div key={i} className={cn("h-16 rounded-xl border flex flex-col items-center justify-center transition-all", hasPayment ? "bg-indigo-500/10 border-indigo-500/30 text-white" : "bg-white/5 border-white/5 text-slate-600")}>
                        <span className="text-sm font-bold">{day}</span>
                        {hasPayment && <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1"></div>}
                     </div>
                   );
                 })}
              </div>
           </Card>
        </div>
      )}
    </div>
  );
}
