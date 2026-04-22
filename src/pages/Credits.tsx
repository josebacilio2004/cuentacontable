import React from 'react';
import { 
  CreditCard, 
  ArrowRight, 
  Plus, 
  Info, 
  ShieldCheck,
  Zap,
  TrendingDown
} from 'lucide-react';
import { Card } from '../components/UI';
import { cn } from '../lib/utils';

const creditCards = [
  { id: 1, bank: 'Platinum Reserve', last4: '4288', limit: 15000, used: 2450.50, color: 'from-slate-800 to-slate-900', text: 'text-white' },
  { id: 2, bank: 'Gold Infinite', last4: '9901', limit: 8000, used: 6120.00, color: 'from-amber-600/80 to-amber-700/80', text: 'text-white' },
];

const loans = [
  { id: 1, name: 'Préstamo Hipotecario', bank: 'Santander', remaining: 145200, total: 350000, rate: '4.2%', nextPayment: '01 Dic', amount: '$1,250' },
  { id: 2, name: 'Crédito Automotriz', bank: 'BBVA', remaining: 12400, total: 45000, rate: '7.8%', nextPayment: '15 Nov', amount: '$450' },
];

export function CreditsPage() {
  return (
    <div className="space-y-10 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Créditos</h1>
          <p className="text-slate-400">Gestiona tus líneas de crédito y préstamos activos.</p>
        </div>
        <button className="hidden md:flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20">
          <Plus size={20} />
          Solicitar Crédito
        </button>
      </div>

      {/* Credit Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-l-4 border-indigo-500">
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Deuda Total</p>
           <p className="text-3xl font-black text-white">$157,600.50</p>
           <div className="mt-4 flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <TrendingDown size={14} />
              -2.4% este mes
           </div>
        </Card>
        <Card className="p-6 border-l-4 border-violet-500">
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Capacidad Utilizada</p>
           <p className="text-3xl font-black text-white">38%</p>
           <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-violet-500 w-[38%] rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]"></div>
           </div>
        </Card>
        <Card className="p-6 border-l-4 border-emerald-500">
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Score Crediticio</p>
           <p className="text-3xl font-black text-white">782</p>
           <p className="mt-4 text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Excelente</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Credit Cards Section */}
        <section className="lg:col-span-12 xl:col-span-5 space-y-6">
           <h3 className="text-xl font-bold text-white flex items-center gap-2 px-1">
             <CreditCard size={22} className="text-indigo-400" />
             Tarjetas de Crédito
           </h3>
           <div className="space-y-4">
             {creditCards.map(card => {
               const percentage = (card.used / card.limit) * 100;
               return (
                 <Card key={card.id} className={cn("p-0 overflow-hidden bg-gradient-to-br border-white/5", card.color)}>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-10">
                        <div className="w-10 h-7 bg-amber-400/40 rounded-md backdrop-blur-sm shadow-inner"></div>
                        <ShieldCheck size={24} className="text-white/40" />
                      </div>
                      <div className="mb-8">
                        <p className={cn("text-xs font-medium uppercase tracking-[0.3em] opacity-60", card.text)}>Card Number</p>
                        <p className={cn("text-xl font-bold tracking-[0.2em]", card.text)}>**** **** **** {card.last4}</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className={cn("text-[10px] font-medium uppercase opacity-60", card.text)}>Card Holder</p>
                          <p className={cn("text-sm font-bold", card.text)}>ALEX THOMPSON</p>
                        </div>
                        <div className={cn("text-right font-black italic text-2xl opacity-40", card.text)}>VISA</div>
                      </div>
                    </div>
                    {/* Usage bar */}
                    <div className="bg-black/20 px-6 py-4 border-t border-white/5">
                       <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-white/60 mb-2">
                         <span>Uso: ${card.used.toLocaleString()}</span>
                         <span>Limite: ${card.limit.toLocaleString()}</span>
                       </div>
                       <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full bg-white/60 rounded-full" style={{ width: `${percentage}%` }}></div>
                       </div>
                    </div>
                 </Card>
               );
             })}
           </div>
        </section>

        {/* Loans Section */}
        <section className="lg:col-span-12 xl:col-span-7 space-y-6">
           <div className="flex justify-between items-center px-1">
              <h3 className="text-xl font-bold text-white">Préstamos Activos</h3>
              <button className="text-xs font-bold text-indigo-400 hover:underline">Historial</button>
           </div>
           <div className="grid grid-cols-1 gap-4">
              {loans.map(loan => (
                <Card key={loan.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/20 transition-all cursor-pointer group">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-indigo-500/10 transition-colors">
                        <Zap size={24} className="text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg">{loan.name}</h4>
                        <p className="text-xs text-slate-500 font-medium">{loan.bank} • Tasa {loan.rate}</p>
                      </div>
                   </div>
                   
                   <div className="flex-1 max-w-md hidden sm:block">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        <span>Progreso de Pago</span>
                        <span>{((1 - loan.remaining/loan.total) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 rounded-full" 
                          style={{ width: `${(1 - loan.remaining/loan.total) * 100}%` }}
                        ></div>
                      </div>
                   </div>

                   <div className="flex items-center gap-8 justify-between md:justify-end">
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Próximo Pago</p>
                        <p className="text-sm font-bold text-white">{loan.amount} • {loan.nextPayment}</p>
                      </div>
                      <button className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                        <ArrowRight size={20} />
                      </button>
                   </div>
                </Card>
              ))}
           </div>

           <Card className="p-6 bg-indigo-600/5 border-dashed border-indigo-500/30 flex items-center gap-4">
              <Info className="text-indigo-400 shrink-0" size={24} />
              <div className="text-sm text-slate-300">
                <span className="font-bold text-indigo-300">Tip de Ahorro:</span> Al pagar un extra de $200 en tu Crédito Automotriz este mes, podrías ahorrarte $450 en intereses a largo plazo.
              </div>
           </Card>
        </section>
      </div>
    </div>
  );
}
