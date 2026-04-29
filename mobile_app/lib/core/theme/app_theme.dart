import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static const Color midnightBlue = Color(0xFF050811);
  static const Color indigoAccent = Color(0xFF6366F1);
  static const Color slateCard = Color(0xFF0F172A);

  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    scaffoldBackgroundColor: midnightBlue,
    primaryColor: indigoAccent,
    cardTheme: CardThemeData(
      color: slateCard,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
        side: const BorderSide(color: Colors.white10, width: 1),
      ),
    ),
    textTheme: GoogleFonts.outfitTextTheme(
      const TextTheme(
        headlineLarge: TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
        titleLarge: TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
        bodyLarge: TextStyle(color: Colors.white70),
      ),
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.transparent,
      elevation: 0,
      centerTitle: true,
      titleTextStyle: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
    ),
  );
}
