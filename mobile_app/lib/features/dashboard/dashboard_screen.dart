import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:cuentacontable_mobile/core/config/supabase_config.dart';
import 'package:cuentacontable_mobile/core/theme/app_theme.dart';
import 'package:cuentacontable_mobile/core/config/notification_service.dart';
import 'package:cuentacontable_mobile/shared/widgets/transaction_modal.dart';
import 'package:lucide_icons/lucide_icons.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  bool _isBalanceHidden = false;

  @override
  void initState() {
    super.initState();
    _syncNotifications();
  }

  Future<void> _syncNotifications() async {
    try {
      // Esperar a que la sesión esté lista
      await Future.delayed(const Duration(milliseconds: 600));
      
      if (Supabase.instance.client.auth.currentUser == null) return;
      
      await NotificationService.cancelAll();
      
      final userId = Supabase.instance.client.auth.currentUser!.id;
      final goals = await Supabase.instance.client
          .from('savings_goals')
          .select()
          .eq('user_id', userId)
          .eq('status', 'pendiente');

      for (var goal in goals) {
        if (goal['deadline'] != null && goal['target_time'] != null) {
          final dateStr = '${goal['deadline']} ${goal['target_time']}';
          final scheduledDate = DateTime.parse(dateStr);
          
          if (scheduledDate.isAfter(DateTime.now())) {
            await NotificationService.scheduleNotification(
              id: goal['id'].hashCode,
              title: '🎯 Meta de Hoy',
              body: 'Es hora de: ${goal['name']}',
              scheduledDate: scheduledDate,
            );
          }
        }
      }
    } catch (e) {
      debugPrint('Info: Sincronización de notificaciones diferida ($e)');
    }
  }

  Stream<double> _balanceStream() {
    final userId = SupabaseConfig.client.auth.currentUser!.id;
    return SupabaseConfig.client
        .from('transactions')
        .stream(primaryKey: ['id'])
        .eq('user_id', userId)
        .map((data) {
          double income = 0;
          double expense = 0;
          for (var item in data) {
            if (item['type'] == 'income') {
              income += double.parse(item['amount'].toString());
            } else {
              expense += double.parse(item['amount'].toString());
            }
          }
          return income - expense;
        });
  }

  void _showTransactionModal(String type) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => TransactionModal(type: type),
    );
  }

  Future<void> _signOut() async {
    await Supabase.instance.client.auth.signOut();
    if (mounted) {
      Navigator.pushReplacementNamed(context, '/login');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('CUENTACONTABLE'),
        actions: [
          IconButton(
            onPressed: () => setState(() => _isBalanceHidden = !_isBalanceHidden),
            icon: Icon(_isBalanceHidden ? LucideIcons.eyeOff : LucideIcons.eye, size: 20),
          ),
          IconButton(onPressed: () {}, icon: const Icon(LucideIcons.bell, size: 20)),
          IconButton(
            onPressed: _signOut,
            icon: const Icon(LucideIcons.logOut, size: 20, color: Colors.redAccent),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildBalanceCard(),
            const SizedBox(height: 32),
            _buildActionCards(),
            const SizedBox(height: 32),
            const Text('Actividad Reciente', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            _buildRecentActivity(),
          ],
        ),
      ),
    );
  }

  Widget _buildBalanceCard() {
    return ClipRRect(
      borderRadius: BorderRadius.circular(32),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(32),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                AppTheme.indigoAccent.withAlpha(38),
                Colors.white.withAlpha(13),
              ],
            ),
            borderRadius: BorderRadius.circular(32),
            border: Border.all(color: Colors.white.withAlpha(25)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Saldo Disponible', style: TextStyle(color: Colors.white54, fontWeight: FontWeight.bold)),
                  Icon(LucideIcons.wallet, color: AppTheme.indigoAccent.withAlpha(127)),
                ],
              ),
              const SizedBox(height: 16),
              StreamBuilder<double>(
                stream: _balanceStream(),
                builder: (context, snapshot) {
                  final balance = snapshot.data ?? 0.0;
                  return AnimatedOpacity(
                    duration: const Duration(milliseconds: 300),
                    opacity: 1.0,
                    child: ImageFiltered(
                      imageFilter: ImageFilter.blur(
                        sigmaX: _isBalanceHidden ? 8 : 0,
                        sigmaY: _isBalanceHidden ? 8 : 0,
                      ),
                      child: Text(
                        'S/ ${balance.toLocaleString()}',
                        style: const TextStyle(fontSize: 40, fontWeight: FontWeight.w900, color: Colors.white),
                      ),
                    ),
                  );
                },
              ),
              const SizedBox(height: 8),
              const Text('Actualizado ahora mismo', style: TextStyle(color: Colors.greenAccent, fontSize: 10, fontWeight: FontWeight.bold)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRecentActivity() {
    return StreamBuilder<List<Map<String, dynamic>>>(
      stream: SupabaseConfig.client
          .from('transactions')
          .stream(primaryKey: ['id'])
          .eq('user_id', SupabaseConfig.client.auth.currentUser!.id)
          .order('created_at', ascending: false)
          .limit(10),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        final txs = snapshot.data ?? [];
        if (txs.isEmpty) {
          return const Text('No hay actividad aún', style: TextStyle(color: Colors.white24));
        }
        return ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: txs.length,
          itemBuilder: (context, index) {
            final tx = txs[index];
            bool isIncome = tx['type'] == 'income';
            return Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.slateCard.withAlpha(127),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.white.withAlpha(13)),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: (isIncome ? Colors.green : Colors.red).withAlpha(25),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(isIncome ? LucideIcons.arrowUpRight : LucideIcons.arrowDownRight, 
                      color: isIncome ? Colors.greenAccent : Colors.redAccent, size: 20),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(tx['category'] ?? 'General', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                        Text(tx['description'] ?? '', style: const TextStyle(color: Colors.white24, fontSize: 12)),
                      ],
                    ),
                  ),
                  Text(
                    '${isIncome ? '+' : '-'} S/ ${double.parse(tx['amount'].toString()).toLocaleString()}',
                    style: TextStyle(
                      color: isIncome ? Colors.greenAccent : Colors.redAccent,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildActionCards() {
    return Row(
      children: [
        Expanded(
          child: _actionCard('Ingresos', LucideIcons.trendingUp, Colors.greenAccent, () => _showTransactionModal('income')),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _actionCard('Gastos', LucideIcons.trendingDown, Colors.redAccent, () => _showTransactionModal('expense')),
        ),
      ],
    );
  }

  Widget _actionCard(String label, IconData icon, Color color, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(24),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: AppTheme.slateCard,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: Colors.white10),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: color),
            const SizedBox(height: 12),
            Text(label, style: const TextStyle(fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }
}

extension DoubleExt on double {
  String toLocaleString() => toStringAsFixed(2).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},');
}
