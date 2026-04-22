import React from 'react';
import { 
  Plus, 
  AlertCircle, 
  Calendar,
  Utensils,
  Car,
  Home,
  Tv,
  Gamepad,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';
import { Card } from '../components/UI';
import { cn } from '../lib/utils';

const budgets = [
  { id: 1, category: 'Alimentación', icon: Utensils, limit: 800, spent: 742.50, color: 'text-emerald-400', progressColor: 'from-emerald-600' },
  { id: 2, category: 'Transporte', icon: Car, limit: 350, spent: 120.00, color: 'text-indigo-400', progressColor: 'from-indigo-600' },
  { id: 3, category: 'Servicios', icon: Home, limit: 450, spent: 480.00, color: 'text-rose-400', progressColor: 'from-rose-600', exceeded: true },
  { id: 4, category: 'Streaming', icon: Tv, limit: 80, spent: 45.99, color: 'text-violet-400', progressColor: 'from-violet-600' },
  { id: 5, category: 'Ocio & Gaming', icon: Gamepad, limit: 200, spent: 185.00, color: 'text-indigo-400', progressColor: 'from-indigo-600' },
];

export function BudgetPage() {
  return (
    <div className="space-y-10 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Presupuesto</h1>
          <p className="text-slate-400">Controla tus límites de gasto mensuales por categoría.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 glass-card rounded-2xl flex items-center gap-2 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
            <Calendar size={18} />
            Mes Actual
          </button>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20">
            <Plus size={20} />
            Establecer Límite
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Budget Grid */}
        <div className="lg:col-span-8 space-y-6">
          {budgets.map((budget) => {
            const percentage = (budget.spent / budget.limit) * 100;
            const isNearLimit = percentage >= 90 && !budget.exceeded;
            
            return (
              <Card key={budget.id} className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className={cn("p-4 rounded-2xl bg-white/5 border border-white/5", budget.color)}>
                      <budget.icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{budget.category}</h3>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="uppercase font-bold tracking-widest leading-none">Septiembre 2023</span>
                        {budget.exceeded && (
                          <span className="flex items-center gap-1 text-rose-400 font-bold px-1.5 py-0.5 bg-rose-400/10 rounded uppercase text-[10px]">
                            Límite Excedido
                          </span>
                        )}
                        {isNearLimit && (
                          <span className="flex items-center gap-1 text-amber-400 font-bold px-1.5 py-0.5 bg-amber-400/10 rounded uppercase text-[10px]">
                            Al Límite (90%+)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-white">${budget.spent.toFixed(2)}</p>
                    <p className="text-xs text-slate-500 font-medium">de ${budget.limit.toFixed(2)}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/10 p-[1.5px]">
                    <div 
                      className={cn(
                        "h-full rounded-full bg-gradient-to-r to-transparent transition-all duration-1000 shadow-[0_0_10px_rgba(0,0,0,0.2)]",
                        budget.exceeded ? "from-rose-500" : isNearLimit ? "from-amber-400" : budget.progressColor
                      )} 
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <span>{percentage.toFixed(0)}% Utilizado</span>
                    <span className={cn(
                      budget.exceeded ? "text-rose-400" : "text-emerald-400"
                    )}>
                      {budget.exceeded 
                        ? `Sobrepasado por $${(budget.spent - budget.limit).toFixed(2)}` 
                        : `Quedan $${(budget.limit - budget.spent).toFixed(2)} disponibles`
                      }
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Sidebar: Summary & Alerts */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-8 bg-gradient-to-br from-indigo-900/40 to-transparent border-indigo-500/20">
            <h3 className="text-xl font-black text-white mb-6 uppercase tracking-wider">Resumen Global</h3>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
                  <span>Presupuesto Total</span>
                  <span>78%</span>
                </div>
                <p className="text-3xl font-black text-white mb-4">$3,200 / $4,100</p>
                <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <div className="h-full bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-400 w-[78%]" />
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Días Restantes</p>
                   <p className="text-2xl font-bold text-white">12</p>
                 </div>
                 <div className="space-y-1">
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Diario Estimado</p>
                   <p className="text-2xl font-bold text-emerald-400">$24.50</p>
                 </div>
              </div>
            </div>
          </Card>

          <section>
            <h3 className="text-lg font-bold text-white mb-4 px-2">Alertas Inteligentes</h3>
            <div className="space-y-3">
              <AlertItem 
                type="warning" 
                title="Límite en Servicios" 
                desc="Has excedido tu presupuesto mensual de luz y agua."
              />
              <AlertItem 
                type="info" 
                title="Sugerencia de Ahorro" 
                desc="Has gastado menos en Ocio de lo habitual. ¿Transferir a la cuenta de ahorro?"
              />
              <AlertItem 
                type="success" 
                title="Meta Alcanzada" 
                desc="¡Felicidades! Lograste mantener tu presupuesto de Transporte bajo control."
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function AlertItem({ type, title, desc }: any) {
  const styles = {
    warning: { bg: 'bg-rose-500/10 border-rose-500/20', icon: <AlertCircle size={18} className="text-rose-400" /> },
    info: { bg: 'bg-indigo-500/10 border-indigo-500/20', icon: <AlertCircle size={18} className="text-indigo-400" /> },
    success: { bg: 'bg-emerald-500/10 border-emerald-500/20', icon: <CheckCircle2 size={18} className="text-emerald-400" /> }
  }[type as 'warning' | 'info' | 'success'];

  return (
    <div className={cn("p-4 rounded-2xl border flex gap-4 transition-all hover:translate-x-1 cursor-pointer", styles.bg)}>
      <div className="shrink-0 mt-0.5">{styles.icon}</div>
      <div>
        <p className="text-sm font-bold text-white">{title}</p>
        <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed uppercase tracking-tighter">{desc}</p>
      </div>
    </div>
  );
}
