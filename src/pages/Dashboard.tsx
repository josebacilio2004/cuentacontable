import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  HandCoins, 
  ShoppingBag, 
  Landmark, 
  Wallet,
  Bolt,
  Smartphone,
  Car,
  Loader2
} from 'lucide-react';
import { Card, KPI } from '../components/UI';
import { cn } from '../lib/utils';
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
import { supabase } from '../lib/supabase';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { useTranslation } from '../lib/i18n';

export function Dashboard() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    totalDebt: 0,
    availableBalance: 0,
    distribution: [] as any[],
    weeklyFlow: [] as any[]
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const start = startOfMonth(new Date());
      const end = endOfMonth(new Date());

      // Fetch Transactions
      const { data: transactions, error: tError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', start.toISOString())
        .lte('date', end.toISOString());

      if (tError) throw tError;

      // Fetch Credits
      const { data: credits, error: cError } = await supabase
        .from('credits')
        .select('*')
        .eq('user_id', user.id);

      if (cError) throw cError;

      if (transactions) {
        const income = transactions.filter(t => t.type === 'income').reduce((a, b) => a + Number(b.amount), 0);
        const expense = transactions.filter(t => t.type === 'expense').reduce((a, b) => a + Number(b.amount), 0);
        
        // Categorización para el PieChart
        const cats: any = {};
        transactions.filter(t => t.type === 'expense').forEach(t => {
          cats[t.category] = (cats[t.category] || 0) + Number(t.amount);
        });
        
        const distribution = Object.keys(cats).map(name => ({
          name,
          value: cats[name],
          color: name === 'Alimentación' ? '#4edea3' : name === 'Transporte' ? '#c0c1ff' : '#d0bcff'
        }));

        // Mocking weekly flow based on current transactions
        const weeklyFlow = [
          { name: 'LUN', in: income * 0.1, out: expense * 0.15 },
          { name: 'MAR', in: income * 0.2, out: expense * 0.1 },
          { name: 'MIE', in: income * 0.15, out: expense * 0.2 },
          { name: 'JUE', in: income * 0.25, out: expense * 0.15 },
          { name: 'VIE', in: income * 0.3, out: expense * 0.4 },
        ];

        const debt = credits?.reduce((a, b) => a + Number(b.remaining_balance), 0) || 0;

        setStats({
          totalIncome: income,
          totalExpense: expense,
          totalDebt: debt,
          availableBalance: income - expense,
          distribution,
          weeklyFlow
        });
      }
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      // Fallback or keep zeros
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-500">
        <Loader2 className="animate-spin w-10 h-10 mb-4 text-indigo-500" />
        <p className="font-medium animate-pulse">Consolidando tus finanzas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Hero Section */}
      <Card className="p-8 relative border-white/5 bg-slate-900/40">
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]"></div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Balance del Mes</p>
            <h2 className={cn("text-5xl font-extrabold tracking-tight mb-4", stats.availableBalance >= 0 ? "text-emerald-400" : "text-rose-400")}>
              {t('currency')}{stats.availableBalance.toLocaleString()}
            </h2>
            <div className="flex items-center gap-4 text-sm text-slate-300">
              <span className="flex items-center gap-1 text-indigo-400 font-bold">
                <TrendingUp size={16} />
                Calculado en tiempo real
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-sm font-medium text-slate-300">Límite de Gasto Sugerido</span>
              <span className="text-xs text-slate-400">{stats.totalIncome > 0 ? Math.round((stats.totalExpense / stats.totalIncome) * 100) : 0}% consumido</span>
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all duration-1000" 
                style={{ width: `${stats.totalIncome > 0 ? Math.min((stats.totalExpense / stats.totalIncome) * 100, 100) : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </Card>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPI label="Ingresos" value={`${t('currency')}${stats.totalIncome.toLocaleString()}`} icon={HandCoins} colorClass="border-l-emerald-400" trend="Este mes" />
        <KPI label="Egresos" value={`${t('currency')}${stats.totalExpense.toLocaleString()}`} icon={ShoppingBag} colorClass="border-l-rose-400" trend="Este mes" />
        <KPI label="Deuda Total" value={`${t('currency')}${stats.totalDebt.toLocaleString()}`} icon={Landmark} colorClass="border-l-violet-400" trend="Créditos" />
        <KPI label="Saldo Libre" value={`${t('currency')}${stats.availableBalance.toLocaleString()}`} icon={Wallet} colorClass="border-l-indigo-400" trend="Neto" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-8 h-[450px] border-white/5">
          <h3 className="text-2xl font-bold text-white mb-8">Flujo Mensual</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weeklyFlow}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} dy={10} />
                <YAxis hide />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} itemStyle={{ fontSize: '12px' }} />
                <Bar dataKey="in" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="out" fill="#fb7185" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-8 flex flex-col h-[450px] border-white/5">
          <h3 className="text-2xl font-bold text-white mb-8">Distribución</h3>
          <div className="flex-1 min-h-0 relative mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.distribution} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {stats.distribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Gastos</span>
              <span className="text-xl font-bold text-white">{t('currency')}{(stats.totalExpense/1000).toFixed(1)}k</span>
            </div>
          </div>
          <div className="space-y-3">
            {stats.distribution.map((item) => (
              <div key={item.name} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="text-white font-bold">{stats.totalExpense > 0 ? Math.round((item.value / stats.totalExpense) * 100) : 0}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
