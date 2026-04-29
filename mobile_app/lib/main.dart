import 'package:flutter/material.dart';
import 'package:cuentacontable_mobile/core/config/supabase_config.dart';
import 'package:cuentacontable_mobile/core/theme/app_theme.dart';
import 'package:cuentacontable_mobile/features/dashboard/dashboard_screen.dart';
import 'package:cuentacontable_mobile/features/credits/credits_screen.dart';
import 'package:lucide_icons/lucide_icons.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await SupabaseConfig.initialize();
  runApp(const CuentaContableApp());
}

class CuentaContableApp extends StatelessWidget {
  const CuentaContableApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CuentaContable',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: const DashboardWrapper(),
    );
  }
}

class DashboardWrapper extends StatefulWidget {
  const DashboardWrapper({super.key});

  @override
  State<DashboardWrapper> createState() => _DashboardWrapperState();
}

class _DashboardWrapperState extends State<DashboardWrapper> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: const [
          DashboardScreen(),
          CreditsScreen(),
          Center(child: Text('Metas')),
          Center(child: Text('Perfil')),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        type: BottomNavigationBarType.fixed,
        backgroundColor: AppTheme.slateCard.withAlpha(204),
        selectedItemColor: AppTheme.indigoAccent,
        unselectedItemColor: Colors.white24,
        items: const [
          BottomNavigationBarItem(icon: Icon(LucideIcons.layoutDashboard), label: 'Inicio'),
          BottomNavigationBarItem(icon: Icon(LucideIcons.creditCard), label: 'Créditos'),
          BottomNavigationBarItem(icon: Icon(LucideIcons.target), label: 'Metas'),
          BottomNavigationBarItem(icon: Icon(LucideIcons.user), label: 'Perfil'),
        ],
      ),
    );
  }
}
