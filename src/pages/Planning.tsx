import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Info, 
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { Card } from '../components/UI';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { format, addMonths, startOfMonth, endOfMonth, isAfter, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';

export function PlanningPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [metrics, setMetrics] = useState({
    avgIncome: 0,
    avgExpense: 0,
    nextPayment: null as any,
    healthScore: 0
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) generateProjection(user.id);
    });
  }, []);

  const generateProjection = async (userId: string) => {
    setLoading(true);

    // 1. Obtener Historial (últimos 3 meses)
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    const { data: history } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', format(threeMonthsAgo, 'yyyy-MM-dd'));

    // 2. Obtener Compromisos Futuros
    const { data: credits } = await supabase.from('credits').select('*').eq('user_id', userId);
    const { data: fixed } = await supabase.from('fixed_accounts').select('*').eq('user_id', userId);

    // 3. Calcular Promedios
    const incomes = history?.filter(t => t.type === 'income') || [];
    const expenses = history?.filter(t => t.type === 'expense') || [];
    
    const avgMonthlyIncome = incomes.reduce((a, b) => a + Number(b.amount), 0) / 3;
    const avgMonthlyExpense = expenses.reduce((a, b) => a + Number(b.amount), 0) / 3;

    // 4. Generar Proyección para 6 meses
    const projection = [];
    let currentBalance = incomes.reduce((a, b) => a + Number(b.amount), 0) - expenses.reduce((a, b) => a + Number(b.amount), 0);
    
    for (let i = 0; i < 6; i++) {
      const monthDate = addMonths(new Date(), i);
      const monthName = format(monthDate, 'MMM yyyy', { locale: es });
      
      // Ingreso Estimado (Promedio)
      const projectedIncome = avgMonthlyIncome;
      
      // Egreso Estimado (Promedio + Compromisos)
      let projectedExpense = avgMonthlyExpense;
      
      // Sumar créditos del mes
      credits?.forEach(c => {
        if (c.remaining_balance > 0) {
          projectedExpense += Number(c.monthly_payment);
        }
      });

      // Sumar cuentas fijas
      fixed?.forEach(f => {
        projectedExpense += Number(f.amount);
      });

      currentBalance += (projectedIncome - projectedExpense);

      projection.push({
        name: monthName,
        income: projectedIncome,
        expense: projectedExpense,
        balance: currentBalance
      });
    }

    setData(projection);
    setMetrics({
      avgIncome: avgMonthlyIncome,
      avgExpense: avgMonthlyExpense,
      nextPayment: credits?.[0],
      healthScore: avgMonthlyIncome > avgMonthlyExpense ? 85 : 45
    });
    setLoading(false);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Zap size={14} className="text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-widest">Inteligencia Financiera</span>
          </div>
          <h1 className="text-4xl font-bold text-white">Proyección de Flujo</h1>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-emerald-500/5 border-emerald-500/10">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400"><TrendingUp size={20} /></div>
             <span className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-widest">Ingreso Promedio</span>
          </div>
          <p className="text-2xl font-bold text-white">S/ {metrics.avgIncome.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-2">Basado en últimos 3 meses</p>
        </Card>

        <Card className="p-6 bg-rose-500/5 border-rose-500/10">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400"><TrendingDown size={20} /></div>
             <span className="text-[10px] font-bold text-rose-500/50 uppercase tracking-widest">Gasto Estimado</span>
          </div>
          <p className="text-2xl font-bold text-white">S/ {metrics.avgExpense.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-2">Promedio histórico mensual</p>
        </Card>

        <Card className="p-6 bg-indigo-500/5 border-indigo-500/10">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400"><ShieldCheck size={20} /></div>
             <span className="text-[10px] font-bold text-indigo-500/50 uppercase tracking-widest">Salud Financiera</span>
          </div>
          <p className="text-2xl font-bold text-white">{metrics.healthScore}/100</p>
          <div className="w-full h-1.5 bg-white/5 rounded-full mt-4 overflow-hidden">
             <div className={cn(
               "h-full rounded-full transition-all duration-1000",
               metrics.healthScore > 70 ? "bg-emerald-500" : "bg-amber-500"
             )} style={{ width: `${metrics.healthScore}%` }}></div>
          </div>
        </Card>

        <Card className="p-6 bg-amber-500/5 border-amber-500/10">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400"><Calendar size={20} /></div>
             <span className="text-[10px] font-bold text-amber-500/50 uppercase tracking-widest">Próximo Compromiso</span>
          </div>
          <p className="text-2xl font-bold text-white">{metrics.nextPayment?.bank_name || 'Ninguno'}</p>
          <p className="text-xs text-slate-500 mt-2">S/ {Number(metrics.nextPayment?.monthly_payment || 0).toLocaleString()}</p>
        </Card>
      </div>

      {/* Projection Chart */}
      <Card className="p-8 border-white/5 bg-slate-900/40 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h3 className="text-2xl font-bold text-white">Proyección de Saldo (6 Meses)</h3>
            <p className="text-slate-500 text-sm mt-1">Simulación basada en compromisos fijos e ingresos promedio.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <span className="text-xs font-bold text-slate-400">Saldo Final</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500/30"></div>
                <span className="text-xs font-bold text-slate-400">Área de Seguridad</span>
             </div>
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
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
                dy={15}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickFormatter={(value) => `S/ ${value.toLocaleString()}`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
                itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                formatter={(value: any) => [`S/ ${value.toLocaleString()}`, 'Saldo Proyectado']}
              />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#6366f1" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorBalance)" 
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Action Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card className="p-8 bg-slate-900/80 border-white/10 flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shrink-0">
               <AlertTriangle size={32} />
            </div>
            <div>
               <h4 className="text-xl font-bold text-white mb-2">Simulación de Retraso</h4>
               <p className="text-slate-400 text-sm leading-relaxed mb-6">
                 ¿Qué pasa si un cliente se retrasa 15 días con un pago de negocio? 
                 Nuestra IA detecta que tu flujo de caja soportaría hasta <span className="text-indigo-400 font-bold">S/ 2,400</span> en retrasos antes de comprometer tus cuotas bancarias.
               </p>
               <button className="text-indigo-400 text-xs font-bold uppercase tracking-widest hover:underline flex items-center gap-2">
                 Ejecutar Simulación de Stress <ArrowUpRight size={14} />
               </button>
            </div>
         </Card>

         <Card className="p-8 bg-slate-900/80 border-white/10 flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shrink-0">
               <Target size={32} />
            </div>
            <div>
               <h4 className="text-xl font-bold text-white mb-2">Oportunidad de Inversión</h4>
               <p className="text-slate-400 text-sm leading-relaxed mb-6">
                 Basado en tu proyección, para el mes de <span className="text-emerald-400 font-bold">Junio 2026</span> tendrás un excedente de <span className="text-emerald-400 font-bold">S/ 5,800</span>. 
                 Es un momento ideal para realizar un pago extraordinario a tu crédito con mayor tasa (TEA).
               </p>
               <button className="text-emerald-400 text-xs font-bold uppercase tracking-widest hover:underline flex items-center gap-2">
                 Ver Sugerencias de Prepago <ArrowUpRight size={14} />
               </button>
            </div>
         </Card>
      </div>
    </div>
  );
}
