import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import { AuthContext } from '../Context/AppwriteContext';
import { logout } from '../Service/Service';
import { clearAllTasks } from '../DB/Database';
import gettingUserName, { gettingUserEmail } from '../Components/GettingUserDetail';
import EditProfileModal from '../Components/EditProfileModal';
import icons from '../../constants/images';

const Profile = () => {
  const [username, setUsername] = useState('');
  const { setIsLoggedIn, setUser } = useContext(AuthContext);
  const [avatarUri, setAvatarUri] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [name , setName] = useState("");
  const navigation = useNavigation<any>();


  // handle logout
  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);

      Snackbar.show({
        text: 'Logged out successfully!',
        duration: Snackbar.LENGTH_SHORT,
      });

      // Clear session and local tasks
      await AsyncStorage.removeItem('user_session');
      clearAllTasks();
      setUser(null);
    } catch (err) {
      console.log('Logout Error:', err);
      Snackbar.show({
        text: 'Logout failed',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  const user = {
    name: gettingUserName(),
    email: gettingUserEmail(),
    profilePic: 'https://via.placeholder.com/100', // Replace with real profile pic
  };

  const stats = {
    completed: 24,
    pending: 6,
    total: 30,
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      {/* <View style={styles.profileHeader}>
            <Text style={styles.headerTitle}>Profile</Text>
          </View>
       */}

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile Info */}
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
            // source={require('../../assets/icons/target.png')}
            source={avatarUri ? { uri: avatarUri } : icons.userIcon2}
            style={styles.avatar}
          />
          </TouchableOpacity>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
        <EditProfileModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreate={() => {}}
        onImageSelected={uri => {
          console.log('Selected URI:', uri);
          setAvatarUri(uri);
          setModalVisible(false);
        }}
        />
        {/* Task Stats */}
        <View style={styles.statsRow}>
          <StatCard label="Completed" value={stats.completed} />
          <StatCard label="Pending" value={stats.pending} />
          <StatCard label="Total" value={stats.total} />
        </View>

        {/* Settings */}
        <View style={styles.settingsContainer}>
          <SettingsItem icon="moon" label="Dark Mode" />
          <SettingsItem icon="notifications" label="Notifications" />
          <SettingsItem icon="settings" label="Preferences" />
          <SettingsItem icon="lock-closed" label="Privacy & Security" />
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// Stat card component
const StatCard = ({ label, value }: { label: string; value: number }) => (
  <View style={styles.statCard}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// Settings item component
const SettingsItem = ({ icon, label }: { icon: string; label: string }) => (
  <TouchableOpacity style={styles.settingsItem}>
    <Ionicons name={icon} size={20} color="#4A90E2" />
    <Text style={styles.settingsLabel}>{label}</Text>
    <Ionicons
      name="chevron-forward"
      size={20}
      color="#ccc"
      style={{ marginLeft: 'auto' }}
    />
  </TouchableOpacity>
);

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7fb',
  },
  profileHeader: {
    backgroundColor: '#4A90E2',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#777',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  statCard: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A90E2',
  },
  statLabel: {
    fontSize: 14,
    color: '#555',
  },
  settingsContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  settingsLabel: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#4A90E2',
    marginHorizontal: 20,
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
});
