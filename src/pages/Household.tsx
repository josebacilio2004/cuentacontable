import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  Clock,
  Heart,
  MessageSquare,
  Share2,
  Wallet,
  Loader2
} from 'lucide-react';
import { Card } from '../components/UI';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { useTranslation } from '../lib/i18n';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function HouseholdPage() {
  const { t } = useTranslation();
  const [sharedTxs, setSharedTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      fetchSharedTransactions();
    });
  }, []);

  const fetchSharedTransactions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('is_shared', true)
      .order('date', { ascending: false });

    if (!error && data) {
      setSharedTxs(data);
    }
    setLoading(false);
  };

  const totalShared = sharedTxs.reduce((acc, curr) => {
    return curr.type === 'expense' ? acc + Number(curr.amount) : acc;
  }, 0);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">{t('nav.household')}</h1>
          <p className="text-slate-400">Gastos compartidos y presupuesto familiar.</p>
        </div>
        <div className="flex -space-x-4">
           {['Sarah', 'Alex'].map((seed, i) => (
             <div key={seed} className="w-12 h-12 rounded-2xl border-4 border-[#050811] overflow-hidden bg-white/5">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} alt="avatar" />
             </div>
           ))}
           <div className="w-12 h-12 rounded-2xl border-4 border-[#050811] bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
              +2
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Shared Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="font-bold text-white">Actividad Compartida</h3>
            <button className="text-xs font-bold text-indigo-400 hover:underline">Filtros</button>
          </div>

          {loading ? (
             <div className="flex items-center justify-center h-64 text-slate-500">
                <Loader2 className="animate-spin mr-2" /> {t('loading')}
             </div>
          ) : sharedTxs.length === 0 ? (
             <div className="flex items-center justify-center h-64 text-slate-500 italic">
                {t('no.data')}
             </div>
          ) : (
            <div className="space-y-4">
              {sharedTxs.map((tx) => (
                <Card key={tx.id} className="p-6 hover:border-white/20 transition-all border-white/5 bg-slate-900/40">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                        {tx.type === 'expense' ? <ArrowUpRight className="text-rose-400" /> : <ArrowDownRight className="text-emerald-400" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{tx.category}</h4>
                        <div className="text-xs text-slate-500 mt-1">
                           Registrado por <span className="text-indigo-400 font-bold">@usuario</span> • {format(new Date(tx.date), 'dd MMM', { locale: es })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className={cn("text-lg font-black", tx.type === 'expense' ? "text-rose-400" : "text-emerald-400")}>
                          {tx.type === 'expense' ? '-' : '+'}{t('currency')}{Number(tx.amount).toLocaleString()}
                       </p>
                       <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">50% cada uno</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Household Stats */}
        <div className="space-y-6">
           <Card className="p-8 bg-gradient-to-br from-indigo-600/20 to-transparent border-indigo-500/20">
              <h4 className="text-sm font-bold text-indigo-300 uppercase tracking-widest mb-6">Fondo Común</h4>
              <p className="text-5xl font-black text-white mb-2">{t('currency')}{totalShared.toLocaleString()}</p>
              <p className="text-xs text-slate-400">Total gastado este mes</p>
              <button className="w-full mt-8 py-4 bg-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all">
                 Aportar al Fondo
              </button>
           </Card>

           <Card className="p-6 border-white/5">
              <h4 className="font-bold text-white mb-6">Membresías del Hogar</h4>
              <div className="space-y-4">
                 {[
                   { name: 'Spotify Family', price: 'S/ 24.90', status: 'paid' },
                   { name: 'Netflix Premium', price: 'S/ 44.90', status: 'pending' },
                   { name: 'Internet Fibra', price: 'S/ 120.00', status: 'paid' },
                 ].map(item => (
                   <div key={item.name} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <div className={cn("w-2 h-2 rounded-full", item.status === 'paid' ? "bg-emerald-400" : "bg-amber-400")}></div>
                         <span className="text-sm text-slate-300">{item.name}</span>
                      </div>
                      <span className="text-sm font-bold text-white">{item.price}</span>
                   </div>
                 ))}
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
