import React, { useState } from 'react';
import { Bell, Search, X, Check, AlertCircle, Info, Wallet } from 'lucide-react';
import { cn } from '../lib/utils';
import { Card } from './UI';

const mockNotifications = [
  { id: 1, title: 'Pago Próximo', message: 'Tu crédito BCP vence en 3 días.', time: 'Hace 2 horas', type: 'warning', unread: true },
  { id: 2, title: 'Ingreso Detectado', message: 'Se ha registrado un nuevo ingreso de $1,200.', time: 'Hace 5 horas', type: 'success', unread: true },
  { id: 3, title: 'Límite de Presupuesto', message: 'Has alcanzado el 80% de tu presupuesto en Alimentación.', time: 'Ayer', type: 'info', unread: false },
];

export function TopNav() {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-30 h-16 bg-slate-950/40 backdrop-blur-md border-b border-white/5 flex justify-between items-center px-6 lg:pl-[264px] shadow-sm">
      <div className="flex items-center gap-4">
         <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Wallet className="text-white w-4 h-4" />
            </div>
            <span className="text-sm font-black text-white uppercase tracking-widest">CuentaContable</span>
         </div>
         <div className="hidden md:flex items-center gap-2 text-slate-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none text-sm focus:ring-0 text-white w-48"
            />
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
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border border-background"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-4 w-80 lg:w-96 glass-card rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="font-bold text-white">Notificaciones</h3>
                <button className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:underline">Marcar todas como leídas</button>
              </div>
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {mockNotifications.map((notif) => (
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
                    {notif.unread && (
                      <div className="absolute right-4 bottom-4 w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
              <button className="w-full p-4 text-center text-xs font-bold text-slate-500 hover:text-white transition-colors bg-white/5 border-t border-white/5">
                Ver todo el historial
              </button>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white">Alex Thompson</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Premium Member</p>
          </div>
          <div className="w-8 h-8 rounded-full border border-indigo-500/20 overflow-hidden bg-slate-800">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
