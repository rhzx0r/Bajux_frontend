import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Star, MapPin, Clock, Phone, Plus, ShoppingCart, Settings } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useCart } from '@/contexts/CartContext';
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

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
    Alert.alert('Producto agregado', `${oferta.nombre} se agregó al carrito.`);
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#8B4513" />
        </TouchableOpacity>
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
            <ShoppingCart size={24} color="#8B4513" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Store Hero */}
        <View style={styles.storeHero}>
          <Image
            source={{
              uri: comercio.imagen_url || 'https://images.pexels.com/photos/1094767/pexels-photo-1094767.jpeg?auto=compress&cs=tinysrgb&w=400'
            }}
            style={styles.storeImage}
          />
        </View>

        {/* Store Info */}
        <View style={styles.storeInfo}>
          <Text style={styles.storeName}>{comercio.nombre}</Text>
          
          {/* Note: Reviews and Ratings are not yet in the DB fetch, keeping placeholders or hiding them?
              The schema has resena_comercio, but I didn't fetch it. I'll hide specific ratings for now or use placeholders if preferred.
              User asked for "datos del comercio exacto". I will show what I have. */}
          
          <Text style={styles.storeDescription}>{comercio.descripcion}</Text>
          
          <View style={styles.contactInfo}>
            <View style={styles.contactRow}>
              <MapPin size={16} color="#B8860B" />
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
  storeHero: {
    position: 'relative',
  },
  storeImage: {
    width: '100%',
    height: 200,
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
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    paddingBottom: 20,
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
