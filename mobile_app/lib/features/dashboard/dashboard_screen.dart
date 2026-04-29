import 'package:flutter/material.dart';
import 'package:cuentacontable_mobile/core/config/supabase_config.dart';
import 'package:cuentacontable_mobile/core/theme/app_theme.dart';
import 'package:lucide_icons/lucide_icons.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('CUENTACONTABLE'),
        actions: [
          IconButton(onPressed: () {}, icon: const Icon(LucideIcons.bell)),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Saldo Disponible', style: TextStyle(color: Colors.white54, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            StreamBuilder<double>(
              stream: _balanceStream(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Text('S/ ---', style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold));
                }
                return Text(
                  'S/ ${snapshot.data?.toLocaleString() ?? '0.00'}',
                  style: const TextStyle(fontSize: 40, fontWeight: FontWeight.bold, color: Colors.white),
                );
              },
            ),
            const SizedBox(height: 32),
            _buildActionCards(),
            const SizedBox(height: 32),
            const Text('Actividad Reciente', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            StreamBuilder<List<Map<String, dynamic>>>(
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
                    return ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: (isIncome ? Colors.green : Colors.red).withOpacity(0.1),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Icon(isIncome ? LucideIcons.arrowUpRight : LucideIcons.arrowDownRight, 
                          color: isIncome ? Colors.greenAccent : Colors.redAccent, size: 20),
                      ),
                      title: Text(tx['category'] ?? 'General', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                      subtitle: Text(tx['description'] ?? '', style: const TextStyle(color: Colors.white24, fontSize: 12)),
                      trailing: Text(
                        '${isIncome ? '+' : '-'} S/ ${double.parse(tx['amount'].toString()).toLocaleString()}',
                        style: TextStyle(
                          color: isIncome ? Colors.greenAccent : Colors.redAccent,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionCards() {
    return Row(
      children: [
        Expanded(
          child: _actionCard('Ingresos', LucideIcons.trendingUp, Colors.greenAccent),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _actionCard('Gastos', LucideIcons.trendingDown, Colors.redAccent),
        ),
      ],
    );
  }

  Widget _actionCard(String label, IconData icon, Color color) {
    return Container(
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
    );
  }
}

extension DoubleExt on double {
  String toLocaleString() => toStringAsFixed(2).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},');
}
