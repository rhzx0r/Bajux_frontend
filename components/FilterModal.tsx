import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { X, Check } from 'lucide-react-native';

interface CategoryItem {
    id: number;
    nombre: string | null;
}

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    categories: CategoryItem[];
    selectedId: number | null;
    onApply: (id: number | null) => void;
}

export function FilterModal({ visible, onClose, categories, selectedId, onApply }: FilterModalProps) {
    const [tempSelected, setTempSelected] = React.useState<number | null>(selectedId);

    React.useEffect(() => {
        setTempSelected(selectedId);
    }, [visible, selectedId]);

    const handleApply = () => {
        onApply(tempSelected);
        onClose();
    };

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Filtrar por Categoría</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X size={24} color="#8B4513" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.list}>
                        <TouchableOpacity
                            style={[styles.item, tempSelected === null && styles.itemSelected]}
                            onPress={() => setTempSelected(null)}
                        >
                            <Text style={[styles.itemText, tempSelected === null && styles.itemTextSelected]}>
                                Todas
                            </Text>
                            {tempSelected === null && <Check size={20} color="#8B4513" />}
                        </TouchableOpacity>

                        {categories.map(cat => (
                            <TouchableOpacity
                                key={cat.id}
                                style={[styles.item, tempSelected === cat.id && styles.itemSelected]}
                                onPress={() => setTempSelected(cat.id)}
                            >
                                <Text style={[styles.itemText, tempSelected === cat.id && styles.itemTextSelected]}>
                                    {cat.nombre}
                                </Text>
                                {tempSelected === cat.id && <Check size={20} color="#8B4513" />}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                            <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    content: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#8B4513',
    },
    list: {
        padding: 20,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f9f9f9',
    },
    itemSelected: {
        backgroundColor: '#FFF8E1',
        marginHorizontal: -10,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    itemText: {
        fontSize: 16,
        color: '#555',
    },
    itemTextSelected: {
        color: '#8B4513',
        fontWeight: '600',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    applyButton: {
        backgroundColor: '#8B4513',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    applyButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
