import React from 'react';
import { 
  Users, 
  TrendingUp, 
  Home, 
  Zap, 
  ShoppingBasket, 
  Plane, 
  Armchair, 
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { Card } from '../components/UI';

export function HouseholdPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Vista Hogar 🏠</h1>
        <p className="text-slate-400">Resumen consolidado de finanzas compartidas entre Samira y Jose.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Balance Card */}
        <div className="col-span-12 lg:col-span-8 glass-card rounded-[24px] p-8 relative overflow-hidden border border-white/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">Saldo Total Disponible</span>
            <div className="flex items-baseline gap-4 mt-2">
              <span className="text-5xl font-black text-white">$ 12,450.00</span>
              <span className="text-emerald-400 font-bold flex items-center text-sm">
                <TrendingUp size={16} className="mr-1" />
                +12% este mes
              </span>
            </div>
            <div className="mt-12">
              <div className="flex justify-between items-end mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Distribución de Aportes</span>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
                    <span className="text-xs font-bold text-slate-300">Samira (65%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-violet-400"></div>
                    <span className="text-xs font-bold text-slate-300">Jose (35%)</span>
                  </div>
                </div>
              </div>
              <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden flex border border-white/5">
                <div className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all duration-1000" style={{ width: '65%' }}></div>
                <div className="h-full bg-violet-500 transition-all duration-1000" style={{ width: '35%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Contributors Card */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 glass-card rounded-[24px] p-6 flex flex-col justify-between border border-white/10">
          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Users size={20} className="text-indigo-400" />
              Miembros
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold border-2 border-indigo-400/20">S</div>
                  <div>
                    <p className="font-bold text-white">Samira</p>
                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Administrador</p>
                  </div>
                </div>
                <span className="font-black text-white">$ 8,092</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-violet-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold border-2 border-violet-400/20">J</div>
                  <div>
                    <p className="font-bold text-white">Jose</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Colaborador</p>
                  </div>
                </div>
                <span className="font-black text-white">$ 4,358</span>
              </div>
            </div>
          </div>
          <button className="w-full mt-6 py-4 rounded-2xl border border-indigo-500/30 text-indigo-400 font-bold text-sm uppercase tracking-widest hover:bg-indigo-500/10 transition-all">
            Gestionar Hogar
          </button>
        </div>

        {/* Shared Expenses */}
        <div className="col-span-12 md:col-span-6 lg:col-span-5 glass-card rounded-[24px] p-8 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-8">Gastos Compartidos</h3>
          <div className="space-y-8">
            <div className="flex items-start gap-5 group cursor-pointer">
              <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 group-hover:scale-110 transition-transform">
                <Home size={24} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-white">Alquiler & Expensas</p>
                  <span className="text-rose-400 font-black">-$1,200.00</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium tracking-tight">Vence en 3 días • Pagado por Samira</p>
                <div className="mt-3 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full w-full shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-5 group cursor-pointer">
              <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/10 group-hover:scale-110 transition-transform">
                <Zap size={24} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-white">Servicios Luz/Gas</p>
                  <span className="text-rose-400 font-black">-$145.00</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium tracking-tight">Auto-debito • Dividido 50/50</p>
              </div>
            </div>
            <div className="flex items-start gap-5 group cursor-pointer">
              <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 group-hover:scale-110 transition-transform">
                <ShoppingBasket size={24} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-white">Supermercado</p>
                  <span className="text-rose-400 font-black">-$430.50</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium tracking-tight">Este mes • Pagado por Jose</p>
              </div>
            </div>
          </div>
        </div>

        {/* Savings Goals */}
        <div className="col-span-12 lg:col-span-7 glass-card rounded-[24px] p-8 border border-white/10">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white">Metas de Ahorro Común</h3>
            <button className="text-indigo-400 font-bold text-xs uppercase tracking-widest hover:underline">+ Nueva Meta</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-[28px] bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                  <Plane size={24} />
                </div>
                <span className="text-[10px] font-black bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full uppercase tracking-widest">75%</span>
              </div>
              <p className="font-bold text-xl text-white">Vacaciones 2026</p>
              <p className="text-sm text-slate-500 mt-1 font-medium">$ 3,000 / $ 4,000</p>
              <div className="mt-5 h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-indigo-500 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.4)] transition-all duration-1000" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div className="p-6 rounded-[28px] bg-white/5 border border-white/5 hover:border-amber-500/30 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                  <Armchair size={24} />
                </div>
                <span className="text-[10px] font-black bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full uppercase tracking-widest">20%</span>
              </div>
              <p className="font-bold text-xl text-white">Renovación Living</p>
              <p className="text-sm text-slate-500 mt-1 font-medium">$ 400 / $ 2,000</p>
              <div className="mt-5 h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-amber-500 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.4)] transition-all duration-1000" style={{ width: '20%' }}></div>
              </div>
            </div>
          </div>
          <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-transparent border-l-4 border-indigo-500">
            <div className="flex items-center gap-4">
              <Lightbulb className="text-indigo-400 shrink-0" size={24} />
              <p className="text-sm text-slate-300">
                <span className="font-bold text-white">Tip Financiero:</span> Si aportan $100 extra cada uno este mes, llegarán a la meta "Vacaciones" 15 días antes del plazo estimado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
