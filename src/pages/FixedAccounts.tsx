import React, { useState, useEffect } from 'react';
import { 
  Repeat, 
  Calendar, 
  Trash2, 
  Plus, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Loader2,
  X,
  Wallet
} from 'lucide-react';
import { Card } from '../components/UI';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { useTranslation } from '../lib/i18n';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function FixedAccountsPage() {
  const { t } = useTranslation();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('VIVIENDA');
  const [amount, setAmount] = useState('');
  const [cycle, setCycle] = useState('Mensual');
  const [nextDate, setNextDate] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) fetchAccounts(user.id);
    });
  }, []);

  const fetchAccounts = async (userId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('fixed_accounts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setAccounts(data);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!name || !amount || !user) return;
    const { error } = await supabase.from('fixed_accounts').insert({
      user_id: user.id,
      name,
      category,
      amount: parseFloat(amount),
      cycle,
      next_due_date: nextDate,
      status: 'pending'
    });

    if (!error) {
      setShowForm(false);
      setName('');
      setAmount('');
      fetchAccounts(user.id);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('fixed_accounts').delete().eq('id', id);
    if (!error && user) fetchAccounts(user.id);
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'paid' ? 'pending' : 'paid';
    const { error } = await supabase
      .from('fixed_accounts')
      .update({ status: newStatus })
      .eq('id', id);
    if (!error && user) fetchAccounts(user.id);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">{t('nav.fixed')}</h1>
          <p className="text-slate-400">Compromisos recurrentes y suscripciones.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? t('cancel') : 'Añadir Cuenta'}
        </button>
      </div>

      {showForm && (
        <Card className="p-8 bg-slate-900/80 border-indigo-500/30">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nombre del Servicio</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Alquiler, Netflix" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t('amount')}</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Frecuencia</label>
              <select value={cycle} onChange={e => setCycle(e.target.value)} className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500">
                <option value="Mensual">Mensual</option>
                <option value="Anual">Anual</option>
                <option value="Semanal">Semanal</option>
              </select>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button onClick={handleSave} className="px-10 py-3 bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all">
              {t('save')}
            </button>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64 text-slate-500">
          <Loader2 className="animate-spin mr-2" /> {t('loading')}
        </div>
      ) : accounts.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-slate-500 italic">
          {t('no.data')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((acc) => (
            <Card key={acc.id} className={cn(
              "p-6 group hover:scale-[1.02] transition-all duration-300 border-white/5 relative overflow-hidden",
              acc.status === 'paid' ? "bg-emerald-500/5 border-emerald-500/20" : "bg-slate-900/40"
            )}>
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  <Repeat size={24} className={acc.status === 'paid' ? "text-emerald-400 group-hover:text-white" : "text-indigo-400 group-hover:text-white"} />
                </div>
                <div className="flex gap-1">
                   <button 
                    onClick={() => toggleStatus(acc.id, acc.status)}
                    className={cn(
                      "px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all",
                      acc.status === 'paid' ? "bg-emerald-500 text-white" : "bg-white/5 text-slate-400 hover:text-white"
                    )}
                   >
                     {acc.status === 'paid' ? 'Pagado' : 'Pendiente'}
                   </button>
                   <button onClick={() => handleDelete(acc.id)} className="p-1 text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">
                     <Trash2 size={16} />
                   </button>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-1">{acc.name}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
                  <span className="uppercase tracking-widest font-bold text-indigo-400/60">{acc.category}</span>
                  <span>•</span>
                  <span>{acc.cycle}</span>
                </div>

                <div className="flex justify-between items-end">
                   <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Próximo Pago</p>
                      <div className="flex items-center gap-2 text-white font-medium">
                         <Calendar size={14} className="text-indigo-400" />
                         {acc.next_due_date ? format(new Date(acc.next_due_date + 'T12:00:00'), 'dd MMM', { locale: es }) : 'N/A'}
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Monto</p>
                      <p className="text-2xl font-black text-white">{t('currency')}{Number(acc.amount).toLocaleString()}</p>
                   </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
