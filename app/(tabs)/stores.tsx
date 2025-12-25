import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Star, MapPin, Store } from 'lucide-react-native';
import { router } from 'expo-router';
import { comercioService } from '../../lib/comercio';
import { Comercio, CategoriaComercio } from '../../types';
import { FilterModal } from '../../components/FilterModal';

export default function StoresScreen() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [stores, setStores] = useState<Comercio[]>([]);
  const [categories, setCategories] = useState<CategoriaComercio[]>([]);
  const [filterVisible, setFilterVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, [searchQuery, selectedCategoryId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedStores, fetchedCategories] = await Promise.all([
        comercioService.getAllComercios(searchQuery, selectedCategoryId),
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

  const selectedCategoryName = categories.find(c => c.id === selectedCategoryId)?.nombre;

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
        /* Stores List */
        <ScrollView showsVerticalScrollIndicator={false} style={styles.storesList}>
          {stores.length > 0 ? (
            stores.map((store) => (
              <TouchableOpacity
                key={store.id}
                style={styles.storeCard}
                onPress={() => router.push(`/store/${store.id}`)}
              >
                {store.imagen_url ? (
                    <Image source={{ uri: store.imagen_url }} style={styles.storeImage} />
                ) : (
                    <View style={[styles.storeImage, styles.placeholderContainer]}>
                        <Store size={48} color="#D2B48C" />
                    </View>
                )}

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
                    </View>
                  </View>

                  <View style={styles.locationContainer}>
                    <MapPin size={14} color="#B8860B" />
                    <Text style={styles.locationText}>{store.ubicacion}</Text>
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
    fontSize: 24, // Reduced
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14, // Reduced
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
  placeholderContainer: {
      backgroundColor: '#F5F5F5',
      justifyContent: 'center',
      alignItems: 'center',
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
});
