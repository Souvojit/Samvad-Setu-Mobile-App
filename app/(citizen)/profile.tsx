import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { User, MapPin, Mail, Phone, Award, LogOut, Clock, CheckCircle2 } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function CitizenProfileScreen() {
  const router = useRouter();
  const [tickets, setTickets] = useState<any[]>([]);

  // Refresh tickets whenever the profile tab comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadTickets();
    }, [])
  );

  const loadTickets = async () => {
    try {
      const stored = await AsyncStorage.getItem('@citizen_tickets');
      if (stored) {
        setTickets(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load tickets', error);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Logout', 
        style: 'destructive',
        onPress: async () => {
          // Clear authentication session data securely
          await AsyncStorage.multiRemove(['@app_user_role', '@user_email']);
          router.replace('/(auth)/login' as any);
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1B1E', padding: 16 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#F2EFE9', marginBottom: 20 }}>Citizen Profile</Text>

        {/* User Info Card */}
        <View style={{ backgroundColor: '#16262A', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#1D3238', alignItems: 'center', marginBottom: 24 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#E8A33D', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <User size={40} color="#0F1B1E" />
          </View>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#F2EFE9', marginBottom: 4 }}>Souvojit Sadhukhan</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <MapPin size={14} color="#9BA8A6" style={{ marginRight: 4 }} />
            <Text style={{ fontSize: 13, color: '#9BA8A6' }}>Howrah, West Bengal, India</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(232, 163, 61, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#E8A33D' }}>
            <Award size={16} color="#E8A33D" style={{ marginRight: 6 }} />
            <Text style={{ color: '#E8A33D', fontSize: 12, fontWeight: 'bold' }}>Civic Contributor • Level 2</Text>
          </View>
        </View>

        {/* Contact Details */}
        <View style={{ backgroundColor: '#16262A', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1D3238', marginBottom: 24 }}>
          <Text style={{ color: '#F2EFE9', fontSize: 16, fontWeight: 'bold', marginBottom: 16 }}>Account Details</Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Mail size={18} color="#9BA8A6" style={{ marginRight: 12 }} />
            <View>
              <Text style={{ color: '#9BA8A6', fontSize: 11 }}>EMAIL</Text>
              <Text style={{ color: '#F2EFE9', fontSize: 14 }}>souvojit.s@sih2026.gov</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Phone size={18} color="#9BA8A6" style={{ marginRight: 12 }} />
            <View>
              <Text style={{ color: '#9BA8A6', fontSize: 11 }}>PHONE</Text>
              <Text style={{ color: '#F2EFE9', fontSize: 14 }}>+91 98765 43210</Text>
            </View>
          </View>
        </View>

        {/* Dynamic Stored Reports */}
        <Text style={{ color: '#F2EFE9', fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>My Submitted Reports</Text>
        
        <View style={{ backgroundColor: '#16262A', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1D3238', marginBottom: 24 }}>
          {tickets.length === 0 ? (
            <Text style={{ color: '#9BA8A6', fontSize: 13, textAlign: 'center', paddingVertical: 10 }}>No reports submitted yet.</Text>
          ) : (
            tickets.map((item, index) => {
              const isResolved = item.status === 'Resolved';
              return (
                <View 
                  key={index} 
                  style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    paddingBottom: index < tickets.length - 1 ? 12 : 0, 
                    borderBottomWidth: index < tickets.length - 1 ? 1 : 0, 
                    borderBottomColor: '#1D3238', 
                    marginBottom: index < tickets.length - 1 ? 12 : 0 
                  }}
                >
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <Text style={{ color: '#F2EFE9', fontWeight: 'bold', fontSize: 14 }}>{item.description}</Text>
                    <Text style={{ color: '#9BA8A6', fontSize: 12, marginTop: 4 }}>{item.id} • {item.category}</Text>
                  </View>
                  <View style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    backgroundColor: isResolved ? 'rgba(47, 158, 143, 0.1)' : 'rgba(232, 163, 61, 0.1)', 
                    paddingHorizontal: 8, 
                    paddingVertical: 4, 
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: isResolved ? '#2F9E8F' : '#E8A33D'
                  }}>
                    {isResolved ? (
                      <CheckCircle2 size={12} color="#2F9E8F" style={{ marginRight: 4 }} />
                    ) : (
                      <Clock size={12} color="#E8A33D" style={{ marginRight: 4 }} />
                    )}
                    <Text style={{ color: isResolved ? '#2F9E8F' : '#E8A33D', fontSize: 11, fontWeight: 'bold' }}>{item.status}</Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Secure Logout Button */}
        <TouchableOpacity 
          onPress={handleLogout}
          style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            borderWidth: 1, 
            borderColor: '#EF4444', 
            paddingVertical: 14, 
            borderRadius: 12, 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
        >
          <LogOut size={18} color="#EF4444" style={{ marginRight: 8 }} />
          <Text style={{ color: '#EF4444', fontWeight: 'bold', fontSize: 15 }}>Secure Sign Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}