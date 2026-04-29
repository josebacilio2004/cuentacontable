import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Plus, 
  X, 
  TrendingUp, 
  Calendar, 
  Loader2, 
  ChevronRight,
  ShieldCheck,
  Star,
  Gift,
  Zap
} from 'lucide-react';
import { Card } from '../components/UI';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { format, differenceInWeeks } from 'date-fns';
import { es } from 'date-fns/locale';

export function GoalsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Form State
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState(new Date().toISOString().split('T')[0]);
  const [targetTime, setTargetTime] = useState('23:00');
  const [icon, setIcon] = useState('Target');
  const [color, setColor] = useState('#6366f1');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) fetchGoals(user.id);
    });
  }, []);

  const fetchGoals = async (userId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setGoals(data);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!name || !targetAmount || !user) return;
    setSaving(true);

    const { error } = await supabase.from('savings_goals').insert({
      user_id: user.id,
      name,
      target_amount: parseFloat(targetAmount),
      deadline,
      target_time: targetTime,
      icon,
      color
    });

    if (!error) {
      setShowForm(false);
      setName('');
      setTargetAmount('');
      fetchGoals(user.id);
    }
    setSaving(false);
  };

  const handleComplete = async (goal: any) => {
    setSaving(true);
    
    // 1. Marcar como cumplido
    const { error: goalError } = await supabase
      .from('savings_goals')
      .update({ status: 'cumplido', current_amount: goal.target_amount })
      .eq('id', goal.id);

    if (!goalError) {
      // 2. Registrar como Ingreso
      await supabase.from('transactions').insert({
        user_id: user.id,
        amount: goal.target_amount,
        type: 'income',
        category: 'Ahorro Cumplido',
        description: `Meta alcanzada: ${goal.name}`,
        date: new Date().toISOString().split('T')[0]
      });
      
      if (user) fetchGoals(user.id);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('savings_goals').delete().eq('id', id);
    if (!error && user) fetchGoals(user.id);
  };

  const calculateWeeklySaving = (goal: any) => {
    if (!goal.deadline) return null;
    const weeks = differenceInWeeks(new Date(goal.deadline + 'T12:00:00'), new Date());
    if (weeks <= 0) return goal.target_amount - goal.current_amount;
    return (goal.target_amount - goal.current_amount) / weeks;
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Star size={14} className="text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-widest">Tus Objetivos</span>
          </div>
          <h1 className="text-4xl font-bold text-white">Metas de Ahorro</h1>
        </div>
        
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? 'Cancelar' : 'Nueva Meta'}
        </button>
      </div>

      {showForm && (
        <Card className="p-8 bg-slate-900/80 border-indigo-500/30 animate-in slide-in-from-top-4 duration-300">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nombre de la Meta</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="Ej: Nueva Laptop" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Monto Objetivo (S/)</label>
                <input 
                  type="number" 
                  value={targetAmount} 
                  onChange={e => setTargetAmount(e.target.value)} 
                  placeholder="0.00" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fecha Límite</label>
                <input 
                  type="date" 
                  value={deadline} 
                  onChange={e => setDeadline(e.target.value)} 
                  className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hora Objetivo</label>
                <input 
                  type="time" 
                  value={targetTime} 
                  onChange={e => setTargetTime(e.target.value)} 
                  className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500" 
                />
              </div>
              <div className="flex items-end">
                <button 
                  onClick={handleSave}
                  disabled={saving || !name || !targetAmount}
                  className="w-full py-3 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-400 transition-all disabled:opacity-50"
                >
                  {saving ? <Loader2 className="animate-spin mx-auto" /> : 'Crear Meta'}
                </button>
              </div>
           </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full flex items-center justify-center h-64 text-slate-500">
            <Loader2 className="animate-spin mr-2" /> Cargando metas...
          </div>
        ) : goals.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center h-64 text-slate-500 italic bg-white/5 rounded-3xl border border-dashed border-white/10">
            <Gift size={48} className="mb-4 opacity-20" />
            Aún no tienes metas de ahorro. ¡Empieza una hoy!
          </div>
        ) : (
          goals.map(goal => {
            const isCompleted = goal.status === 'cumplido';
            const progress = isCompleted ? 100 : Math.min(Math.round((goal.current_amount / goal.target_amount) * 100), 100);
            const weekly = calculateWeeklySaving(goal);
            
            return (
              <Card key={goal.id} className={cn(
                "p-0 overflow-hidden group hover:border-indigo-500/30 transition-all border-white/5",
                isCompleted && "bg-emerald-500/5 border-emerald-500/20"
              )}>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center border",
                      isCompleted ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                    )}>
                      {isCompleted ? <Star size={24} /> : <Target size={24} />}
                    </div>
                    <div className="flex items-center gap-2">
                       {isCompleted && (
                         <span className="text-[8px] font-black uppercase tracking-widest bg-emerald-500 text-white px-2 py-1 rounded-md">Completada</span>
                       )}
                       <button 
                         onClick={() => handleDelete(goal.id)}
                         className="text-slate-600 hover:text-rose-400 p-2 opacity-0 group-hover:opacity-100 transition-all"
                       >
                         <X size={16} />
                       </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">{goal.name}</h3>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{goal.deadline ? format(new Date(goal.deadline + 'T12:00:00'), 'dd MMM', { locale: es }) : 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-indigo-400">
                      <Zap size={12} />
                      <span>{goal.target_time?.slice(0, 5) || '23:59'}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400 font-medium">Progreso</span>
                      <span className={cn("font-bold", isCompleted ? "text-emerald-400" : "text-white")}>{progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          isCompleted ? "bg-emerald-500" : "bg-indigo-500"
                        )}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-slate-500">S/ {goal.current_amount.toLocaleString()}</span>
                      <span className="text-indigo-400">Objetivo: S/ {goal.target_amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {!isCompleted ? (
                  <button 
                    onClick={() => handleComplete(goal)}
                    disabled={saving}
                    className="w-full py-4 bg-indigo-500 text-white text-xs font-bold hover:bg-indigo-400 transition-all flex items-center justify-center gap-2"
                  >
                    {saving ? <Loader2 className="animate-spin" /> : <>Cumplir Meta <ChevronRight size={14} /></>}
                  </button>
                ) : (
                  <div className="w-full py-4 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                     <ShieldCheck size={14} /> Dinero Agregado al Saldo
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      <Card className="p-8 bg-gradient-to-br from-indigo-600/10 to-transparent border-indigo-500/20 flex flex-col md:flex-row items-center gap-8">
         <div className="w-20 h-20 rounded-3xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <ShieldCheck size={40} />
         </div>
         <div className="flex-1 space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold text-white">¿Sabías que...?</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Tener metas visuales aumenta en un <span className="text-indigo-400 font-bold">40%</span> las probabilidades de éxito financiero. 
              Recuerda que cada sol ahorrado hoy es un paso hacia tu libertad financiera del mañana.
            </p>
         </div>
         <button className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl transition-all">Más Consejos</button>
      </Card>
    </div>
  );
}
