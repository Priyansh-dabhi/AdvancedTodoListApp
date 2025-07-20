import { StyleSheet, Text, View, Pressable, TouchableOpacity, FlatList, Button } from 'react-native'
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
                {/* <ScrollView horizontal={true} style={{marginTop:20,marginBottom:20 ,borderWidth:1, }}>
                    <TouchableOpacity style={{backgroundColor:'red'}}><Text>Add</Text></TouchableOpacity>
                    
                </ScrollView> */}
                <FlatList
                    data={tasks}
                    keyExtractor={(item, index) => index.toString()}
                    // style={{ width: '100%',borderWidth:1 }}  
                    renderItem={({ item }) => (
                    <TouchableOpacity 
                    delayPressIn={100}
                    delayPressOut={100}
                    delayLongPress={500}
                    hitSlop={{ top: 10, bottom: 10, left: 20, right: 20 }}
                    >
                        <View style={styles.taskCard}>
                            <Text style={styles.taskItem}>{item.title}</Text>
                            <Text style={styles.taskItem}>{item.id}</Text> 
                        </View>
                    </TouchableOpacity>
                    )
                }   
                    contentContainerStyle={{ padding: 10,marginLeft:15,marginRight:15,marginBottom:20 }}
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
        paddingVertical: 8,
    },
    flatList: {
        width: '100%',
        // borderWidth: 1,
    },
})