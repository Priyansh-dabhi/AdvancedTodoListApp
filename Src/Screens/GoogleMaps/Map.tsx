import React, { useState, useCallback, useRef } from 'react';
import {PermissionsAndroid,Platform,View,StyleSheet,TouchableOpacity,Image,} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useFocusEffect, useIsFocused, } from '@react-navigation/native';
import icons from '../../../constants/icons'; // Adjust the import path as necessary

const MapScreen = () => {
  const isFocused = useIsFocused();
  const [region, setRegion] = useState<Region | null>(null);
  const mapRef = useRef<MapView | null>(null);
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Permission error:', err);
        return false;
      }
    }
    return true;
  };

  const fetchLocation = async () => {
    const granted = await requestLocationPermission();
    if (!granted) return;

    // First try live location
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        console.log('Live location fetched');
        if(mapRef.current){
          mapRef.current.animateToRegion({ latitude
            ,longitude
            ,latitudeDelta:0.01
            ,longitudeDelta:0.01
          },1000)
        console.log('current position focused');
        }
      },
      error => {
        console.warn('Live location error:', error.message);
      },
    );
  };

  useFocusEffect(
    useCallback(() => {
      fetchLocation();
    }, []),
  );

  return (
    <View style={styles.container}>
      {isFocused && region && (
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={region}
          // onRegionChangeComplete={(reg)=> {setRegion(reg)}}
          // showsUserLocation={true}
        >
          <Marker coordinate={region}>
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: 'rgba(30, 136, 229, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: '#1E88E5',
                }}
              />
            </View>
          </Marker>
        </MapView>
      )}
      <TouchableOpacity style={{
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  }}
  onPress={fetchLocation}>
        <Image source={icons.target2} 
        style={{
      width: 24,
      height: 24,
      resizeMode: 'contain',
      tintColor: '#000',
    }}
    
    />
      </TouchableOpacity>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
});
