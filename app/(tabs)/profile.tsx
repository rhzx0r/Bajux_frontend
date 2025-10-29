// app/(tabs)/profile.tsx
import React from 'react';
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

export default function ProfileScreen() {
  const { session, profile, loading, signOut } = useAuth();
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
  ];

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
});
