import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Star, Clock, Phone, MapPin } from 'lucide-react-native';
import { router } from 'expo-router';

export default function ServicesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Categories for filtering
  const categories = ['Todos', 'Reparación y construcción', 'Hogar y jardinería', 'Automotriz', 'Tecnología', 'Educación', 'Salud y bienestar', 'Eventos y entretenimiento', 'Servicios profesionales'];

  const services = [
    //is better to fetch this data from an API or database
    {
      id: '1',
      name: 'Carlos Méndez',
      service: 'Plomería',
      description: 'Especialista en instalaciones y reparaciones de plomería residencial y comercial.',
      rating: 4.8,
      reviews: 124,
      image: 'https://images.pexels.com/photos/8472749/pexels-photo-8472749.jpeg?auto=compress&cs=tinysrgb&w=400',
      available: true,
      location: 'Centro, CDMX',
      priceRange: '$$',
      phone: '+52 55 1234 5678',
    },
    {
      id: '2',
      name: 'María González',
      service: 'Jardinería',
      description: 'Diseño y mantenimiento de jardines, poda y paisajismo profesional.',
      rating: 4.9,
      reviews: 89,
      image: 'https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg?auto=compress&cs=tinysrgb&w=400',
      available: true,
      location: 'Roma Norte, CDMX',
      priceRange: '$',
      phone: '+52 55 9876 5432',
    },
    {
      id: '3',
      name: 'Juan Pérez',
      service: 'Electricidad',
      description: 'Instalaciones eléctricas, reparaciones y mantenimiento con certificación.',
      rating: 4.7,
      reviews: 156,
      image: 'https://images.pexels.com/photos/5691608/pexels-photo-5691608.jpeg?auto=compress&cs=tinysrgb&w=400',
      available: false,
      location: 'Polanco, CDMX',
      priceRange: '$$$',
      phone: '+52 55 2468 1357',
    },
    {
      id: '4',
      name: 'Ana Rodríguez',
      service: 'Limpieza',
      description: 'Servicios de limpieza profunda para hogares y oficinas.',
      rating: 4.6,
      reviews: 78,
      image: 'https://images.pexels.com/photos/6195943/pexels-photo-6195943.jpeg?auto=compress&cs=tinysrgb&w=400',
      available: true,
      location: 'Condesa, CDMX',
      priceRange: '$',
      phone: '+52 55 1357 2468',
    },
  ];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || service.service === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderPriceRange = (range: string) => {
    return range.split('').map((char, index) => (
      <Text key={index} style={[styles.priceSymbol, { color: '#B8860B' }]}>
        {char}
      </Text>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Servicios Particulares</Text>
        <Text style={styles.subtitle}>Encuentra al profesional que necesitas</Text>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={20} color="#8B4513" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar servicios..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#8B4513"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#FFD700" />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScrollView}>
        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.selectedCategoryButton,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category && styles.selectedCategoryButtonText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Services List */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.servicesList}>
        {filteredServices.map((service) => (
          <TouchableOpacity
            key={service.id}
            style={styles.serviceCard}
            onPress={() => router.push(`/service/${service.id}`)}
          >
            <Image source={{ uri: service.image }} style={styles.serviceImage} />
            <View style={styles.serviceContent}>
              <View style={styles.serviceHeader}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <View style={styles.availabilityContainer}>
                  <View style={[styles.availabilityDot, service.available && styles.availableDot]} />
                  <Text style={[styles.availabilityText, service.available && styles.availableText]}>
                    {service.available ? 'Disponible' : 'Ocupado'}
                  </Text>
                </View>
              </View>

              <View style={styles.serviceTypeContainer}>
                <Text style={styles.serviceType}>{service.service}</Text>
                <View style={styles.priceContainer}>
                  {renderPriceRange(service.priceRange)}
                </View>
              </View>

              <Text style={styles.serviceDescription} numberOfLines={2}>
                {service.description}
              </Text>

              <View style={styles.serviceFooter}>
                <View style={styles.ratingContainer}>
                  <Star size={16} color="#FFD700" fill="#FFD700" />
                  <Text style={styles.ratingText}>{service.rating}</Text>
                  <Text style={styles.reviewsText}>({service.reviews} reseñas)</Text>
                </View>

                <View style={styles.locationContainer}>
                  <MapPin size={14} color="#B8860B" />
                  <Text style={styles.locationText}>{service.location}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.contactButton}
                onPress={() => {/* Handle contact */ }}
              >
                <Phone size={16} color="#FFFFFF" />
                <Text style={styles.contactButtonText}>Contactar</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFEFE',
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
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#D2B48C',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#8B4513',
  },
  filterButton: {
    backgroundColor: '#8B4513',
    borderRadius: 25,
    padding: 12,
  },
  categoriesScrollView: {
    maxHeight: 50,
    marginBottom: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  categoryButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#D2B48C',
  },
  selectedCategoryButton: {
    backgroundColor: '#8B4513',
    borderColor: '#8B4513',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#8B4513',
    fontWeight: '500',
  },
  selectedCategoryButtonText: {
    color: '#FFFFFF',
  },
  servicesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
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
    overflow: 'hidden',
  },
  serviceImage: {
    width: '100%',
    height: 140,
  },
  serviceContent: {
    padding: 16,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#050504ff',
    flex: 1,
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF9800',
    marginRight: 6,
  },
  availableDot: {
    backgroundColor: '#4CAF50',
  },
  availabilityText: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '600',
  },
  availableText: {
    color: '#4CAF50',
  },
  serviceTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceType: {
    fontSize: 16,
    color: '#5b5a58ff',
    fontWeight: '600',
  },
  priceContainer: {
    flexDirection: 'row',
  },
  priceSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
  },
  serviceFooter: {
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 14,
    color: '#8B4513',
    fontWeight: '600',
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 12,
    color: '#888888',
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#B8860B',
    marginLeft: 4,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B4513',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});