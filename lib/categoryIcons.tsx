import React from 'react';
import {
  Utensils,
  Smartphone,
  Shirt,
  Sparkles,
  Home,
  Dumbbell,
  Book,
  Car,
  ShoppingBag,
  Package,
  Wrench,
  Coffee,
  Monitor,
  Heart
} from 'lucide-react-native';

/**
 * Returns a Lucide icon component based on the category name or keywords.
 * @param categoryName The name of the category
 * @param size The size of the icon (default: 24)
 * @param color The color of the icon (default: #8B4513)
 */
export const getCategoryIcon = (categoryName: string, size: number = 24, color: string = '#8B4513') => {
  const normalizedName = categoryName.toLowerCase();

  // Mapping logic based on keywords
  if (normalizedName.includes('restaurante') || normalizedName.includes('comida') || normalizedName.includes('bebida')) {
    return <Utensils size={size} color={color} />;
  }
  if (normalizedName.includes('electrónica') || normalizedName.includes('tecnolog') || normalizedName.includes('celular') || normalizedName.includes('comput')) {
    return <Smartphone size={size} color={color} />;
  }
  if (normalizedName.includes('ropa') || normalizedName.includes('moda') || normalizedName.includes('accesorio') || normalizedName.includes('vestir')) {
    return <Shirt size={size} color={color} />;
  }
  if (normalizedName.includes('salud') || normalizedName.includes('belleza') || normalizedName.includes('cuidado')) {
    return <Sparkles size={size} color={color} />;
  }
  if (normalizedName.includes('hogar') || normalizedName.includes('jardín') || normalizedName.includes('mueble') || normalizedName.includes('decoracion')) {
    return <Home size={size} color={color} />;
  }
  if (normalizedName.includes('deporte') || normalizedName.includes('fitness') || normalizedName.includes('gym') || normalizedName.includes('ejercicio')) {
    return <Dumbbell size={size} color={color} />;
  }
  if (normalizedName.includes('libro') || normalizedName.includes('papelería') || normalizedName.includes('lectura') || normalizedName.includes('oficina')) {
    return <Book size={size} color={color} />;
  }
  if (normalizedName.includes('automotriz') || normalizedName.includes('vehículo') || normalizedName.includes('carro') || normalizedName.includes('taller')) {
    return <Car size={size} color={color} />;
  }

  // Fallback icon
  return <Package size={size} color={color} />;
};
