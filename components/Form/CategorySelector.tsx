import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Search, X, Plus } from 'lucide-react-native';
import { comercioService } from '../../lib/comercio';
import { CategoriaOferta } from '../../types';

interface CategorySelectorProps {
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
}

export function CategorySelector({
  selectedIds,
  onSelectionChange,
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<CategoriaOferta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await comercioService.getCategoriasOferta();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (id: number) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((catId) => catId !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.nombre?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCategories = categories.filter((cat) => selectedIds.includes(cat.id));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Categorías</Text>

      {/* Selected Chips */}
      <View style={styles.chipsContainer}>
        {selectedCategories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={styles.chip}
            onPress={() => toggleCategory(cat.id)}
          >
            <Text style={styles.chipText}>{cat.nombre}</Text>
            <X size={14} color="#FFFFFF" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#B8860B" />
        <TextInput
          placeholder="Buscar categorías..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      {/* Results List */}
      {loading ? (
        <ActivityIndicator size="small" color="#8B4513" />
      ) : (
        <ScrollView style={styles.listContainer} nestedScrollEnabled>
          {filteredCategories.slice(0, 10).map((cat) => {
            const isSelected = selectedIds.includes(cat.id);
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.listItem, isSelected && styles.listItemSelected]}
                onPress={() => toggleCategory(cat.id)}
              >
                <Text style={[styles.listItemText, isSelected && styles.listItemTextSelected]}>
                    {cat.nombre}
                </Text>
                {isSelected ? (
                    <X size={16} color="#8B4513" />
                ) : (
                    <Plus size={16} color="#B8860B" />
                )}
              </TouchableOpacity>
            );
          })}
          {filteredCategories.length === 0 && (
            <Text style={styles.noResults}>No se encontraron categorías</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#8B4513',
    fontWeight: '600',
    marginBottom: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    backgroundColor: '#8B4513',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  chipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D2B48C',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    color: '#333',
    fontSize: 14,
  },
  listContainer: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  listItemSelected: {
    backgroundColor: '#FFF8E1',
  },
  listItemText: {
    fontSize: 14,
    color: '#555',
  },
  listItemTextSelected: {
    color: '#8B4513',
    fontWeight: '600',
  },
  noResults: {
    padding: 12,
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
  },
});
