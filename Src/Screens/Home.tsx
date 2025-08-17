import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  FlatList,
  Button,
  Alert,
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Context/AppwriteContext';
import { getCurrentUser, logout } from '../Service/Service';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
// Icons & task library:
import Icon from 'react-native-vector-icons/Ionicons';
import AddTaskModal from '../Components/AddTaskModal';
//Task Types
import { Task } from '../Types/Task';
import Routes from '../Routes/Routes';
import { useNavigation } from '@react-navigation/native';
//DB
import { getAllTasks, updateTaskCompletion } from '../DB/Database';
import { deleteTask } from '../DB/Database';

const Home = () => {
    const navigation = useNavigation<any>();
    //Greeting the user
    const [greeting, setGreeting] = useState('');

    const [tasks, setTasks] = useState<Task[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // clear serch query
    const clearText = () => {
        setSearchQuery('');
    };

    // Greeting the user
    useEffect(() => {
        const date = new Date();
        const hours = date.getHours();
        if (hours < 12) {
        setGreeting('Good Morning');
        } else if (hours < 17) {
        setGreeting('Good Afternoon');
        } else {
        setGreeting('Good Evening');
        }
    }, []);

    // Fetch tasks from DB
    const fetchTasksFromDB = () => {
        getAllTasks((fetchedTasks: Task[]) => {
        // Map over the tasks and set completed to false for all of them
        const uncheckedTasks = fetchedTasks.map(task => ({
            ...task,
            completed: false,
        }));
        setTasks(uncheckedTasks);
        console.log('Fetched and Unchecked Tasks:', uncheckedTasks);
        });
    };
    // fetchTasksFromDB
    useEffect(() => {
        fetchTasksFromDB();
    }, []);

    const handleCreateTask = () => {
        fetchTasksFromDB();
    };
    const handleTaskDeleteOnCheckboxPress = (taskId: number) => {
        deleteTask(
        taskId,
        () => {
            console.log('Deleted successfully');
            // Call the new function to refresh the list and uncheck all items
            fetchTasksFromDB();
        },
        err => {
            Alert.alert('Error', 'Failed to delete task');
        },
        );
    };
    const handleTaskCompletionToggle = (
        taskId: number,
        currentStatus: boolean,
    ) => {
        // The completed parameter should be a boolean, not a number.
        const newStatus = !currentStatus;

        updateTaskCompletion({
        id: taskId,
        completed: newStatus, // Pass the boolean directly
        success: () => {
            console.log(`Task ${taskId} completion toggled to ${newStatus}`);
            fetchTasksFromDB(); // Re-fetch all tasks to update the UI
        },
        error: err => {
            console.error('Failed to update task completion:', err);
            Alert.alert('Error', 'Could not update task status.');
        },
        });
    };
    return (
        <View style={styles.container}>
        {/* <Text style={styles.title}>Welcome <Text style={{color:'#f02e65'}}>{username}</Text> to Home Screen 🎉 </Text>

                <Pressable style={styles.logoutBtn} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </Pressable>                     */}

        {/* List of tasks */}
        {/* <ScrollView horizontal={true} style={{marginTop:20,marginBottom:20 ,borderWidth:1, }}>
                        <TouchableOpacity style={{backgroundColor:'red'}}><Text>Add</Text></TouchableOpacity>
                        
                    </ScrollView> */}
        <View style={styles.headerContainer}>
            <View style={styles.headerLeft}>
            <Text style={styles.welcomeText}>{greeting} 👋</Text>
            <Text style={styles.usernameText}>Let's manage your tasks!</Text>
            </View>

            <View style={styles.searchRow}>
            <View style={styles.searchContainer}>
                <TextInput
                placeholder="Search tasks..."
                clearButtonMode="always"
                placeholderTextColor="#888"
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                <TouchableOpacity onPress={clearText} style={styles.clearButton}>
                    <Icon name="close-circle" size={20} color="#888" />
                </TouchableOpacity>
                )}
            </View>
            <TouchableOpacity style={styles.searchButton}>
                <Icon
                name="search"
                size={30}
                color="#FF6B6B"
                style={{ marginRight: 8, marginLeft: 8 }}
                />
            </TouchableOpacity>
            </View>
        </View>

        <FlatList
            data={tasks.filter(task =>
            task.task?.toLowerCase().includes(searchQuery.toLowerCase()),
            )}
            keyExtractor={item => item.id.toString()}
            // style={{ width: '100%',borderWidth:1 }}
            renderItem={({ item }) => (
            <TouchableOpacity
                delayPressIn={100}
                delayPressOut={100}
                delayLongPress={500}
                hitSlop={{ top: 10, bottom: 10, left: 20, right: 20 }}
                onPress={() => {
                navigation.navigate(Routes.EditTask, { taskId: item.id, task: item.task });
                }}
            >
                <View style={styles.taskCard}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <BouncyCheckbox
                    fillColor="#FF6B6B"
                    isChecked={item.completed}
                    onPress={() => handleTaskDeleteOnCheckboxPress(item.id)}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.taskItem}>{item.task}</Text>
                    <Text style={styles.taskItem}>{item.timestamp}</Text>
                </View>
                </View>
            </TouchableOpacity>
            )}
            contentContainerStyle={{
            padding: 10,
            marginLeft: 15,
            marginRight: 15,
            marginBottom: 20,
            }}
            style={styles.flatList}
        />
        {/* Floating "+" button */}
        <TouchableOpacity
            style={styles.fab}
            onPress={() => setModalVisible(true)}
        >
            <Icon name="add" size={32} color="white" />
        </TouchableOpacity>
        {/* Bottom Modal */}
        <AddTaskModal
            isVisible={modalVisible}
            onClose={() => setModalVisible(false)}
            onCreate={handleCreateTask}
        />
        </View>
    );
};
export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#fff',
    },
    headerContainer: {
        borderWidth: 1,
        width: '100%',
        paddingTop: 45,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: '#FF6B6B',
        // flexDirection: 'row',
        flexDirection: 'column',
        // justifyContent: 'center',
        // alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
    },
    headerLeft: {
        flexDirection: 'column',
        // borderWidth: 1,
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
    usernameText: {
        fontSize: 14,
        color: '#333  ',
        marginTop: 2,
    },
    // Search bar styles
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
    },
    searchContainer: {
        borderWidth: 1,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        marginRight: 10,
        height: 55,
        // width: '50%',
        // width: 10,
        paddingVertical: 5,
        borderRadius: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        // marginRight: 10, // gives space between input and button
    },

    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    clearButton: {
        marginLeft: 10,
    },
    searchButton: {
        borderWidth: 1,
        width: 55,
        height: 55,
        backgroundColor: '#fff',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },

    title: {
        fontSize: 24,
        marginBottom: 30,
        color: '#333',
    },
    logoutBtn: {
        backgroundColor: '#f02e65',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 5,
    },
    logoutText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        // backgroundColor: '#1E90FF',
        backgroundColor: '#FF6B6B',
        width: 70,
        height: 70,
        borderRadius: 35, // Half of width/height
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
    },
    taskCard: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 15,
        // elevation: 3, // for Android shadow
    },
    taskItem: {
        fontSize: 16,
        // paddingVertical: 4,
    },
    flatList: {
        width: '100%',
        // borderWidth: 1,
    },
});
