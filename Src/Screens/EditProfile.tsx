import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EditProfileModal from '../Components/EditProfileModal';

const EditProfile = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [avatarUri, setAvatarUri] = useState(
    'https://cdn-icons-png.flaticon.com/512/706/706830.png',
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.avatarContainer}>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}
        >
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: '#ccc' }]} />
          )}
        </TouchableOpacity>
        <Text style={styles.name}>John Doe</Text>
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

      <View style={styles.inputContainer}>
        <Icon
          name="account-outline"
          size={20}
          color="#555"
          style={styles.icon}
        />
        <TextInput placeholder="First Name" style={styles.input} />
      </View>

      <View style={styles.inputContainer}>
        <Icon
          name="account-outline"
          size={20}
          color="#555"
          style={styles.icon}
        />
        <TextInput placeholder="Last Name" style={styles.input} />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="phone-outline" size={20} color="#555" style={styles.icon} />
        <TextInput
          placeholder="Phone"
          keyboardType="phone-pad"
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="email-outline" size={20} color="#555" style={styles.icon} />
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="earth" size={20} color="#555" style={styles.icon} />
        <TextInput placeholder="Country" style={styles.input} />
      </View>

      <View style={styles.inputContainer}>
        <Icon
          name="map-marker-outline"
          size={20}
          color="#555"
          style={styles.icon}
        />
        <TextInput placeholder="City" style={styles.input} />
      </View>

      <TouchableOpacity style={styles.submitBtn}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: '#333',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 15,
    paddingVertical: 5,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 5,
  },
  submitBtn: {
    backgroundColor: '#4A90E2',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 30,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
