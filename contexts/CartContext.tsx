import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  storeId: string;
  storeName: string;
  image: string;
}

export interface CartStore {
  storeId: string;
  storeName: string;
  items: CartItem[];
  total: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartStores: CartStore[];
  totalAmount: number;
  totalItems: number;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const cartStores = cartItems.reduce((stores: CartStore[], item) => {
    const existingStore = stores.find(store => store.storeId === item.storeId);
    
    if (existingStore) {
      existingStore.items.push(item);
      existingStore.total += item.price * item.quantity;
    } else {
      stores.push({
        storeId: item.storeId,
        storeName: item.storeName,
        items: [item],
        total: item.price * item.quantity,
      });
    }
    
    return stores;
  }, []);

  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
    setCartItems(current => {
      const existingItem = current.find(item => item.id === newItem.id);
      
      if (existingItem) {
        return current.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...current, { ...newItem, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(current => current.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(current =>
      current.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartStores,
        totalAmount,
        totalItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}