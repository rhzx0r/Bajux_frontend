import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Store, Plus, Trash2, AlertTriangle } from 'lucide-react-native';
import { router, useFocusEffect } from 'expo-router';
import { useAuth } from '../../providers/AuthProvider';
import { comercioService } from '../../lib/comercio';
import { Comercio } from '../../types';
import { CreateComercioForm } from '../../components/Form/CreateComercioForm';

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

export default function MyShopsScreen() {
  const { session, profile, refetchProfile } = useAuth();
  const [misComercios, setMisComercios] = useState<Comercio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateComercio, setShowCreateComercio] = useState(false);
  const [customAlert, setCustomAlert] = useState<CustomAlertConfig>({
    visible: false,
    title: '',
    message: '',
    buttons: [],
  });

  // Helpers para alert
  const showCustomAlert = (config: Omit<CustomAlertConfig, 'visible'>) => {
    setCustomAlert({ ...config, visible: true });
  };

  const hideCustomAlert = () => {
    setCustomAlert((prev) => ({ ...prev, visible: false }));
  };

  useFocusEffect(
    useCallback(() => {
      if (session) {
        loadMisComercios();
      }
    }, [session])
  );

  const loadMisComercios = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const comercios = await comercioService.getComerciosByUser(session);
      setMisComercios(comercios);
    } catch (error) {
      console.error('Error loading comercios:', error);
      showCustomAlert({
        title: '❌ Error',
        message: 'No se pudieron cargar tus comercios.',
        buttons: [{ text: 'Entendido', onPress: hideCustomAlert }],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComercio = (id: number, nombre: string) => {
    showCustomAlert({
      title: '¿Eliminar comercio?',
      message: `¿Estás seguro que deseas eliminar "${nombre}"? Esta acción eliminará todas las ofertas y datos asociados permanentemente.`,
      icon: 'warning',
      buttons: [
        { text: 'Cancelar', style: 'cancel', onPress: hideCustomAlert },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => confirmDeleteComercio(id),
        },
      ],
    });
  };

  const confirmDeleteComercio = async (id: number) => {
    setLoading(true);
    hideCustomAlert();

    try {
      await comercioService.deleteComercio(id);
      // Optimistic update
      setMisComercios((prev) => prev.filter((c) => c.id !== id));
      showCustomAlert({
        title: '✅ Éxito',
        message: 'Comercio eliminado correctamente.',
        buttons: [
          {
            text: 'Aceptar',
            onPress: () => {
              hideCustomAlert();
              loadMisComercios(); // Asegurar sincronía
            },
          },
        ],
      });
    } catch (error: any) {
      console.error('Error eliminando comercio:', error);

      const isForeignKeyViolation =
        error?.code === '23503' ||
        (error && typeof error === 'object' && (error as any).code === '23503') ||
        error?.message?.includes('23503') ||
        error?.message?.includes('pedidos') ||
        error?.message?.includes('FOREIGN KEY');

      if (isForeignKeyViolation) {
        showCustomAlert({
          title: '⚠️ No se puede eliminar',
          message: 'Este comercio tiene pedidos asociados y no puede ser eliminado para preservar el historial.',
          icon: 'warning',
          buttons: [{ text: 'Entendido', onPress: hideCustomAlert }],
        });
      } else {
        showCustomAlert({
          title: '❌ Error',
          message: 'No se pudo eliminar el comercio. Inténtalo de nuevo.',
          buttons: [{ text: 'Entendido', onPress: hideCustomAlert }],
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleComercioCreated = async () => {
    setShowCreateComercio(false);
    await refetchProfile();
    loadMisComercios();
  };

  const canCreateMore = misComercios.length < 3;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#8B4513" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Comercios</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator size="large" color="#8B4513" style={{ marginTop: 20 }} />
        ) : misComercios.length > 0 ? (
          misComercios.map((comercio) => (
            <TouchableOpacity
              key={comercio.id}
              style={styles.comercioCard}
              onPress={() => router.push(`/store/${comercio.id}`)}
            >
              <Image
                source={{
                  uri:
                    comercio.imagen_url ||
                    'https://images.pexels.com/photos/264537/pexels-photo-264537.jpeg?auto=compress&cs=tinysrgb&w=400',
                }}
                style={styles.comercioImage}
                onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
              />
              <View style={styles.comercioInfo}>
                <Text style={styles.comercioName}>{comercio.nombre}</Text>
                <Text style={styles.comercioLocation}>{comercio.ubicacion}</Text>
                <Text style={styles.comercioDescription} numberOfLines={2}>
                  {comercio.descripcion}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteComercio(comercio.id, comercio.nombre || 'Comercio')}
                disabled={loading}
              >
                <Trash2 size={40} color="#EF4444" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Store size={48} color="#D2B48C" />
            <Text style={styles.emptyStateText}>No tienes comercios registrados</Text>
            <Text style={styles.emptyStateSubtext}>¡Comienza tu negocio digital hoy mismo!</Text>
          </View>
        )}
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.createButton, !canCreateMore && styles.disabledButton]}
          onPress={() => setShowCreateComercio(true)}
          disabled={!canCreateMore}
        >
          <Plus size={24} color="#FFFFFF" />
          <Text style={styles.createButtonText}>
            {canCreateMore ? 'Agregar nuevo comercio' : 'Límite de comercios alcanzado'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.limitText}>{misComercios.length} / 3 comercios creados</Text>
      </View>

      {/* Modal para crear comercio */}
      {showCreateComercio && (
        <CreateComercioForm
          onSuccess={handleComercioCreated}
          onCancel={() => setShowCreateComercio(false)}
        />
      )}

      {/* 🌟 Custom Alert Modal */}
      <CustomAlertModal
        visible={customAlert.visible}
        title={customAlert.title}
        message={customAlert.message}
        icon={customAlert.icon}
        buttons={customAlert.buttons}
        onClose={hideCustomAlert}
        loading={loading}
      />
    </SafeAreaView>
  );
}

// ✨ Componente reutilizable de Alert (puedes moverlo a una lib/ si lo usas en más pantallas)
interface CustomAlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  icon?: 'warning';
  buttons: CustomAlertButton[];
  onClose: () => void;
  loading?: boolean;
}

const CustomAlertModal: React.FC<CustomAlertModalProps> = ({
  visible,
  title,
  message,
  icon,
  buttons,
  onClose,
  loading = false,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.alertOverlay}>
      <View style={styles.alertContent}>
        {icon === 'warning' && (
          <View style={styles.alertIconContainer}>
            <AlertTriangle size={28} color="#FFA500" />
          </View>
        )}

        <Text style={styles.alertTitle}>{title}</Text>
        <Text style={styles.alertMessage}>{message}</Text>

        <View style={styles.alertButtonsContainer}>
          {buttons.map((btn, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.alertButton,
                btn.style === 'destructive' && styles.alertButtonDestructive,
                btn.style === 'cancel' && styles.alertButtonCancel,
              ]}
              onPress={btn.onPress}
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
  );
};

// === Estilos ===
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFEFE',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D2B48C',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  comercioCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D2B48C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  comercioImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  comercioInfo: {
    flex: 1,
    marginLeft: 16,
    paddingRight: 30,
  },
  comercioName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 4,
  },
  comercioLocation: {
    fontSize: 14,
    color: '#B8860B',
    marginBottom: 4,
  },
  comercioDescription: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B4513',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#B8860B',
    marginTop: 8,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FEFEFE',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  createButton: {
    backgroundColor: '#8B4513',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  disabledButton: {
    backgroundColor: '#A0A0A0',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  limitText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
  },
  deleteButton: {
    position: 'absolute',
    top: 25,
    right: 12,
    padding: 4,
    borderRadius: 4,
    backgroundColor: '#FEF2F2',
  },

  // === Custom Alert Modal ===
  alertOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    backgroundColor: '#EF4444',
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