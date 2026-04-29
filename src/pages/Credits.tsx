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
  Calendar
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
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 16));

  useEffect(() => {
    if (selectedCredit) {
      // Ajuste de zona horaria para datetime-local
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      setPaymentDate(now.toISOString().slice(0, 16));
    }
  }, [selectedCredit]);

  // Helper to calculate total to return
  useEffect(() => {
    if (totalAmount && interestRate) {
      const capital = parseFloat(totalAmount);
      const rate = parseFloat(interestRate) / 100;
      let total = capital;
      
      if (interestType === 'Monto Fijo') {
        total = capital + parseFloat(interestRate);
      } else {
        // Simplificación: Interés simple para el cálculo de "Total a Devolver"
        // ya que el banco suele dar el monto final proyectado.
        total = capital * (1 + rate);
      }
      setTotalToReturn(total.toFixed(2));
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
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!bankName || !user || !totalToReturn) return;
    setSaving(true);

    const { error } = await supabase.from('credits').insert({
      user_id: user.id,
      bank_name: bankName,
      total_amount: parseFloat(totalAmount),
      remaining_balance: parseFloat(remainingBalance),
      monthly_payment: parseFloat(monthlyPayment),
      due_date: dueDate,
      installments_total: parseInt(installmentsTotal),
      installments_paid: parseInt(installmentsPaid),
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

  const handleAbono = async () => {
    if (!selectedCredit || !paymentAmount || !user) return;
    setIsPaying(true);

    const amount = parseFloat(paymentAmount);

    try {
      // 1. VALIDACIÓN DE SALDO EN TIEMPO REAL
      const { data: transactions } = await supabase.from('transactions').select('amount, type').eq('user_id', user.id);
      const currentBalance = (transactions || []).reduce((acc, tx) => {
        return tx.type === 'income' ? acc + Number(tx.amount) : acc - Number(tx.amount);
      }, 0);

      if (currentBalance < amount) {
        alert(`Saldo insuficiente. Tu saldo actual es S/ ${currentBalance.toLocaleString()}. Necesitas S/ ${amount.toLocaleString()} para este abono.`);
        setIsPaying(false);
        return;
      }

      // 2. Registrar Egreso
      const { error: txError } = await supabase.from('transactions').insert({
        user_id: user.id,
        amount: amount,
        type: 'expense',
        category: 'Créditos',
        description: `Abono a crédito ${selectedCredit.bank_name} (Cuota ${selectedCredit.installments_paid + 1})`,
        date: paymentDate.split('T')[0],
        created_at: new Date(paymentDate).toISOString(),
        credit_id: selectedCredit.id
      });

      if (txError) throw txError;

      // 3. Calcular Nueva Fecha de Vencimiento (+1 mes)
      let nextDate = null;
      if (selectedCredit.due_date) {
        const date = new Date(selectedCredit.due_date + 'T12:00:00');
        date.setMonth(date.getMonth() + 1);
        nextDate = date.toISOString().split('T')[0];
      }

      // 4. Actualizar Crédito
      const newRemaining = selectedCredit.remaining_balance - amount;
      const { error: creditError } = await supabase
        .from('credits')
        .update({
          remaining_balance: newRemaining,
          installments_paid: (selectedCredit.installments_paid || 0) + 1,
          due_date: nextDate // Actualización automática de fecha
        })
        .eq('id', selectedCredit.id);

      if (creditError) throw creditError;

      setSelectedCredit(null);
      setPaymentAmount('');
      fetchCredits(user.id);
    } catch (e: any) {
      alert("Error al procesar el abono: " + e.message);
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
    const { error } = await supabase.from('credits').delete().eq('id', id);
    if (!error && user) {
      fetchCredits(user.id);
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
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Monto de Cuota</label>
              <input type="number" value={monthlyPayment} onChange={e => setMonthlyPayment(e.target.value)} placeholder="0.00" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500" />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Saldo Pendiente Real</label>
              <input type="number" value={remainingBalance} onChange={e => setRemainingBalance(e.target.value)} placeholder="0.00" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500" />
            </div>
            
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Próximo Vencimiento</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cuotas Totales</label>
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
           <div className="mt-4 flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <TrendingDown size={14} />
              Calculado real
           </div>
        </Card>
        <Card className="p-6 border-l-4 border-violet-500 border-white/5">
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Capacidad Utilizada</p>
           <p className="text-3xl font-black text-white">{usagePercentage}%</p>
           <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-violet-500 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)] transition-all duration-1000" style={{ width: `${usagePercentage}%` }}></div>
           </div>
        </Card>
        <Card className="p-6 border-l-4 border-emerald-500 border-white/5">
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Score Crediticio (Est.)</p>
           <p className="text-3xl font-black text-white">782</p>
           <p className="mt-4 text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Excelente</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Loans Section */}
        <section className="lg:col-span-12 space-y-6">
           <div className="flex justify-between items-center px-1">
              <h3 className="text-xl font-bold text-white">Préstamos y Líneas Activas</h3>
              <button className="text-xs font-bold text-indigo-400 hover:underline">Ver Historial</button>
           </div>
           
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
                    <Card key={loan.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/20 transition-all group border-white/5">
                      <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-indigo-500/10 transition-colors">
                            <Zap size={24} className="text-indigo-400" />
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
                        <span>Progreso (S/ {Number(loan.remaining_balance).toLocaleString()} pendiente)</span>
                        <span>{progress}%</span>
                      </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-2">
                             <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Interés proyectado: S/ {(loan.total_to_return - loan.total_amount).toLocaleString()}</span>
                             <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-tighter">Costo Total: {(((loan.total_to_return - loan.total_amount) / loan.total_amount) * 100).toFixed(1)}%</span>
                          </div>
                      </div>

                      <div className="flex items-center gap-6 justify-between md:justify-end">
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Próxima Cuota</p>
                            <p className="text-sm font-bold text-white">S/ {Number(loan.monthly_payment).toLocaleString()} • {loan.due_date ? format(new Date(loan.due_date + 'T12:00:00'), 'dd MMM', { locale: es }) : 'N/A'}</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                             <button 
                               onClick={() => {
                                 setSelectedCredit(loan);
                                 setPaymentAmount(loan.monthly_payment.toString());
                               }}
                               className="px-4 py-2 bg-indigo-500 text-white text-xs font-bold rounded-xl hover:bg-indigo-400 transition-all shadow-lg shadow-indigo-500/10"
                             >
                               Abonar
                             </button>
                             <button 
                               onClick={() => handleDelete(loan.id)}
                               className="p-2 rounded-xl bg-white/5 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                             >
                               <Trash2 size={20} />
                             </button>
                          </div>
                      </div>
                    </Card>
                  );
                })}
             </div>
           )}

           <Card className="p-6 bg-indigo-600/5 border-dashed border-indigo-500/30 flex items-center gap-4">
              <Info className="text-indigo-400 shrink-0" size={24} />
              <div className="text-sm text-slate-300">
                <span className="font-bold text-indigo-300">Tip de Ahorro:</span> Mantén el uso de tus tarjetas por debajo del 30% para optimizar tu score crediticio.
              </div>
           </Card>
        </section>
      </div>

      {/* Abono Modal */}
      {selectedCredit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-md p-8 relative animate-in slide-in-from-bottom-4 duration-300 shadow-2xl border-indigo-500/30">
            <button 
              onClick={() => setSelectedCredit(null)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-all"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <CreditCard size={32} className="text-indigo-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Abonar a Cuota</h3>
                <p className="text-slate-400 text-sm">{selectedCredit.bank_name}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Monto a Pagar (Soles)</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-white">S/</span>
                  <input 
                    type="number" 
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full bg-transparent border-none text-4xl font-bold text-white focus:ring-0 p-0 placeholder-white/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Fecha y Hora del Pago</label>
                <input 
                  type="datetime-local" 
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                <ShieldCheck size={20} className="text-amber-400 shrink-0" />
                <p className="text-xs text-slate-400">Esta acción descontará el saldo de tu navbar y registrará un egreso automáticamente.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setSelectedCredit(null)}
                  className="py-4 bg-white/5 text-slate-400 font-bold rounded-2xl hover:bg-white/10 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleAbono}
                  disabled={isPaying || !paymentAmount}
                  className="py-4 bg-indigo-500 text-white font-bold rounded-2xl hover:bg-indigo-400 transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center"
                >
                  {isPaying ? <Loader2 className="animate-spin" /> : 'Confirmar'}
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Floating Calendar Button */}
      <button 
        onClick={() => setShowCalendar(true)}
        className="fixed bottom-24 right-8 lg:bottom-12 lg:right-12 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl shadow-indigo-500/40 flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-40 group"
      >
        <Calendar size={28} />
        <span className="absolute right-20 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none">Ver Calendario de Pagos</span>
      </button>

      {/* Calendar Overlay */}
      {showCalendar && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
           <Card className="w-full max-w-4xl p-8 relative animate-in zoom-in-95 duration-300 bg-slate-950/90">
              <button 
                onClick={() => setShowCalendar(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-all"
              >
                <X size={24} />
              </button>
              
              <div className="mb-8">
                 <h3 className="text-3xl font-bold text-white mb-2">Calendario de Pagos</h3>
                 <p className="text-slate-500">Organiza tus próximos vencimientos bancarios.</p>
              </div>

              <div className="grid grid-cols-7 gap-4 mb-8">
                 {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
                   <div key={d} className="text-center text-[10px] font-bold text-slate-600 uppercase">{d}</div>
                 ))}
                 {/* Simplified Grid */}
                 {Array.from({ length: 31 }).map((_, i) => {
                   const day = i + 1;
                   const hasPayment = credits.some(c => c.due_date && new Date(c.due_date + 'T12:00:00').getDate() === day);
                   return (
                     <div key={i} className={cn(
                       "h-20 rounded-2xl border flex flex-col items-center justify-center relative transition-all",
                       hasPayment ? "bg-indigo-500/10 border-indigo-500/30 text-white" : "bg-white/5 border-white/5 text-slate-600"
                     )}>
                        <span className="text-sm font-bold">{day}</span>
                        {hasPayment && (
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1"></div>
                        )}
                        {hasPayment && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-indigo-600 rounded-2xl transition-all cursor-help p-2 text-center">
                             <span className="text-[8px] font-black leading-tight uppercase">Pago Pendiente</span>
                          </div>
                        )}
                     </div>
                   );
                 })}
              </div>

              <div className="bg-white/5 rounded-2xl p-6 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
                       <Zap size={20} />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-white">Próximo Vencimiento Crítico</p>
                       <p className="text-xs text-slate-400">BCP - 25 de Mayo (S/ 417.50)</p>
                    </div>
                 </div>
                 <button className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all">Ver todos los detalles</button>
              </div>
           </Card>
        </div>
      )}
    </div>
  );
}
