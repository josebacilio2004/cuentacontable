import React, { useState, useEffect } from 'react';
import { Bell, Search, X, Check, AlertCircle, Info, Wallet, Eye, EyeOff } from 'lucide-react';
import { cn } from '../lib/utils';
import { Card } from './UI';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const mockNotifications = [
  { id: 1, title: 'Pago Próximo', message: 'Tu crédito BCP vence en 3 días.', time: 'Hace 2 horas', type: 'warning', unread: true },
  { id: 2, title: 'Ingreso Detectado', message: 'Se ha registrado un nuevo ingreso de $1,200.', time: 'Hace 5 horas', type: 'success', unread: true },
  { id: 3, title: 'Límite de Presupuesto', message: 'Has alcanzado el 80% de tu presupuesto en Alimentación.', time: 'Ayer', type: 'info', unread: false },
];

import { supabase } from '../lib/supabase';
import { useTranslation } from '../lib/i18n';

interface TopNavProps {
  user: any;
}

const userNames: Record<string, string> = {
  'baciliodelacruz.2004@gmail.com': 'José Bacilio',
  'sxchecya-es@udabol.edu.bo': 'Ssamira Checya'
};

export function TopNav({ user }: TopNavProps) {
  const { t } = useTranslation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [balance, setBalance] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isBalanceHidden, setIsBalanceHidden] = useState(() => {
    return localStorage.getItem('hide_balance') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('hide_balance', isBalanceHidden.toString());
  }, [isBalanceHidden]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const displayName = userNames[user?.email] || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const avatarUrl = user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`;

  useEffect(() => {
    if (user) {
      fetchData();
      // Suscribirse a cambios en tiempo real
      const channel = supabase
        .channel('db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, fetchData)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'credits' }, fetchData)
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchData = async () => {
    // Calcular Saldo
    const { data: incomeData } = await supabase.from('transactions').select('amount').eq('user_id', user.id).eq('type', 'income');
    const { data: expenseData } = await supabase.from('transactions').select('amount').eq('user_id', user.id).eq('type', 'expense');
    const totalIn = incomeData?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
    const totalOut = expenseData?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
    setBalance(totalIn - totalOut);

    // Notifications for Credits
    const { data: credits } = await supabase.from('credits').select('*').eq('user_id', user.id);
    const creditNotifs = (credits || [])
      .filter(c => {
        if (!c.due_date) return false;
        const diff = Math.ceil((new Date(c.due_date + 'T12:00:00').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return diff >= 0 && diff <= 5;
      })
      .map(c => ({
        id: `credit-${c.id}`,
        title: 'Vencimiento Próximo',
        message: `Tu crédito en ${c.bank_name} vence en ${Math.ceil((new Date(c.due_date + 'T12:00:00').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} días.`,
        time: 'Urgente',
        type: 'warning',
        unread: true
      }));

    // Notifications for Daily Goals
    const today = new Date().toISOString().split('T')[0];
    const { data: goals } = await supabase
      .from('savings_goals')
      .select('*')
      .eq('user_id', user.id)
      .eq('deadline', today)
      .eq('status', 'pendiente');

    const goalNotifs = (goals || [])
      .filter(g => {
        const now = new Date();
        const [h, m] = g.target_time.split(':');
        const target = new Date();
        target.setHours(parseInt(h), parseInt(m), 0);
        return now >= target; // Notificar si ya pasó la hora
      })
      .map(g => ({
        id: `goal-${g.id}`,
        title: 'Meta Diaria Vencida',
        message: `Es hora de cumplir tu meta: ${g.name} (S/ ${g.target_amount})`,
        time: g.target_time.slice(0, 5),
        type: 'info',
        unread: true
      }));

    setNotifications([...creditNotifs, ...goalNotifs]);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="fixed top-0 w-full z-30 h-16 bg-slate-950/40 backdrop-blur-md border-b border-white/5 flex justify-between items-center px-6 lg:pl-[264px] shadow-sm">
      <div className="flex items-center gap-4">
         <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Wallet className="text-white w-4 h-4" />
            </div>
            <span className="text-sm font-black text-white uppercase tracking-widest">CuentaContable</span>
         </div>
         <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
               <Search size={16} />
               <input 
                 type="text" 
                 placeholder="Search..." 
                 className="bg-transparent border-none text-sm focus:ring-0 text-white w-48"
               />
            </div>
            {/* Contador de Saldo Real */}
            <div className="flex items-center gap-2 px-4 py-1.5 glass rounded-xl border border-emerald-500/20">
               <button 
                 onClick={() => setIsBalanceHidden(!isBalanceHidden)}
                 className="p-1 hover:bg-white/10 rounded-md transition-all text-emerald-400"
               >
                 {isBalanceHidden ? <EyeOff size={14} /> : <Eye size={14} />}
               </button>
               <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest ml-1">Saldo:</span>
               <span className={cn(
                 "text-sm font-black text-white transition-all duration-300",
                 isBalanceHidden && "blur-balance"
               )}>
                 S/ {balance.toLocaleString()}
               </span>
            </div>
         </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={cn(
              "text-slate-300 hover:text-white transition-colors relative p-2 rounded-lg",
              showNotifications && "bg-white/5 text-white"
            )}
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-background"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-4 w-80 lg:w-96 glass-card rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="font-bold text-white">Notificaciones</h3>
                <span className="bg-indigo-500 text-[10px] font-bold px-2 py-0.5 rounded-full">{notifications.length}</span>
              </div>
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm italic">No hay alertas pendientes.</div>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif.id} className={cn(
                      "p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer relative",
                      notif.unread && "bg-indigo-500/5"
                    )}>
                      <div className="flex gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                          notif.type === 'warning' && "bg-amber-500/10 text-amber-400",
                          notif.type === 'success' && "bg-emerald-500/10 text-emerald-400",
                          notif.type === 'info' && "bg-indigo-500/10 text-indigo-400",
                        )}>
                          {notif.type === 'warning' && <AlertCircle size={18} />}
                          {notif.type === 'success' && <Check size={18} />}
                          {notif.type === 'info' && <Info size={18} />}
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between items-start">
                            <p className="text-sm font-bold text-white">{notif.title}</p>
                            <span className="text-[10px] text-slate-500 font-medium">{notif.time}</span>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">{notif.message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Real-time Clock */}
        <div className="hidden lg:flex flex-col items-end mr-4">
           <span className="text-sm font-black text-white leading-none">
             {format(currentTime, 'HH:mm:ss')}
           </span>
           <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-tighter mt-1">
             {format(currentTime, "eeee, d 'de' MMMM", { locale: es })}
           </span>
        </div>
        
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white capitalize">{displayName}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Premium Member</p>
          </div>
          <button 
            onClick={handleLogout}
            title="Cerrar Sesión"
            className="w-8 h-8 rounded-full border border-indigo-500/20 overflow-hidden bg-slate-800 hover:ring-2 hover:ring-indigo-500 transition-all"
          >
            <img 
              src={avatarUrl} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </nav>
  );
}
