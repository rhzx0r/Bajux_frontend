import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Star, MapPin, Clock, Phone, Plus, ShoppingCart } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useCart } from '@/contexts/CartContext';

export default function StoreDetailScreen() {
  const { id } = useLocalSearchParams();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Mock store data - in a real app, fetch by ID
  const store = {
    id: '1',
    name: 'Ferretería El Martillo',
    category: 'Ferretería',
    description: 'Todo lo que necesitas para construcción y reparaciones del hogar. Más de 20 años de experiencia sirviendo a la comunidad.',
    rating: 4.7,
    reviews: 245,
    image: 'https://images.pexels.com/photos/1094767/pexels-photo-1094767.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Av. Insurgentes 123, CDMX',
    phone: '+52 55 1234 5678',
    isOpen: true,
    openHours: '8:00 AM - 8:00 PM',
    delivery: true,
  };

  const categories = ['Todos', 'Herramientas', 'Pinturas', 'Plomería', 'Electricidad', 'Ferretería'];

  const products = [
    {
      id: '1',
      name: 'Taladro Inalámbrico 20V',
      price: 1299,
      image: 'https://images.pexels.com/photos/209235/pexels-photo-209235.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Herramientas',
      rating: 4.8,
      stock: 12,
    },
    {
      id: '2',
      name: 'Pintura Blanca 4L',
      price: 389,
      image: 'https://images.pexels.com/photos/1444416/pexels-photo-1444416.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Pinturas',
      rating: 4.5,
      stock: 25,
    },
    {
      id: '3',
      name: 'Llave Inglesa 12"',
      price: 189,
      image: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Herramientas',
      rating: 4.6,
      stock: 8,
    },
    {
      id: '4',
      name: 'Tubo PVC 4"',
      price: 89,
      image: 'https://images.pexels.com/photos/8583047/pexels-photo-8583047.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Plomería',
      rating: 4.3,
      stock: 30,
    },
  ];

  const filteredProducts = products.filter(product => 
    selectedCategory === 'Todos' || product.category === selectedCategory
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      storeId: store.id,
      storeName: store.name,
      image: product.image,
    });
    Alert.alert('Producto agregado', `${product.name} se agregó al carrito.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#8B4513" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tienda</Text>
        <TouchableOpacity onPress={() => router.push('/cart')} style={styles.cartButton}>
          <ShoppingCart size={24} color="#8B4513" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Store Hero */}
        <View style={styles.storeHero}>
          <Image source={{ uri: store.image }} style={styles.storeImage} />
          <View style={styles.storeOverlay}>
            <View style={[styles.statusBadge, store.isOpen && styles.openBadge]}>
              <Text style={[styles.statusText, store.isOpen && styles.openText]}>
                {store.isOpen ? 'Abierto' : 'Cerrado'}
              </Text>
            </View>
          </View>
        </View>

        {/* Store Info */}
        <View style={styles.storeInfo}>
          <Text style={styles.storeName}>{store.name}</Text>
          <Text style={styles.storeCategory}>{store.category}</Text>
          
          <View style={styles.ratingContainer}>
            <Star size={20} color="#FFD700" fill="#FFD700" />
            <Text style={styles.ratingText}>{store.rating}</Text>
            <Text style={styles.reviewsText}>({store.reviews} reseñas)</Text>
          </View>
          
          <Text style={styles.storeDescription}>{store.description}</Text>
          
          <View style={styles.contactInfo}>
            <View style={styles.contactRow}>
              <MapPin size={16} color="#B8860B" />
              <Text style={styles.contactText}>{store.location}</Text>
            </View>
            <View style={styles.contactRow}>
              <Clock size={16} color="#B8860B" />
              <Text style={styles.contactText}>{store.openHours}</Text>
            </View>
            <TouchableOpacity style={styles.contactRow}>
              <Phone size={16} color="#B8860B" />
              <Text style={styles.contactText}>{store.phone}</Text>
            </TouchableOpacity>
          </View>
          
          {store.delivery && (
            <View style={styles.deliveryBanner}>
              <Text style={styles.deliveryText}>✅ Entrega disponible</Text>
            </View>
          )}
        </View>

        {/* Product Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Productos</Text>
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
        </View>

        {/* Products Grid */}
        <View style={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <Image source={{ uri: product.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                <View style={styles.productRating}>
                  <Star size={12} color="#FFD700" fill="#FFD700" />
                  <Text style={styles.productRatingText}>{product.rating}</Text>
                </View>
                <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
                <Text style={styles.productStock}>
                  {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                </Text>
                <TouchableOpacity
                  style={[styles.addButton, product.stock === 0 && styles.disabledButton]}
                  onPress={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  <Plus size={16} color="#FFFFFF" />
                  <Text style={styles.addButtonText}>Agregar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D2B48C',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  cartButton: {
    padding: 4,
  },
  storeHero: {
    position: 'relative',
  },
  storeImage: {
    width: '100%',
    height: 200,
  },
  storeOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  statusBadge: {
    backgroundColor: 'rgba(255, 243, 224, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  openBadge: {
    backgroundColor: 'rgba(232, 245, 232, 0.9)',
  },
  statusText: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '600',
  },
  openText: {
    color: '#4CAF50',
  },
  storeInfo: {
    padding: 20,
  },
  storeName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 4,
  },
  storeCategory: {
    fontSize: 18,
    color: '#B8860B',
    fontWeight: '600',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 16,
    color: '#8B4513',
    fontWeight: '600',
    marginLeft: 6,
  },
  reviewsText: {
    fontSize: 14,
    color: '#888888',
    marginLeft: 4,
  },
  storeDescription: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
    marginBottom: 16,
  },
  contactInfo: {
    marginBottom: 16,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#8B4513',
    marginLeft: 8,
  },
  deliveryBanner: {
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  deliveryText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  categoriesSection: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8B4513',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  categoriesScrollView: {
    maxHeight: 50,
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
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
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
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#F5F5F5',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 6,
    minHeight: 34,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  productRatingText: {
    fontSize: 12,
    color: '#8B4513',
    marginLeft: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B8860B',
    marginBottom: 4,
  },
  productStock: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B4513',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});