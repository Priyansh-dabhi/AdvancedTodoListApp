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

const PRIMARY_COLOR = '#6C63FF';

const Profile = () => {
  const [username, setUsername] = useState('');
  const { setIsLoggedIn, setUser } = useContext(AuthContext);
  const [avatarUri, setAvatarUri] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
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
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile Info */}
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
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
          onImageSelected={(uri) => {
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
    <Ionicons name={icon} size={20} color={PRIMARY_COLOR} />
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
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
    // borderWidth: 1,
    // borderColor: PRIMARY_COLOR,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: PRIMARY_COLOR,
    marginBottom: 4,
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
    fontSize: 20,
    fontWeight: '700',
    color: PRIMARY_COLOR,
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
    backgroundColor: PRIMARY_COLOR,
    marginHorizontal: 20,
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logoutText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
});
