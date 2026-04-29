import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:cuentacontable_mobile/core/config/supabase_config.dart';
import 'package:cuentacontable_mobile/core/theme/app_theme.dart';
import 'package:cuentacontable_mobile/shared/widgets/goal_modal.dart';
import 'package:lucide_icons/lucide_icons.dart';

class GoalsScreen extends StatelessWidget {
  const GoalsScreen({super.key});

  Stream<List<Map<String, dynamic>>> _goalsStream() {
    final userId = SupabaseConfig.client.auth.currentUser!.id;
    return SupabaseConfig.client
        .from('savings_goals')
        .stream(primaryKey: ['id'])
        .eq('user_id', userId)
        .order('created_at', ascending: false);
  }

  void _showGoalModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => const GoalModal(),
    );
  }

  Future<void> _completeGoal(BuildContext context, Map<String, dynamic> goal) async {
    final client = SupabaseConfig.client;
    final userId = client.auth.currentUser!.id;

    try {
      await client.from('savings_goals').update({
        'status': 'cumplido',
        'current_amount': goal['target_amount'],
      }).eq('id', goal['id']);

      HapticFeedback.heavyImpact();

      await client.from('transactions').insert({
        'user_id': userId,
        'amount': goal['target_amount'],
        'type': 'income',
        'category': 'Ahorro Cumplido',
        'description': 'Meta alcanzada: ${goal['name']}',
        'date': DateTime.now().toIso8601String().split('T')[0],
      });

      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('¡Meta cumplida y saldo actualizado!'), backgroundColor: Colors.greenAccent),
        );
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: Colors.redAccent),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Tus Metas')),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showGoalModal(context),
        backgroundColor: AppTheme.indigoAccent,
        child: const Icon(LucideIcons.plus, color: Colors.white),
      ),
      body: StreamBuilder<List<Map<String, dynamic>>>(
        stream: _goalsStream(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          final goals = snapshot.data ?? [];
          if (goals.isEmpty) {
            return const Center(child: Text('No hay metas activas', style: TextStyle(color: Colors.white54)));
          }
          return ListView.builder(
            padding: const EdgeInsets.all(24),
            itemCount: goals.length,
            itemBuilder: (context, index) {
              final goal = goals[index];
              return _goalCard(context, goal);
            },
          );
        },
      ),
    );
  }

  Widget _goalCard(BuildContext context, Map<String, dynamic> goal) {
    bool isCompleted = goal['status'] == 'cumplido';
    double target = double.parse(goal['target_amount'].toString());
    double current = double.parse(goal['current_amount'].toString());
    double progress = isCompleted ? 1.0 : (current / target);

    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      decoration: BoxDecoration(
        color: isCompleted ? Colors.green.withAlpha(13) : AppTheme.slateCard,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: isCompleted ? Colors.green.withAlpha(51) : Colors.white10),
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: (isCompleted ? Colors.green : AppTheme.indigoAccent).withAlpha(25),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(isCompleted ? LucideIcons.star : LucideIcons.target, color: isCompleted ? Colors.greenAccent : AppTheme.indigoAccent, size: 20),
                    ),
                    if (isCompleted) 
                      const Text('COMPLETADA', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.greenAccent)),
                  ],
                ),
                const SizedBox(height: 16),
                Text(goal['name'], style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text('Hora: ${goal['target_time']?.toString().substring(0, 5) ?? '23:59'}', style: const TextStyle(color: Colors.white54, fontSize: 12)),
                const SizedBox(height: 20),
                LinearProgressIndicator(
                  value: progress,
                  backgroundColor: Colors.white10,
                  color: isCompleted ? Colors.green : AppTheme.indigoAccent,
                  borderRadius: BorderRadius.circular(10),
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('S/ ${current.toLocaleString()}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    Text('S/ ${target.toLocaleString()}', style: const TextStyle(fontSize: 12, color: Colors.indigoAccent)),
                  ],
                ),
              ],
            ),
          ),
          if (!isCompleted)
            InkWell(
              onTap: () => _completeGoal(context, goal),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: const BoxDecoration(
                  color: AppTheme.indigoAccent,
                  borderRadius: BorderRadius.only(bottomLeft: Radius.circular(24), bottomRight: Radius.circular(24)),
                ),
                child: const Center(
                  child: Text('CUMPLIR META', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 12)),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

extension DoubleExt on double {
  String toLocaleString() => toStringAsFixed(2).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},');
}
