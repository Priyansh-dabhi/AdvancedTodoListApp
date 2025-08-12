import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  ScrollView
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/Ionicons';

const EditTask = () => {
  const [title, setTitle] = useState('My Current Task');
  const [description, setDescription] = useState('Details about the task...');
  const [attachment, setAttachment] = useState<any>(null);

  const pickAttachment = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], 
      });
      setAttachment(res[0]);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.error('DocumentPicker Error:', err);
      }
    }
  };

  const saveTask = () => {
    console.log('Updated task:', { title, description, attachment });
    // Later: update in SQLite & sync with Appwrite
  };

  return (
    <ScrollView style={styles.container}>
      {/* Title */}
      <Text style={styles.label}>Task Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter task title"
      />

      {/* Description */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter task description"
        multiline
      />

      {/* Attachment */}
      <Text style={styles.label}>Attachment</Text>
      <TouchableOpacity style={styles.attachmentBtn} onPress={pickAttachment}>
        <Icon name="attach" size={20} color="#fff" />
        <Text style={styles.attachmentBtnText}>Choose File</Text>
      </TouchableOpacity>

      {attachment && (
        <View style={styles.attachmentPreview}>
          {attachment.type?.startsWith('image/') ? (
            <Image
              source={{ uri: attachment.uri }}
              style={styles.attachmentImage}
            />
          ) : (
            <Text style={styles.attachmentText}>{attachment.name}</Text>
          )}
        </View>
      )}

      {/* Save Button */}
      <TouchableOpacity style={styles.saveBtn} onPress={saveTask}>
        <Text style={styles.saveBtnText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditTask;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 6,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  attachmentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6c63ff',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    width: 140,
  },
  attachmentBtnText: {
    color: '#fff',
    fontSize: 15,
    marginLeft: 6,
  },
  attachmentPreview: {
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  attachmentImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  attachmentText: {
    fontSize: 14,
    color: '#555',
    paddingVertical: 6,
  },
  saveBtn: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});
