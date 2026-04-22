import React, { useState, useEffect } from 'react';
import { 
  User, 
  Globe, 
  Moon, 
  Shield, 
  Bell, 
  CreditCard, 
  Smartphone,
  Save,
  CheckCircle2,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { Card } from '../components/UI';
import { cn } from '../lib/utils';
import { useTranslation } from '../lib/i18n';
import { supabase } from '../lib/supabase';

const userNames: Record<string, string> = {
  'baciliodelacruz.2004@gmail.com': 'José Bacilio',
  'sxchecya-es@udabol.edu.bo': 'Ssamira Checya'
};

export function SettingsPage() {
  const { language, setLanguage, t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const displayName = userNames[user?.email] || user?.email?.split('@')[0] || 'User';

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">{t('nav.settings')}</h1>
          <p className="text-slate-400">Gestiona tus preferencias y seguridad de la cuenta.</p>
        </div>
        <button 
          onClick={handleSave}
          className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
        >
          {isSaved ? <CheckCircle2 size={20} /> : <Save size={20} />}
          {isSaved ? 'Guardado' : t('save')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <Card className="p-8 text-center border-white/5">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-3xl bg-indigo-500/20 flex items-center justify-center border-2 border-indigo-500/30 overflow-hidden">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} 
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-500 rounded-xl border-4 border-[#050811] flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <h2 className="text-xl font-bold text-white">{displayName}</h2>
            <p className="text-xs text-slate-500 mt-1">{user?.email}</p>
            <div className="mt-6 pt-6 border-t border-white/5">
              <div className="flex justify-between text-sm mb-4">
                <span className="text-slate-400">Estado</span>
                <span className="text-emerald-400 font-bold">Premium</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Miembro desde</span>
                <span className="text-white">Oct 2023</span>
              </div>
            </div>
          </Card>

          <nav className="space-y-1">
             <SettingsLink icon={User} label="Perfil" active />
             <SettingsLink icon={Shield} label="Seguridad" />
             <SettingsLink icon={Bell} label="Notificaciones" />
             <SettingsLink icon={CreditCard} label="Suscripción" />
          </nav>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-8 space-y-8 border-white/5">
            <div>
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Globe size={20} className="text-indigo-400" />
                Preferencias de Región
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Idioma / Language</label>
                   <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                   >
                     <option value="es">Español (S/)</option>
                     <option value="en">English ($)</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Moneda Local</label>
                   <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-400 cursor-not-allowed">
                     {language === 'es' ? 'Soles (PEN)' : 'US Dollars (USD)'}
                   </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Moon size={20} className="text-indigo-400" />
                Interfaz
              </h3>
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                <div>
                  <p className="font-bold text-white text-sm">Modo Oscuro</p>
                  <p className="text-xs text-slate-500">Optimizado para pantallas OLED</p>
                </div>
                <div className="w-12 h-6 bg-indigo-500 rounded-full p-1 flex items-center justify-end">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 text-rose-400">
                <Shield size={20} />
                Zona Peligrosa
              </h3>
              <div className="flex flex-col gap-4">
                 <button className="w-full p-4 rounded-2xl border border-white/5 hover:bg-white/5 text-left group transition-all">
                    <div className="flex justify-between items-center">
                       <div>
                          <p className="font-bold text-white text-sm">Cerrar Sesión en otros dispositivos</p>
                          <p className="text-xs text-slate-500">Tu sesión se cerrará en tablets y laptops vinculadas.</p>
                       </div>
                       <ChevronRight size={18} className="text-slate-600 group-hover:text-white transition-colors" />
                    </div>
                 </button>
                 <button 
                  onClick={() => supabase.auth.signOut()}
                  className="w-full p-4 rounded-2xl border border-rose-500/20 hover:bg-rose-500/10 text-left group transition-all"
                 >
                    <div className="flex justify-between items-center">
                       <div>
                          <p className="font-bold text-rose-400 text-sm">Eliminar Cuenta</p>
                          <p className="text-xs text-rose-500/60">Esta acción no se puede deshacer.</p>
                       </div>
                       <LogOut size={18} className="text-rose-400" />
                    </div>
                 </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SettingsLink({ icon: Icon, label, active = false }: any) {
  return (
    <button className={cn(
      "w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold text-sm",
      active ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "text-slate-400 hover:bg-white/5 hover:text-white"
    )}>
      <Icon size={18} />
      {label}
    </button>
  );
}
