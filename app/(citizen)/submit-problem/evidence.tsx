import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowRight, Camera, Image as ImageIcon, CheckCircle } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EvidenceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleOpenCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Camera permission is required to take a photo!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleOpenGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Media library permission is required to select a photo!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleNext = async () => {
    try {
      // Securely store the image URI locally so the Review screen can pick it up
      if (imageUri) {
        await AsyncStorage.setItem('@temp_ticket_image', imageUri);
      } else {
        await AsyncStorage.removeItem('@temp_ticket_image');
      }
    } catch (e) {
      console.error('Failed to save image locally', e);
    }

    // Fix: Route to the location screen next, not the review screen
    router.push({
      pathname: '/(citizen)/submit-problem/location',
      params: params
    } as any);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1B1E', padding: 16 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}>
        
        <View style={{ marginBottom: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#E8A33D' }}>STEP 2 OF 4</Text>
          <Text style={{ fontSize: 12, color: '#9BA8A6' }}>Evidence Capture</Text>
        </View>

        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#F2EFE9', marginBottom: 8 }}>Attach Photo Evidence</Text>
        <Text style={{ fontSize: 14, color: '#9BA8A6', marginBottom: 24 }}>
          Take a live photo or upload an existing image from your gallery to help municipal field agents.
        </Text>

        {imageUri && (
          <View style={{ marginBottom: 20, alignItems: 'center', backgroundColor: '#16262A', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#2F9E8F' }}>
            <Image source={{ uri: imageUri }} style={{ width: '100%', height: 180, borderRadius: 12, marginBottom: 8 }} />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CheckCircle size={16} color="#2F9E8F" style={{ marginRight: 6 }} />
              <Text style={{ color: '#2F9E8F', fontWeight: 'bold', fontSize: 13 }}>Photo Attached Successfully</Text>
            </View>
          </View>
        )}

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          <TouchableOpacity 
            onPress={handleOpenCamera}
            style={{ 
              flex: 1, backgroundColor: '#16262A', height: 180, borderRadius: 16, 
              borderWidth: 1, borderColor: '#1D3238', justifyContent: 'center', 
              alignItems: 'center', padding: 12
            }}
          >
            <Camera size={36} color="#2F9E8F" style={{ marginBottom: 12 }} />
            <Text style={{ color: '#F2EFE9', fontWeight: 'bold', fontSize: 13, textAlign: 'center' }}>Take Photo</Text>
            <Text style={{ color: '#9BA8A6', fontSize: 11, marginTop: 4, textAlign: 'center' }}>Open Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleOpenGallery}
            style={{ 
              flex: 1, backgroundColor: '#16262A', height: 180, borderRadius: 16, 
              borderWidth: 1, borderColor: '#1D3238', justifyContent: 'center', 
              alignItems: 'center', padding: 12
            }}
          >
            <ImageIcon size={36} color="#2F9E8F" style={{ marginBottom: 12 }} />
            <Text style={{ color: '#F2EFE9', fontWeight: 'bold', fontSize: 13, textAlign: 'center' }}>Upload Photo</Text>
            <Text style={{ color: '#9BA8A6', fontSize: 11, marginTop: 4, textAlign: 'center' }}>From Gallery</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1 }} />

        <TouchableOpacity 
          onPress={handleNext}
          style={{ 
            backgroundColor: '#E8A33D', paddingVertical: 16, borderRadius: 12, 
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center' 
          }}
        >
          <Text style={{ color: '#0F1B1E', fontWeight: 'bold', fontSize: 16, marginRight: 8 }}>Next: Location Pin</Text>
          <ArrowRight size={18} color="#0F1B1E" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}