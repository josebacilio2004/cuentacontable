class Transaction {
  final String id;
  final double amount;
  final String type;
  final String category;
  final String description;
  final DateTime date;

  Transaction({
    required this.id,
    required this.amount,
    required this.type,
    required this.category,
    required this.description,
    required this.date,
  });

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      id: json['id'],
      amount: double.parse(json['amount'].toString()),
      type: json['type'],
      category: json['category'],
      description: json['description'] ?? '',
      date: DateTime.parse(json['created_at']),
    );
  }
}
