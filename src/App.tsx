import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar, MobileNav } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { Dashboard } from './pages/Dashboard';
import { IncomePage } from './pages/Income';
import { ExpensesPage } from './pages/Expenses';
import { BudgetPage } from './pages/Budget';
import { CreditsPage } from './pages/Credits';
import { FixedAccountsPage } from './pages/FixedAccounts';
import { ReportsPage } from './pages/Reports';
import { HouseholdPage } from './pages/Household';
import { SettingsPage } from './pages/Settings';
import { LoginPage } from './pages/Login';

// Page placeholders for now
const ComingSoon = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
    <h2 className="text-4xl font-bold text-white mb-2">{title}</h2>
    <p className="text-slate-400 max-w-md mx-auto">
      This section is under construction. We are working hard to bring you a premium financial management experience.
    </p>
    <div className="w-16 h-1 bg-indigo-500 rounded-full"></div>
  </div>
);

function LayoutShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-background selection:bg-indigo-500/30">
      <Sidebar />
      <TopNav />
      
      <main className="pt-24 pb-28 lg:pb-12 px-6 lg:pl-[264px] lg:pr-12 max-w-[1600px] mx-auto min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      
      <MobileNav />
      
      {/* Background Decorative Elements */}
      <div className="fixed bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="fixed top-[-10%] left-[-5%] w-[300px] h-[300px] bg-emerald-600/5 blur-[100px] rounded-full pointer-events-none -z-10"></div>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Router>
      <LayoutShell>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ingresos" element={<IncomePage />} />
          <Route path="/egresos" element={<ExpensesPage />} />
          <Route path="/presupuesto" element={<BudgetPage />} />
          <Route path="/creditos" element={<CreditsPage />} />
          <Route path="/cuentas-fijas" element={<FixedAccountsPage />} />
          <Route path="/reportes" element={<ReportsPage />} />
          <Route path="/vista-hogar" element={<HouseholdPage />} />
          <Route path="/configuracion" element={<SettingsPage />} />
        </Routes>
      </LayoutShell>
    </Router>
  );
}
