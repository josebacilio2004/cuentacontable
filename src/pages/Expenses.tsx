import React from 'react';
import { 
  Search, 
  Calendar, 
  Filter, 
  Plus, 
  ArrowUp,
  Utensils,
  Bus,
  Activity,
  Home,
  ShoppingBag,
  Building2,
  Dumbbell,
  Fuel
} from 'lucide-react';
import { Card } from '../components/UI';
import { cn } from '../lib/utils';

const categories = [
  { name: 'Alimentación', icon: Utensils, percentage: 35, color: '#4edea3' },
  { name: 'Transporte', icon: Bus, percentage: 18, color: '#c0c1ff' },
  { name: 'Salud', icon: Activity, percentage: 12, color: '#d0bcff' },
  { name: 'Vivienda', icon: Home, percentage: 25, color: '#fb7185' },
];

const expenseCards = [
  { 
    title: 'Supermercado Jumbo', 
    date: '14 Sep, 18:30', 
    amount: '$145.20', 
    icon: ShoppingBag, 
    type: 'Variable', 
    note: '"Compra mensual de víveres"',
    borderColor: 'border-l-emerald-400',
    iconColor: 'bg-emerald-400/10 text-emerald-400'
  },
  { 
    title: 'Alquiler Octubre', 
    date: '12 Sep, 10:00', 
    amount: '$1,200.00', 
    icon: Building2, 
    type: 'Fijo', 
    note: 'Apartamento Central',
    borderColor: 'border-l-rose-400',
    iconColor: 'bg-rose-400/10 text-rose-400'
  },
  { 
    title: 'Membresía Gym', 
    date: '10 Sep, 08:45', 
    amount: '$65.00', 
    icon: Dumbbell, 
    type: 'Fijo', 
    note: '"Plan Anual VIP"',
    borderColor: 'border-l-violet-400',
    iconColor: 'bg-violet-400/10 text-violet-400'
  },
  { 
    title: 'Combustible Shell', 
    date: '08 Sep, 21:15', 
    amount: '$88.50', 
    icon: Fuel, 
    type: 'Variable', 
    note: 'Tanque lleno SUV',
    borderColor: 'border-l-indigo-400',
    iconColor: 'bg-indigo-400/10 text-indigo-400'
  },
  { 
    title: 'Cena: La Fontana', 
    date: '05 Sep, 22:30', 
    amount: '$210.00', 
    icon: Utensils, 
    type: 'Variable', 
    note: 'Aniversario',
    borderColor: 'border-l-emerald-400',
    iconColor: 'bg-emerald-400/10 text-emerald-400'
  },
  { 
    title: 'Recarga Tarjeta Transp.', 
    date: '02 Sep, 09:20', 
    amount: '$40.00', 
    icon: Bus, 
    type: 'Fijo', 
    note: 'Recarga mensual',
    borderColor: 'border-l-indigo-400',
    iconColor: 'bg-indigo-400/10 text-indigo-400'
  },
];

export function ExpensesPage() {
  return (
    <div className="space-y-8 pb-12">
       <h1 className="text-4xl font-bold text-white mb-8">Egresos</h1>

       {/* Top Insights */}
       <section className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <Card className="p-6 md:col-span-2 lg:col-span-1 flex flex-col justify-between">
             <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">GASTO MENSUAL</p>
                <p className="text-4xl font-extrabold text-white tracking-tight">$4,820.50</p>
             </div>
             <div className="mt-4 flex items-center text-rose-400 font-bold text-xs gap-1">
                <ArrowUp size={14} />
                12% vs mes pasado
             </div>
          </Card>

          <Card className="p-6 md:col-span-2 lg:col-span-4 flex items-center">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 w-full">
              {categories.map((cat) => (
                <div key={cat.name} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       <cat.icon size={16} className="text-indigo-400" />
                       <span className="text-xs font-bold text-slate-300 uppercase tracking-tighter">{cat.name}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-500">{cat.percentage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000" 
                      style={{ backgroundColor: cat.color, width: `${cat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
       </section>

       {/* Toolbar */}
       <section className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-72 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Buscar egresos..." 
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none placeholder-slate-500 text-white"
              />
            </div>
            <button className="px-5 py-3 glass-card rounded-xl flex items-center gap-2 text-sm font-semibold text-slate-300 hover:bg-white/10 transition-colors">
               <Calendar size={18} />
               Septiembre 2023
            </button>
            <button className="px-5 py-3 glass-card rounded-xl flex items-center gap-2 text-sm font-semibold text-slate-300 hover:bg-white/10 transition-colors">
               <Filter size={18} />
               Filtros
            </button>
          </div>
          
          <button className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-indigo-500/20">
             <Plus size={20} />
             Nuevo Egreso
          </button>
       </section>

       {/* Masonry-ish Grid */}
       <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expenseCards.map((card, idx) => (
            <Card key={idx} className={cn("p-6 flex flex-col gap-5 border-l-4 group hover:scale-[1.02] transition-all duration-300", card.borderColor)}>
               <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                     <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110", card.iconColor)}>
                        <card.icon size={22} />
                     </div>
                     <div>
                        <h3 className="font-bold text-white text-lg leading-tight">{card.title}</h3>
                        <div className="text-xs text-slate-500 mt-1">{card.date}</div>
                     </div>
                  </div>
                  <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {card.type}
                  </span>
               </div>
               
               <div className="flex justify-between items-end border-t border-white/5 pt-4">
                  <div className="text-xs font-medium text-slate-500 italic max-w-[150px] truncate">{card.note}</div>
                  <div className="text-2xl font-black text-white">{card.amount}</div>
               </div>
            </Card>
          ))}
       </section>
    </div>
  );
}
