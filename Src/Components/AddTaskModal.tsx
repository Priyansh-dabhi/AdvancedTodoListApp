/*  1. Task Title
    2. day Month date, year 
    3. category*/

// components/AddTaskModal.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import {Task} from '../Types/Task'

type Props = {
    isVisible: boolean;
    onClose: () => void;
    onCreate: (task: Task) => Task;
};

const AddTaskModal = ({ isVisible, onClose, onCreate }: Props) => {
    const [task, setTask] = useState('');
    const handleCreate = () => {
        if (task.trim() !== '') {
          const today = new Date();
          const options: Intl.DateTimeFormatOptions = {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
          };
          const formattedDate = today.toLocaleDateString('en-US', options);
          const newTask: Task = {
            id: formattedDate, // Set appropriate id logic here
            title: task.trim(),
            // category: ["No Category"], // Assuming category is an array of strings
            completed:false
          }
        onCreate(newTask);
        setTask('');
        onClose();
        }
    };

    return (
        <Modal
        isVisible={isVisible}
        onBackdropPress={onClose}
        backdropOpacity={0.5}
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
            <Button title="Create" onPress={handleCreate} />
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
    marginBottom: 20,
  },
});
