import 'package:flutter/material.dart';
import 'package:cuentacontable_mobile/core/config/supabase_config.dart';
import 'package:cuentacontable_mobile/core/theme/app_theme.dart';
import 'package:lucide_icons/lucide_icons.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  Stream<double> _balanceStream() {
    return SupabaseConfig.client
        .from('transactions')
        .stream(primaryKey: ['id'])
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
            // Aquí iría una lista de transacciones real-time
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
