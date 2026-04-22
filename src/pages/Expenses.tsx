import React, { useState, useEffect } from 'react';
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
  Fuel,
  X,
  Trash2,
  Loader2,
  Wallet
} from 'lucide-react';
import { Card } from '../components/UI';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const categoryIcons: any = {
  'Alimentación': Utensils,
  'Transporte': Bus,
  'Salud': Activity,
  'Vivienda': Home,
  'Tecnología': ShoppingBag,
  'Otro': Wallet
};

const categoryColors: any = {
  'Alimentación': 'text-emerald-400 bg-emerald-400/10 border-l-emerald-400',
  'Transporte': 'text-indigo-400 bg-indigo-400/10 border-l-indigo-400',
  'Salud': 'text-rose-400 bg-rose-400/10 border-l-rose-400',
  'Vivienda': 'text-violet-400 bg-violet-400/10 border-l-violet-400',
  'Tecnología': 'text-cyan-400 bg-cyan-400/10 border-l-cyan-400',
  'Otro': 'text-slate-400 bg-slate-400/10 border-l-slate-400'
};

export function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Form State
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Alimentación');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isShared, setIsShared] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) fetchExpenses(user.id);
    });
  }, []);

  const fetchExpenses = async (userId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'expense')
      .order('date', { ascending: false });

    if (!error && data) {
      setExpenses(data);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!amount || !user) return;
    setSaving(true);

    const { error } = await supabase.from('transactions').insert({
      user_id: user.id,
      amount: parseFloat(amount),
      type: 'expense',
      category,
      description,
      date,
      is_shared: isShared
    });

    if (!error) {
      setAmount('');
      setDescription('');
      setShowAddForm(false);
      fetchExpenses(user.id);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (!error && user) {
      fetchExpenses(user.id);
    }
  };

  const totalExpense = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Egresos</h1>
          <p className="text-slate-500">Control detallado de tus salidas de dinero.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-indigo-500/20"
        >
          {showAddForm ? <X size={20} /> : <Plus size={20} />}
          {showAddForm ? 'Cerrar' : 'Nuevo Egreso'}
        </button>
      </div>

      {showAddForm && (
        <Card className="p-8 bg-slate-900/80 border-indigo-500/30 animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Monto del Egreso</label>
              <div className="relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl font-bold text-rose-400 ">$</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-transparent border-none text-4xl font-bold text-white focus:ring-0 p-0 pl-8 border-b border-white/10 pb-2 placeholder-white/20"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Descripción / Nota</label>
                <input 
                  type="text" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ej: Cena en La Fontana"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Categoría</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
                  >
                    <option value="Alimentación">Alimentación</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Salud">Salud</option>
                    <option value="Vivienda">Vivienda</option>
                    <option value="Tecnología">Tecnología</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Fecha</label>
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-4">
            <div className="flex items-center gap-3 px-6 py-2 bg-white/5 rounded-xl border border-white/5 cursor-pointer" onClick={() => setIsShared(!isShared)}>
              <span className="text-xs font-semibold text-slate-400">Gasto Compartido</span>
              <div className={cn("w-8 h-4 rounded-full p-1 transition-colors duration-200 flex items-center", isShared ? "bg-indigo-500" : "bg-white/10")}>
                <div className={cn("w-2.5 h-2.5 bg-white rounded-full shadow-sm transition-transform", isShared ? "translate-x-3.5" : "translate-x-0")} />
              </div>
            </div>
            <button 
              onClick={handleSave}
              disabled={saving || !amount}
              className="px-10 py-3 bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <Loader2 className="animate-spin w-5 h-5" /> : 'Guardar Egreso'}
            </button>
          </div>
        </Card>
      )}

      {/* Top Insights */}
      <section className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <Card className="p-6 md:col-span-2 lg:col-span-1 flex flex-col justify-between border-white/5">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">GASTO TOTAL</p>
            <p className="text-4xl font-extrabold text-white tracking-tight">${totalExpense.toLocaleString()}</p>
          </div>
          <div className="mt-4 flex items-center text-rose-400 font-bold text-xs gap-1">
            <ArrowUp size={14} />
            Calculado del mes
          </div>
        </Card>

        <Card className="p-6 md:col-span-2 lg:col-span-4 flex items-center border-white/5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            {Object.keys(categoryIcons).slice(0, 4).map((catName) => {
              const Icon = categoryIcons[catName];
              const catTotal = expenses.filter(e => e.category === catName).reduce((a, b) => a + Number(b.amount), 0);
              const percentage = totalExpense > 0 ? Math.round((catTotal / totalExpense) * 100) : 0;
              return (
                <div key={catName} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       <Icon size={16} className="text-indigo-400" />
                       <span className="text-xs font-bold text-slate-300 uppercase tracking-tighter">{catName}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-500">{percentage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 bg-indigo-500" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      {/* Grid of Expenses */}
      {loading ? (
        <div className="flex items-center justify-center h-64 text-slate-500">
          <Loader2 className="animate-spin mr-2" /> Cargando egresos...
        </div>
      ) : expenses.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-slate-500 italic">
          No hay egresos registrados. Comienza añadiendo uno arriba.
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expenses.map((tx) => {
            const Icon = categoryIcons[tx.category] || Wallet;
            const colors = categoryColors[tx.category] || categoryColors['Otro'];
            return (
              <Card key={tx.id} className={cn("p-6 flex flex-col gap-5 border-l-4 group hover:scale-[1.02] transition-all duration-300 border-white/5", colors.split(' ').pop())}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110", colors.split(' ').slice(1, -1).join(' '))}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg leading-tight">{tx.category}</h3>
                      <div className="text-xs text-slate-500 mt-1">{format(new Date(tx.date), 'dd MMM, yyyy', { locale: es })}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(tx.id)}
                    className="p-2 text-slate-600 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="flex justify-between items-end border-t border-white/5 pt-4">
                  <div className="text-xs font-medium text-slate-500 italic max-w-[150px] truncate">{tx.description || 'Sin descripción'}</div>
                  <div className="text-2xl font-black text-white">${Number(tx.amount).toLocaleString()}</div>
                </div>
              </Card>
            );
          })}
        </section>
      )}
    </div>
  );
}
