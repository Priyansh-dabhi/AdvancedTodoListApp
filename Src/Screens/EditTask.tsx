import React, { useEffect, useState } from 'react';
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
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import CameraAndGallery from '../Components/CameraAndGallery';
import Routes, { AppStackParamList } from '../Routes/Routes';
import { RouteProp, useNavigation } from '@react-navigation/native';
// Context
import { useTaskContext } from '../Context/TaskContext';
import { updateTask } from '../DB/Database';

type EditTaskRouteProp = RouteProp<AppStackParamList, 'EditTask'>;
type Props = {
  route: EditTaskRouteProp;
};

const EditTask = () => {
  const navigation = useNavigation<any>();
  // context
  const { selectedTask } = useTaskContext();

  const [task, setTask] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [duetime, setDueTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reminder, setReminder] = useState(false);
  const [photo, setPhoto] = useState<any>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [cameraModalVisible, setCameraModalVisible] = useState(false);

  useEffect(() => {
    if (selectedTask) {
      setTask(selectedTask.task || '');
      setDescription(selectedTask.description || '');

      if (selectedTask.dueDateTime) {
        const iso = new Date(selectedTask.dueDateTime);

        if (!isNaN(iso.getTime())) {
          // Split into two states
          setDueDate(
            new Date(iso.getFullYear(), iso.getMonth(), iso.getDate()),
          );

          setDueTime(
            new Date(
              0,
              0,
              0, // reset date part
              iso.getHours(),
              iso.getMinutes(),
            ),
          );
        }
      }
    }
    // console.log('Selected task:', selectedTask.dueDateTime);
  }, [selectedTask]);

  const saveTask = () => {
    // This is the reverse process: combine the UI states back into one string for saving.
    let dueDateTimeISO: string | undefined = undefined;
    if (dueDate) {
      const combinedDateTime = new Date(dueDate);
      if (duetime) {
        combinedDateTime.setHours(duetime.getHours());
        combinedDateTime.setMinutes(duetime.getMinutes());
      }
      dueDateTimeISO = combinedDateTime.toISOString();
    }

    const updatedTask = {
      task,
      description,
      dueDateTime: dueDateTimeISO, // The single value to save to the database
      // reminder,
      // photo,
    };

    updateTask(selectedTask?.id || 0, updatedTask, () => {
      console.log('Updated task ready to be saved:', updatedTask);
    });
  };
  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* Title */}
      <Text style={styles.label}>Task Title</Text>
      <TextInput
        style={styles.input}
        value={task}
        onChangeText={setTask}
        placeholder="Enter task title"
        placeholderTextColor="#aaa"
      />

      {/* Description */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter task description"
        placeholderTextColor="#aaa"
        multiline
      />

      {/* Due Date */}
      <Text style={styles.label}>Due Date</Text>
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
        <Text>{dueDate.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(e, selected) => {
            setShowDatePicker(false);
            if (selected) setDueDate(selected);
          }}
        />
      )}

      {/* Time & Reminder */}
      <Text style={styles.label}>Time</Text>
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
          {duetime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={duetime}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(e, selected) => {
            setShowTimePicker(false);
            if (selected) setDueTime(selected);
          }}
        />
      )}

      <View style={styles.reminderRow}>
        <Text style={styles.label}>Reminder</Text>
        <Switch value={reminder} onValueChange={setReminder} />
      </View>

      {/* Photo */}
      <Text style={styles.label}>Photo</Text>
      <TouchableOpacity
        style={styles.photoBtn}
        onPress={() => setCameraModalVisible(true)}
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

      {/* Full Screen Image Modal */}
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

      {/* Save Button */}
      <TouchableOpacity
        style={styles.saveBtn}
        onPress={() => {
          (saveTask(), navigation.navigate(Routes.TabHome));
        }}
      >
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

export default EditTask;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 14,
    marginBottom: 6,
    color: '#555',
  },
  input: {
    backgroundColor: '#FFFFFF',
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
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
  },
  reminderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  photoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginTop: 6,
    width: 150,
  },
  photoBtnText: {
    color: '#fff',
    fontSize: 15,
  },
  thumbnailContainer: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 2,
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 24,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
