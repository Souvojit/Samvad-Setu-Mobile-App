import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MapPin, Navigation } from 'lucide-react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LocationScreen() {
  const router = useRouter();
  const [locationName, setLocationName] = useState('Detecting current GPS location...');
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLocationName('Howrah, West Bengal (Default)');
        setLoading(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      const { latitude, longitude } = currentLocation.coords;
      setCoords({ latitude, longitude });

      // Reverse geocode to get a readable street/area name
      let reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const formattedAddress = `${address.name || address.street || ''}, ${address.subregion || address.city || 'Howrah'}, ${address.region || 'West Bengal'}`;
        setLocationName(formattedAddress.replace(/^,\s/, ''));
      } else {
        setLocationName(`Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`);
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      setErrorMsg('Could not fetch GPS coordinates.');
      setLocationName('Howrah, West Bengal');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    try {
      // Save location temporarily in AsyncStorage to combine during final review/submission
      const ticketData = {
        location: locationName,
        latitude: coords?.latitude || 22.5958,
        longitude: coords?.longitude || 88.2636,
      };
      await AsyncStorage.setItem('@temp_ticket_location', JSON.stringify(ticketData));
    } catch (e) {
      console.error('Failed to save location', e);
    }
    
    // Proceed to next step in submission flow (e.g., review or confirmation)
    router.push('/(citizen)/submit-problem/review' as any);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1B1E', padding: 16, justifyContent: 'space-between' }}>
      <View>
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#F2EFE9' }}>Pin Incident Location</Text>
          <Text style={{ fontSize: 13, color: '#9BA8A6', marginTop: 2 }}>We use your GPS to pinpoint infrastructure issues</Text>
        </View>

        {/* Map / GPS Box */}
        <View style={{ backgroundColor: '#16262A', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: '#1D3238', alignItems: 'center', marginBottom: 20 }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(47, 158, 143, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#2F9E8F' }}>
            <MapPin size={32} color="#2F9E8F" />
          </View>

          {loading ? (
            <View style={{ alignItems: 'center', marginVertical: 10 }}>
              <ActivityIndicator size="small" color="#2F9E8F" style={{ marginBottom: 8 }} />
              <Text style={{ color: '#9BA8A6', fontSize: 13 }}>Acquiring satellite lock...</Text>
            </View>
          ) : (
            <>
              <Text style={{ color: '#F2EFE9', fontWeight: 'bold', fontSize: 15, textAlign: 'center', marginBottom: 6 }}>
                {locationName}
              </Text>
              {errorMsg && <Text style={{ color: '#E8A33D', fontSize: 11, marginTop: 4 }}>{errorMsg}</Text>}
            </>
          )}
        </View>

        <TouchableOpacity 
          onPress={getCurrentLocation}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#16262A', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#1D3238' }}
        >
          <Navigation size={16} color="#2F9E8F" style={{ marginRight: 8 }} />
          <Text style={{ color: '#2F9E8F', fontWeight: '600', fontSize: 13 }}>Refresh GPS Location</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        onPress={handleNext}
        style={{ backgroundColor: '#2F9E8F', padding: 16, borderRadius: 16, alignItems: 'center', marginBottom: 12 }}
      >
        <Text style={{ color: '#0F1B1E', fontWeight: 'bold', fontSize: 16 }}>Confirm Location & Proceed</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}