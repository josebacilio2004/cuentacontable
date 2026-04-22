import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart as PieIcon,
  LineChart as LineIcon
} from 'lucide-react';
import { Card } from '../components/UI';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';

const monthlyGrowth = [
  { name: 'Ene', income: 4200, expenses: 3100 },
  { name: 'Feb', income: 3800, expenses: 2900 },
  { name: 'Mar', income: 4500, expenses: 3400 },
  { name: 'Abr', income: 5100, expenses: 3800 },
  { name: 'May', income: 4900, expenses: 3100 },
  { name: 'Jun', income: 5800, expenses: 4000 },
  { name: 'Jul', income: 6200, expenses: 3900 },
  { name: 'Ago', income: 5900, expenses: 4200 },
  { name: 'Sep', income: 7100, expenses: 4500 },
];

const categorySpend = [
  { name: 'Comida', value: 2400, color: '#4edea3' },
  { name: 'Renta', value: 4500, color: '#6366f1' },
  { name: 'Ocio', value: 1200, color: '#a855f7' },
  { name: 'Auto', value: 1800, color: '#f43f5e' },
  { name: 'Salud', value: 900, color: '#fbbf24' },
];

export function ReportsPage() {
  return (
    <div className="space-y-10 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Reportes Analíticos</h1>
          <p className="text-slate-400">Visualiza el rendimiento de tu patrimonio a través del tiempo.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-3 glass-card rounded-xl flex items-center gap-2 text-sm font-semibold text-slate-300 hover:bg-white/10 transition-colors">
            <Filter size={18} />
            Periodo: Anual
          </button>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20">
            <Download size={20} />
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Main Growth Chart */}
      <Card className="p-8 h-[500px]">
        <div className="flex justify-between items-start mb-10">
          <div>
             <h3 className="text-2xl font-bold text-white mb-1">Crecimiento Patrimonial</h3>
             <p className="text-sm text-slate-500">Comparativa Ingresos vs Egresos (YTD)</p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-right">
             <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Promedio Mensual</p>
                <p className="text-2xl font-black text-emerald-400">$2,450</p>
             </div>
             <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Tasa de Ahorro</p>
                <p className="text-2xl font-black text-indigo-400">32%</p>
             </div>
          </div>
        </div>
        
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyGrowth}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4edea3" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4edea3" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 11 }}
                dy={12}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 11 }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                itemStyle={{ fontSize: '13px', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="income" stroke="#4edea3" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
              <Area type="monotone" dataKey="expenses" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spending Breakdown Pie */}
        <Card className="p-8 h-[450px] flex flex-col">
          <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
            <PieIcon size={20} className="text-violet-400" />
            Distribución de Gastos
          </h3>
          <div className="flex-1 flex items-center gap-8">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categorySpend}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {categorySpend.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-4">
               {categorySpend.map(item => (
                 <div key={item.name} className="space-y-1.5 focus-within:scale-105 transition-transform duration-200">
                    <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
                       <span className="text-slate-400">{item.name}</span>
                       <span className="text-white">${item.value}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full rounded-full" style={{ background: item.color, width: `${(item.value / 12000) * 100}%` }} />
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </Card>

        {/* Savings Goals / Highlights */}
        <Card className="p-8 flex flex-col">
           <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
             <LineIcon size={20} className="text-emerald-400" />
             Logros y Metas
           </h3>
           <div className="space-y-6">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                      <TrendingUp size={24} />
                    </div>
                    <div>
                       <p className="text-white font-bold">Fondo de Emergencia</p>
                       <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">92% Completado</p>
                    </div>
                 </div>
                 <ArrowUpRight className="text-emerald-400" size={20} />
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                      <BarChart3 size={24} />
                    </div>
                    <div>
                       <p className="text-white font-bold">Meta: Viaje 2024</p>
                       <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">45% Completado</p>
                    </div>
                 </div>
                 <ArrowUpRight className="text-indigo-400" size={20} />
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/5 flex items-center justify-between opacity-60">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-400">
                      <ArrowDownRight size={24} />
                    </div>
                    <div>
                       <p className="text-white font-bold">Gasto Variación</p>
                       <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">+5% vs objetivo</p>
                    </div>
                 </div>
                 <ArrowDownRight className="text-rose-400" size={20} />
              </div>
           </div>
           
           <button className="mt-auto w-full py-4 text-sm font-bold text-white bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all uppercase tracking-widest">
             Generar Informe Extendido
           </button>
        </Card>
      </div>
    </div>
  );
}
