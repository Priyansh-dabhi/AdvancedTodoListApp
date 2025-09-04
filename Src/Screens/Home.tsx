import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  FlatList,
  Button,
  Alert,
  Image,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Context/AppwriteContext';
import { getCurrentUser, getTasks, logout, deleteTaskFromAppwrite } from '../Service/Service';
import { ScrollView, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import images from '@/constants/images';
// Icons & task library:
import Icon from 'react-native-vector-icons/Ionicons';
import AddTaskModal from '../Components/AddTaskModal';
//Task Types
import { Task } from '../Types/Task';
import Routes from '../Routes/Routes';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
//DB
import { getAllTasksByUser, updateTaskCompletion, insertOrUpdateTask } from '../DB/Database';
// import { deleteTask } from '../DB/Database';
import { markTaskAsDeleted, permanentlyDeleteTask } from '../DB/Database';
// context
import { useTaskContext } from '../Context/TaskContext';
import { TaskContext } from '../Context/TaskContext';
import { useAuth } from '../Context/AppwriteContext';
import { Models } from 'appwrite';
import { useTaskStats } from '../Context/TaskSummaryContext';

const Home = () => {
  //context
  const {user, isLoggedIn} = useAuth();
  const { stats, setStats } = useTaskStats();

  const navigation = useNavigation<any>();
  //Greeting the user
  const [greeting, setGreeting] = useState('');

  // context
  const { selectedTask,setSelectedTask } = useTaskContext();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [completedTask,setCompletedTask] = useState(0);

  // pull to refresh
  const [isRefreshing, setIsRefreshing] = useState(false);
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


  // Appwrite 

  // This is the main data synchronization effect.
  // It depends on the 'user' object from the AuthContext.

  const syncFromAppwrite = async () => {
  if (!user) {
    console.log("Auth context is not ready yet. Waiting for user...");
    return;
  }

  console.log(`User ${user.$id} is available. Fetching tasks from Appwrite.`);

  // with TablesDB, the property is `rows`, not `documents`
  const res = await getTasks(user.$id);

  const mappedTasks: Task[] = res.rows.map((doc: any) => ({
  id: doc.$id,
  task: doc.task,
  timestamp: doc.timestamp,
  description: doc.description,
  dueDateTime: doc.dueDateTime ?? null,
  completed: doc.completed === 1 || doc.completed === true,
  isSynced: true,
  userId: user.$id,
  photoPath: doc.photoPath || null,
}));

  // Save all tasks locally
  await Promise.all(mappedTasks.map((task) => insertOrUpdateTask(task)));

  console.log("All Appwrite tasks saved to local DB. Refreshing UI...");
  fetchTasksFromDB();
};

const fetchTasksFromDB = () => {
  if (!user) return "User";
  getAllTasksByUser(user.$id, (fetchedTasks: any[]) => {
    const normalizedTasks: Task[] = fetchedTasks.map((task) => ({
      ...task,
      completed: task.completed === 1,
      isSynced: task.isSynced === 1,
    }));
    setTasks(normalizedTasks);
    // Update stats for profile
    const total = normalizedTasks.length;
    const completed = normalizedTasks.filter(task => task.completed).length;
    const pending = total - completed;

    setStats({ total, completed, pending });
    console.log(`Fetched Tasks for user ${user.$id}:`, normalizedTasks);
  });
};

const handleCreateTask = () => {
  fetchTasksFromDB();
};

useEffect(() => {
  if (user) {
    console.log(`User ${user.$id} detected. Syncing tasks.`);
    syncFromAppwrite();
  } else {
    setTasks([]);
    console.log("User logged out or not present, clearing tasks state.");
  }
}, [user]);
// // fetchTasksFromDB
// useEffect(() => {
//   fetchTasksFromDB();
// }, []);


// const onRefresh = useCallback(async () => {
//   setIsRefreshing(true); // Start the spinner
//   await syncFromAppwrite(); // Re-fetch the data
//   setIsRefreshing(false); // Stop the spinner
// }, [user]); // Recreate the function if the user changes

  // Delete task on checkbox press
const handleTaskDeleteOnCheckboxPress = async (taskToDelete: Task) => {
  const appwriteDocumentId = taskToDelete.id;
    if (!appwriteDocumentId) {
        console.error("Delete failed: The task object is missing its ID.", taskToDelete);
        Alert.alert("Error", "Could not delete the task because its ID is missing.");
        return;
    }
    setTasks(prevTasks => prevTasks.filter(task => task.id !== appwriteDocumentId));
    const updatedTasks = tasks.filter(task => task.id !== appwriteDocumentId);

    const total = updatedTasks.length;
    const completed = updatedTasks.filter(task => task.completed).length;
    const pending = total - completed;
    setStats({ total, completed, pending });

    try {
        await markTaskAsDeleted(appwriteDocumentId);

        await deleteTaskFromAppwrite  (appwriteDocumentId);
        
        await permanentlyDeleteTask(appwriteDocumentId);
        
        console.log(`Task ${appwriteDocumentId} was successfully deleted and synced.`);

    } catch (error) {
        console.log(`Failed to sync deletion for task ${appwriteDocumentId}. It remains marked for deletion locally.`);
    }
    setCompletedTask(prev => prev + 1);
    console.log("Completed tasks:", completedTask+1); 
};
// after updating it will re fetches the tasks from db!
useFocusEffect(
        useCallback(() => {
            console.log("Home screen is in focus, fetching tasks from DB...");
            fetchTasksFromDB(); 

            return () => {
                console.log("Home screen is no longer in focus.");
            };
        }, []) 
    );
  

  return (
    <SafeAreaView style={styles.container}>
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
          <Text style={styles.welcomeText}>{greeting} 📝</Text>
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
              color="#6C63FF"
              style={{ marginRight: 8, marginLeft: 8 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            // onRefresh={onRefresh}
            colors={["#4A90E2"]} // Optional: customize spinner color
          />
        }
        data={tasks.filter(task =>
          task.task?.toLowerCase().includes(searchQuery.toLowerCase()),
        )}
        ListEmptyComponent={
          <View
            style={{
              flexDirection: 'column',
              //   backgroundColor: '#000',
              gap: 5,
              alignItems: 'center',
              marginTop: 20,
              height: '100%',
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <Image
              source={images.emptyTask}
              style={{ height: 150, width: 150 }}
            />
            <Text style={{ fontSize: 16, color: '#888', marginBottom: 50 }}>
              No tasks found. Create a new task!
            </Text>
          </View>
        }
        keyExtractor={item => item.id.toString()}
        // style={{ width: '100%',borderWidth:1 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            delayPressIn={100}
            delayPressOut={100}
            delayLongPress={500}
            hitSlop={{ top: 10, bottom: 10, left: 20, right: 20 }}
            onPress={() => {
              setSelectedTask(item);
              navigation.navigate(Routes.EditTask);
            }}
          >
            <View style={styles.taskCard}>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <BouncyCheckbox
                  fillColor="#4A90E2"
                  isChecked={item.completed}
                  onPress={() => handleTaskDeleteOnCheckboxPress(item)}
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
          flexGrow: 1,
          // height: '100%',
          width: '100%',
          padding: 10,

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
    </SafeAreaView>
  );
};
export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#fff',
    backgroundColor: '#F8F9FA',
  },
  headerContainer: {
    borderWidth: 1,
    width: '100%',
    paddingTop: 45,
    paddingBottom: 20,
    paddingHorizontal: 20,
    // backgroundColor: '#FF6B6B',
    // backgroundColor: '#4A90E2',
    backgroundColor: '#6C63FF',
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
    color: '#2D3748',
  },
  usernameText: {
    fontSize: 14,
    color: '#718096  ',
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
    backgroundColor: '#6C63FF',
    // backgroundColor: '#FF6B6B',
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
    backgroundColor: '#FFFFFF',
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
    flex: 1,
    height: '100%',
    width: '100%',
    // backgroundColor: 'yellow',
    // borderWidth: 1,
  },
});
