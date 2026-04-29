import 'package:flutter/material.dart';
import 'package:cuentacontable_mobile/core/config/supabase_config.dart';
import 'package:cuentacontable_mobile/core/theme/app_theme.dart';
import 'package:lucide_icons/lucide_icons.dart';

class CreditModal extends StatefulWidget {
  const CreditModal({super.key});

  @override
  State<CreditModal> createState() => _CreditModalState();
}

class _CreditModalState extends State<CreditModal> {
  final _bankController = TextEditingController();
  final _capitalController = TextEditingController(); // Capital solicitado
  final _teaController = TextEditingController();     // Tasa TEA
  final _totalInstallmentsController = TextEditingController();
  final _paidInstallmentsController = TextEditingController();
  final _nextDueController = TextEditingController();
  bool _isLoading = false;

  Future<void> _save() async {
    if (_bankController.text.isEmpty || _capitalController.text.isEmpty || _teaController.text.isEmpty || _totalInstallmentsController.text.isEmpty) return;
    
    setState(() => _isLoading = true);
    try {
      final userId = SupabaseConfig.client.auth.currentUser!.id;
      final capital = double.parse(_capitalController.text);
      final tea = double.parse(_teaController.text);
      final instTotal = int.parse(_totalInstallmentsController.text);
      final instPaid = int.parse(_paidInstallmentsController.text.isEmpty ? '0' : _paidInstallmentsController.text);
      
      // 📐 LÓGICA AUTOMÁTICA BASADA EN TEA:
      // 1. Deuda Total = Capital * (1 + TEA/100)
      final totalToReturn = capital * (1 + (tea / 100));
      
      // 2. Cuota = Deuda Total / Cantidad de Letras
      final mPayment = totalToReturn / instTotal;
      
      // 3. Saldo Pendiente = Cuota * (Letras Pendientes)
      final remaining = mPayment * (instTotal - instPaid);
      
      await SupabaseConfig.client.from('credits').insert({
        'user_id': userId,
        'bank_name': _bankController.text,
        'total_amount': totalToReturn,
        'remaining_balance': remaining,
        'monthly_payment': mPayment,
        'installments_total': instTotal, // Nuevo (Web)
        'installments': instTotal,       // Antiguo (Móvil)
        'installments_paid': instPaid,   // Nuevo (Web)
        'paid_installments': instPaid,   // Antiguo (Móvil)
        'due_date': _nextDueController.text,
        'interest_rate': tea,
        'status': instPaid >= instTotal ? 'completado' : 'activo',
        'created_at': DateTime.now().toIso8601String(),
      });
      if (mounted) Navigator.pop(context);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom, left: 24, right: 24, top: 32),
      decoration: const BoxDecoration(
        color: AppTheme.midnightBlue,
        borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
      ),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Nuevo Crédito', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white)),
            const SizedBox(height: 24),
            _input('Nombre del Banco', _bankController, LucideIcons.building, TextInputType.text),
            const SizedBox(height: 16),
            _input('Capital Solicitado (S/)', _capitalController, LucideIcons.dollarSign, TextInputType.number),
            const SizedBox(height: 16),
            _input('Tasa Anual (%) TEA', _teaController, LucideIcons.percent, TextInputType.number),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(child: _input('Letras Totales', _totalInstallmentsController, LucideIcons.list, TextInputType.number)),
                const SizedBox(width: 16),
                Expanded(child: _input('Letras Pagadas', _paidInstallmentsController, LucideIcons.checkCircle, TextInputType.number)),
              ],
            ),
            const SizedBox(height: 16),
            _input('Próximo Vencimiento (YYYY-MM-DD)', _nextDueController, LucideIcons.calendar, TextInputType.datetime),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              height: 60,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _save,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.indigoAccent,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                child: _isLoading ? const CircularProgressIndicator(color: Colors.white) : const Text('REGISTRAR CRÉDITO', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _input(String label, TextEditingController controller, IconData icon, TextInputType type) {
    return TextField(
      controller: controller,
      keyboardType: type,
      style: const TextStyle(color: Colors.white),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(color: Colors.white54, fontSize: 13),
        prefixIcon: Icon(icon, color: Colors.white24, size: 20),
        filled: true,
        fillColor: Colors.white.withOpacity(0.05),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
      ),
    );
  }
}
