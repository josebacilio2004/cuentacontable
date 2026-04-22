import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Filter, 
  Download, 
  Plus, 
  TrendingUp, 
  CheckCircle2, 
  Wallet,
  X,
  Trash2,
  Loader2
} from 'lucide-react';
import { Card } from '../components/UI';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useTranslation } from '../lib/i18n';

export function IncomePage() {
  const { t } = useTranslation();
  const [incomes, setIncomes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Form State
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Negocio 1');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isShared, setIsShared] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) fetchIncomes(user.id);
    });
  }, []);

  const fetchIncomes = async (userId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'income')
      .order('date', { ascending: false });

    if (!error && data) {
      setIncomes(data);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!amount || !user) return;
    setSaving(true);

    const { error } = await supabase.from('transactions').insert({
      user_id: user.id,
      amount: parseFloat(amount),
      type: 'income',
      category,
      description,
      date,
      is_shared: isShared
    });

    if (!error) {
      setAmount('');
      setDescription('');
      fetchIncomes(user.id);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (!error && user) {
      fetchIncomes(user.id);
    }
  };

  const totalIncome = incomes.reduce((acc, curr) => acc + Number(curr.amount), 0);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Calendar size={14} />
            <span className="text-xs font-bold uppercase tracking-widest">{format(new Date(), 'MMMM yyyy', { locale: es })}</span>
          </div>
          <h1 className="text-4xl font-bold text-white">Ingresos</h1>
        </div>
        
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-8 py-4 flex flex-col items-end shadow-[0_0_15px_rgba(78,222,163,0.1)]">
          <span className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">{t('total.received')}</span>
          <span className="text-4xl font-bold text-emerald-400 tracking-tight">{t('currency')}{totalIncome.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Table Card */}
        <Card className="lg:col-span-8 p-0 overflow-hidden border-white/5">
          <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/5 backdrop-blur-md">
            <h3 className="font-semibold text-white">Registro de Transacciones</h3>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg hover:bg-white/10 text-slate-400 transition-colors">
                <Filter size={18} />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto min-h-[300px]">
            {loading ? (
              <div className="flex items-center justify-center h-64 text-slate-500">
                <Loader2 className="animate-spin mr-2" /> {t('loading')}
              </div>
            ) : incomes.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-slate-500 italic">
                {t('no.data')}
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">
                    <th className="px-6 py-4">{t('date')}</th>
                    <th className="px-6 py-4">{t('description')}</th>
                    <th className="px-6 py-4">{t('category')}</th>
                    <th className="px-6 py-4 text-right">{t('amount')}</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {incomes.map((tx) => (
                    <tr key={tx.id} className="group hover:bg-white/5 transition-colors">
                      <td className="px-6 py-5 text-slate-300 text-sm whitespace-nowrap">
                        {format(new Date(tx.date), 'dd MMM', { locale: es })}
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-medium text-white">{tx.category}</div>
                        <div className="text-[10px] text-slate-500">{tx.description || 'Sin descripción'}</div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/5 text-slate-300 border border-white/10 group-hover:border-indigo-500/30 group-hover:text-indigo-400 transition-colors uppercase">
                          {tx.category}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right font-bold text-emerald-400">{t('currency')}{Number(tx.amount).toLocaleString()}</td>
                      <td className="px-6 py-5 text-right">
                        <button 
                          onClick={() => handleDelete(tx.id)}
                          className="p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>

        {/* Side Panel: Add Income */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card className="p-6 bg-slate-900/80 border-white/10">
            <h3 className="text-xl font-bold text-white mb-8">{t('add.income')}</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">{t('amount')}</label>
                <div className="relative">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl font-bold text-emerald-400 ">{t('currency')}</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-transparent border-none text-4xl font-bold text-white focus:ring-0 p-0 pl-8 border-b border-white/10 pb-2 placeholder-white/20"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t('description')}</label>
                <input 
                  type="text" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ej: Retorno Inversión"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t('category')}</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
                  >
                    <option value="Negocio 1">Negocio 1</option>
                    <option value="Negocio 2">Negocio 2</option>
                    <option value="Inversión">Inversión</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t('date')}</label>
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button 
                onClick={handleSave}
                disabled={saving || !amount}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center"
              >
                {saving ? <Loader2 className="animate-spin" /> : t('save')}
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
