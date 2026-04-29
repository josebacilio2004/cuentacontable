import 'package:local_auth/local_auth.dart';
import 'package:logger/logger.dart';

class BiometricService {
  static final LocalAuthentication _auth = LocalAuthentication();
  static final Logger _logger = Logger();

  static Future<bool> isAvailable() async {
    try {
      final bool canAuthenticateWithBiometrics = await _auth.canCheckBiometrics;
      final bool canAuthenticate = canAuthenticateWithBiometrics || await _auth.isDeviceSupported();
      return canAuthenticate;
    } catch (e) {
      _logger.e('Error comprobando biometría: $e');
      return false;
    }
  }

  static Future<bool> authenticate() async {
    try {
      // Simplificado para compatibilidad máxima entre versiones 2.x y 3.x
      return await _auth.authenticate(
        localizedReason: 'Inicia sesión de forma segura en CuentaContable',
      );
    } catch (e) {
      _logger.e('Error autenticando biometría: $e');
      return false;
    }
  }
}
