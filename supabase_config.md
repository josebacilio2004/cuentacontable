# Configuración de Supabase - CuentaContable

Para que el sistema funcione correctamente con datos reales, debes ejecutar este script SQL en el **SQL Editor** de tu proyecto en Supabase.

## 1. Creación de Tablas y RLS

```sql
-- Tabla de Transacciones (Ingresos y Egresos)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  type TEXT CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  description TEXT,
  date DATE DEFAULT CURRENT_DATE,
  is_shared BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Créditos (Actualizada)
CREATE TABLE IF NOT EXISTS credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  bank_name TEXT NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL, -- Capital solicitado
  remaining_balance DECIMAL(12,2) NOT NULL,
  monthly_payment DECIMAL(12,2) NOT NULL,
  due_date DATE,
  installments_total INTEGER,
  installments_paid INTEGER DEFAULT 0,
  payment_frequency TEXT DEFAULT 'mensual', -- 'mensual' o 'semanal'
  interest_rate DECIMAL(5,2) DEFAULT 0, -- TEA o TEM
  interest_type TEXT DEFAULT 'TEA', -- 'TEA', 'TEM' o 'Monto Fijo'
  total_to_return DECIMAL(12,2) NOT NULL, -- Capital + Intereses
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Cuentas Fijas
CREATE TABLE IF NOT EXISTS fixed_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  cycle TEXT DEFAULT 'Mensual',
  next_due_date DATE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE fixed_accounts ENABLE ROW LEVEL SECURITY;

-- Políticas para Transactions
CREATE POLICY "Users can manage their own transactions" 
ON transactions FOR ALL 
USING (auth.uid() = user_id);

-- Políticas para Credits
CREATE POLICY "Users can manage their own credits" 
ON credits FOR ALL 
USING (auth.uid() = user_id);

-- Políticas para Fixed Accounts
CREATE POLICY "Users can manage their own fixed accounts" 
ON fixed_accounts FOR ALL 
USING (auth.uid() = user_id);
```

## 2. Notas Importantes
*   **Autenticación**: Asegúrate de tener habilitado el proveedor de "Email" en la sección de Auth.
*   **HashRouter**: El sistema ahora usa `HashRouter` para evitar errores 404 al recargar la página en GitHub Pages. La URL ahora tendrá un `#` (ej: `.../cuentacontable/#/ingresos`).
*   **Despliegue**: Al hacer `npm run build`, los archivos se generan en `/docs`. Asegúrate de que GitHub Pages apunte a esa carpeta en la rama `master`.
