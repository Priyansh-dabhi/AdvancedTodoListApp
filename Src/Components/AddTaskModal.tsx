/*  1. Task Title
    2. day Month date, year 
    3. category*/
// components/AddTaskModal.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import CameraAndGallery from './CameraAndGallery';
import { Task } from '../Types/Task';
import Routes from '../Routes/Routes';
// DB
import { insertOrUpdateTask } from '../DB/Database';
// Context
import { useAuth } from '../Context/AppwriteContext';
import { addTask } from '../Service/Service';
// RNFS
import RNFS from 'react-native-fs';
import NetInfo from "@react-native-community/netinfo";

// custom icon component
const CustomIcon = ({ name, size, color }: { name: string; size: number; color: string }) => (
  <Text style={{ fontSize: size, color, fontFamily: 'monospace' }}>
    {name.includes('calendar')
      ? '📅'
      : name.includes('time')
      ? '🕒'
      : name.includes('camera')
      ? '📷'
      : '📍'}
  </Text>
);

type Props = {
  isVisible: boolean;
  onClose: () => void;
  onCreate: () => void;
};

const AddTaskModal = ({ isVisible, onClose, onCreate }: Props) => {
  const { user } = useAuth();
  const navigation = useNavigation<any>();

  const [navigateToMap, setNavigateToMap] = useState(false);
  const [task, setTask] = useState('');
  const [takePhoto, setTakePhoto] = useState('No Photo');
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectLocation, setSelectLocation] = useState('Select Location');
  const [localPhotoPath, setLocalPhotoPath] = useState<string | null>(null);

  useEffect(() => {
    if (navigateToMap) {
      navigation.navigate(Routes.Map);
      setNavigateToMap(false);
    }
  }, [navigateToMap]);

  const handleCreate = async () => {
    if (!user) {
      return Alert.alert('Error', 'You must be logged in to create a task.');
    }
    if (task.trim() === '') {
      return Alert.alert('Validation', 'Task title cannot be empty.');
    }

    let dueDateTimeISO = '';
    if (selectedDate) {
      const combinedDateTime = new Date(selectedDate);
      if (selectedTime) {
        combinedDateTime.setHours(selectedTime.getHours());
        combinedDateTime.setMinutes(selectedTime.getMinutes());
      }
      dueDateTimeISO = combinedDateTime.toISOString();
    }

    const formattedTimestamp = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date());
    
    const sortableTimestamp = new Date().toISOString();

    // checking network status
    const state =  await NetInfo.fetch();
    const isOnline = state.isConnected && state.isInternetReachable

    try {
      if(isOnline){
        const appwriteDocument = await addTask({
        task: task.trim(),
        description: '',
        dueDateTime: dueDateTimeISO,
        completed: false,
        timestamp: sortableTimestamp,
        userId: user.$id,
        photoId: 'temp',
        photoPath: localPhotoPath ,
      });

      if (!appwriteDocument?.$id) throw new Error('Failed to create task');

      const taskForSQLite: Task = {
        id: appwriteDocument.$id,
        task: appwriteDocument.task,
        timestamp: appwriteDocument.timestamp,
        description: appwriteDocument.description,
        dueDateTime: appwriteDocument.dueDateTime,
        completed: appwriteDocument.completed,
        isSynced: true,
        userId: user.$id,
        photoId: 'temp',
        photoPath: localPhotoPath ?? null,
      };
      insertOrUpdateTask(taskForSQLite);
      } else {
      
        const offlineId = `local-${Date.now()}`;

        const offlineTask: Task = {
          id: offlineId,
          task: task.trim(),
          timestamp: sortableTimestamp,
          description: '',
          dueDateTime: dueDateTimeISO,
          completed: false,
          isSynced: false, // 🚨 mark as unsynced
          userId: user.$id,
          photoId: 'temp',
          photoPath: localPhotoPath ?? null,
        };

        insertOrUpdateTask(offlineTask);
        console.log('📴 Task saved offline:', offlineTask);
      }

      onCreate();
      resetForm();
    } catch (err) {
      console.error('Error creating task:', err);
      Alert.alert('Error', 'Could not save the task.');
    }
  };

  const resetForm = () => {
    setTask('');
    setTakePhoto('No Photo');
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectLocation('Select Location');
    setLocalPhotoPath(null);
    onClose();
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) setSelectedDate(date);
  };

  const handleTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(false);
    if (time) setSelectedTime(time);
  };

  const onImageSelected = async (imageUri: string) => {
    setCameraModalVisible(false);
    try {
      const fileName = `${Date.now()}-${imageUri.split('/').pop()}`;
      const newPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      await RNFS.copyFile(imageUri, newPath);
      setTakePhoto('Photo Selected');
      setLocalPhotoPath(newPath);
    } catch {
      Alert.alert('Error', 'Could not save the photo.');
    }
  };

  const handleCemeraModal = async () =>{
    const state =  await NetInfo.fetch();
    const isOnline = state.isConnected && state.isInternetReachable
    if(!isOnline){
      // setCameraModalVisible(false);
      Alert.alert("You are likely offline!")
    }else{
      setCameraModalVisible(true);
    }
  }
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      backdropOpacity={0.4}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={styles.modal}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Create New Task</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter a task..."
          value={task}
          onChangeText={setTask}
        />

        <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
          <Text style={styles.createBtnText}>+ Create Task</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCemeraModal} style={styles.row}>
          <CustomIcon name="camera-outline" size={20} color="#333" />
          <Text style={styles.rowText}>{takePhoto}</Text>
        </TouchableOpacity>

        <CameraAndGallery
          isVisible={cameraModalVisible}
          onCreate={() => {}}
          onClose={() => setCameraModalVisible(false)}
          onImageSelected={onImageSelected}
        />

        <TouchableOpacity style={styles.row} onPress={() => setShowDatePicker(true)}>
          <CustomIcon name="calendar-outline" size={20} color="#333" />
          <Text style={styles.rowText}>
            {selectedDate ? selectedDate.toDateString() : 'Due Date'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} onPress={() => setShowTimePicker(true)}>
          <CustomIcon name="time-outline" size={20} color="#333" />
          <Text style={styles.rowText}>
            {selectedTime
              ? `${selectedTime.getHours() % 12 || 12}:${selectedTime
                  .getMinutes()
                  .toString()
                  .padStart(2, '0')} ${selectedTime.getHours() >= 12 ? 'PM' : 'AM'}`
              : 'Due Time'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.row}
          onPress={() => {
            setNavigateToMap(true);
            onClose();
          }}
        >
          <CustomIcon name="location-outline" size={20} color="#333" />
          <Text style={styles.rowText}>{selectLocation}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="time"
            is24Hour={false}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
          />
        )}
      </View>
    </Modal>
  );
};

export default AddTaskModal;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 20,
  },
  createBtn: {
    backgroundColor: '#6C63FF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  createBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  rowText: {
    fontSize: 15,
    marginLeft: 10,
    color: '#444',
  },
});
