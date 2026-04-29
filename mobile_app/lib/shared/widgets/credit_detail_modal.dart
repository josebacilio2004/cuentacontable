import 'package:flutter/material.dart';
import 'package:cuentacontable_mobile/core/config/supabase_config.dart';
import 'package:cuentacontable_mobile/core/theme/app_theme.dart';
import 'package:lucide_icons/lucide_icons.dart';

class CreditDetailModal extends StatefulWidget {
  final Map<String, dynamic> credit;
  const CreditDetailModal({super.key, required this.credit});

  @override
  State<CreditDetailModal> createState() => _CreditDetailModalState();
}

class _CreditDetailModalState extends State<CreditDetailModal> {
  bool _isLoading = false;

  Future<double> _getCurrentBalance() async {
    final userId = SupabaseConfig.client.auth.currentUser!.id;
    final response = await SupabaseConfig.client.from('transactions').select().eq('user_id', userId);
    double balance = 0;
    for (var tx in response) {
      if (tx['type'] == 'income') {
        balance += double.parse(tx['amount'].toString());
      } else {
        balance -= double.parse(tx['amount'].toString());
      }
    }
    return balance;
  }

  Future<void> _payInstallment() async {
    setState(() => _isLoading = true);
    try {
      final totalAmount = double.tryParse(widget.credit['total_amount']?.toString() ?? '0') ?? 0.0;
      
      // BÚSQUEDA MULTI-CANAL PARA SINCRONIZACIÓN TOTAL
      final totalInstallments = int.tryParse(
        (widget.credit['installments_total'] ?? widget.credit['installmentsTotal'] ?? widget.credit['installments'] ?? '24').toString()
      ) ?? 24;
      
      final paidSoFar = int.tryParse(
        (widget.credit['installments_paid'] ?? widget.credit['installmentsPaid'] ?? widget.credit['paid_installments'] ?? '0').toString()
      ) ?? 0;
      
      if (paidSoFar >= totalInstallments) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Este crédito ya está totalmente pagado.')));
        return;
      }

      final installmentValue = totalAmount / totalInstallments;
      final currentBalance = await _getCurrentBalance();

      // VALIDACIÓN DE SALDO
      if (currentBalance < installmentValue) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Saldo insuficiente (S/ ${currentBalance.toStringAsFixed(2)}). Necesitas S/ ${installmentValue.toStringAsFixed(2)} para esta cuota.'),
              backgroundColor: Colors.redAccent,
            ),
          );
        }
        return;
      }

      final userId = SupabaseConfig.client.auth.currentUser!.id;
      
      // 1. Registrar Gasto
      await SupabaseConfig.client.from('transactions').insert({
        'user_id': userId,
        'amount': installmentValue,
        'type': 'expense',
        'category': 'Pago de Crédito',
        'description': 'Cuota ${paidSoFar + 1} de ${widget.credit['bank_name']}',
        'date': DateTime.now().toIso8601String().split('T')[0],
      });

      // 2. Actualizar Crédito (ACTUALIZAMOS AMBAS PARA MANTENER SINCRONÍA)
      final newPaid = paidSoFar + 1;
      final currentRemaining = double.tryParse(widget.credit['remaining_balance']?.toString() ?? '0') ?? 0.0;
      final newRemaining = currentRemaining - installmentValue;
      
      await SupabaseConfig.client.from('credits').update({
        'installments_paid': newPaid,
        'paid_installments': newPaid, // Retrocompatibilidad
        'remaining_balance': newRemaining,
        'status': newPaid >= totalInstallments ? 'completado' : 'activo',
      }).eq('id', widget.credit['id']);

      if (mounted) Navigator.pop(context);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error al procesar pago: $e')));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final total = double.tryParse(widget.credit['total_amount']?.toString() ?? '0') ?? 0.0;
    final remaining = double.tryParse(widget.credit['remaining_balance']?.toString() ?? '0') ?? 0.0;
    
    // BÚSQUEDA MULTI-CANAL EN UI
    final totalInstallments = int.tryParse(
      (widget.credit['installments_total'] ?? widget.credit['installmentsTotal'] ?? widget.credit['installments'] ?? '24').toString()
    ) ?? 24;
    
    final paid = int.tryParse(
      (widget.credit['installments_paid'] ?? widget.credit['installmentsPaid'] ?? widget.credit['paid_installments'] ?? '0').toString()
    ) ?? 0;
    
    final installmentValue = totalInstallments > 0 ? total / totalInstallments : 0.0;

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: const BoxDecoration(
        color: AppTheme.midnightBlue,
        borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(widget.credit['bank_name'], style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
              const Icon(LucideIcons.creditCard, color: AppTheme.indigoAccent),
            ],
          ),
          const SizedBox(height: 24),
          _detailRow('Monto Total a Devolver', 'S/ ${total.toStringAsFixed(2)}'),
          _detailRow('Saldo Pendiente', 'S/ ${remaining.toStringAsFixed(2)}', isHighlight: true),
          _detailRow('Letras Totales', '$totalInstallments'),
          _detailRow('Letras Pagadas', '$paid'),
          _detailRow('Letras Pendientes', '${totalInstallments - paid}'),
          _detailRow('Valor de cada Cuota', 'S/ ${installmentValue.toStringAsFixed(2)}'),
          const SizedBox(height: 32),
          SizedBox(
            width: double.infinity,
            height: 60,
            child: ElevatedButton(
              onPressed: _isLoading || paid >= totalInstallments ? null : _payInstallment,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.indigoAccent,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              child: _isLoading 
                ? const CircularProgressIndicator(color: Colors.white) 
                : Text(paid >= totalInstallments ? 'CRÉDITO FINALIZADO' : 'ABONAR CUOTA ${paid + 1}', 
                    style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
            ),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _detailRow(String label, String value, {bool isHighlight = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.white54)),
          Text(value, style: TextStyle(
            fontWeight: FontWeight.bold, 
            color: isHighlight ? AppTheme.indigoAccent : Colors.white,
            fontSize: isHighlight ? 18 : 14,
          )),
        ],
      ),
    );
  }
}
