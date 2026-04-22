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
  X
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
    if (!bankName || !user) return;
    setSaving(true);

    const { error } = await supabase.from('credits').insert({
      user_id: user.id,
      bank_name: bankName,
      total_amount: parseFloat(totalAmount),
      remaining_balance: parseFloat(remainingBalance),
      monthly_payment: parseFloat(monthlyPayment),
      due_date: dueDate,
      installments_total: parseInt(installmentsTotal),
      installments_paid: parseInt(installmentsPaid)
    });

    if (!error) {
      setShowForm(false);
      resetForm();
      fetchCredits(user.id);
    }
    setSaving(false);
  };

  const resetForm = () => {
    setBankName('');
    setTotalAmount('');
    setRemainingBalance('');
    setMonthlyPayment('');
    setDueDate('');
    setInstallmentsTotal('');
    setInstallmentsPaid('');
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
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('amount')} Total</label>
              <input type="number" value={totalAmount} onChange={e => setTotalAmount(e.target.value)} placeholder="0.00" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500" />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Saldo Pendiente</label>
              <input type="number" value={remainingBalance} onChange={e => setRemainingBalance(e.target.value)} placeholder="0.00" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500" />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cuota Mensual</label>
              <input type="number" value={monthlyPayment} onChange={e => setMonthlyPayment(e.target.value)} placeholder="0.00" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500" />
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
                            <p className="text-xs text-slate-500 font-medium">Cuota {loan.installments_paid}/{loan.installments_total}</p>
                          </div>
                      </div>
                      
                      <div className="flex-1 max-w-md hidden sm:block">
                          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                            <span>Progreso de Pago</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                      </div>

                      <div className="flex items-center gap-8 justify-between md:justify-end">
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Próximo Pago</p>
                            <p className="text-sm font-bold text-white">{t('currency')}{Number(loan.monthly_payment).toLocaleString()} • {loan.due_date ? format(new Date(loan.due_date), 'dd MMM', { locale: es }) : 'N/A'}</p>
                          </div>
                          <button 
                            onClick={() => handleDelete(loan.id)}
                            className="p-2 rounded-xl bg-white/5 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                          >
                            <Trash2 size={20} />
                          </button>
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
    </div>
  );
}
