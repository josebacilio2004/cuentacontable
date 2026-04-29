import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:cuentacontable_mobile/core/config/supabase_config.dart';
import 'package:cuentacontable_mobile/core/theme/app_theme.dart';
import 'package:cuentacontable_mobile/features/auth/login_screen.dart';
import 'package:cuentacontable_mobile/features/dashboard/dashboard_screen.dart';
import 'package:cuentacontable_mobile/features/credits/credits_screen.dart';
import 'package:cuentacontable_mobile/features/goals/goals_screen.dart';
import 'package:cuentacontable_mobile/features/planning/planning_screen.dart';
import 'package:lucide_icons/lucide_icons.dart';

import 'package:cuentacontable_mobile/core/config/notification_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await SupabaseConfig.initialize();
  await NotificationService.initialize();
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
      initialRoute: '/',
      routes: {
        '/': (context) => const AuthGate(),
        '/login': (context) => const LoginScreen(),
        '/dashboard': (context) => const DashboardWrapper(),
      },
    );
  }
}

class AuthGate extends StatelessWidget {
  const AuthGate({super.key});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<AuthState>(
      stream: SupabaseConfig.client.auth.onAuthStateChange,
      builder: (context, snapshot) {
        final session = SupabaseConfig.client.auth.currentSession;
        if (session != null) {
          return const DashboardWrapper();
        }
        return const LoginScreen();
      },
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
          GoalsScreen(),
          PlanningScreen(),
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
          BottomNavigationBarItem(icon: Icon(LucideIcons.trendingUp), label: 'Planificación'),
        ],
      ),
    );
  }
}
