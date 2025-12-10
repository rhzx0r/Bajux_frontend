import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Star, Clock, MapPin, Package } from 'lucide-react-native';
import { router } from 'expo-router';
import { comercioService } from '../../lib/comercio';
import { Comercio, CategoriaComercio } from '../../types';

export default function StoresScreen() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [stores, setStores] = useState<Comercio[]>([]);
  const [categories, setCategories] = useState<CategoriaComercio[]>([]);

  useEffect(() => {
    loadData();
  }, [searchQuery]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedStores, fetchedCategories] = await Promise.all([
        comercioService.getAllComercios(searchQuery),
        comercioService.getCategoriasComercio(),
      ]);

      setStores(fetchedStores);
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error loading stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStores = stores.filter(store => {
    // Basic client-side filtering if needed on top of API search
    // Using API search query for now, client side category filtering could be added if we fetched relations.
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Tiendas y Locales</Text>
        <Text style={styles.subtitle}>Descubre y compra en negocios locales</Text>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={20} color="#8B4513" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar tiendas..."
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
          <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === 'Todos' && styles.selectedCategoryButton,
              ]}
              onPress={() => setSelectedCategory('Todos')}
            >
              <Text
                 style={[
                  styles.categoryButtonText,
                  selectedCategory === 'Todos' && styles.selectedCategoryButtonText,
                ]}
              >
                Todos
              </Text>
            </TouchableOpacity>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.nombre && styles.selectedCategoryButton,
              ]}
              onPress={() => setSelectedCategory(category.nombre || '')}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category.nombre && styles.selectedCategoryButtonText,
                ]}
              >
                {category.nombre}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#8B4513" />
        </View>
      ) : (
        /* Stores List */
        <ScrollView showsVerticalScrollIndicator={false} style={styles.storesList}>
          {filteredStores.length > 0 ? (
            filteredStores.map((store) => (
              <TouchableOpacity
                key={store.id}
                style={styles.storeCard}
                onPress={() => router.push(`/store/${store.id}`)}
              >
                <Image source={{ uri: store.imagen_url || 'https://via.placeholder.com/200' }} style={styles.storeImage} />
                <View style={styles.storeContent}>
                  <View style={styles.storeHeader}>
                    <Text style={styles.storeName}>{store.nombre}</Text>
                    <View style={[styles.statusBadge, styles.openBadge]}>
                      <Text style={[styles.statusText, styles.openText]}>
                        Abierto
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.storeCategory}>{store.ubicacion || 'Sin ubicación'}</Text>
                  <Text style={styles.storeDescription} numberOfLines={2}>
                    {store.descripcion}
                  </Text>

                  <View style={styles.storeInfo}>
                    <View style={styles.ratingContainer}>
                      <Star size={16} color="#FFD700" fill="#FFD700" />
                      <Text style={styles.ratingText}>N/A</Text>
                      <Text style={styles.reviewsText}></Text>
                    </View>

                    <View style={styles.productsContainer}>
                      {/* <Package size={16} color="#B8860B" /> */}
                      <Text style={styles.productsText}></Text>
                    </View>
                  </View>

                  <View style={styles.locationContainer}>
                    <MapPin size={14} color="#B8860B" />
                    <Text style={styles.locationText}>{store.ubicacion}</Text>
                  </View>

                  <View style={styles.hoursContainer}>
                    {/* <Clock size={14} color="#8B4513" />
                    <Text style={styles.hoursText}>{store.horario}</Text> */}
                    {/* Delivery badge placeholder */}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={{ padding: 20, alignItems: 'center' }}>
               <Text style={{ color: '#888' }}>No se encontraron tiendas.</Text>
            </View>
          )}
        </ScrollView>
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
  storesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  storeCard: {
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
  storeImage: {
    width: '100%',
    height: 140,
  },
  storeContent: {
    padding: 16,
  },
  storeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  storeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#170f09ff',
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  openBadge: {
    backgroundColor: '#E8F5E8',
  },
  statusText: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '600',
  },
  openText: {
    color: '#4CAF50',
  },
  storeCategory: {
    fontSize: 16,
    color: '#1f1a10ff',
    fontWeight: '600',
    marginBottom: 6,
  },
  storeDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
  },
  storeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  productsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productsText: {
    fontSize: 12,
    color: '#B8860B',
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    color: '#B8860B',
    marginLeft: 4,
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hoursText: {
    fontSize: 12,
    color: '#8B4513',
    marginLeft: 4,
    flex: 1,
  },
  deliveryBadge: {
    backgroundColor: '#8B4513',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  deliveryText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});