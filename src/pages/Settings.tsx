import React from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Moon, 
  Globe, 
  Smartphone, 
  CreditCard, 
  LogOut,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Card } from '../components/UI';
import { cn } from '../lib/utils';

export function SettingsPage() {
  return (
    <div className="space-y-10 pb-12">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Configuración</h1>
        <p className="text-slate-400">Personaliza tu experiencia y gestiona tus preferencias de seguridad.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-4 space-y-2">
           <SettingsNavItem icon={User} label="Perfil del Usuario" active />
           <SettingsNavItem icon={Shield} label="Seguridad & Privacidad" />
           <SettingsNavItem icon={Bell} label="Notificaciones" />
           <SettingsNavItem icon={Moon} label="Interfaz & Apariencia" />
           <SettingsNavItem icon={Globe} label="Idioma & Región" />
           <SettingsNavItem icon={Smartphone} label="Dispositivos Vinculados" />
           <SettingsNavItem icon={CreditCard} label="Suscripción CuentaContable" />
           
           <div className="pt-6 mt-6 border-t border-white/5">
              <button className="flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-500/10 transition-all rounded-xl w-full">
                <LogOut size={20} />
                <span className="font-semibold">Cerrar Sesión</span>
              </button>
           </div>
        </aside>

        {/* Content Area */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="p-8">
             <div className="flex justify-between items-start mb-10">
                <h3 className="text-xl font-bold text-white uppercase tracking-wider">Perfil Público</h3>
                <button className="px-4 py-2 bg-indigo-600 text-xs font-bold text-white rounded-lg hover:bg-indigo-500 transition-all">
                   Editar Perfil
                </button>
             </div>
             
             <div className="flex flex-col sm:flex-row gap-8 items-center mb-10">
                <div className="relative group cursor-pointer">
                   <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-indigo-500/30">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Profile" className="w-full h-full object-cover" />
                   </div>
                   <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl">
                      <Sparkles size={20} className="text-white" />
                   </div>
                </div>
                <div className="space-y-1 text-center sm:text-left">
                   <h4 className="text-2xl font-bold text-white">Alex Thompson</h4>
                   <p className="text-slate-400">baciliodelacruz.2004@gmail.com</p>
                   <div className="flex gap-2 mt-4 justify-center sm:justify-start">
                      <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Premium Member</span>
                      <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Verified Account</span>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nombre Completo</label>
                   <input type="text" defaultValue="Alex Thompson" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Zona Horaria</label>
                   <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none">
                      <option>GMT-5 (Lima/Bogotá)</option>
                      <option>GMT-3 (Buenos Aires)</option>
                      <option>UTC+1 (Madrid/París)</option>
                   </select>
                </div>
             </div>
          </Card>

          <Card className="p-8">
             <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-8">Preferencias de Interfaz</h3>
             <div className="space-y-6">
                <ToggleItem label="Habilitar Modo Oscuro Automático" active />
                <ToggleItem label="Compactar Tablas de Transacciones" />
                <ToggleItem label="Mostrar Saldo en Dashboard" active />
                <ToggleItem label="Sonidos de Confirmación de Pago" />
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SettingsNavItem({ icon: Icon, label, active }: any) {
  return (
    <button className={cn(
      "w-full flex items-center justify-between px-4 py-4 rounded-xl transition-all group",
      active ? "bg-white/5 text-indigo-400 border border-white/10" : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
    )}>
      <div className="flex items-center gap-3">
         <Icon size={20} className={active ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"} />
         <span className="font-semibold text-sm">{label}</span>
      </div>
      <ChevronRight size={16} className={active ? "opacity-100" : "opacity-0 group-hover:opacity-100 text-slate-600 transition-opacity"} />
    </button>
  );
}

function ToggleItem({ label, active }: any) {
  return (
    <div className="flex items-center justify-between">
       <span className="text-sm font-medium text-slate-300">{label}</span>
       <div className={cn(
         "w-10 h-5 rounded-full p-1 cursor-pointer transition-colors duration-200",
         active ? "bg-indigo-500" : "bg-white/10"
       )}>
         <div className={cn(
           "w-3 h-3 bg-white rounded-full transition-transform duration-200 shadow-sm",
           active ? "translate-x-5" : "translate-x-0"
         )} />
       </div>
    </div>
  );
}
