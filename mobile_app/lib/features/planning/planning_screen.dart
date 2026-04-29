import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:cuentacontable_mobile/core/theme/app_theme.dart';
import 'package:lucide_icons/lucide_icons.dart';

class PlanningScreen extends StatefulWidget {
  const PlanningScreen({super.key});

  @override
  State<PlanningScreen> createState() => _PlanningScreenState();
}

class _PlanningScreenState extends State<PlanningScreen> {
  double _monthlyIncome = 5000;
  double _monthlyExpenses = 3000;

  List<FlSpot> _generateProjection() {
    List<FlSpot> spots = [];
    double balance = 0;
    for (int i = 0; i < 6; i++) {
      balance += (_monthlyIncome - _monthlyExpenses);
      spots.add(FlSpot(i.toDouble(), balance));
    }
    return spots;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Simulador "What If"')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Proyección a 6 meses', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 24),
            _buildChart(),
            const SizedBox(height: 40),
            _buildSlider('Ingreso Mensual Estimado', _monthlyIncome, 0, 15000, (val) {
              setState(() => _monthlyIncome = val);
            }),
            const SizedBox(height: 24),
            _buildSlider('Gasto Mensual Estimado', _monthlyExpenses, 0, 10000, (val) {
              setState(() => _monthlyExpenses = val);
            }),
            const SizedBox(height: 40),
            _buildSummaryCard(),
          ],
        ),
      ),
    );
  }

  Widget _buildChart() {
    return Container(
      height: 250,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.slateCard,
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: Colors.white10),
      ),
      child: LineChart(
        LineChartData(
          gridData: const FlGridData(show: false),
          titlesData: const FlTitlesData(show: false),
          borderData: FlBorderData(show: false),
          lineBarsData: [
            LineChartBarData(
              spots: _generateProjection(),
              isCurved: true,
              color: AppTheme.indigoAccent,
              barWidth: 4,
              isStrokeCapRound: true,
              dotData: const FlDotData(show: false),
              belowBarData: BarAreaData(
                show: true,
                color: AppTheme.indigoAccent.withOpacity(0.1),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSlider(String label, double value, double min, double max, Function(double) onChanged) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(label, style: const TextStyle(color: Colors.white70, fontSize: 14)),
            Text('S/ ${value.toInt()}', style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.indigoAccent)),
          ],
        ),
        Slider(
          value: value,
          min: min,
          max: max,
          activeColor: AppTheme.indigoAccent,
          inactiveColor: Colors.white10,
          onChanged: onChanged,
        ),
      ],
    );
  }

  Widget _buildSummaryCard() {
    double net = _monthlyIncome - _monthlyExpenses;
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [AppTheme.indigoAccent.withOpacity(0.1), Colors.white.withOpacity(0.05)],
        ),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppTheme.indigoAccent.withOpacity(0.2)),
      ),
      child: Row(
        children: [
          Icon(LucideIcons.trendingUp, color: net >= 0 ? Colors.greenAccent : Colors.redAccent),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Flujo Mensual Neto', style: TextStyle(color: Colors.white54, fontSize: 12)),
                Text('S/ ${net.toInt()}', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              ],
            ),
          ),
          Text(net >= 0 ? 'Positivo' : 'Déficit', 
            style: TextStyle(color: net >= 0 ? Colors.greenAccent : Colors.redAccent, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
