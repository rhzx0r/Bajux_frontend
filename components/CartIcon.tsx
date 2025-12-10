import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShoppingCart } from 'lucide-react-native';
import { useCart } from '@/contexts/CartContext';

interface CartIconProps {
  size?: number;
  color?: string;
}

export const CartIcon: React.FC<CartIconProps> = ({ size = 24, color = '#8B4513' }) => {
  const { totalItems } = useCart();

  return (
    <View style={styles.container}>
      <ShoppingCart size={size} color={color} />
      {totalItems > 0 && (
        <View style={styles.badge} testID="cart-badge-container">
          <Text style={styles.badgeText} testID="cart-badge-text">
            {totalItems > 9 ? '9+' : totalItems}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -8,
    backgroundColor: '#FF4500', // Or a color that fits the theme, maybe red
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
