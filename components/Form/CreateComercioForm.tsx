import React, { useState, useEffect } from 'react';
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
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, X, MapPin, FileText, Store } from 'lucide-react-native';
import { useAuth } from '../../providers/AuthProvider';
import { comercioService } from '../../lib/comercio';
import { storageService } from '../../lib/storage';
import { CategoriaComercio } from '../../types';

interface CreateComercioFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateComercioForm({
  onSuccess,
  onCancel,
}: CreateComercioFormProps) {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState<CategoriaComercio[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    ubicacion: '',
    rfc: '',
    categoriaId: '',
  });

  const [horario, setHorario] = useState({
    lunes: { abierto: true, inicio: '09:00', fin: '18:00' },
    martes: { abierto: true, inicio: '09:00', fin: '18:00' },
    miercoles: { abierto: true, inicio: '09:00', fin: '18:00' },
    jueves: { abierto: true, inicio: '09:00', fin: '18:00' },
    viernes: { abierto: true, inicio: '09:00', fin: '18:00' },
    sabado: { abierto: false, inicio: '09:00', fin: '14:00' },
    domingo: { abierto: false, inicio: '09:00', fin: '14:00' },
  });

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      const categoriasData = await comercioService.getCategoriasComercio();
      setCategorias(categoriasData);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const handleSubmit = async () => {
    if (!session) return;

    // Validaciones
    if (!formData.nombre.trim()) {
      Alert.alert('Error', 'El nombre del comercio es obligatorio');
      return;
    }

    if (!formData.ubicacion.trim()) {
      Alert.alert('Error', 'La ubicación es obligatoria');
      return;
    }

    if (!formData.categoriaId) {
      Alert.alert('Error', 'Selecciona una categoría');
      return;
    }

    setLoading(true);

    try {
      let imagenUrl = null;

      // Subir imagen si se seleccionó una
      if (selectedImage && session.user) {
        imagenUrl = await storageService.uploadComercioImage(
          session.user.id,
          selectedImage,
        );
      }

      // Crear el comercio
      const comercio = await comercioService.createComercio(session, {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        ubicacion: formData.ubicacion,
        rfc: formData.rfc || null,
        imagen_url: imagenUrl,
        horario: horario,
      });

      // Asignar categoría
      await comercioService.asignarCategoriaComercio(
        comercio.id,
        parseInt(formData.categoriaId),
      );

      Alert.alert('Éxito', 'Comercio creado correctamente');
      onSuccess();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo crear el comercio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Store size={32} color="#8B4513" />
          <Text style={styles.title}>Crear Comercio</Text>
          <Text style={styles.subtitle}>Registra tu negocio en Bajux</Text>
        </View>

        <View style={styles.form}>
          {/* Imagen del comercio */}
          <View style={styles.imageSection}>
            <Text style={styles.sectionLabel}>
              Imagen del comercio (opcional)
            </Text>
            <View style={styles.imageContainer}>
              {selectedImage ? (
                <View style={styles.selectedImageContainer}>
                  <Image
                    source={{ uri: selectedImage }}
                    style={styles.comercioImage}
                  />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => setSelectedImage(null)}
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
                    Agregar imagen
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Información básica */}
          <Text style={styles.sectionLabel}>Información básica</Text>

          <TextInput
            placeholder="Nombre del comercio *"
            value={formData.nombre}
            onChangeText={(text) => setFormData({ ...formData, nombre: text })}
            style={styles.input}
          />

          <TextInput
            placeholder="Descripción"
            value={formData.descripcion}
            onChangeText={(text) =>
              setFormData({ ...formData, descripcion: text })
            }
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={3}
          />

          <View style={styles.inputWithIcon}>
            <MapPin size={20} color="#B8860B" />
            <TextInput
              placeholder="Ubicación *"
              value={formData.ubicacion}
              onChangeText={(text) =>
                setFormData({ ...formData, ubicacion: text })
              }
              style={[styles.input, styles.inputWithIconField]}
            />
          </View>

          <View style={styles.inputWithIcon}>
            <FileText size={20} color="#B8860B" />
            <TextInput
              placeholder="RFC (opcional)"
              value={formData.rfc}
              onChangeText={(text) => setFormData({ ...formData, rfc: text })}
              style={[styles.input, styles.inputWithIconField]}
            />
          </View>

          {/* Categoría */}
          <Text style={styles.sectionLabel}>Categoría *</Text>
          <View style={styles.categoryContainer}>
            {categorias.map((categoria) => (
              <TouchableOpacity
                key={categoria.id}
                style={[
                  styles.categoryButton,
                  formData.categoriaId === categoria.id.toString() &&
                    styles.categoryButtonSelected,
                ]}
                onPress={() =>
                  setFormData({
                    ...formData,
                    categoriaId: categoria.id.toString(),
                  })
                }
              >
                <Text
                  style={[
                    styles.categoryText,
                    formData.categoriaId === categoria.id.toString() &&
                      styles.categoryTextSelected,
                  ]}
                >
                  {categoria.nombre}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Botones */}
          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.submitButton,
                loading && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Creando...' : 'Crear Comercio'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFEFE',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#D2B48C',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
    marginTop: 12,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#B8860B',
    textAlign: 'center',
  },
  form: {
    padding: 20,
  },
  imageSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 12,
  },
  imageContainer: {
    alignItems: 'center',
  },
  selectedImageContainer: {
    position: 'relative',
  },
  comercioImage: {
    width: 200,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF6B6B',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 200,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#D2B48C',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 14,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D2B48C',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  inputWithIconField: {
    flex: 1,
    borderWidth: 0,
    marginBottom: 0,
    marginLeft: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#D2B48C',
  },
  categoryButtonSelected: {
    backgroundColor: '#8B4513',
    borderColor: '#8B4513',
  },
  categoryText: {
    fontSize: 14,
    color: '#8B4513',
  },
  categoryTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#D2B48C',
  },
  submitButton: {
    backgroundColor: '#8B4513',
  },
  submitButtonDisabled: {
    backgroundColor: '#C4A484',
  },
  cancelButtonText: {
    color: '#8B4513',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
