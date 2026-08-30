import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Send, MapPin, FileText, AlertTriangle, Image as ImageIcon, Navigation } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

export default function ReviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Real GPS State
  const [reportLocation, setReportLocation] = useState('Fetching current GPS location...');
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLocLoading, setIsLocLoading] = useState(true);

  // Attached Image State
  const [attachedImage, setAttachedImage] = useState<string | null>(null);

  const reportCategory = (params.category as string) || 'Water Supply';
  const reportDescription = (params.description as string) || 'General municipal infrastructure grievance reported in Howrah.';

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
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setReportLocation('Howrah, West Bengal, India (Permission Denied)');
        setIsLocLoading(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = currentLocation.coords;
      setCoords({ latitude, longitude });

      // Reverse geocode to get a clean street/area address
      let reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const formatted = `${address.name || address.street || ''}, ${address.subregion || address.city || 'Howrah'}, ${address.region || 'West Bengal'}`;
        setReportLocation(formatted.replace(/^,\s/, ''));
      } else {
        setReportLocation(`Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`);
      }
    } catch (error) {
      console.error('Error fetching GPS:', error);
      setReportLocation('Howrah, West Bengal, India');
    } finally {
      setIsLocLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const ticketId = `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newTicket = {
        id: ticketId,
        category: reportCategory,
        description: reportDescription,
        location: reportLocation,
        latitude: coords?.latitude || 22.5958,
        longitude: coords?.longitude || 88.2636,
        imageUri: attachedImage, // Save the image to the ticket
        status: 'Pending',
        timestamp: 'Just now',
      };

      const existingTicketsJson = await AsyncStorage.getItem('@citizen_tickets');
      const existingTickets = existingTicketsJson ? JSON.parse(existingTicketsJson) : [];

      const updatedTickets = [newTicket, ...existingTickets];
      await AsyncStorage.setItem('@citizen_tickets', JSON.stringify(updatedTickets));

      // Optional: Clear temporary storage after successful submission
      await AsyncStorage.removeItem('@temp_ticket_image');

      setTimeout(() => {
        setIsSubmitting(false);
        router.push('/(citizen)/submit-problem/confirmation' as any);
      }, 1000);
    } catch (error) {
      console.error('Failed to save ticket locally', error);
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1B1E', padding: 16 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}>
        
        <View style={{ marginBottom: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#E8A33D' }}>STEP 4 OF 4</Text>
          <Text style={{ fontSize: 12, color: '#9BA8A6' }}>Review & Submit</Text>
        </View>

        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#F2EFE9', marginBottom: 8 }}>Review your report</Text>
        <Text style={{ fontSize: 14, color: '#9BA8A6', marginBottom: 24 }}>
          Please verify the details below before submitting to the authorities.
        </Text>

        <View style={{ backgroundColor: '#16262A', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#1D3238', marginBottom: 24 }}>
          
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 }}>
            <AlertTriangle size={20} color="#E8A33D" style={{ marginTop: 2, marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#9BA8A6', fontSize: 12, marginBottom: 4 }}>SELECTED DEPARTMENT</Text>
              <Text style={{ color: '#F2EFE9', fontSize: 16, fontWeight: '500' }}>{reportCategory}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 }}>
            <FileText size={20} color="#E8A33D" style={{ marginTop: 2, marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#9BA8A6', fontSize: 12, marginBottom: 4 }}>DESCRIPTION</Text>
              <Text style={{ color: '#F2EFE9', fontSize: 14, lineHeight: 20 }}>{reportDescription}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 }}>
            <MapPin size={20} color="#E8A33D" style={{ marginTop: 2, marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <Text style={{ color: '#9BA8A6', fontSize: 12 }}>GPS LOCATION</Text>
                <TouchableOpacity onPress={fetchCurrentGPSLocation}>
                  <Text style={{ color: '#2F9E8F', fontSize: 11, fontWeight: '600' }}>Refresh GPS</Text>
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
                Submit Report
              </Text>
              <Send size={18} color="#0F1B1E" />
            </>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}