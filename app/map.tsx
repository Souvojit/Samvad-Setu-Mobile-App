import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin } from 'lucide-react-native';

export default function MapScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1B1E', padding: 16 }}>
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#F2EFE9' }}>Live Infrastructure Map</Text>
        <Text style={{ fontSize: 13, color: '#9BA8A6', marginTop: 2 }}>Howrah Municipal Corporation Area</Text>
      </View>

      <View style={{ flex: 1, backgroundColor: '#16262A', borderRadius: 16, borderWidth: 1, borderColor: '#1D3238', justifyContent: 'center', alignItems: 'center' }}>
        <MapPin size={48} color="#2F9E8F" style={{ marginBottom: 12 }} />
        <Text style={{ color: '#F2EFE9', fontWeight: 'bold', fontSize: 16 }}>Interactive Map View</Text>
        <Text style={{ color: '#9BA8A6', fontSize: 12, marginTop: 4 }}>Displaying reported grievances around Howrah</Text>
      </View>
    </SafeAreaView>
  );
}