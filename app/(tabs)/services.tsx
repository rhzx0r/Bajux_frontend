import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Star, Wrench } from 'lucide-react-native';
import { router } from 'expo-router';
import { comercioService } from '../../lib/comercio';
import { Oferta, CategoriaOferta } from '../../types';
import { FilterModal } from '../../components/FilterModal';

export default function ServicesScreen() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [services, setServices] = useState<Oferta[]>([]);
  const [categories, setCategories] = useState<CategoriaOferta[]>([]);
  const [filterVisible, setFilterVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, [searchQuery, selectedCategoryId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedServices, fetchedCategories] = await Promise.all([
        comercioService.getAllServices(searchQuery, selectedCategoryId),
        comercioService.getCategoriasOferta(),
      ]);

      setServices(fetchedServices);
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  const selectedCategoryName = categories.find(c => c.id === selectedCategoryId)?.nombre;

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
        <TouchableOpacity
            style={[styles.filterButton, selectedCategoryId !== null && styles.filterButtonActive]}
            onPress={() => setFilterVisible(true)}
        >
          <Filter size={20} color={selectedCategoryId !== null ? "#FFFFFF" : "#FFD700"} />
        </TouchableOpacity>
      </View>

      {selectedCategoryName && (
        <View style={styles.activeFilterContainer}>
            <Text style={styles.activeFilterText}>Categoría: {selectedCategoryName}</Text>
        </View>
      )}

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#8B4513" />
        </View>
      ) : (
        /* Services List */
        <ScrollView showsVerticalScrollIndicator={false} style={styles.servicesList}>
          {services.length > 0 ? (
            services.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.serviceCard}
                onPress={() => router.push(`/service/${service.id}`)}
              >
                {service.imagen_url ? (
                    <Image source={{ uri: service.imagen_url }} style={styles.serviceImage} />
                ) : (
                    <View style={[styles.serviceImage, styles.placeholderContainer]}>
                        <Wrench size={48} color="#D2B48C" />
                    </View>
                )}

                <View style={styles.serviceContent}>
                  <View style={styles.serviceHeader}>
                    <Text style={styles.serviceName}>{service.nombre}</Text>
                    <View style={styles.availabilityContainer}>
                      <View style={[styles.availabilityDot, service.disponible && styles.availableDot]} />
                      <Text style={[styles.availabilityText, service.disponible && styles.availableText]}>
                        {service.disponible ? 'Disponible' : 'Ocupado'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.serviceTypeContainer}>
                    <Text style={styles.serviceType} numberOfLines={1}>{service.descripcion}</Text>
                    <View style={styles.priceContainer}>
                      <Text style={styles.priceSymbol}>{formatPrice(service.precio || 0)}</Text>
                    </View>
                  </View>

                  <View style={styles.serviceFooter}>
                    <View style={styles.ratingContainer}>
                      <Star size={16} color="#FFD700" fill="#FFD700" />
                      <Text style={styles.ratingText}>N/A</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.contactButton}
                    onPress={() => router.push(`/service/${service.id}`)}
                  >
                    <Text style={styles.contactButtonText}>Ver Detalles</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: '#888' }}>No se encontraron servicios.</Text>
            </View>
          )}
        </ScrollView>
      )}

      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        categories={categories}
        selectedId={selectedCategoryId}
        onApply={setSelectedCategoryId}
      />
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
    fontSize: 24, // Reduced from 28
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14, // Reduced from 16
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
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D2B48C',
  },
  filterButtonActive: {
      backgroundColor: '#8B4513',
  },
  activeFilterContainer: {
      paddingHorizontal: 20,
      marginBottom: 10,
  },
  activeFilterText: {
      color: '#8B4513',
      fontWeight: '600',
      fontSize: 14,
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
  placeholderContainer: {
      backgroundColor: '#F5F5F5',
      justifyContent: 'center',
      alignItems: 'center',
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
    color: '#121110ff',
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
    fontSize: 14,
    color: '#030303ff',
    flex: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  priceSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B8860B',
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
  },
});
