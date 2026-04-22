import React from 'react';
import { 
  Calendar, 
  Filter, 
  Download, 
  Plus, 
  TrendingUp, 
  CheckCircle2, 
  Wallet,
  X
} from 'lucide-react';
import { Card } from '../components/UI';
import { cn } from '../lib/utils';

const transactions = [
  { date: '15 Nov', title: 'Nómina TechCorp', desc: 'Mensual recurrente', category: 'SALARIO', type: 'Fijo', amount: '$8,500.00', color: 'text-emerald-400' },
  { date: '12 Nov', title: 'Proyecto Freelance UI', desc: 'Payment #2 Client A', category: 'FREELANCE', type: 'Variable', amount: '$2,200.00', color: 'text-violet-400' },
  { date: '08 Nov', title: 'Dividendos ETFs', desc: 'Vanguard All-World', category: 'INVERSIÓN', type: 'Variable', amount: '$1,450.00', color: 'text-indigo-400' },
  { date: '03 Nov', title: 'Reembolso Seguro', desc: 'Axa Health', category: 'OTRO', type: 'Variable', amount: '$300.00', color: 'text-slate-400' },
];

export function IncomePage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Calendar size={14} />
            <select className="bg-transparent border-none text-xs font-bold uppercase tracking-widest focus:ring-0 cursor-pointer p-0 pr-6">
              <option>Octubre 2023</option>
              <option selected>Noviembre 2023</option>
              <option>Diciembre 2023</option>
            </select>
          </div>
          <h1 className="text-4xl font-bold text-white">Ingresos</h1>
        </div>
        
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-8 py-4 flex flex-col items-end shadow-[0_0_15px_rgba(78,222,163,0.1)]">
          <span className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Total Recibido</span>
          <span className="text-4xl font-bold text-emerald-400 tracking-tight">$12,450.00</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Table Card */}
        <Card className="lg:col-span-8 p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/5 backdrop-blur-md">
            <h3 className="font-semibold text-white">Registro de Transacciones</h3>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg hover:bg-white/10 text-slate-400 transition-colors">
                <Filter size={18} />
              </button>
              <button className="p-2 rounded-lg hover:bg-white/10 text-slate-400 transition-colors">
                <Download size={18} />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Descripción</th>
                  <th className="px-6 py-4">Categoría</th>
                  <th className="px-6 py-4">Tipo</th>
                  <th className="px-6 py-4 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map((tx, idx) => (
                  <tr key={idx} className="group hover:bg-white/5 transition-colors cursor-pointer">
                    <td className="px-6 py-5 text-slate-300 text-sm">{tx.date}</td>
                    <td className="px-6 py-5">
                      <div className="font-medium text-white">{tx.title}</div>
                      <div className="text-[10px] text-slate-500">{tx.desc}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/5 text-slate-300 border border-white/10 group-hover:border-indigo-500/30 group-hover:text-indigo-400 transition-colors uppercase">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-slate-400 text-xs">{tx.type}</td>
                    <td className="px-6 py-5 text-right font-bold text-emerald-400">{tx.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Side Panel: Add Income */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card className="p-6 bg-slate-900/80 border-white/10">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-white">Añadir Ingreso</h3>
              <button className="text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Monto del Ingreso</label>
                <div className="relative">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl font-bold text-emerald-400 ">$</span>
                  <input 
                    type="text" 
                    className="w-full bg-transparent border-none text-4xl font-bold text-white focus:ring-0 p-0 pl-8 border-b border-white/10 pb-2 placeholder-white/20"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Categoría</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                    <option>Salario</option>
                    <option>Freelance</option>
                    <option>Inversión</option>
                    <option>Otro</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Fecha</label>
                  <input 
                    type="date" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">Ingreso Recurrente</span>
                  <span className="text-[10px] text-slate-500">Se repetirá mensualmente</span>
                </div>
                <div className={cn(
                  "w-11 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200",
                  "bg-indigo-500"
                )}>
                  <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm" />
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all">
                Guardar Ingreso
              </button>
            </div>
          </Card>

          {/* Composition Card */}
          <Card className="p-6">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Composición por Categoría</h4>
            <div className="space-y-5">
              <CategoryBar label="Salario" percentage={68} color="bg-indigo-500" />
              <CategoryBar label="Freelance" percentage={22} color="bg-violet-400" />
              <CategoryBar label="Inversión" percentage={10} color="bg-emerald-400" />
            </div>
          </Card>
        </div>
      </div>

      {/* Floating Action Button (Mobile) */}
      <button className="fixed bottom-24 right-6 lg:hidden h-14 w-14 bg-indigo-500 rounded-full shadow-2xl flex items-center justify-center text-white z-50">
        <Plus size={24} />
      </button>

      {/* Footer Summary Bar */}
      <div className="fixed bottom-20 lg:bottom-0 left-0 lg:left-60 right-0 h-16 bg-slate-900/80 backdrop-blur-2xl border-t border-white/5 z-40 flex items-center justify-between px-8">
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Total Mes</span>
            <span className="text-lg font-bold text-emerald-400">$12,450.00</span>
          </div>
          <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
          <div className="hidden sm:flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Promedio Semanal</span>
            <span className="text-lg font-bold text-white">$3,112.50</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-emerald-400 font-bold text-[10px] uppercase tracking-wider">
          <TrendingUp size={14} />
          +12% vs mes anterior
        </div>
      </div>
    </div>
  );
}

function CategoryBar({ label, percentage, color }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-slate-300 font-medium">{label}</span>
        <span className="text-white font-bold">{percentage}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}
