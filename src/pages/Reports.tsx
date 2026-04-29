import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Download, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart as PieIcon,
  Loader2
} from 'lucide-react';
import { Card } from '../components/UI';
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
  Cell,
  LineChart,
  Line
} from 'recharts';
import { supabase } from '../lib/supabase';
import { useTranslation } from '../lib/i18n';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

export function ReportsPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [distribution, setDistribution] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetchReportData();
  }, []);

  const exportToPDF = async () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(79, 70, 229); // Indigo 600
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('CUENTACONTABLE', 20, 20);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('REPORTE FINANCIERO PROFESIONAL', 20, 30);
    doc.text(format(new Date(), 'dd/MM/yyyy HH:mm', { locale: es }), 160, 20);

    // Summary Section
    const totalIn = transactions.filter(t => t.type === 'income').reduce((a, b) => a + Number(b.amount), 0);
    const totalOut = transactions.filter(t => t.type === 'expense').reduce((a, b) => a + Number(b.amount), 0);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text('Resumen de Periodo', 20, 55);
    
    autoTable(doc, {
      startY: 60,
      head: [['Concepto', 'Monto (S/)']],
      body: [
        ['Total Ingresos', `S/ ${totalIn.toLocaleString()}`],
        ['Total Egresos', `S/ ${totalOut.toLocaleString()}`],
        ['Saldo Neto', `S/ ${(totalIn - totalOut).toLocaleString()}`],
      ],
      theme: 'striped',
      headStyles: { fillStyle: [79, 70, 229] }
    });

    // Transactions Table
    doc.text('Detalle de Movimientos', 20, (doc as any).lastAutoTable.finalY + 20);
    
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 25,
      head: [['Fecha', 'Categoría', 'Descripción', 'Tipo', 'Monto']],
      body: transactions.map(t => [
        t.date,
        t.category,
        t.description || '-',
        t.type === 'income' ? 'Ingreso' : 'Egreso',
        `S/ ${Number(t.amount).toLocaleString()}`
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillStyle: [79, 70, 229] }
    });

    doc.save(`Reporte_CuentaContable_${format(new Date(), 'yyyyMMdd')}.pdf`);
  };

  const fetchReportData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch last 6 months of data
    const start = startOfMonth(subMonths(new Date(), 5));
    const end = endOfMonth(new Date());

    const { data: transactions } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', start.toISOString())
      .lte('date', end.toISOString());

    if (transactions) {
      // Group by month
      const monthlyData: any = {};
      const cats: any = {};

      transactions.forEach(t => {
        const monthName = format(new Date(t.date), 'MMM', { locale: es }).toUpperCase();
        if (!monthlyData[monthName]) monthlyData[monthName] = { name: monthName, in: 0, out: 0 };
        
        if (t.type === 'income') monthlyData[monthName].in += Number(t.amount);
        else {
          monthlyData[monthName].out += Number(t.amount);
          cats[t.category] = (cats[t.category] || 0) + Number(t.amount);
        }
      });

      setData(Object.values(monthlyData));
      setDistribution(Object.keys(cats).map(name => ({
        name,
        value: cats[name],
      })));
      setTransactions(transactions);
    }
    setLoading(false);
  };

  const handleExport = () => {
    const csv = [
      ['Fecha', 'Categoria', 'Tipo', 'Monto', 'Descripcion'],
      ...data.map(d => [d.name, 'N/A', 'N/A', d.in, 'Ingreso Mensual'])
    ].map(e => e.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_finanzas_${format(new Date(), 'yyyyMMdd')}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">{t('nav.reports')}</h1>
          <p className="text-slate-400">Análisis detallado de tu comportamiento financiero.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
            <Filter size={18} />
            Filtrar
          </button>
          <button 
            onClick={exportToPDF}
            className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
          >
            <Download size={18} />
            Exportar para Banco (PDF)
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-96 text-slate-500">
          <Loader2 className="animate-spin mr-2" /> {t('loading')}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Chart */}
          <Card className="lg:col-span-8 p-8 h-[500px] border-white/5 bg-slate-900/40">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
               <TrendingUp size={20} className="text-indigo-400" />
               Evolución Mensual (Ingresos vs Egresos)
            </h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                  <Bar dataKey="in" fill="#4edea3" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="out" fill="#fb7185" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Distribution Chart */}
          <Card className="lg:col-span-4 p-8 flex flex-col h-[500px] border-white/5 bg-slate-900/40">
             <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                <PieIcon size={20} className="text-indigo-400" />
                Categorías
             </h3>
             <div className="flex-1 min-h-0 relative mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={distribution} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {distribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="space-y-3">
               {distribution.slice(0, 4).map((item) => (
                 <div key={item.name} className="flex justify-between items-center text-xs">
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                     <span className="text-slate-300">{item.name}</span>
                   </div>
                   <span className="text-white font-bold">{t('currency')}{item.value.toLocaleString()}</span>
                 </div>
               ))}
             </div>
          </Card>
        </div>
      )}
    </div>
  );
}
