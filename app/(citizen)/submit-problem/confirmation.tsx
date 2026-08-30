import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CheckCircle2, Home } from 'lucide-react-native';

export default function ConfirmationScreen() {
  const router = useRouter();
  
  // Generating a realistic mock ticket ID based on the current year
  const ticketId = `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1B1E', padding: 24, justifyContent: 'center', alignItems: 'center' }}>
      
      <View style={{ alignItems: 'center', marginBottom: 40 }}>
        <CheckCircle2 size={80} color="#2F9E8F" style={{ marginBottom: 24 }} />
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#F2EFE9', textAlign: 'center', marginBottom: 12 }}>
          Report Submitted!
        </Text>
        <Text style={{ fontSize: 16, color: '#9BA8A6', textAlign: 'center', lineHeight: 24, paddingHorizontal: 20 }}>
          Thank you for helping improve the community. The local authorities have been notified.
        </Text>
      </View>

      <View style={{ backgroundColor: '#16262A', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 12, borderWidth: 1, borderColor: '#1D3238', marginBottom: 40 }}>
        <Text style={{ color: '#9BA8A6', fontSize: 12, textAlign: 'center', marginBottom: 4 }}>YOUR TRACKING ID</Text>
        <Text style={{ color: '#E8A33D', fontSize: 20, fontWeight: 'bold', letterSpacing: 1 }}>{ticketId}</Text>
      </View>

      <TouchableOpacity 
        // Using replace() instead of push() prevents the user from swiping back to the form
        onPress={() => router.replace('/(citizen)/home' as any)}
        style={{ 
          backgroundColor: '#E8A33D', 
          paddingVertical: 16, 
          paddingHorizontal: 32,
          borderRadius: 12, 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: '100%'
        }}
      >
        <Home size={20} color="#0F1B1E" style={{ marginRight: 8 }} />
        <Text style={{ color: '#0F1B1E', fontWeight: 'bold', fontSize: 16 }}>
          Return to Dashboard
        </Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}