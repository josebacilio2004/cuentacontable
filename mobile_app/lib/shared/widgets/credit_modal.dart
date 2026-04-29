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
  final _amountController = TextEditingController();
  final _rateController = TextEditingController();
  final _installmentsController = TextEditingController();
  bool _isLoading = false;

  Future<void> _save() async {
    if (_amountController.text.isEmpty) return;
    setState(() => _isLoading = true);
    try {
      final userId = SupabaseConfig.client.auth.currentUser!.id;
      final amount = double.parse(_amountController.text);
      await SupabaseConfig.client.from('credits').insert({
        'user_id': userId,
        'bank_name': _bankController.text,
        'total_amount': amount,
        'remaining_balance': amount,
        'interest_rate': double.parse(_rateController.text),
        'installments': int.parse(_installmentsController.text),
        'status': 'activo',
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
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Nuevo Crédito', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
          const SizedBox(height: 24),
          _input('Nombre del Banco', _bankController, LucideIcons.building, TextInputType.text),
          const SizedBox(height: 16),
          _input('Monto Total (S/)', _amountController, LucideIcons.dollarSign, TextInputType.number),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(child: _input('Tasa (%)', _rateController, LucideIcons.percent, TextInputType.number)),
              const SizedBox(width: 16),
              Expanded(child: _input('Cuotas', _installmentsController, LucideIcons.list, TextInputType.number)),
            ],
          ),
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
    );
  }

  Widget _input(String label, TextEditingController controller, IconData icon, TextInputType type) {
    return TextField(
      controller: controller,
      keyboardType: type,
      style: const TextStyle(color: Colors.white),
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon, color: Colors.white24),
        filled: true,
        fillColor: Colors.white.withOpacity(0.05),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
      ),
    );
  }
}
