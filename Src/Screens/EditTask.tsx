import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  Modal,
  Pressable,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import CameraAndGallery from '../Components/CameraAndGallery';
import { Task } from '../Types/Task';
import { updateTaskFromAppwrite as updateTaskOnServer } from '../Service/Service';
import { updateTaskInDB, updateTaskSyncStatus } from '../DB/Database';
import { useTaskContext } from '../Context/TaskContext';
import RNFS from 'react-native-fs';
import NetInfo from '@react-native-community/netinfo'


const EditTask = () => {
  const navigation = useNavigation<any>();
  const { selectedTask, setSelectedTask } = useTaskContext();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDateTime, setDueDateTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reminder, setReminder] = useState(false);
  const [photo, setPhoto] = useState<{ uri: string } | null>(null);
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.task || '');
      setDescription(selectedTask.description || '');
      if (selectedTask.dueDateTime) {
        setDueDateTime(new Date(selectedTask.dueDateTime));
      }
      if (selectedTask.photoPath) {
        // Load previously saved photo
        setPhoto({ uri: 'file://' + selectedTask.photoPath });
      }
    }
  }, [selectedTask]);

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDateTime = dueDateTime ? new Date(dueDateTime) : new Date();
      newDateTime.setFullYear(selectedDate.getFullYear());
      newDateTime.setMonth(selectedDate.getMonth());
      newDateTime.setDate(selectedDate.getDate());
      setDueDateTime(newDateTime);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDateTime = dueDateTime ? new Date(dueDateTime) : new Date();
      newDateTime.setHours(selectedTime.getHours());
      newDateTime.setMinutes(selectedTime.getMinutes());
      setDueDateTime(newDateTime);
    }
  };

  const handleUpdate = async () => {
    if (!selectedTask) {
      return Alert.alert('Error', 'No task selected to update.');
    }
    if (!title.trim()) {
      return Alert.alert('Validation', 'Task title cannot be empty.');
    }

    let finalPhotoPath = selectedTask.photoPath || null;

    // If user picked a new photo, copy it to RNFS and update path
    if (photo && photo.uri !== finalPhotoPath) {
        console.log('New photo selected:', photo.uri);
      try {
        const fileName = `task_${Date.now()}.jpg`;
        const newPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
        await RNFS.copyFile(photo.uri, newPath);
        finalPhotoPath = newPath;
        console.log('Photo copied to:', newPath);
      } catch (err) {
        console.log('Failed to copy photo:', err);
      }
    }

    const updatedTask: Task = {
      ...selectedTask,
      task: title.trim(),
      description: description.trim(),
      dueDateTime: dueDateTime ? dueDateTime.toISOString() : null,
      photoPath: finalPhotoPath,
    };

    try {
      await updateTaskInDB(updatedTask);
      navigation.goBack();

      await updateTaskOnServer(selectedTask.id, {
        task: updatedTask.task,
        description: updatedTask.description,
        dueDateTime: updatedTask.dueDateTime,
        photoPath: updatedTask.photoPath
      });

      await updateTaskSyncStatus(selectedTask.id, true);
    } catch (error) {
      console.log(
        `Failed to sync task update for ${selectedTask.id}. It remains safely saved offline.`,
      );
    } finally {
      setSelectedTask(null);
    }
  };
  const handleCemeraModal = async () =>{
    const state =  await NetInfo.fetch();
    const isOnline = state.isConnected && state.isInternetReachable
    if(!isOnline){
      // setCameraModalVisible(false);
      Alert.alert(
        "You are likely offline!",
      "You cannot save a task with an image while offline."
      )
    }else{
      setCameraModalVisible(true);
    }
  }
  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Task Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter task title"
        placeholderTextColor="#aaa"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter task description"
        placeholderTextColor="#aaa"
        multiline
      />

      <Text style={styles.label}>Due Date & Time</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity
          style={styles.dateBtn}
          onPress={() => setShowDatePicker(true)}
        >
          <Icon
            name="calendar-outline"
            size={18}
            color="#333"
            style={{ marginRight: 6 }}
          />
          <Text>
            {dueDateTime ? dueDateTime.toDateString() : 'Select Date'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dateBtn}
          onPress={() => setShowTimePicker(true)}
        >
          <Icon
            name="time-outline"
            size={18}
            color="#333"
            style={{ marginRight: 6 }}
          />
          <Text>
            {dueDateTime
              ? dueDateTime.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Select Time'}
          </Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={dueDateTime || new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={dueDateTime || new Date()}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}

      <View style={styles.reminderRow}>
        <Text style={styles.label}>Reminder</Text>
        <Switch value={reminder} onValueChange={setReminder} />
      </View>

      <Text style={styles.label}>Photo</Text>
      <TouchableOpacity
        style={styles.photoBtn}
        onPress={handleCemeraModal}
      >
        <Icon
          name="image-outline"
          size={18}
          color="#fff"
          style={{ marginRight: 6 }}
        />
        <Text style={styles.photoBtnText}>Select Photo</Text>
      </TouchableOpacity>

      <CameraAndGallery
        isVisible={cameraModalVisible}
        onCreate={() => {}}
        onClose={() => setCameraModalVisible(false)}
        onImageSelected={uri => {
          setPhoto({ uri });
          setCameraModalVisible(false);
        }}
      />
      {photo && (
        <TouchableOpacity
          style={styles.thumbnailContainer}
          onPress={() => setShowImageModal(true)}
        >
          <Image source={{ uri: photo.uri }} style={styles.thumbnail} />
        </TouchableOpacity>
      )}

      <Modal visible={showImageModal} transparent={true}>
        <View style={styles.modalContainer}>
          <Pressable
            style={styles.modalClose}
            onPress={() => setShowImageModal(false)}
          >
            <Icon name="close" size={28} color="#fff" />
          </Pressable>
          <Image
            source={{ uri: photo?.uri }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </View>
      </Modal>

      <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
        <Icon
          name="save-outline"
          size={20}
          color="#fff"
          style={{ marginRight: 6 }}
        />
        <Text style={styles.saveBtnText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 16 },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 14,
    marginBottom: 6,
    color: '#555',
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
  textArea: { height: 100, textAlignVertical: 'top' },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  reminderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 8,
  },
  photoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6C63FF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  photoBtnText: { color: '#fff', fontSize: 15 },
  thumbnailContainer: { marginTop: 10, alignSelf: 'flex-start' },
  thumbnail: { width: 80, height: 80, borderRadius: 6 },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: { position: 'absolute', top: 40, right: 20, zIndex: 2 },
  fullImage: { width: '90%', height: '80%' },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 24,
    marginBottom: 40,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default EditTask;
