import React from 'react';
import { cn } from '../lib/utils';

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  glow?: boolean;
  key?: React.Key | null;
  [key: string]: any;
}

export function Card({ children, className, glow, ...props }: CardProps) {
  return (
    <div 
      className={cn(
        "glass-card rounded-[24px] p-6 relative overflow-hidden",
        glow && "after:absolute after:inset-0 after:bg-indigo-500/5 after:pointer-events-none",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function KPI({ label, value, icon: Icon, colorClass, trend }: { 
  label: string; 
  value: string; 
  icon: any; 
  colorClass: string;
  trend?: string;
}) {
  return (
    <Card className={cn("border-l-4", colorClass)}>
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2 rounded-lg bg-opacity-10", colorClass.replace('border-l-', 'bg-').replace('4', ''))}>
          <Icon size={20} className={colorClass.replace('border-l-', 'text-')} />
        </div>
        {trend && (
           <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{trend}</span>
        )}
      </div>
      <p className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </Card>
  );
}
