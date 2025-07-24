// components/CategoryPopup.tsx
import React, { useState } from 'react';
import {
    // Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    } from 'react-native';
import Modal from 'react-native-modal'; 
type Props = {
    visible: boolean;
    onClose: () => void;
    onSelect: (category: string) => void;
    categories: string[];
    };

const CategoryPopup = ({ visible, onClose, onSelect, categories }: Props) => {
    const [creating, setCreating] = useState(false);
    const [newCategory, setNewCategory] = useState('');

    const handleCreate = () => {
        if (newCategory.trim()) {
        onSelect(newCategory.trim());
        setNewCategory('');
        setCreating(false);
        onClose();
        }
    };
    const handleSelect = (cat: string) => {
        if (cat === '+ Create') {
        setCreating(true);
        } else {
        onSelect(cat);
        onClose();
        }
    };
    return (
        <Modal 
        isVisible={visible} 
        // transparent animationType="fade"
        onBackdropPress={onClose}
        backdropOpacity={0.5}
        >
        <View style={styles.overlay}>
            <View style={styles.popup}>
            {creating ? (
                <>
                <Text style={styles.title}>Create New Category</Text>
                <TextInput
                    value={newCategory}
                    onChangeText={setNewCategory}
                    placeholder="Enter category name"
                    style={styles.input}
                />
                <TouchableOpacity style={styles.button} onPress={handleCreate}>
                    <Text style={styles.buttonText}>Create</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setCreating(false)}>
                    <Text style={styles.CancelText}>Cancel</Text>
                </TouchableOpacity>
                </>
            ) : (
                <>
                <Text style={styles.title}>Choose a Category</Text>
                <FlatList
                    data={[...categories, '+ Create']}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                    <TouchableOpacity style={styles.categoryItem} onPress={() => handleSelect(item)}>
                        <Text>{item}</Text>
                    </TouchableOpacity>
                    )}
                />
                <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                    <Text style={styles.CancelText}>Cancel</Text>
                </TouchableOpacity>
                </>
            )}
            </View>
        </View>
        </Modal>
    );
};

export default CategoryPopup;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    popup: {
        margin: 20,
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 15,
        fontSize: 18,
    },
    input: {
        borderBottomWidth: 1,
        marginBottom: 15,
        padding: 5,
    },
    button: {
        backgroundColor: '#3b82f6',
        padding: 10,
        alignItems: 'center',
        borderRadius: 6,
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    cancelBtn: {
        padding: 10,
        alignItems: 'center',
    },
    CancelText: {
        color: 'gray',
    },
    categoryItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
});
