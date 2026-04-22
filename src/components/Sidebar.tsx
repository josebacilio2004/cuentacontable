import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  HandCoins, 
  ShoppingBag, 
  CreditCard, 
  Repeat, 
  BarChart3, 
  Wallet, 
  Settings,
  Users,
  MessageSquareCode
} from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
  { icon: HandCoins, label: 'Ingresos', to: '/ingresos' },
  { icon: ShoppingBag, label: 'Egresos', to: '/egresos' },
  { icon: CreditCard, label: 'Créditos', to: '/creditos' },
  { icon: Repeat, label: 'Cuentas Fijas', to: '/cuentas-fijas' },
  { icon: BarChart3, label: 'Reportes', to: '/reportes' },
  { icon: Wallet, label: 'Presupuesto', to: '/presupuesto' },
  { icon: Users, label: 'Vista Hogar', to: '/vista-hogar' },
  { icon: Settings, label: 'Configuración', to: '/configuracion' },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col h-screen fixed left-0 top-0 z-40 w-60 bg-sidebar/60 backdrop-blur-xl border-r border-white/10 shadow-2xl">
      <div className="p-8 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Wallet className="text-white w-5 h-5" />
        </div>
        <div>
          <h1 className="text-sm font-black text-white tracking-widest uppercase leading-none">CuentaContable</h1>
          <p className="text-[8px] text-indigo-400 font-bold tracking-tighter uppercase mt-1">Premium Finance</p>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-100 transition-all rounded-xl hover:bg-white/5",
              isActive && "text-indigo-400 bg-indigo-500/10 border-l-4 border-indigo-500 rounded-l-none font-semibold"
            )}
          >
            <item.icon size={20} />
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-white/5">
        <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-xl p-4">
          <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider mb-2">Support</p>
          <p className="text-xs text-indigo-100 leading-relaxed">Need help with your wealth management?</p>
          <button className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-white bg-indigo-600 px-3 py-2 rounded-lg w-full hover:bg-indigo-500 transition-colors">
            <MessageSquareCode size={14} />
            Chat with AI
          </button>
        </div>
      </div>
    </aside>
  );
}

export function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 h-20 bg-slate-900/80 backdrop-blur-2xl rounded-t-3xl border-t border-white/10 flex justify-around items-center px-4">
      {navItems.slice(0, 4).map((item) => (
         <NavLink
         key={item.to}
         to={item.to}
         className={({ isActive }) => cn(
           "flex flex-col items-center gap-1 text-slate-500 transition-all",
           isActive && "text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
         )}
       >
         <item.icon size={20} />
         <span className="text-[10px] font-medium uppercase tracking-tighter">{item.label}</span>
       </NavLink>
      ))}
    </nav>
  );
}
