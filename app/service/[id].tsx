import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Calendar,
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Oferta } from '../../types';

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState<Oferta | null>(null);

  useEffect(() => {
    fetchServiceData();
  }, [id]);

  const fetchServiceData = async () => {
    try {
      if (!id) return;
      const { data, error } = await supabase
        .from('oferta')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setService(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo cargar la información del servicio');
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    // Note: Phone number is not in `oferta` table. This would require fetching the commerce owner's profile or commerce details.
    // For now, I'll assume we can't make the call without that data, or alert that it's not available.
    Alert.alert('Información', 'Teléfono no disponible en este momento');
  };

  const handleMessage = () => {
    Alert.alert('Mensaje', 'Función de mensajería en desarrollo');
  };

  const handleBooking = () => {
    Alert.alert('Reservar cita', 'Función de reservas en desarrollo');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B4513" />
      </View>
    );
  }

  if (!service) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color="#8B4513" />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Servicio no encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#8B4513" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil del Servicio</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Service Hero */}
        <View style={styles.serviceHero}>
          <Image
            source={{
              uri: service.imagen_url || 'https://via.placeholder.com/400',
            }}
            style={styles.serviceImage}
          />
          <View style={styles.serviceOverlay}>
            <View
              style={[
                styles.availabilityBadge,
                service.disponible && styles.availableBadge,
              ]}
            >
              <Clock
                size={12}
                color={service.disponible ? '#4CAF50' : '#FF9800'}
              />
              <Text
                style={[
                  styles.availabilityText,
                  service.disponible && styles.availableText,
                ]}
              >
                {service.disponible ? 'Disponible' : 'Ocupado'}
              </Text>
            </View>
          </View>
        </View>

        {/* Service Info */}
        <View style={styles.serviceInfo}>
          <View style={styles.serviceHeader}>
            <Text style={styles.serviceName}>{service.nombre}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.priceSymbol}>
                {formatPrice(service.precio || 0)}
              </Text>
            </View>
          </View>

          <Text style={styles.serviceType}>Servicio</Text>

          <View style={styles.ratingContainer}>
            <Star size={20} color="#FFD700" fill="#FFD700" />
            <Text style={styles.ratingText}>N/A</Text>
            <Text style={styles.reviewsText}></Text>
          </View>

          <Text style={styles.serviceDescription}>{service.descripcion}</Text>
        </View>

        {/* Stats - Mocked for now as we don't have this data in oferta table */}
        {/*
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>N/A</Text>
            <Text style={styles.statLabel}>Experiencia</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>N/A</Text>
            <Text style={styles.statLabel}>Trabajos</Text>
          </View>
        </View>
        */}

        {/* Contact Info - Mocked/Unavailable */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información</Text>
          <Text style={styles.contactText}>
            Para más detalles contacte al proveedor.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
          <Phone size={20} color="#8B4513" />
          <Text style={styles.actionButtonText}>Llamar</Text>
        </TouchableOpacity>

        {/*<TouchableOpacity style={styles.actionButton} onPress={handleMessage}>
          <MessageCircle size={20} color="#8B4513" />
          <Text style={styles.actionButtonText}>Mensaje</Text>
        </TouchableOpacity>*/}

        {/*<TouchableOpacity style={styles.primaryButton} onPress={handleBooking}>
          <Calendar size={20} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Reservar</Text>
        </TouchableOpacity>*/}
      </View>
    </SafeAreaView>
  );
}

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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#8B4513',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D2B48C',
  },
  backButton: {
    padding: 4,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  serviceHero: {
    position: 'relative',
  },
  serviceImage: {
    width: '100%',
    height: 250,
  },
  serviceOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 243, 224, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  availableBadge: {
    backgroundColor: 'rgba(232, 245, 232, 0.9)',
  },
  availabilityText: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '600',
    marginLeft: 4,
  },
  availableText: {
    color: '#4CAF50',
  },
  serviceInfo: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513',
    flex: 1,
  },
  priceContainer: {
    flexDirection: 'row',
  },
  priceSymbol: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  serviceType: {
    fontSize: 18,
    color: '#B8860B',
    fontWeight: '600',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 18,
    color: '#8B4513',
    fontWeight: '600',
    marginLeft: 6,
  },
  reviewsText: {
    fontSize: 16,
    color: '#888888',
    marginLeft: 4,
  },
  serviceDescription: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    padding: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
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
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 16,
  },
  serviceItem: {
    marginBottom: 8,
  },
  serviceItemText: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 16,
    color: '#8B4513',
    marginLeft: 12,
  },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayText: {
    fontSize: 16,
    color: '#8B4513',
    fontWeight: '600',
  },
  hoursText: {
    fontSize: 16,
    color: '#666666',
  },
  reviewCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: '#888888',
  },
  actionsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#D2B48C',
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 8,
    flex: 1,
    borderWidth: 1,
    borderColor: '#D2B48C',
  },
  actionButtonText: {
    color: '#8B4513',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B4513',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 6,
  },
});
