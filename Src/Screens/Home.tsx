import { StyleSheet, Text, View, Pressable, TouchableOpacity, FlatList } from 'react-native'
import React ,{useContext, useEffect, useState} from 'react'
import { AuthContext } from '../Context/AppwriteContext';
import { getCurrentUser, logout } from '../Service/Service';
import Snackbar from 'react-native-snackbar';
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
// Icons & task library:
import Icon from 'react-native-vector-icons/Ionicons';
import AddTaskModal from '../Components/AddTaskModal';

//Task Types
import { Task } from '../Types/Task';

const Home = () => {
    // const [username, setUsername] = useState('');
    // const { setIsLoggedIn } = useContext(AuthContext);
    // // handling logout
    // const handleLogout = async () => {
    //     try {
    //     await logout();
    //     setIsLoggedIn(false);
    //     Snackbar.show({
    //         text: 'Logged out successfully!',
    //         duration: Snackbar.LENGTH_SHORT,
    //     });
    //     } catch (err) {
    //     console.log('Logout Error:', err);
    //     Snackbar.show({
    //         text: 'Logout failed',
    //         duration: Snackbar.LENGTH_SHORT,
    //     });
    //     }
    // };
    // // fetching users
    // useEffect(()=> {
    //     const fetchUser = async () => {
    //         const user = await getCurrentUser();
    //         if(user){
    //             setUsername(user.name);
    //         }
    //     }
    //     fetchUser();
    // },[])

//     // TaskInput:
//     type Task = {
//     id: number;          // or string if you use UUID
//     title: string;
//     description?: string;
//     completed?: boolean;
// };
    const [tasks, setTasks] = useState<Task[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const handleCreateTask = (task:Task)  => {
        setTasks(prev => [...prev, task]);
    return task;
    } ;

    return (

        <View style={styles.container}>
            {/* <Text style={styles.title}>Welcome <Text style={{color:'#f02e65'}}>{username}</Text> to Home Screen 🎉 </Text>

            <Pressable style={styles.logoutBtn} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </Pressable>                     */}

            {/* List of tasks */}
                <FlatList
                    data={tasks}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => <Text style={styles.taskItem}>{item.title}</Text>}
                    contentContainerStyle={{ padding: 20 }}
                    style={styles.flatList}
                />
                {/* Floating "+" button */}
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => setModalVisible(true)}
                >
                    <Icon name="add" size={38} color="white" />

                </TouchableOpacity>
                {/* Bottom Modal */}
            <AddTaskModal
                isVisible={modalVisible}
                onClose={() => setModalVisible(false)}
                onCreate={handleCreateTask}
            />
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
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
        backgroundColor: '#1E90FF',
        width: 70,
        height: 70,
        borderRadius: 35, // Half of width/height
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,

    },
    taskItem: {
        
        fontSize: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    flatList: {
        width: '100%',
        // borderWidth: 1,
    },
})