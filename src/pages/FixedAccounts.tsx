import React from 'react';
import { 
  Repeat, 
  Calendar, 
  Trash2, 
  Plus, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  MoreVertical
} from 'lucide-react';
import { Card } from '../components/UI';
import { cn } from '../lib/utils';

const fixedAccounts = [
  { id: 1, name: 'Alquiler Residencia', category: 'VIVIENDA', amount: 1500, cycle: 'Mensual', next: '05 Dic', status: 'pending' },
  { id: 2, name: 'Seguro Médico Premium', category: 'SALUD', amount: 450, cycle: 'Mensual', next: '12 Nov', status: 'paid' },
  { id: 3, name: 'Fibra Óptica 1Gbps', category: 'SERVICIOS', amount: 65, cycle: 'Mensual', next: '18 Nov', status: 'pending' },
  { id: 4, name: 'Cloud Subscription', category: 'TECNOLOGÍA', amount: 99.99, cycle: 'Anual', next: '01 Ene', status: 'pending' },
  { id: 5, name: 'Membresía Coworking', category: 'TRABAJO', amount: 250, cycle: 'Mensual', next: '20 Nov', status: 'pending' },
];

export function FixedAccountsPage() {
  const totalFixed = fixedAccounts.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-10 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Cuentas Fijas</h1>
          <p className="text-slate-400">Controla tus gastos recurrentes y suscripciones.</p>
        </div>
        <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl px-6 py-3 flex items-center gap-4">
           <div className="text-right">
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Costo Fijo Mensual</p>
             <p className="text-2xl font-black text-violet-400">${totalFixed.toLocaleString()}</p>
           </div>
           <div className="p-2 rounded-xl bg-violet-500/20 text-violet-400">
             <Repeat size={20} />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upcoming List */}
        <div className="lg:col-span-8 space-y-4">
           <div className="flex justify-between items-center px-2 mb-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Listado de Compromisos</h3>
              <button className="flex items-center gap-1 text-xs font-bold text-indigo-400 hover:underline">
                <Plus size={14} /> Nueva Cuenta
              </button>
           </div>
           
           <div className="space-y-3">
              {fixedAccounts.map(account => (
                <Card key={account.id} className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 group hover:bg-white/5 transition-all">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center border",
                      account.status === 'paid' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-violet-500/10 border-violet-500/20 text-violet-400"
                    )}>
                      {account.status === 'paid' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{account.name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{account.category}</span>
                        <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                        <span className="text-[10px] text-slate-400 italic font-medium">{account.cycle}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-10 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-0 border-white/5">
                     <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Próximo</p>
                        <p className="text-sm font-bold text-white">{account.next}</p>
                     </div>
                     <div className="flex items-center gap-6">
                        <span className="text-xl font-bold text-white">${account.amount}</span>
                        <div className="flex items-center gap-1">
                           <button className="p-2 rounded-lg text-slate-600 hover:text-white hover:bg-white/5 transition-all">
                             <Trash2 size={16} />
                           </button>
                           <button className="p-2 rounded-lg text-slate-600 hover:text-white hover:bg-white/5 transition-all">
                             <MoreVertical size={16} />
                           </button>
                        </div>
                     </div>
                  </div>
                </Card>
              ))}
           </div>
        </div>

        {/* Calendar View Placeholder / Statistics */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="p-6 relative overflow-hidden h-fit">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Calendar size={120} />
              </div>
              <h3 className="text-xl font-bold text-white mb-6">Calendario de Pagos</h3>
              <div className="grid grid-cols-7 gap-2 mb-4">
                 {['L','M','X','J','V','S','D'].map(d => (
                   <div key={d} className="text-[10px] font-bold text-slate-500 text-center uppercase tracking-widest">{d}</div>
                 ))}
                 {Array.from({ length: 31 }).map((_, i) => (
                    <div key={i} className={cn(
                      "aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold border border-white/5",
                      (i+1 === 5 || i+1 === 12 || i+1 === 18) ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "text-slate-500 bg-white/5"
                    )}>
                      {i + 1}
                    </div>
                 ))}
              </div>
              <p className="text-xs text-slate-400 text-center italic">Tienes 3 pagos programados para el resto del mes.</p>
           </Card>

           <Card className="p-6 border-l-4 border-rose-400 bg-rose-400/5">
              <div className="flex items-start gap-4">
                <AlertCircle className="text-rose-400 shrink-0" size={20} />
                <div className="space-y-1">
                   <p className="text-sm font-bold text-white">Renovación Próxima</p>
                   <p className="text-xs text-slate-400 leading-relaxed">Tu suscripción a "Cloud Services" se renovará automáticamente el 01 Enero por $99.99.</p>
                </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
