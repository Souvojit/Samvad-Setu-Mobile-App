import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Send, MapPin, FileText, AlertTriangle, Image as ImageIcon } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useProblemStore } from '../../../store/problemStore';

export default function ReviewScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Read from Zustand Global Memory
  const department = useProblemStore((state: any) => state.department);
  const description = useProblemStore((state: any) => state.description);

  // Real GPS State
  const [reportLocation, setReportLocation] = useState('Fetching GPS location...');
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLocLoading, setIsLocLoading] = useState(true);

  // Attached Image State
  const [attachedImage, setAttachedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentGPSLocation();
    fetchAttachedImage();
  }, []);

  const fetchAttachedImage = async () => {
    try {
      const img = await AsyncStorage.getItem('@temp_ticket_image');
      if (img) setAttachedImage(img);
    } catch (e) {
      console.error('Error fetching image for review', e);
    }
  };

  const fetchCurrentGPSLocation = async () => {
    setIsLocLoading(true);
    try {
      // 1. Verify device location services are active
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        setReportLocation('Location services disabled on device');
        setIsLocLoading(false);
        return;
      }

      // 2. Request runtime permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setReportLocation('Location permission denied');
        setIsLocLoading(false);
        return;
      }

      // 3. Obtain location with balanced accuracy (fast lock for indoor/outdoor)
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }).catch(async () => {
        // Fallback to cached position if live satellite fix times out
        return await Location.getLastKnownPositionAsync();
      });

      if (!location) {
        location = await Location.getLastKnownPositionAsync();
      }

      if (location) {
        const { latitude, longitude } = location.coords;
        setCoords({ latitude, longitude });

        // 4. Reverse geocode to human-readable address
        const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (reverseGeocode && reverseGeocode.length > 0) {
          const place = reverseGeocode[0];
          const parts = [
            place.name || place.street,
            place.subregion || place.district || place.city,
            place.region,
            place.country,
          ].filter(Boolean);

          setReportLocation(parts.length > 0 ? parts.join(', ') : `Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`);
        } else {
          setReportLocation(`Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`);
        }
      } else {
        setReportLocation('Unable to pinpoint location');
      }
    } catch (error) {
      console.error('Error acquiring location:', error);
      setReportLocation('Location unavailable');
    } finally {
      setIsLocLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const ticketId = `CHAL-${Math.floor(1000 + Math.random() * 9000)}`;
      const newTicket = {
        id: ticketId,
        title: description ? (description.length > 35 ? `${description.substring(0, 35)}...` : description) : 'Grassroots Innovation Challenge',
        domain: department,
        description: description,
        stage: 'Submitted',
        status: 'Open for HEI Claim',
        assignedDept: 'Pending AI Routing',
        suggestedHEI: 'Pending Allocation',
        industryPledge: null,
        location: reportLocation,
        latitude: coords?.latitude || 23.3441,
        longitude: coords?.longitude || 85.3096,
        imageUri: attachedImage,
        date: 'Just now',
      };

      const existingTicketsJson = await AsyncStorage.getItem('@citizen_tickets');
      const existingTickets = existingTicketsJson ? JSON.parse(existingTicketsJson) : [];

      const updatedTickets = [newTicket, ...existingTickets];
      await AsyncStorage.setItem('@citizen_tickets', JSON.stringify(updatedTickets));

      await AsyncStorage.removeItem('@temp_ticket_image');

      setTimeout(() => {
        setIsSubmitting(false);
        router.push('/(citizen)/home' as any);
      }, 800);
    } catch (error) {
      console.error('Failed to save ticket locally', error);
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1B1E', padding: 16 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        
        <View style={{ marginBottom: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#E8A33D' }}>STEP 4 OF 4</Text>
          <Text style={{ fontSize: 12, color: '#9BA8A6' }}>Review & Submit</Text>
        </View>

        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#F2EFE9', marginBottom: 8 }}>Review your report</Text>
        <Text style={{ fontSize: 14, color: '#9BA8A6', marginBottom: 24 }}>
          Please verify the details below before submitting to the innovation portal.
        </Text>

        <View style={{ backgroundColor: '#16262A', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#1D3238', marginBottom: 24 }}>
          
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 }}>
            <AlertTriangle size={20} color="#E8A33D" style={{ marginTop: 2, marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#9BA8A6', fontSize: 12, marginBottom: 4 }}>THEMATIC DOMAIN</Text>
              <Text style={{ color: '#F2EFE9', fontSize: 16, fontWeight: '500' }}>{department}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 }}>
            <FileText size={20} color="#E8A33D" style={{ marginTop: 2, marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#9BA8A6', fontSize: 12, marginBottom: 4 }}>DESCRIPTION</Text>
              <Text style={{ color: '#F2EFE9', fontSize: 14, lineHeight: 20 }}>
                {description || 'No description provided.'}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 }}>
            <MapPin size={20} color="#E8A33D" style={{ marginTop: 2, marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <Text style={{ color: '#9BA8A6', fontSize: 12 }}>GPS LOCATION</Text>
                <TouchableOpacity onPress={fetchCurrentGPSLocation} disabled={isLocLoading}>
                  <Text style={{ color: '#2F9E8F', fontSize: 11, fontWeight: '600' }}>
                    {isLocLoading ? 'Locating...' : 'Refresh GPS'}
                  </Text>
                </TouchableOpacity>
              </View>
              {isLocLoading ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <ActivityIndicator size="small" color="#2F9E8F" style={{ marginRight: 8 }} />
                  <Text style={{ color: '#9BA8A6', fontSize: 13 }}>Acquiring satellite fix...</Text>
                </View>
              ) : (
                <Text style={{ color: '#F2EFE9', fontSize: 14, lineHeight: 20 }}>{reportLocation}</Text>
              )}
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <ImageIcon size={20} color="#E8A33D" style={{ marginTop: 2, marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#9BA8A6', fontSize: 12, marginBottom: 8 }}>EVIDENCE</Text>
              {attachedImage ? (
                <Image 
                  source={{ uri: attachedImage }} 
                  style={{ width: 100, height: 100, borderRadius: 8, borderWidth: 1, borderColor: '#2F9E8F' }} 
                />
              ) : (
                <Text style={{ color: '#E8A33D', fontSize: 14, fontWeight: '500' }}>No image attached</Text>
              )}
            </View>
          </View>

        </View>

        <View style={{ flex: 1 }} />

        <TouchableOpacity 
          onPress={handleSubmit}
          disabled={isSubmitting || isLocLoading}
          style={{ 
            backgroundColor: '#2F9E8F', 
            paddingVertical: 16, 
            borderRadius: 12, 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'center',
            opacity: isLocLoading ? 0.7 : 1
          }}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#0F1B1E" />
          ) : (
            <>
              <Text style={{ color: '#0F1B1E', fontWeight: 'bold', fontSize: 16, marginRight: 8 }}>
                Submit Challenge
              </Text>
              <Send size={18} color="#0F1B1E" />
            </>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}