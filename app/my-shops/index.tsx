import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Store, Plus, Trash2 } from 'lucide-react-native';
import { router, useFocusEffect } from 'expo-router';
import { useAuth } from '../../providers/AuthProvider';
import { comercioService } from '../../lib/comercio';
import { Comercio } from '../../types';
import { CreateComercioForm } from '../../components/Form/CreateComercioForm';

export default function MyShopsScreen() {
  const { session, profile, refetchProfile } = useAuth();
  const [misComercios, setMisComercios] = useState<Comercio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateComercio, setShowCreateComercio] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
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
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComercio = async (id: number, nombre: string) => {
    Alert.alert(
      'Eliminar Comercio',
      `¿Estás seguro que deseas eliminar "${nombre}"? Esta acción eliminará todas las ofertas y datos asociados permanentemente.`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await comercioService.deleteComercio(id);
              // Optimistically update the list
              setMisComercios(prev => prev.filter(c => c.id !== id));
              Alert.alert('Éxito', 'Comercio eliminado correctamente');
            } catch (error: any) {
              console.error('Error eliminando comercio:', error);
              if (error.code === '23503') {
                Alert.alert(
                  'No se puede eliminar',
                  'Este comercio tiene pedidos asociados y no puede ser eliminado para preservar el historial.'
                );
              } else {
                Alert.alert('Error', 'No se pudo eliminar el comercio. Inténtalo de nuevo.');
              }
            } finally {
              setLoading(false);
              // Reload to ensure sync
              loadMisComercios();
            }
          },
        },
      ]
    );
  };

  const handleComercioCreated = async () => {
    setShowCreateComercio(false);
    await refetchProfile(); // Update role if it changed
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
              />
              <View style={styles.comercioInfo}>
                <Text style={styles.comercioName}>{comercio.nombre}</Text>
                <Text style={styles.comercioLocation}>
                  {comercio.ubicacion}
                </Text>
                <Text style={styles.comercioDescription} numberOfLines={2}>
                  {comercio.descripcion}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteComercio(comercio.id, comercio.nombre || 'Comercio')}
              >
                <Trash2 size={20} color="#EF4444" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Store size={48} color="#D2B48C" />
            <Text style={styles.emptyStateText}>No tienes comercios registrados</Text>
            <Text style={styles.emptyStateSubtext}>
              ¡Comienza tu negocio digital hoy mismo!
            </Text>
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
        <Text style={styles.limitText}>
          {misComercios.length} / 3 comercios creados
        </Text>
      </View>

      {/* Modal para crear comercio */}
      {showCreateComercio && (
        <CreateComercioForm
          onSuccess={handleComercioCreated}
          onCancel={() => setShowCreateComercio(false)}
        />
      )}
    </SafeAreaView>
  );
}

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
    paddingBottom: 100, // Space for footer
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
    paddingRight: 30, // Space for delete button
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
    top: 12,
    right: 12,
    padding: 4,
    borderRadius: 4,
    backgroundColor: '#FEF2F2',
  },
});
