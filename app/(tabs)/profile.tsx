// app/(tabs)/profile.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Settings,
  Heart,
  Clock,
  CreditCard,
  CircleHelp as HelpCircle,
  LogOut,
  ChevronRight,
  MapPin,
  Mail,
} from 'lucide-react-native';
import { useAuth } from '../../providers/AuthProvider';
import { AuthForms } from '../../components/AuthForms';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';

// Para comercio
import { Store, Plus } from 'lucide-react-native';
import { CreateComercioForm } from '../../components/Form/CreateComercioForm';
import { comercioService } from '../../lib/comercio';
import { Comercio } from '../../types';

export default function ProfileScreen() {
  const { session, profile, loading, signOut, refetchProfile } = useAuth();
  const [showCreateComercio, setShowCreateComercio] = useState(false);
  const [misComercios, setMisComercios] = useState<Comercio[]>([]);
  const [loadingComercios, setLoadingComercios] = useState(false);
  const [logoutModal, setLogoutModal] = React.useState(false);

  const menuItems = [
    {
      id: 1,
      title: 'Mi perfil',
      subtitle: 'Información personal y preferencias',
      icon: User,
      onPress: () => {},
    },
    {
      id: 2,
      title: 'Mis pedidos',
      subtitle: 'Historial de compras y estado',
      icon: Clock,
      onPress: () => {},
    },
    {
      id: 3,
      title: 'Favoritos',
      subtitle: 'Servicios y tiendas guardados',
      icon: Heart,
      onPress: () => {},
    },
    {
      id: 4,
      title: 'Métodos de pago',
      subtitle: 'Tarjetas y formas de pago',
      icon: CreditCard,
      onPress: () => {},
    },
    {
      id: 5,
      title: 'Configuración',
      subtitle: 'Notificaciones y privacidad',
      icon: Settings,
      onPress: () => {},
    },
    {
      id: 6,
      title: 'Ayuda y soporte',
      subtitle: 'FAQ y contacto',
      icon: HelpCircle,
      onPress: () => {},
    },
    ...(profile?.rol_actual === 'comerciante'
      ? [
          {
            id: 7,
            title: 'Mis Comercios',
            subtitle: 'Gestiona tus negocios',
            icon: Store,
            onPress: () => {}, // Puedes navegar a una pantalla de gestión
          },
        ]
      : []),
  ];

  // Para comercio
  useEffect(() => {
    if (session && profile?.rol_actual === 'comerciante') {
      loadMisComercios();
    }
  }, [session, profile?.rol_actual]);

  const loadMisComercios = async () => {
    if (!session) return;

    setLoadingComercios(true);
    try {
      const comercios = await comercioService.getComerciosByUser(session);
      setMisComercios(comercios);
    } catch (error) {
      console.error('Error loading comercios:', error);
    } finally {
      setLoadingComercios(false);
    }
  };

  console.log('profile', profile);

  const handleComercioCreated = async () => {
    setShowCreateComercio(false);
    await refetchProfile(); // Para actualizar el rol a comerciante
    await loadMisComercios();
  };

  const handleSignOut = () => {
    setLogoutModal(true);
  };

  const confirmSignOut = async () => {
    try {
      await signOut();
      setLogoutModal(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // SI NO HAY SESIÓN: mostrar formularios de autenticación
  if (!session) {
    return (
      <SafeAreaView style={styles.container}>
        <AuthForms />
      </SafeAreaView>
    );
  }

  // SI ESTÁ CARGANDO
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // SI HAY SESIÓN: mostrar perfil normal
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Mi Perfil</Text>
          <Text style={styles.subtitle}>Gestiona tu cuenta y preferencias</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{
              uri:
                profile?.imagen_url ||
                'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
            }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {profile?.nombre ||
                session.user?.email?.split('@')[0] ||
                'Usuario'}
            </Text>
            <View style={styles.profileDetail}>
              <Mail size={14} color="#B8860B" />
              <Text style={styles.profileEmail}>{session.user?.email}</Text>
            </View>
            {profile?.ubicacion && (
              <View style={styles.profileDetail}>
                <MapPin size={14} color="#B8860B" />
                <Text style={styles.profileLocation}>{profile.ubicacion}</Text>
              </View>
            )}
            <View style={styles.membershipBadge}>
              <Text style={styles.membershipText}>
                {profile?.rol_actual === 'comerciante'
                  ? 'Comerciante'
                  : profile?.rol_actual === 'administrador'
                    ? 'Administrador'
                    : 'Cliente'}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Pedidos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>-</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuIconContainer}>
                <item.icon size={24} color="#8B4513" />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <ChevronRight size={20} color="#B8860B" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sección de Comercios */}
        {profile?.rol_actual === 'comerciante' && (
          <View style={styles.comerciosSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mis Comercios</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowCreateComercio(true)}
              >
                <Plus size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {loadingComercios ? (
              <Text style={styles.loadingText}>Cargando comercios...</Text>
            ) : misComercios.length > 0 ? (
              misComercios.map((comercio) => (
                <TouchableOpacity key={comercio.id} style={styles.comercioCard}>
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
                </TouchableOpacity>
              ))
            ) : (
              <TouchableOpacity
                style={styles.emptyComercioCard}
                onPress={() => setShowCreateComercio(true)}
              >
                <Store size={32} color="#B8860B" />
                <Text style={styles.emptyComercioText}>
                  Crear mi primer comercio
                </Text>
                <Text style={styles.emptyComercioSubtext}>
                  Comienza a ofrecer tus productos y servicios
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Botón para convertirse en comerciante */}
        {profile?.rol_actual === 'cliente' ||
          (profile?.rol_actual === 'administrador' && (
            <TouchableOpacity
              style={styles.becomeComercianteButton}
              onPress={() => setShowCreateComercio(true)}
            >
              <Store size={20} color="#8B4513" />
              <Text style={styles.becomeComercianteText}>
                Convertirse en Comerciante
              </Text>
              <ChevronRight size={20} color="#B8860B" />
            </TouchableOpacity>
          ))}

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <LogOut size={20} color="#FF6B6B" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>Bajux</Text>
          <Text style={styles.appVersion}>Versión 1.0.0</Text>
          <Text style={styles.appDescription}>
            Tu directorio de confianza para servicios y tiendas locales
          </Text>
        </View>
      </ScrollView>

      {/* Modal de confirmación */}
      <ConfirmationModal
        visible={logoutModal}
        title="Cerrar sesión"
        message="¿Estás seguro de que quieres cerrar sesión?"
        confirmText="Cerrar sesión"
        cancelText="Cancelar"
        type="danger"
        onConfirm={confirmSignOut}
        onCancel={() => setLogoutModal(false)}
      />

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

// Tus estilos existentes aquí...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFEFE',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#8B4513',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#B8860B',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D2B48C',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 8,
  },
  profileDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#B8860B',
    marginLeft: 6,
  },
  profileLocation: {
    fontSize: 14,
    color: '#B8860B',
    marginLeft: 6,
  },
  membershipBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  membershipText: {
    fontSize: 12,
    color: '#8B4513',
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#D2B48C',
  },
  editButtonText: {
    fontSize: 14,
    color: '#8B4513',
    fontWeight: '600',
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D2B48C',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#B8860B',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#D2B48C',
  },
  menuContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#D2B48C',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#B8860B',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFE0E0',
  },
  logoutText: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '600',
    marginLeft: 8,
  },
  appInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: '#B8860B',
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 20,
  },

  // comercio
  comerciosSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  addButton: {
    backgroundColor: '#8B4513',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comercioCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D2B48C',
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
  emptyComercioCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D2B48C',
    borderStyle: 'dashed',
  },
  emptyComercioText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyComercioSubtext: {
    fontSize: 14,
    color: '#B8860B',
    textAlign: 'center',
  },
  becomeComercianteButton: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D2B48C',
  },
  becomeComercianteText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
    marginLeft: 12,
  },
});
