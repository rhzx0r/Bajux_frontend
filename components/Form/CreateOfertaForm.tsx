import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  Modal,
  Switch,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, X, Tag, DollarSign, Package } from 'lucide-react-native';
import { comercioService } from '../../lib/comercio';
import { storageService } from '../../lib/storage';
import { TipoOferta } from '../../types';

interface CreateOfertaFormProps {
  comercioId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateOfertaForm({
  comercioId,
  onSuccess,
  onCancel,
}: CreateOfertaFormProps) {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    tipo: 'producto' as TipoOferta,
    disponible: true,
  });

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
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
    // Validaciones
    if (!formData.nombre.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }

    if (!formData.precio || isNaN(parseFloat(formData.precio))) {
      Alert.alert('Error', 'El precio debe ser un número válido');
      return;
    }

    if (formData.tipo === 'producto' && (!formData.stock || isNaN(parseInt(formData.stock)))) {
      Alert.alert('Error', 'El stock debe ser un número entero válido');
      return;
    }

    setLoading(true);

    try {
      let imagenUrl = null;

      if (selectedImage) {
        imagenUrl = await storageService.uploadOfertaImage(
          comercioId,
          selectedImage,
        );
      }

      await comercioService.createOferta({
        comercio_id: comercioId,
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        stock: formData.tipo === 'producto' ? parseInt(formData.stock) : null,
        tipo: formData.tipo,
        disponible: formData.disponible,
        imagen_url: imagenUrl,
      });

      Alert.alert('Éxito', `${formData.tipo === 'producto' ? 'Producto' : 'Servicio'} creado correctamente`);
      onSuccess();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo crear la oferta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>
              Agregar {formData.tipo === 'producto' ? 'Producto' : 'Servicio'}
            </Text>
            <TouchableOpacity onPress={onCancel}>
              <X size={24} color="#8B4513" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            {/* Tipo Selector */}
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  formData.tipo === 'producto' && styles.typeButtonSelected,
                ]}
                onPress={() => setFormData({ ...formData, tipo: 'producto' })}
              >
                <Text
                  style={[
                    styles.typeText,
                    formData.tipo === 'producto' && styles.typeTextSelected,
                  ]}
                >
                  Producto
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  formData.tipo === 'servicio' && styles.typeButtonSelected,
                ]}
                onPress={() => setFormData({ ...formData, tipo: 'servicio' })}
              >
                <Text
                  style={[
                    styles.typeText,
                    formData.tipo === 'servicio' && styles.typeTextSelected,
                  ]}
                >
                  Servicio
                </Text>
              </TouchableOpacity>
            </View>

            {/* Image Upload */}
            <View style={styles.imageSection}>
              <View style={styles.imageContainer}>
                {selectedImage ? (
                  <View style={styles.selectedImageContainer}>
                    <Image
                      source={{ uri: selectedImage }}
                      style={styles.ofertaImage}
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
                      Imagen (opcional)
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Form Fields */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nombre *</Text>
              <View style={styles.inputContainer}>
                <Tag size={20} color="#B8860B" />
                <TextInput
                  placeholder="Nombre..."
                  value={formData.nombre}
                  onChangeText={(text) =>
                    setFormData({ ...formData, nombre: text })
                  }
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                placeholder="Detalles..."
                value={formData.descripcion}
                onChangeText={(text) =>
                  setFormData({ ...formData, descripcion: text })
                }
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Precio *</Text>
                <View style={styles.inputContainer}>
                  <DollarSign size={20} color="#B8860B" />
                  <TextInput
                    placeholder="0.00"
                    value={formData.precio}
                    onChangeText={(text) =>
                      setFormData({ ...formData, precio: text })
                    }
                    keyboardType="numeric"
                    style={styles.input}
                  />
                </View>
              </View>

              {formData.tipo === 'producto' && (
                <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>Stock *</Text>
                  <View style={styles.inputContainer}>
                    <Package size={20} color="#B8860B" />
                    <TextInput
                      placeholder="0"
                      value={formData.stock}
                      onChangeText={(text) =>
                        setFormData({ ...formData, stock: text })
                      }
                      keyboardType="numeric"
                      style={styles.input}
                    />
                  </View>
                </View>
              )}
            </View>

             <View style={styles.switchContainer}>
              <Text style={styles.label}>Disponible</Text>
              <Switch
                value={formData.disponible}
                onValueChange={(val) => setFormData({ ...formData, disponible: val })}
                trackColor={{ false: "#767577", true: "#8B4513" }}
                thumbColor={formData.disponible ? "#D2B48C" : "#f4f3f4"}
              />
            </View>

            {/* Buttons */}
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
                  {loading ? 'Guardando...' : 'Guardar'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FEFEFE',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  scrollView: {
    padding: 20,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  typeButtonSelected: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  typeText: {
    color: '#666',
    fontWeight: '600',
  },
  typeTextSelected: {
    color: '#8B4513',
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
  },
  selectedImageContainer: {
    position: 'relative',
  },
  ofertaImage: {
    width: 120,
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
    width: 120,
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
    fontSize: 12,
    color: '#8B4513',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#8B4513',
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D2B48C',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    color: '#333',
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#D2B48C',
    borderRadius: 8,
    padding: 12,
  },
  row: {
    flexDirection: 'row',
  },
  switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
    marginBottom: 20,
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
