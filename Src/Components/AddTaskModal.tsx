/*  1. Task Title
    2. day Month date, year 
    3. category*/

// components/AddTaskModal.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import CategoryPopup from './CategoryPopup';
import { NewTask, Task } from '../Types/Task';
import Calendar from './Calender';
import Time from './Time';
import Map from '../Screens/GoogleMaps/Map';
import Routes from '../Routes/Routes';
import { useNavigation } from '@react-navigation/native';
import CameraAndGallery from './CameraAndGallery';
// DB
import { insertOrUpdateTask, insertTask } from '../DB/Database';

// Context for user
import { useAuth } from '../Context/AppwriteContext';
import { addTask } from '../Service/Service';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  onCreate: () => void;
};

const AddTaskModal = ({ isVisible, onClose, onCreate }: Props) => {
  
  // auth context custom hook call
  const {user} = useAuth();
  
  // Navigation to map
  const navigation = useNavigation<any>();

  const [navigateToMap, setNavigateToMap] = useState(false);

  useEffect(() => {
    if (navigateToMap) {
      navigation.navigate(Routes.Map);
      setNavigateToMap(false); // reset it
    }
  }, [navigateToMap]);

  // State variables

  const [task, setTask] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('No Category');
  const [takePhoto, setTakePhoto] = useState('No Photo');
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [imgUri, setImgUri] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectLocation, setSelectLocation] = useState('Select Location');

  const categoryOptions = [
    'Work',
    'Personal',
    'Wishlist',
    'Birthday',
    'No Category',
  ];

const handleCreate = async () => {
  // 1. --- VALIDATION ---
  // Ensure a user is logged in before proceeding.
  if (!user) {
    return Alert.alert('Error', 'You must be logged in to create a task.');
  }

  // Ensure the task title is not empty.
  if (task.trim() === '') {
    Alert.alert('Validation', 'Task title cannot be empty.');
    return;
  }

  // 2. --- PREPARE DATA ---
  // Combine the selected date and time into a single ISO 8601 string.
  let dueDateTimeISO: string = '';
  if (selectedDate) {
    const combinedDateTime = new Date(selectedDate);
    if (selectedTime) {
      combinedDateTime.setHours(selectedTime.getHours());
      combinedDateTime.setMinutes(selectedTime.getMinutes());
    }
    dueDateTimeISO = combinedDateTime.toISOString();
  }

  // Format the creation timestamp for display purposes.
  const formattedTimestamp = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date());

  // 3. --- "APPWRITE-FIRST" WORKFLOW ---
  try {
    // STEP A: Save the task to Appwrite first to get the official document ID ($id).
    console.log('Attempting to save task to Appwrite...');
    const appwriteDocument = await addTask({
      task: task.trim(),
      description: '', // You can add a description field later
      dueDateTime: dueDateTimeISO,
      completed: false,
      timestamp: formattedTimestamp,
      userId: user.$id,
    });

    if (!appwriteDocument?.$id) {
        throw new Error("Failed to create task in Appwrite or received an invalid response.");
    }

    console.log('Task created in Appwrite with $id:', appwriteDocument.$id);

    // STEP B: Create a task object for the local SQLite database using the ID from Appwrite.
    const taskForSQLite: Task = {
      id: appwriteDocument.$id, // <-- This is the critical fix.
      task: appwriteDocument.task,
      timestamp: appwriteDocument.timestamp,
      description: appwriteDocument.description,
      dueDateTime: appwriteDocument.dueDateTime,
      completed: appwriteDocument.completed,
      isSynced: true, // It is synced because we just saved it.
    };

    // STEP C: Save the complete task object to the local SQLite database.
    // Using an "upsert" function is safest here.
    insertOrUpdateTask(taskForSQLite);
    console.log('Task saved locally with ID:', taskForSQLite.id);

    // STEP D: If both saves are successful, trigger UI updates and close the modal.
    onCreate(); // This calls fetchTasksFromDB() in Home.tsx
    resetForm(); // This clears the form and closes the modal

  } catch (err) {
    // If anything fails (network error, etc.), inform the user.
    console.error('Error during task creation process:', err);
    Alert.alert('Error', 'Could not save the task. Please check your connection and try again.');
  }
};

  const resetForm = () => {
    setTask('');
    setSelectedCategory('No Category');
    setTakePhoto('No Photo');
    setImgUri(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectLocation('Select Location');
    onClose();
  };

  // Modal close
  const handleModalClose = () => {
    onClose();
    setSelectedCategory('No Category');
    setTakePhoto('No Photo');
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectLocation('Select Location');
  };
  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      const existing = selectedDate || new Date();
      date.setHours(existing.getHours());
      date.setMinutes(existing.getMinutes());
      setSelectedDate(date);
    }
  };

  const handleTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(false);
    if (time) {
      const existing = selectedTime || new Date();
      existing.setHours(time.getHours());
      existing.setMinutes(time.getMinutes());
      setSelectedTime(new Date(existing));
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={handleModalClose}
      backdropOpacity={0.5}
      animationIn={'fadeInUp'}
      animationOut={'slideOutDown'}
      useNativeDriverForBackdrop={true} // Use native driver for better performance
      // hideModalContentWhileAnimating={true} // Hide content while animating
      style={styles.modal}
      onModalHide={() => {
        if (navigateToMap) {
          navigation.navigate(Routes.Map);
          setNavigateToMap(false);
        }
      }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Create New Task</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter a task..."
          value={task}
          onChangeText={setTask}
        />

        <Button title="Create Task" onPress={handleCreate} />

        {/* Take Photo */}
        <TouchableOpacity
          onPress={() => setCameraModalVisible(true)}
          style={styles.row}
        >
          <Ionicons name="camera-outline" size={22} color="black" />
          <Text style={styles.rowText}>{takePhoto}</Text>
        </TouchableOpacity>
        <CameraAndGallery
          isVisible={cameraModalVisible}
          onCreate={() => {}}
          onClose={() => setCameraModalVisible(false)}
          onImageSelected={uri => {
            setImgUri(uri);
            setTakePhoto('Photo Selected');
            setCameraModalVisible(false);
          }}
        />
        {/* Date Picker */}
        <TouchableOpacity
          style={styles.row}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar-outline" size={22} color="black" />
          <Text style={styles.rowText}>
            {selectedDate ? selectedDate.toDateString() : 'Due Date'}
          </Text>
        </TouchableOpacity>

        {/* Time Picker */}
        <TouchableOpacity
          style={styles.row}
          onPress={() => setShowTimePicker(true)}
        >
          <Ionicons name="time-outline" size={22} color="black" />
          <Text style={styles.rowText}>
            {selectedTime
              ? `${selectedTime.getHours() % 12 || 12}:${selectedTime
                  .getMinutes()
                  .toString()
                  .padStart(
                    2,
                    '0',
                  )} ${selectedTime.getHours() >= 12 ? 'PM' : 'AM'}`
              : 'Due Time'}
          </Text>
        </TouchableOpacity>

        {/* Location Picker Placeholder */}
        <TouchableOpacity
          style={styles.row}
          onPress={() => {
            setNavigateToMap(true);
            onClose();
          }}
        >
          <Ionicons name="location-outline" size={22} color="black" />
          {/* onPress= {()=> {navigation.navigate(Routes.EditTask)}} */}
          <Text style={styles.rowText}>{selectLocation}</Text>
        </TouchableOpacity>

        {/* Inline Android Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
          />
        )}

        {/* Time Picker */}
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
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '600',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    marginBottom: 15,
  },
  categoryScroll: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  categoryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#eee',
    borderRadius: 20,
    marginRight: 8,
  },
  selectedCategory: {
    // flexDirection: 'row',
    // backgroundColor: '#6C63FF',
  },
  categoryText: {
    color: 'black',
  },
  createNewBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFD700',
    borderRadius: 20,
  },
  createNewText: {
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    marginBottom: 10,
  },
  rowText: {
    fontSize: 15,
  },
});
