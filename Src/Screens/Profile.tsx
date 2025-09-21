import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import { AuthContext, useAuth } from '../Context/AppwriteContext';
import { getCurrentUser, logout } from '../Service/Service';
import { clearAllTasks } from '../DB/Database';
import gettingUserName, { gettingUserEmail } from '../Components/GettingUserDetail';
import EditProfileModal from '../Components/EditProfileModal';
import icons from '../../constants/images';
import { useTaskStats } from '../Context/TaskSummaryContext';
import RNFS from 'react-native-fs'
import { storeUserAvatar } from '../Service/Service';

const PRIMARY_COLOR = '#6C63FF';

const Profile = () => {
  const { stats } = useTaskStats();
  const { isLoggedIn } = useAuth();
  const { setIsLoggedIn, setUser } = useContext(AuthContext);

  const [modalVisible, setModalVisible] = useState(false); // edit profile modal
  const [viewerVisible, setViewerVisible] = useState(false); // ✅ big image modal
  const [localPhotoPath, setLocalPhotoPath] = useState<string | null>(null);

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

      await AsyncStorage.removeItem('user_session');
      await AsyncStorage.removeItem('user_avatar');
      clearAllTasks();
      setUser(null);
      setLocalPhotoPath(null);
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
  };

  const onImageSelected = async (imageUri: string) => {
    setModalVisible(false);
    try {
      if (isLoggedIn === true) {
        const fileName = `${Date.now()}-${imageUri.split('/').pop()}`;
        const newPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
        await RNFS.copyFile(imageUri, newPath);
        setLocalPhotoPath(newPath);

        await AsyncStorage.setItem("user_avatar", newPath);
      } else {
        await AsyncStorage.setItem("user_avatar", icons.userIcon2);
      }
    } catch {
      Alert.alert('Error', 'Could not save the photo.');
    }
  };

  useEffect(() => {
    const loadAvatar = async () => {
      const savedPath = await AsyncStorage.getItem("user_avatar");
      if (savedPath) {
        setLocalPhotoPath(savedPath);
      }
    };
    loadAvatar();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile Info */}
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={() => setViewerVisible(true)}>
            <Image
              source={
                localPhotoPath && localPhotoPath.length > 0
                  ? { uri: `file://${localPhotoPath}` }
                  : icons.userIcon2
              }
              style={styles.avatar}
            />
          </TouchableOpacity>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        {/* Edit Profile Modal */}
        <EditProfileModal
          isVisible={modalVisible}
          onClose={() => setModalVisible(false)}
          onCreate={() => {}}
          onImageSelected={onImageSelected}
        />

        {/* ✅ Fullscreen Image Viewer */}
        <Modal visible={viewerVisible} transparent animationType="fade">
          <View style={styles.viewerContainer}>
            {/* Close button */}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setViewerVisible(false)}
            >
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>

            {/* Edit button */}
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => {
                setViewerVisible(false);
                setModalVisible(true);
              }}
            >
              <Ionicons name="pencil" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Big image */}
            <Image
              source={
                localPhotoPath && localPhotoPath.length > 0
                  ? { uri: `file://${localPhotoPath}` }
                  : icons.userIcon2
              }
              style={styles.bigImage}
              resizeMode="contain"
            />
          </View>
        </Modal>

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
  container: { flex: 1, backgroundColor: '#f6f7fb' },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    marginBottom: 10,
    // borderWidth: 9
  },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 12 , borderWidth: 2, borderColor:"#6C63FF"},
  name: { fontSize: 20, fontWeight: '700', color: PRIMARY_COLOR, marginBottom: 4 },
  email: { fontSize: 14, color: '#777' },

  // ✅ Big image viewer styles
  viewerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigImage: { width: '90%', height: '70%' },
  closeBtn: { position: 'absolute', top: 40, left: 20 },
  editBtn: { position: 'absolute', top: 40, right: 20 },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  statCard: { alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '700', color: PRIMARY_COLOR },
  statLabel: { fontSize: 14, color: '#555' },
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
  settingsLabel: { fontSize: 16, marginLeft: 10, color: '#333' },
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
  logoutText: { color: '#fff', marginLeft: 8, fontSize: 16, fontWeight: '600' },
});
