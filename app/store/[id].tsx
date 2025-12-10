<<<<<<< HEAD
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
=======
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Star, MapPin, Clock, Phone, Plus, ShoppingCart, Settings } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { toast } from 'sonner-native';
import { useCart } from '@/contexts/CartContext';
import { CartIcon } from '../../components/CartIcon';
import { useAuth } from '../../providers/AuthProvider';
import { comercioService } from '../../lib/comercio';
import { Comercio, Oferta } from '../../types';
import { CreateOfertaForm } from '../../components/Form/CreateOfertaForm';
import { EditOfertaForm } from '../../components/Form/EditOfertaForm';

export default function StoreDetailScreen() {
  const { id } = useLocalSearchParams();
  const { session } = useAuth();
  const { addToCart } = useCart();
  const [comercio, setComercio] = useState<Comercio | null>(null);
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateOferta, setShowCreateOferta] = useState(false);
  const [editingOferta, setEditingOferta] = useState<Oferta | null>(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      if (!id) return;
      const comercioId = parseInt(Array.isArray(id) ? id[0] : id);

      // Fetch commerce first to check ownership
      const comercioData = await comercioService.getComercioById(comercioId);

      // Determine if we should fetch unavailable items (only if owner)
      const isOwner = session?.user?.id === comercioData?.propietario_id;
      const ofertasData = await comercioService.getOfertasByComercio(comercioId, isOwner);

      setComercio(comercioData);
      setOfertas(ofertasData);
    } catch (error) {
      console.error('Error loading store data:', error);
      Alert.alert('Error', 'No se pudo cargar la información del comercio');
    } finally {
      setLoading(false);
    }
  };

  const handleOfertaCreated = () => {
    setShowCreateOferta(false);
    loadData(); // Refresh data
  };

  const handleOfertaUpdated = () => {
    setEditingOferta(null);
    loadData(); // Refresh data
  };

  const isOwner = session?.user?.id === comercio?.propietario_id;
>>>>>>> temp_feature

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

<<<<<<< HEAD
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

=======
  const handleAddToCart = (oferta: Oferta) => {
    if (!comercio) return;

    addToCart({
      id: oferta.id.toString(),
      name: oferta.nombre || 'Producto sin nombre',
      price: oferta.precio || 0,
      storeId: comercio.id.toString(),
      storeName: comercio.nombre || 'Comercio',
      image: oferta.imagen_url || 'https://images.pexels.com/photos/209235/pexels-photo-209235.jpeg?auto=compress&cs=tinysrgb&w=400',
    });

    toast.success('Producto agregado', {
      description: `${oferta.nombre} se agregó al carrito.`,
      duration: 3000,
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B4513" />
        <Text style={styles.loadingText}>Cargando tienda...</Text>
      </SafeAreaView>
    );
  }

  if (!comercio) {
    return (
      <SafeAreaView style={styles.container}>
         <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color="#8B4513" />
            </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>No se encontró el comercio.</Text>
        </View>
      </SafeAreaView>
    );
  }

>>>>>>> temp_feature
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#8B4513" />
        </TouchableOpacity>
<<<<<<< HEAD
        <Text style={styles.headerTitle}>Tienda</Text>
        <TouchableOpacity onPress={() => router.push('/cart')} style={styles.cartButton}>
          <ShoppingCart size={24} color="#8B4513" />
        </TouchableOpacity>
=======
        <Text style={styles.headerTitle}>{comercio.nombre}</Text>
        <View style={styles.headerRight}>
          {isOwner && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowCreateOferta(true)}
            >
              <Plus size={24} color="#8B4513" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => router.push('/cart')} style={styles.actionButton}>
            <CartIcon size={24} color="#8B4513" />
          </TouchableOpacity>
        </View>
>>>>>>> temp_feature
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Store Hero */}
        <View style={styles.storeHero}>
<<<<<<< HEAD
          <Image source={{ uri: store.image }} style={styles.storeImage} />
          <View style={styles.storeOverlay}>
            <View style={[styles.statusBadge, store.isOpen && styles.openBadge]}>
              <Text style={[styles.statusText, store.isOpen && styles.openText]}>
                {store.isOpen ? 'Abierto' : 'Cerrado'}
              </Text>
            </View>
          </View>
=======
          <Image
            source={{
              uri: comercio.imagen_url || 'https://images.pexels.com/photos/1094767/pexels-photo-1094767.jpeg?auto=compress&cs=tinysrgb&w=400'
            }}
            style={styles.storeImage}
          />
>>>>>>> temp_feature
        </View>

        {/* Store Info */}
        <View style={styles.storeInfo}>
<<<<<<< HEAD
          <Text style={styles.storeName}>{store.name}</Text>
          <Text style={styles.storeCategory}>{store.category}</Text>

          <View style={styles.ratingContainer}>
            <Star size={20} color="#FFD700" fill="#FFD700" />
            <Text style={styles.ratingText}>{store.rating}</Text>
            <Text style={styles.reviewsText}>({store.reviews} reseñas)</Text>
          </View>

          <Text style={styles.storeDescription}>{store.description}</Text>
=======
          <Text style={styles.storeName}>{comercio.nombre}</Text>
          
          {/* Note: Reviews and Ratings are not yet in the DB fetch, keeping placeholders or hiding them?
              The schema has resena_comercio, but I didn't fetch it. I'll hide specific ratings for now or use placeholders if preferred.
              User asked for "datos del comercio exacto". I will show what I have. */}
          
          <Text style={styles.storeDescription}>{comercio.descripcion}</Text>
>>>>>>> temp_feature
          
          <View style={styles.contactInfo}>
            <View style={styles.contactRow}>
              <MapPin size={16} color="#B8860B" />
<<<<<<< HEAD
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
=======
              <Text style={styles.contactText}>{comercio.ubicacion || 'Sin ubicación registrada'}</Text>
            </View>
            {/* RFC is available, maybe show it for merchant view? But this is public view too. */}
             <View style={styles.contactRow}>
              <Text style={styles.contactText}>RFC: {comercio.rfc || 'No disponible'}</Text>
            </View>
          </View>
        </View>

        {/* Owner Actions Section */}
        {isOwner && (
          <View style={styles.ownerActions}>
            <Text style={styles.sectionTitle}>Gestión del Comercio</Text>
            <TouchableOpacity
              style={styles.addOfertaButton}
              onPress={() => setShowCreateOferta(true)}
            >
              <View style={styles.addIconContainer}>
                <Plus size={24} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.addOfertaTitle}>Agregar Producto o Servicio</Text>
                <Text style={styles.addOfertaSubtitle}>Publica una nueva oferta para tus clientes</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Products Grid */}
        <View style={styles.productsGrid}>
          {ofertas.length > 0 ? (
            ofertas.map((oferta) => (
              <TouchableOpacity
                key={oferta.id}
                style={styles.productCard}
                onPress={() => isOwner ? setEditingOferta(oferta) : null}
                activeOpacity={isOwner ? 0.7 : 1}
              >
                <Image
                  source={{
                    uri: oferta.imagen_url || 'https://images.pexels.com/photos/209235/pexels-photo-209235.jpeg?auto=compress&cs=tinysrgb&w=400'
                  }}
                  style={styles.productImage}
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>{oferta.nombre}</Text>
                  <Text style={styles.productPrice}>{formatPrice(oferta.precio || 0)}</Text>

                  {oferta.tipo === 'producto' && (
                    <Text style={styles.productStock}>
                      {(oferta.stock || 0) > 0 ? `${oferta.stock} disponibles` : 'Agotado'}
                    </Text>
                  )}

                  {!isOwner && (
                    <TouchableOpacity
                      style={[styles.addButton, (oferta.stock || 0) === 0 && oferta.tipo === 'producto' && styles.disabledButton]}
                      onPress={() => handleAddToCart(oferta)}
                      disabled={oferta.tipo === 'producto' && (oferta.stock || 0) === 0}
                    >
                      <Plus size={16} color="#FFFFFF" />
                      <Text style={styles.addButtonText}>Agregar</Text>
                    </TouchableOpacity>
                  )}

                  {isOwner && (
                     <Text style={styles.editHintText}>
                       {oferta.disponible ? 'Toca para editar' : 'No disponible (Toca para editar)'}
                     </Text>
                  )}
                </View>
                {!oferta.disponible && isOwner && (
                  <View style={styles.unavailableOverlay} />
                )}
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noProductsContainer}>
              <Text style={styles.noProductsText}>No hay ofertas disponibles en este momento.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal for creating offer */}
      {showCreateOferta && comercio && (
        <CreateOfertaForm
          comercioId={comercio.id}
          onSuccess={handleOfertaCreated}
          onCancel={() => setShowCreateOferta(false)}
        />
      )}

      {/* Modal for editing offer */}
      {editingOferta && (
        <EditOfertaForm
          oferta={editingOferta}
          onSuccess={handleOfertaUpdated}
          onCancel={() => setEditingOferta(null)}
        />
      )}
>>>>>>> temp_feature
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFEFE',
  },
<<<<<<< HEAD
=======
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEFEFE',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#8B4513',
  },
  errorText: {
    fontSize: 18,
    color: '#FF6B6B',
  },
>>>>>>> temp_feature
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
<<<<<<< HEAD
  cartButton: {
=======
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
>>>>>>> temp_feature
    padding: 4,
  },
  storeHero: {
    position: 'relative',
  },
  storeImage: {
    width: '100%',
    height: 200,
  },
<<<<<<< HEAD
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
=======
>>>>>>> temp_feature
  storeInfo: {
    padding: 20,
  },
  storeName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 4,
  },
<<<<<<< HEAD
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
=======
>>>>>>> temp_feature
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
<<<<<<< HEAD
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
=======
  // Owner styles
  ownerActions: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 12,
  },
  addOfertaButton: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD54F',
    borderStyle: 'dashed',
  },
  addIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFB300',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  addOfertaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 2,
  },
  addOfertaSubtitle: {
    fontSize: 12,
    color: '#B8860B',
>>>>>>> temp_feature
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
<<<<<<< HEAD
=======
    paddingBottom: 20,
>>>>>>> temp_feature
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
<<<<<<< HEAD
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
=======
>>>>>>> temp_feature
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
<<<<<<< HEAD
=======
  editHintText: {
    fontSize: 12,
    color: '#B8860B',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  unavailableOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    zIndex: -1,
  },
>>>>>>> temp_feature
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
<<<<<<< HEAD
});
=======
  noProductsContainer: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
  },
  noProductsText: {
    color: '#888',
    fontSize: 16,
  }
});
>>>>>>> temp_feature
