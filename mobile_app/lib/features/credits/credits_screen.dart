import 'package:flutter/material.dart';
import 'package:cuentacontable_mobile/core/config/supabase_config.dart';
import 'package:cuentacontable_mobile/core/theme/app_theme.dart';
import 'package:cuentacontable_mobile/shared/widgets/credit_detail_modal.dart';
import 'package:cuentacontable_mobile/shared/widgets/credit_modal.dart';
import 'package:lucide_icons/lucide_icons.dart';

class CreditsScreen extends StatelessWidget {
  const CreditsScreen({super.key});

  Stream<List<Map<String, dynamic>>> _creditsStream() {
    final userId = SupabaseConfig.client.auth.currentUser!.id;
    return SupabaseConfig.client
        .from('credits')
        .stream(primaryKey: ['id'])
        .eq('user_id', userId)
        .order('created_at', ascending: false);
  }

  void _showCreditModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => const CreditModal(),
    );
  }

  void _showDetailModal(BuildContext context, Map<String, dynamic> credit) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => CreditDetailModal(credit: credit),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Tus Créditos')),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showCreditModal(context),
        backgroundColor: AppTheme.indigoAccent,
        child: const Icon(LucideIcons.plus, color: Colors.white),
      ),
      body: StreamBuilder<List<Map<String, dynamic>>>(
        stream: _creditsStream(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          final credits = snapshot.data ?? [];
          if (credits.isEmpty) {
            return const Center(child: Text('No hay créditos registrados', style: TextStyle(color: Colors.white54)));
          }
          return ListView.builder(
            padding: const EdgeInsets.all(24),
            itemCount: credits.length,
            itemBuilder: (context, index) {
              final loan = credits[index];
              return InkWell(
                onTap: () => _showDetailModal(context, loan),
                child: _creditCard(loan),
              );
            },
          );
        },
      ),
    );
  }

  Widget _creditCard(Map<String, dynamic> loan) {
    // Blindaje contra nulos y errores de formato
    double total = double.tryParse(loan['total_amount']?.toString() ?? '0') ?? 0.0;
    double remaining = double.tryParse(loan['remaining_balance']?.toString() ?? '0') ?? 0.0;
    double progress = total > 0 ? (total - remaining) / total : 0;
    int totalInstallments = int.tryParse(loan['installments']?.toString() ?? '0') ?? 0;
    int paid = int.tryParse(loan['paid_installments']?.toString() ?? '0') ?? 0;
    String bank = loan['bank_name']?.toString() ?? 'Banco Desconocido';

    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(bank, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    Text('Letra $paid de $totalInstallments', style: const TextStyle(fontSize: 12, color: Colors.white54)),
                  ],
                ),
                const Icon(LucideIcons.zap, color: Colors.amberAccent, size: 20),
              ],
            ),
            const SizedBox(height: 16),
            LinearProgressIndicator(
              value: progress,
              backgroundColor: Colors.white10,
              color: AppTheme.indigoAccent,
              borderRadius: BorderRadius.circular(10),
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('S/ ${remaining.toLocaleString()} pendientes', style: const TextStyle(fontSize: 12, color: Colors.white54)),
                Text('${(progress * 100).toInt()}%', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.indigoAccent)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

extension DoubleExt on double {
  String toLocaleString() => toStringAsFixed(2).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},');
}
