import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'es' | 'en';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  es: {
    'nav.dashboard': 'Dashboard',
    'nav.income': 'Ingresos',
    'nav.expenses': 'Egresos',
    'nav.credits': 'Créditos',
    'nav.fixed': 'Cuentas Fijas',
    'nav.reports': 'Reportes',
    'nav.budget': 'Presupuesto',
    'nav.household': 'Vista Hogar',
    'nav.settings': 'Configuración',
    'currency': 'S/',
    'total.received': 'Total Recibido',
    'total.spent': 'Total Gastado',
    'available.balance': 'Saldo Disponible',
    'save': 'Guardar',
    'delete': 'Eliminar',
    'cancel': 'Cancelar',
    'loading': 'Cargando...',
    'no.data': 'No hay datos registrados.',
    'add.income': 'Añadir Ingreso',
    'add.expense': 'Añadir Egreso',
    'add.credit': 'Nuevo Crédito',
    'description': 'Descripción',
    'category': 'Categoría',
    'date': 'Fecha',
    'amount': 'Monto',
    'shared': 'Gasto Compartido',
    'logout': 'Cerrar Sesión'
  },
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.income': 'Income',
    'nav.expenses': 'Expenses',
    'nav.credits': 'Credits',
    'nav.fixed': 'Fixed Accounts',
    'nav.reports': 'Reports',
    'nav.budget': 'Budget',
    'nav.household': 'Household View',
    'nav.settings': 'Settings',
    'currency': '$',
    'total.received': 'Total Received',
    'total.spent': 'Total Spent',
    'available.balance': 'Available Balance',
    'save': 'Save',
    'delete': 'Delete',
    'cancel': 'Cancel',
    'loading': 'Loading...',
    'no.data': 'No data recorded.',
    'add.income': 'Add Income',
    'add.expense': 'Add Expense',
    'add.credit': 'New Credit',
    'description': 'Description',
    'category': 'Category',
    'date': 'Date',
    'amount': 'Amount',
    'shared': 'Shared Expense',
    'logout': 'Logout'
  }
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('app_lang');
    return (saved as Language) || 'es';
  });

  useEffect(() => {
    localStorage.setItem('app_lang', language);
  }, [language]);

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) throw new Error('useTranslation must be used within TranslationProvider');
  return context;
}
