import React from 'react';
import { 
  TrendingUp, 
  HandCoins, 
  ShoppingBag, 
  Landmark, 
  Wallet,
  Bolt,
  Smartphone,
  Car
} from 'lucide-react';
import { Card, KPI } from '../components/UI';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const weeklyData = [
  { name: 'LUN', in: 3200, out: 2400 },
  { name: 'MAR', in: 4800, out: 1600 },
  { name: 'MIE', in: 2400, out: 4000 },
  { name: 'JUE', in: 4000, out: 2000 },
  { name: 'VIE', in: 5600, out: 3200 },
  { name: 'SAB', in: 2000, out: 1200 },
  { name: 'DOM', in: 1600, out: 800 },
];

const distributionData = [
  { name: 'Vivienda', value: 45, color: '#4edea3' },
  { name: 'Alimentación', value: 30, color: '#c0c1ff' },
  { name: 'Ocio', value: 15, color: '#d0bcff' },
  { name: 'Otros', value: 10, color: '#908fa0' },
];

export function Dashboard() {
  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <Card className="p-8 relative">
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]"></div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Saldo Disponible</p>
            <h2 className="text-5xl font-extrabold text-emerald-400 tracking-tight mb-4">$42,850.24</h2>
            <div className="flex items-center gap-4 text-sm text-slate-300">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <TrendingUp size={16} />
                +12.4%
              </span>
              <span>vs mes pasado</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-sm font-medium text-slate-300">Progreso Mensual</span>
              <span className="text-xs text-slate-400">68% del objetivo</span>
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(78,222,163,0.3)] transition-all duration-1000" 
                style={{ width: '68%' }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 italic">"Estás un 5% por debajo del gasto promedio de este mes. ¡Buen trabajo!"</p>
          </div>
        </div>
      </Card>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPI 
          label="Total Ingresos" 
          value="$12,450.00" 
          icon={HandCoins} 
          colorClass="border-l-indigo-400"
          trend="Blue Tier"
        />
        <KPI 
          label="Total Egresos" 
          value="$8,120.45" 
          icon={ShoppingBag} 
          colorClass="border-l-rose-400"
          trend="Monthly Flow"
        />
        <KPI 
          label="Compromisos Fijos" 
          value="$3,200.00" 
          icon={Landmark} 
          colorClass="border-l-violet-400"
          trend="Fixed Costs"
        />
        <KPI 
          label="Saldo Libre" 
          value="$1,129.55" 
          icon={Wallet} 
          colorClass="border-l-emerald-400"
          trend="Available"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-8 h-[450px]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white">Flujo Semanal</h3>
              <p className="text-sm text-slate-400">Comparativa Ingresos vs Egresos</p>
            </div>
            <select className="bg-white/5 border border-white/10 rounded-lg text-xs text-slate-300 px-3 py-1.5 focus:ring-0">
              <option>Últimos 7 días</option>
              <option>Últimos 30 días</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Bar dataKey="in" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="out" fill="#fb7185" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-8 flex flex-col h-[450px]">
          <h3 className="text-2xl font-bold text-white mb-8">Distribución</h3>
          <div className="flex-1 min-h-0 relative mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Total Gastos</span>
              <span className="text-xl font-bold text-white">$8.1k</span>
            </div>
          </div>
          <div className="space-y-3">
            {distributionData.map((item) => (
              <div key={item.name} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="text-white font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row: Payments & Credits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Próximos Pagos</h3>
            <button className="text-xs font-bold text-indigo-400 hover:underline">Ver todo</button>
          </div>
          <div className="space-y-4">
            <PaymentItem 
              icon={Bolt} 
              title="Servicio Eléctrico" 
              due="Vence en 2 días" 
              amount="$120.00" 
              color="text-indigo-400"
            />
            <PaymentItem 
              icon={Smartphone} 
              title="Suscripción SaaS Pro" 
              due="Vence en 5 días" 
              amount="$45.99" 
              color="text-violet-400"
            />
            <PaymentItem 
              icon={Car} 
              title="Seguro Automotriz" 
              due="Vence en 12 días" 
              amount="$210.00" 
              color="text-emerald-400"
            />
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Mis Créditos</h3>
            <button className="text-xs font-bold text-indigo-400 hover:underline">Gestionar</button>
          </div>
          <div className="space-y-4">
            <CreditItem 
               title="BBVA Real Estate" 
               type="Hipotecario" 
               rate="4.2%" 
               remaining="$145k" 
               total="$350k" 
               progress={58}
               color="from-indigo-600"
            />
            <CreditItem 
               title="Préstamo de Expansión" 
               type="Personal" 
               rate="8.5%" 
               remaining="$4.2k" 
               total="$12k" 
               progress={65}
               color="from-emerald-500"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function PaymentItem({ icon: Icon, title, due, amount, color }: any) {
  return (
    <Card className="p-4 flex items-center justify-between border-l-2 border-white/5 hover:border-indigo-500/50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full lg:rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
          <Icon size={20} className={color} />
        </div>
        <div>
          <p className="text-sm font-bold text-white">{title}</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">{due}</p>
        </div>
      </div>
      <p className="text-sm font-bold text-white">{amount}</p>
    </Card>
  );
}

function CreditItem({ title, type, rate, remaining, total, progress, color }: any) {
  return (
    <Card className={`p-6 bg-gradient-to-br ${color}/10 to-transparent border-none overflow-hidden`}>
      <div className="flex justify-between mb-4">
        <div>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-0.5">{type}</p>
          <p className="text-sm font-bold text-white">{title}</p>
        </div>
        <span className="text-[10px] font-bold text-indigo-400 px-2 py-1 bg-white/5 rounded-lg border border-white/5">Tasa {rate}</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-[10px] text-slate-500 font-medium">
          <span>Restante: {remaining}</span>
          <span>Total: {total}</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
          <div className={`h-full bg-gradient-to-r ${color} to-primary-violet w-[${progress}%] rounded-full`}></div>
        </div>
      </div>
    </Card>
  );
}
