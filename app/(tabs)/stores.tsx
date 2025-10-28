import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Star, Clock, MapPin, Package } from 'lucide-react-native';
import { router } from 'expo-router';

export default function StoresScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Categories for filtering
  const categories = ['Todos', 'Ferretería', 'Papelería', 'Alimentos y bebidas', 'Salud', 'Abarrotes', 'Comercio', 'Turismo', 'Ejercicio', 'Entretenimiento'];

  const stores = [
    // Ideally, this data should be fetched from an API or database
    {
      id: '1',
      name: 'Ferretería El Martillo',
      category: 'Ferretería',
      description: 'Todo lo que necesitas para construcción y reparaciones del hogar.',
      rating: 4.7,
      reviews: 245,
      image: 'https://images.pexels.com/photos/1094767/pexels-photo-1094767.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'Av. Insurgentes 123, CDMX',
      isOpen: true,
      openHours: '8:00 AM - 8:00 PM',
      productsCount: 156,
      delivery: true,
    },
    {
      id: '2',
      name: 'Papelería Moderna',
      category: 'Papelería',
      description: 'Artículos escolares, oficina y manualidades de calidad.',
      rating: 4.6,
      reviews: 132,
      image: 'https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'Col. Roma, CDMX',
      isOpen: true,
      openHours: '9:00 AM - 7:00 PM',
      productsCount: 89,
      delivery: false,
    },
    {
      id: '3',
      name: 'Restaurante La Cocina',
      category: 'Restaurante',
      description: 'Comida casera y tradicional mexicana con ingredientes frescos.',
      rating: 4.8,
      reviews: 189,
      image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'Centro Histórico, CDMX',
      isOpen: false,
      openHours: '12:00 PM - 10:00 PM',
      productsCount: 45,
      delivery: true,
    },
    {
      id: '4',
      name: 'Farmacia San José',
      category: 'Farmacia',
      description: 'Medicamentos y productos de salud con servicio 24 horas.',
      rating: 4.5,
      reviews: 298,
      image: 'https://images.pexels.com/photos/356054/pexels-photo-356054.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'Polanco, CDMX',
      isOpen: true,
      openHours: '24 horas',
      productsCount: 234,
      delivery: true,
    },
  ];

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || store.category === selectedCategory;
    return matchesSearch && matchesCategory;
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

      {/* Stores List */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.storesList}>
        {filteredStores.map((store) => (
          <TouchableOpacity
            key={store.id}
            style={styles.storeCard}
            onPress={() => router.push(`/store/${store.id}`)}
          >
            <Image source={{ uri: store.image }} style={styles.storeImage} />
            <View style={styles.storeContent}>
              <View style={styles.storeHeader}>
                <Text style={styles.storeName}>{store.name}</Text>
                <View style={[styles.statusBadge, store.isOpen && styles.openBadge]}>
                  <Text style={[styles.statusText, store.isOpen && styles.openText]}>
                    {store.isOpen ? 'Abierto' : 'Cerrado'}
                  </Text>
                </View>
              </View>

              <Text style={styles.storeCategory}>{store.category}</Text>
              <Text style={styles.storeDescription} numberOfLines={2}>
                {store.description}
              </Text>

              <View style={styles.storeInfo}>
                <View style={styles.ratingContainer}>
                  <Star size={16} color="#FFD700" fill="#FFD700" />
                  <Text style={styles.ratingText}>{store.rating}</Text>
                  <Text style={styles.reviewsText}>({store.reviews})</Text>
                </View>

                <View style={styles.productsContainer}>
                  <Package size={16} color="#B8860B" />
                  <Text style={styles.productsText}>{store.productsCount} productos</Text>
                </View>
              </View>

              <View style={styles.locationContainer}>
                <MapPin size={14} color="#B8860B" />
                <Text style={styles.locationText}>{store.location}</Text>
              </View>

              <View style={styles.hoursContainer}>
                <Clock size={14} color="#8B4513" />
                <Text style={styles.hoursText}>{store.openHours}</Text>
                {store.delivery && (
                  <View style={styles.deliveryBadge}>
                    <Text style={styles.deliveryText}>Entrega</Text>
                  </View>
                )}
              </View>
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
    color: '#080808ff',
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
    color: '#5b5a58ff',
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