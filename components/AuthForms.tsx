import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, X } from 'lucide-react-native';
import { useAuthActions } from '../hooks/useAuthActions';

type AuthMode = 'login' | 'register';

export function AuthForms() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    username: '',
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { loading, error, login, register, clearError } = useAuthActions();

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const handleSubmit = async () => {
    clearError();

    if (mode === 'login') {
      const result = await login({
        email: formData.email,
        password: formData.password,
      });

      if (result.error) {
        const errorMessage =
          (result.error as any)?.message || 'Error al iniciar sesión';
        if (errorMessage.includes('Email not confirmed')) {
          Alert.alert(
            'Email no confirmado',
            'Por favor, verifica tu email antes de iniciar sesión.',
            [{ text: 'OK', style: 'cancel' }],
          );
        } else {
          Alert.alert('Error', errorMessage);
        }
      }
    } else {
      // Validaciones de registro
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Las contraseñas no coinciden');
        return;
      }

      if (formData.password.length < 6) {
        Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
        return;
      }

      if (!formData.nombre.trim()) {
        Alert.alert('Error', 'El nombre es obligatorio');
        return;
      }

      if (!formData.username.trim()) {
        Alert.alert('Error', 'El username es obligatorio');
        return;
      }

      const result = await register({
        email: formData.email,
        password: formData.password,
        nombre: formData.nombre,
        username: formData.username,
      });

      if (result.data && !result.error) {
        // Si hay imagen seleccionada y el registro fue exitoso, subir la imagen
        if (selectedImage && result.data.user) {
          // Aquí podrías integrar la subida de imagen después del registro
          // Por ahora solo mostramos un mensaje
          Alert.alert(
            'Registro Exitoso',
            'Tu cuenta ha sido creada. Puedes actualizar tu foto de perfil más tarde.',
            [{ text: 'OK' }],
          );
        } else {
          Alert.alert(
            'Registro Exitoso',
            result.message ||
              'Por favor, verifica tu email antes de iniciar sesión.',
            [{ text: 'OK' }],
          );
        }

        setMode('login');
        resetForm();
      } else if (result.error) {
        const errorMessage =
          (result.error as any)?.message || 'Error al registrar';
        Alert.alert('Error', errorMessage);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      nombre: '',
      username: '',
    });
    setSelectedImage(null);
    clearError();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </Text>
          <Text style={styles.subtitle}>
            {mode === 'login'
              ? 'Bienvenido de vuelta a Bajux'
              : 'Únete a nuestra comunidad local'}
          </Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          {mode === 'register' && (
            <>
              {/* Selector de imagen de perfil */}
              <View style={styles.imageSection}>
                <Text style={styles.imageLabel}>Foto de perfil (opcional)</Text>
                <View style={styles.imageContainer}>
                  {selectedImage ? (
                    <View style={styles.selectedImageContainer}>
                      <Image
                        source={{ uri: selectedImage }}
                        style={styles.profileImage}
                      />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={removeImage}
                      >
                        <X size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.imagePlaceholder}
                      onPress={pickImage}
                    >
                      <Camera size={24} color="#8B4513" />
                      <Text style={styles.imagePlaceholderText}>
                        Agregar foto
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <TextInput
                placeholder="Nombre completo"
                value={formData.nombre}
                onChangeText={(text) =>
                  setFormData({ ...formData, nombre: text })
                }
                style={styles.input}
                autoCapitalize="words"
              />

              <TextInput
                placeholder="Username"
                value={formData.username}
                onChangeText={(text) =>
                  setFormData({ ...formData, username: text })
                }
                style={styles.input}
                autoCapitalize="none"
              />
            </>
          )}

          <TextInput
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <TextInput
            placeholder="Contraseña"
            value={formData.password}
            onChangeText={(text) =>
              setFormData({ ...formData, password: text })
            }
            style={styles.input}
            secureTextEntry
            autoComplete="password"
          />

          {mode === 'register' && (
            <TextInput
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChangeText={(text) =>
                setFormData({ ...formData, confirmPassword: text })
              }
              style={styles.input}
              secureTextEntry
              autoComplete="password"
            />
          )}

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
            ]}
          >
            <Text style={styles.submitButtonText}>
              {loading
                ? mode === 'login'
                  ? 'Iniciando sesión...'
                  : 'Creando cuenta...'
                : mode === 'login'
                  ? 'Iniciar Sesión'
                  : 'Registrarse'}
            </Text>
          </TouchableOpacity>

          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>
              {mode === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
            </Text>
            <TouchableOpacity
              onPress={() => {
                const newMode = mode === 'login' ? 'register' : 'login';
                setMode(newMode);
                resetForm();
              }}
            >
              <Text style={styles.switchLink}>
                {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFEFE',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#B8860B',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#FFE0E0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
  },
  form: {
    width: '100%',
  },
  imageSection: {
    marginBottom: 20,
  },
  imageLabel: {
    fontSize: 16,
    color: '#8B4513',
    marginBottom: 12,
    fontWeight: '500',
  },
  imageContainer: {
    alignItems: 'center',
  },
  selectedImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5F5F5',
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF6B6B',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#D2B48C',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 12,
    color: '#8B4513',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D2B48C',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#8B4513',
  },
  submitButton: {
    backgroundColor: '#8B4513',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#C4A484',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchText: {
    color: '#B8860B',
    fontSize: 14,
  },
  switchLink: {
    color: '#8B4513',
    fontSize: 14,
    fontWeight: '600',
  },
});
