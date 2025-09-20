import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CreditCard, MapPin, Clock, Check } from 'lucide-react-native';
import { router } from 'expo-router';
import { useCart } from '@/contexts/CartContext';

export default function CheckoutScreen() {
  const { cartStores, totalAmount, clearCart } = useCart();
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [selectedAddress, setSelectedAddress] = useState('home');
  const [deliveryTime, setDeliveryTime] = useState('standard');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  const paymentMethods = [
    { id: 'card', name: 'Tarjeta de crédito/débito', icon: '💳' },
    { id: 'cash', name: 'Efectivo', icon: '💵' },
    { id: 'transfer', name: 'Transferencia bancaria', icon: '🏦' },
  ];

  const addresses = [
    { id: 'home', name: 'Casa', address: 'Av. Insurgentes 123, Col. Roma, CDMX' },
    { id: 'office', name: 'Oficina', address: 'Polanco 456, Col. Polanco, CDMX' },
  ];

  const deliveryOptions = [
    { id: 'standard', name: 'Entrega estándar', time: '2-3 días hábiles', price: 0 },
    { id: 'express', name: 'Entrega express', time: '24 horas', price: 99 },
    { id: 'pickup', name: 'Recoger en tienda', time: 'Disponible hoy', price: 0 },
  ];

  const deliveryFee = deliveryOptions.find(option => option.id === deliveryTime)?.price || 0;
  const finalTotal = totalAmount + deliveryFee;

  const handlePlaceOrder = () => {
    Alert.alert(
      'Orden confirmada',
      '¡Gracias por tu compra! Recibirás un email con los detalles de tu pedido.',
      [
        {
          text: 'OK',
          onPress: () => {
            clearCart();
            router.push('/');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#8B4513" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen del pedido</Text>
          {cartStores.map((store) => (
            <View key={store.storeId} style={styles.storeOrderSummary}>
              <Text style={styles.storeName}>{store.storeName}</Text>
              <Text style={styles.storeItemCount}>{store.items.length} productos</Text>
              <Text style={styles.storeTotal}>{formatPrice(store.total)}</Text>
            </View>
          ))}
        </View>

        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dirección de entrega</Text>
          {addresses.map((address) => (
            <TouchableOpacity
              key={address.id}
              style={[
                styles.optionCard,
                selectedAddress === address.id && styles.selectedOption,
              ]}
              onPress={() => setSelectedAddress(address.id)}
            >
              <View style={styles.optionContent}>
                <MapPin size={20} color="#8B4513" />
                <View style={styles.addressContent}>
                  <Text style={styles.addressName}>{address.name}</Text>
                  <Text style={styles.addressText}>{address.address}</Text>
                </View>
              </View>
              {selectedAddress === address.id && (
                <Check size={20} color="#4CAF50" />
              )}
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Agregar nueva dirección</Text>
          </TouchableOpacity>
        </View>

        {/* Delivery Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Opciones de entrega</Text>
          {deliveryOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                deliveryTime === option.id && styles.selectedOption,
              ]}
              onPress={() => setDeliveryTime(option.id)}
            >
              <View style={styles.optionContent}>
                <Clock size={20} color="#8B4513" />
                <View style={styles.deliveryContent}>
                  <Text style={styles.deliveryName}>{option.name}</Text>
                  <Text style={styles.deliveryTime}>{option.time}</Text>
                </View>
              </View>
              <View style={styles.deliveryPrice}>
                <Text style={styles.deliveryPriceText}>
                  {option.price === 0 ? 'Gratis' : formatPrice(option.price)}
                </Text>
                {deliveryTime === option.id && (
                  <Check size={20} color="#4CAF50" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Método de pago</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.optionCard,
                selectedPayment === method.id && styles.selectedOption,
              ]}
              onPress={() => setSelectedPayment(method.id)}
            >
              <View style={styles.optionContent}>
                <Text style={styles.paymentIcon}>{method.icon}</Text>
                <Text style={styles.paymentName}>{method.name}</Text>
              </View>
              {selectedPayment === method.id && (
                <Check size={20} color="#4CAF50" />
              )}
            </TouchableOpacity>
          ))}
          
          {selectedPayment === 'card' && (
            <View style={styles.cardForm}>
              <TextInput
                style={styles.cardInput}
                placeholder="Número de tarjeta"
                placeholderTextColor="#888"
                keyboardType="numeric"
              />
              <View style={styles.cardRow}>
                <TextInput
                  style={[styles.cardInput, { flex: 1, marginRight: 8 }]}
                  placeholder="MM/AA"
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                />
                <TextInput
                  style={[styles.cardInput, { flex: 1, marginLeft: 8 }]}
                  placeholder="CVV"
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                  secureTextEntry
                />
              </View>
              <TextInput
                style={styles.cardInput}
                placeholder="Nombre en la tarjeta"
                placeholderTextColor="#888"
              />
            </View>
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Order Summary Footer */}
      <View style={styles.summaryFooter}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal:</Text>
          <Text style={styles.summaryValue}>{formatPrice(totalAmount)}</Text>
        </View>
        
        {deliveryFee > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Envío:</Text>
            <Text style={styles.summaryValue}>{formatPrice(deliveryFee)}</Text>
          </View>
        )}
        
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>{formatPrice(finalTotal)}</Text>
        </View>
        
        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <CreditCard size={20} color="#FFFFFF" />
          <Text style={styles.placeOrderText}>Confirmar pedido</Text>
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
    backgroundColor: '#FFFFFF',
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
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 16,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 16,
  },
  storeOrderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
    flex: 1,
  },
  storeItemCount: {
    fontSize: 14,
    color: '#888888',
    marginHorizontal: 8,
  },
  storeTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B8860B',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedOption: {
    backgroundColor: '#F0F8FF',
    borderColor: '#4CAF50',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressContent: {
    marginLeft: 12,
    flex: 1,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 2,
  },
  addressText: {
    fontSize: 14,
    color: '#666666',
  },
  addButton: {
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginTop: 8,
  },
  addButtonText: {
    color: '#B8860B',
    fontWeight: '600',
    fontSize: 16,
  },
  deliveryContent: {
    marginLeft: 12,
    flex: 1,
  },
  deliveryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 2,
  },
  deliveryTime: {
    fontSize: 14,
    color: '#666666',
  },
  deliveryPrice: {
    alignItems: 'flex-end',
  },
  deliveryPriceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B8860B',
    marginBottom: 4,
  },
  paymentIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  paymentName: {
    fontSize: 16,
    color: '#8B4513',
    fontWeight: '500',
  },
  cardForm: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  cardInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#8B4513',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D2B48C',
  },
  cardRow: {
    flexDirection: 'row',
  },
  summaryFooter: {
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#8B4513',
  },
  summaryValue: {
    fontSize: 16,
    color: '#8B4513',
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#D2B48C',
    paddingTop: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  placeOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B4513',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  placeOrderText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 20,
  },
});