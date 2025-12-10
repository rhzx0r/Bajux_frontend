import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, Star, Clock } from 'lucide-react-native';
import { router } from 'expo-router';
import { comercioService } from '../../lib/comercio';
import { getCategoryIcon } from '../../lib/categoryIcons';
import { Comercio, Oferta, CategoriaComercio } from '../../types';

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState<Oferta[]>([]);
  const [stores, setStores] = useState<Comercio[]>([]);
  const [categories, setCategories] = useState<CategoriaComercio[]>([]);

  useEffect(() => {
    loadData();
  }, [searchQuery]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedServices, fetchedStores, fetchedCategories] = await Promise.all([
        comercioService.getAllServices(searchQuery),
        comercioService.getAllComercios(searchQuery),
        comercioService.getCategoriasComercio(),
      ]);

      setServices(fetchedServices);
      setStores(fetchedStores);
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>Bajux</Text>
          <Text style={styles.subtitle}>Directorio de confianza</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#8B4513" />
            <TextInput
              style={styles.searchInput}
              placeholder="¿Qué servicio o tienda buscas?"
              placeholderTextColor="#8B4513"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          {/* <TouchableOpacity style={styles.locationButton}>
            <MapPin size={18} color="#FFD700" />
          </TouchableOpacity> */}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8B4513" />
            <Text style={styles.loadingText}>Cargando...</Text>
          </View>
        ) : (
          <>
            {/* Categories */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Categorías Populares</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                 <View style={styles.categoriesRow}>
                    {categories.length > 0 ? (
                    categories.map((category) => (
                      <TouchableOpacity key={category.id} style={styles.categoryCard}>
                        {/* Placeholder icon since we don't have icons in DB yet */}
                        <View style={styles.categoryIconContainer}>
                          {getCategoryIcon(category.nombre || '', 24, '#8B4513')}
                        </View>
                        <Text style={styles.categoryName}>{category.nombre}</Text>
                        <Text style={styles.categoryCount}>{category.descripcion}</Text>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <Text style={styles.emptyText}>No hay categorías disponibles</Text>
                  )}
                 </View>
              </ScrollView>
            </View>

            {/* Featured Services */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Servicios Destacados</Text>
                <TouchableOpacity onPress={() => router.push('/services')}>
                  <Text style={styles.seeAllText}>Ver todos</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                {services.length > 0 ? (
                  services.map((service) => (
                    <TouchableOpacity key={service.id} style={styles.serviceCard} onPress={() => router.push(`/service/${service.id}`)}>
                      <Image
                        source={{ uri: service.imagen_url || 'https://via.placeholder.com/200' }}
                        style={styles.serviceImage}
                      />
                      <View style={styles.serviceInfo}>
                        <Text style={styles.serviceName} numberOfLines={1}>{service.nombre}</Text>
                        <Text style={styles.serviceType} numberOfLines={2}>{service.descripcion}</Text>
                        <View style={styles.serviceRating}>
                          <Star size={14} color="#FFD700" fill="#FFD700" />
                          <Text style={styles.ratingText}>N/A</Text>
                        </View>
                        <View style={[styles.availabilityBadge, service.disponible && styles.availableBadge]}>
                          <Clock size={12} color={service.disponible ? '#4CAF50' : '#FF9800'} />
                          <Text style={[styles.availabilityText, service.disponible && styles.availableText]}>
                            {service.disponible ? 'Disponible' : 'Ocupado'}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.emptyText}>No hay servicios que coincidan con tu búsqueda</Text>
                )}
              </ScrollView>
            </View>

            {/* Featured Stores */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Tiendas Destacadas</Text>
                <TouchableOpacity onPress={() => router.push('/stores')}>
                  <Text style={styles.seeAllText}>Ver todas</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                {stores.length > 0 ? (
                  stores.map((store) => (
                    <TouchableOpacity key={store.id} style={styles.storeCard} onPress={() => router.push(`/store/${store.id}`)}>
                      <Image
                        source={{ uri: store.imagen_url || 'https://via.placeholder.com/200' }}
                        style={styles.storeImage}
                      />
                      <View style={styles.storeInfo}>
                        <Text style={styles.storeName} numberOfLines={1}>{store.nombre}</Text>
                        <Text style={styles.storeCategory} numberOfLines={1}>{store.ubicacion || 'Sin ubicación'}</Text>
                        <View style={styles.storeRating}>
                           {/* Rating placeholder */}
                          <Star size={14} color="#FFD700" fill="#FFD700" />
                          <Text style={styles.ratingText}>N/A</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.emptyText}>No hay tiendas que coincidan con tu búsqueda</Text>
                )}
              </ScrollView>
            </View>
          </>
        )}
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
    paddingBottom: 10,
    alignItems: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#B8860B',
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
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
    marginRight: 0,
    borderWidth: 1,
    borderColor: '#D2B48C',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#8B4513',
  },
  locationButton: {
    backgroundColor: '#8B4513',
    borderRadius: 25,
    padding: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
    paddingLeft: 16,
    paddingBottom: 12,
  },
  seeAllText: {
    color: '#B8860B',
    fontWeight: '600',
    paddingRight: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  categoriesRow: {
    flexDirection: 'row',
    paddingRight: 20,
  },
  categoryCard: {
    width: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#D2B48C',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryIconContainer: {
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 10,
    color: '#B8860B',
    textAlign: 'center',
  },
  horizontalScroll: {
    paddingLeft: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#8B4513',
  },
  emptyText: {
    color: '#888',
    fontStyle: 'italic',
    padding: 20,
  },
  serviceCard: {
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#D2B48C',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  serviceImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  serviceInfo: {
    padding: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 2,
  },
  serviceType: {
    fontSize: 14,
    color: '#B8860B',
    marginBottom: 6,
  },
  serviceRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 12,
    color: '#8B4513',
    marginLeft: 4,
    fontWeight: '600',
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#FFF3E0',
  },
  availableBadge: {
    backgroundColor: '#E8F5E8',
  },
  availabilityText: {
    fontSize: 10,
    color: '#FF9800',
    marginLeft: 4,
    fontWeight: '600',
  },
  availableText: {
    color: '#4CAF50',
  },
  storeCard: {
    width: 180,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#D2B48C',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  storeImage: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  storeInfo: {
    padding: 12,
  },
  storeName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 2,
  },
  storeCategory: {
    fontSize: 12,
    color: '#B8860B',
    marginBottom: 6,
  },
  storeRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productCount: {
    fontSize: 11,
    color: '#8B4513',
    marginLeft: 4,
  },
});