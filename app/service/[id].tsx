import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Star, MapPin, Clock, Phone, MessageCircle, Calendar } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams();

  // Mock service data - in a real app, fetch by ID
  const service = {
    id: '1',
    name: 'Carlos Méndez',
    service: 'Plomería',
    description: 'Especialista en instalaciones y reparaciones de plomería residencial y comercial. Con más de 15 años de experiencia, ofrezco servicios de alta calidad con garantía incluida.',
    rating: 4.8,
    reviews: 124,
    image: 'https://images.pexels.com/photos/8472749/pexels-photo-8472749.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    location: 'Centro, CDMX',
    priceRange: '$$',
    phone: '+52 55 1234 5678',
    experience: '15 años',
    responseTime: '30 min',
    completedJobs: 450,
    services: [
      'Instalación de tuberías',
      'Reparación de fugas',
      'Destapado de drenajes',
      'Instalación de calentadores',
      'Mantenimiento preventivo',
    ],
    availability: {
      monday: '8:00 AM - 6:00 PM',
      tuesday: '8:00 AM - 6:00 PM',
      wednesday: '8:00 AM - 6:00 PM',
      thursday: '8:00 AM - 6:00 PM',
      friday: '8:00 AM - 6:00 PM',
      saturday: '9:00 AM - 2:00 PM',
      sunday: 'Cerrado',
    },
  };

  const reviews = [
    {
      id: 1,
      name: 'María González',
      rating: 5,
      comment: 'Excelente servicio, muy profesional y puntual. Resolvió el problema de plomería rápidamente.',
      date: '2024-01-15',
    },
    {
      id: 2,
      name: 'Juan López',
      rating: 5,
      comment: 'Trabajo de calidad y precio justo. Muy recomendado.',
      date: '2024-01-10',
    },
    {
      id: 3,
      name: 'Ana Rodríguez',
      rating: 4,
      comment: 'Buen servicio, llegó a tiempo y solucionó el problema.',
      date: '2024-01-05',
    },
  ];

  const renderPriceRange = (range: string) => {
    return range.split('').map((char, index) => (
      <Text key={index} style={[styles.priceSymbol, { color: '#B8860B' }]}>
        {char}
      </Text>
    ));
  };

  const handleCall = () => {
    Linking.openURL(`tel:${service.phone}`);
  };

  const handleMessage = () => {
    Alert.alert('Mensaje', 'Función de mensajería en desarrollo');
  };

  const handleBooking = () => {
    Alert.alert('Reservar cita', 'Función de reservas en desarrollo');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#8B4513" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil del Servicio</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Service Hero */}
        <View style={styles.serviceHero}>
          <Image source={{ uri: service.image }} style={styles.serviceImage} />
          <View style={styles.serviceOverlay}>
            <View style={[styles.availabilityBadge, service.available && styles.availableBadge]}>
              <Clock size={12} color={service.available ? '#4CAF50' : '#FF9800'} />
              <Text style={[styles.availabilityText, service.available && styles.availableText]}>
                {service.available ? 'Disponible' : 'Ocupado'}
              </Text>
            </View>
          </View>
        </View>

        {/* Service Info */}
        <View style={styles.serviceInfo}>
          <View style={styles.serviceHeader}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <View style={styles.priceContainer}>
              {renderPriceRange(service.priceRange)}
            </View>
          </View>
          
          <Text style={styles.serviceType}>{service.service}</Text>
          
          <View style={styles.ratingContainer}>
            <Star size={20} color="#FFD700" fill="#FFD700" />
            <Text style={styles.ratingText}>{service.rating}</Text>
            <Text style={styles.reviewsText}>({service.reviews} reseñas)</Text>
          </View>
          
          <Text style={styles.serviceDescription}>{service.description}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{service.experience}</Text>
            <Text style={styles.statLabel}>Experiencia</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{service.completedJobs}</Text>
            <Text style={styles.statLabel}>Trabajos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{service.responseTime}</Text>
            <Text style={styles.statLabel}>Respuesta</Text>
          </View>
        </View>

        {/* Services List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Servicios Ofrecidos</Text>
          {service.services.map((item, index) => (
            <View key={index} style={styles.serviceItem}>
              <Text style={styles.serviceItemText}>• {item}</Text>
            </View>
          ))}
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de Contacto</Text>
          <View style={styles.contactRow}>
            <MapPin size={18} color="#B8860B" />
            <Text style={styles.contactText}>{service.location}</Text>
          </View>
          <TouchableOpacity style={styles.contactRow} onPress={handleCall}>
            <Phone size={18} color="#B8860B" />
            <Text style={styles.contactText}>{service.phone}</Text>
          </TouchableOpacity>
        </View>

        {/* Availability */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horarios de Atención</Text>
          {Object.entries(service.availability).map(([day, hours]) => (
            <View key={day} style={styles.availabilityRow}>
              <Text style={styles.dayText}>
                {day.charAt(0).toUpperCase() + day.slice(1)}:
              </Text>
              <Text style={styles.hoursText}>{hours}</Text>
            </View>
          ))}
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reseñas Recientes</Text>
          {reviews.slice(0, 3).map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewName}>{review.name}</Text>
                <View style={styles.reviewRating}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      color={i < review.rating ? '#FFD700' : '#D2B48C'}
                      fill={i < review.rating ? '#FFD700' : 'none'}
                    />
                  ))}
                </View>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
          <Phone size={20} color="#8B4513" />
          <Text style={styles.actionButtonText}>Llamar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleMessage}>
          <MessageCircle size={20} color="#8B4513" />
          <Text style={styles.actionButtonText}>Mensaje</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.primaryButton} onPress={handleBooking}>
          <Calendar size={20} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Reservar</Text>
        </TouchableOpacity>
      </View>
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