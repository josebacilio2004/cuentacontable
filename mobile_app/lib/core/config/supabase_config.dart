import 'package:supabase_flutter/supabase_flutter.dart';

class SupabaseConfig {
  static const String url = 'https://xcdisilwlvqpnkirydpu.supabase.co';
  static const String anonKey = 'sb_publishable_Bd2gstipNPXZNFm_yY4QXg_5eq5aCf7';

  static Future<void> initialize() async {
    await Supabase.initialize(
      url: url,
      anonKey: anonKey,
    );
  }

  static SupabaseClient get client => Supabase.instance.client;
}
