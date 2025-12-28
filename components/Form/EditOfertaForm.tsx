import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  Switch,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, X, Tag, DollarSign, Package, Trash2, AlertTriangle } from 'lucide-react-native';
import { comercioService } from '../../lib/comercio';
import { storageService } from '../../lib/storage';
import { Oferta, TipoOferta } from '../../types';

// Tipado del alert personalizado
type CustomAlertButton = {
  text: string;
  style?: 'cancel' | 'destructive' | 'default';
  onPress: () => void;
};

interface CustomAlertConfig {
  visible: boolean;
  title: string;
  message: string;
  icon?: 'warning';
  buttons: CustomAlertButton[];
}

interface EditOfertaFormProps {
  oferta: Oferta;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EditOfertaForm({
  oferta,
  onSuccess,
  onCancel,
}: EditOfertaFormProps) {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [customAlert, setCustomAlert] = useState<CustomAlertConfig>({
    visible: false,
    title: '',
    message: '',
    buttons: [],
  });

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    tipo: 'producto' as TipoOferta,
    disponible: true,
  });

  useEffect(() => {
    if (oferta) {
      setFormData({
        nombre: oferta.nombre || '',
        descripcion: oferta.descripcion || '',
        precio: oferta.precio?.toString() || '',
        stock: oferta.stock?.toString() || '',
        tipo: oferta.tipo || 'producto',
        disponible: oferta.disponible ?? true,
      });
    }
  }, [oferta]);

  // === Alert personalizado helpers ===
  const showCustomAlert = (config: Omit<CustomAlertConfig, 'visible'>) => {
    setCustomAlert({ ...config, visible: true });
  };

  const hideCustomAlert = () => {
    setCustomAlert((prev) => ({ ...prev, visible: false }));
  };

  // === Handlers ===
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
      console.error('Error al seleccionar imagen:', error);
      showCustomAlert({
        title: 'Error',
        message: 'No se pudo seleccionar la imagen',
        buttons: [{ text: 'Entendido', onPress: hideCustomAlert }],
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.nombre.trim()) {
      showCustomAlert({
        title: 'Error',
        message: 'El nombre es obligatorio',
        buttons: [{ text: 'Entendido', onPress: hideCustomAlert }],
      });
      return;
    }

    if (!formData.precio || isNaN(parseFloat(formData.precio))) {
      showCustomAlert({
        title: 'Error',
        message: 'El precio debe ser un número válido',
        buttons: [{ text: 'Entendido', onPress: hideCustomAlert }],
      });
      return;
    }

    if (formData.tipo === 'producto' && (!formData.stock || isNaN(parseInt(formData.stock)))) {
      showCustomAlert({
        title: 'Error',
        message: 'El stock debe ser un número entero válido',
        buttons: [{ text: 'Entendido', onPress: hideCustomAlert }],
      });
      return;
    }

    setLoading(true);

    try {
      let imagenUrl = oferta.imagen_url;

      if (selectedImage && oferta.comercio_id) {
        imagenUrl = await storageService.uploadOfertaImage(
          oferta.comercio_id,
          selectedImage
        );
      }

      await comercioService.updateOferta(oferta.id, {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        stock: formData.tipo === 'producto' ? parseInt(formData.stock) : null,
        tipo: formData.tipo,
        disponible: formData.disponible,
        imagen_url: imagenUrl,
      });

      showCustomAlert({
        title: '✅ Éxito',
        message: `${formData.tipo === 'producto' ? 'Producto' : 'Servicio'} actualizado correctamente`,
        buttons: [
          {
            text: 'Aceptar',
            onPress: () => {
              hideCustomAlert();
              onSuccess();
            },
          },
        ],
      });
    } catch (error: any) {
      console.error('Error al actualizar:', error);
      showCustomAlert({
        title: '❌ Error',
        message: error.message || 'No se pudo actualizar la oferta',
        buttons: [{ text: 'Entendido', onPress: hideCustomAlert }],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    showCustomAlert({
      title: '¿Eliminar artículo?',
      message: '¿Estás seguro de que deseas eliminar este artículo?',
      icon: 'warning',
      buttons: [
        { text: 'Cancelar', style: 'cancel', onPress: hideCustomAlert },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: confirmDelete,
        },
      ],
    });
  };

  const confirmDelete = async () => {
    if (!oferta.id) {
      showCustomAlert({
        title: '❌ Error',
        message: 'ID de oferta no válido',
        buttons: [{ text: 'Entendido', onPress: hideCustomAlert }],
      });
      return;
    }

    setLoading(true);
    hideCustomAlert(); // cerramos el primer alert

    try {
      await comercioService.deleteOferta(oferta.id);

      showCustomAlert({
        title: '✅ Éxito',
        message: 'Artículo eliminado correctamente',
        buttons: [
          {
            text: 'Aceptar',
            onPress: () => {
              hideCustomAlert();
              onSuccess();
            },
          },
        ],
      });
    } catch (error: any) {
      console.error('❌ Error al eliminar:', error);

      const isForeignKeyViolation =
        error?.code === '23503' ||
        (error && typeof error === 'object' && (error as any).code === '23503') ||
        error?.message?.includes('23503') ||
        error?.message?.includes('pedidos') ||
        error?.message?.includes('FOREIGN KEY');

      if (isForeignKeyViolation) {
        showCustomAlert({
          title: '⚠️ No se puede eliminar',
          message:
            'Este artículo tiene pedidos asociados y no se puede eliminar permanentemente para mantener el historial. ¿Deseas marcarlo como no disponible?',
          icon: 'warning',
          buttons: [
            { text: 'Cancelar', style: 'cancel', onPress: hideCustomAlert },
            {
              text: 'Marcar como no disponible',
              onPress: async () => {
                hideCustomAlert();
                try {
                  await comercioService.updateOferta(oferta.id, {
                    disponible: false,
                  });
                  showCustomAlert({
                    title: '✅ Actualizado',
                    message: 'El artículo ha sido marcado como no disponible.',
                    buttons: [
                      {
                        text: 'Aceptar',
                        onPress: () => {
                          hideCustomAlert();
                          onSuccess();
                        },
                      },
                    ],
                  });
                } catch (updateError) {
                  console.error('Error al actualizar disponibilidad:', updateError);
                  showCustomAlert({
                    title: '❌ Error',
                    message: 'No se pudo actualizar el estado del artículo.',
                    buttons: [{ text: 'Entendido', onPress: hideCustomAlert }],
                  });
                }
              },
            },
          ],
        });
      } else {
        showCustomAlert({
          title: '❌ Error',
          message: error?.message || 'No se pudo eliminar el artículo. Intenta nuevamente.',
          buttons: [{ text: 'Entendido', onPress: hideCustomAlert }],
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // === Render ===
  return (
    <Modal animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>
              Editar {formData.tipo === 'producto' ? 'Producto' : 'Servicio'}
            </Text>
            <TouchableOpacity onPress={onCancel}>
              <X size={24} color="#8B4513" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            {/* Image Upload */}
            <View style={styles.imageSection}>
              <View style={styles.imageContainer}>
                {(selectedImage || oferta.imagen_url) ? (
                  <View style={styles.selectedImageContainer}>
                    <Image
                      source={{ uri: selectedImage || oferta.imagen_url || undefined }}
                      style={styles.ofertaImage}
                    />
                    <TouchableOpacity
                      style={styles.changeImageButton}
                      onPress={pickImage}
                    >
                      <Camera size={16} color="#FFFFFF" />
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
                  placeholder="Ej. Martillo"
                  value={formData.nombre}
                  onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                placeholder="Detalles del artículo..."
                value={formData.descripcion}
                onChangeText={(text) => setFormData({ ...formData, descripcion: text })}
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
                    onChangeText={(text) => setFormData({ ...formData, precio: text })}
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
                      onChangeText={(text) => setFormData({ ...formData, stock: text })}
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
                trackColor={{ false: '#767577', true: '#8B4513' }}
                thumbColor={formData.disponible ? '#D2B48C' : '#f4f3f4'}
              />
            </View>

            {/* Buttons */}
            <View style={styles.buttons}>
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={handleDelete}
                disabled={loading}
              >
                <Trash2 size={20} color="#FF6B6B" />
              </TouchableOpacity>

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
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* 🌟 Custom Alert Modal */}
          <Modal
            transparent
            visible={customAlert.visible}
            animationType="fade"
            onRequestClose={hideCustomAlert}
          >
            <View style={styles.alertOverlay}>
              <View style={styles.alertContent}>
                {/* Icono opcional */}
                {customAlert.icon === 'warning' && (
                  <View style={styles.alertIconContainer}>
                    <AlertTriangle size={28} color="#FFA500" />
                  </View>
                )}

                <Text style={styles.alertTitle}>{customAlert.title}</Text>
                <Text style={styles.alertMessage}>{customAlert.message}</Text>

                <View style={styles.alertButtonsContainer}>
                  {customAlert.buttons.map((btn, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.alertButton,
                        btn.style === 'destructive' && styles.alertButtonDestructive,
                        btn.style === 'cancel' && styles.alertButtonCancel,
                      ]}
                      onPress={() => {
                        btn.onPress();
                      }}
                      disabled={loading}
                    >
                      <Text
                        style={[
                          styles.alertButtonText,
                          btn.style === 'destructive' && styles.alertButtonTextDestructive,
                          btn.style === 'cancel' && styles.alertButtonTextCancel,
                        ]}
                      >
                        {btn.text}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </Modal>
  );
}

// === Estilos ===
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
  changeImageButton: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: '#8B4513',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
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
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#D2B48C',
  },
  deleteButton: {
    backgroundColor: '#FFE0E0',
    flex: 0.3,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  submitButton: {
    backgroundColor: '#8B4513',
    flex: 1.5,
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

  // === Estilos del Custom Alert ===
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  alertContent: {
    width: '80%',
    maxWidth: 350,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  alertIconContainer: {
    marginBottom: 12,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  alertMessage: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  alertButtonsContainer: {
    width: '100%',
  },
  alertButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#8B4513',
  },
  alertButtonDestructive: {
    backgroundColor: '#FF6B6B',
  },
  alertButtonCancel: {
    backgroundColor: '#F0F0F0',
  },
  alertButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  alertButtonTextDestructive: {
    color: 'white',
  },
  alertButtonTextCancel: {
    color: '#333',
  },
});