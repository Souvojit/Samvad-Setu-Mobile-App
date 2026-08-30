import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ShieldCheck, Mail, LogOut, CheckCircle2, Activity } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function GovernmentProfileScreen() {
  const router = useRouter();
  const [stats, setStats] = useState({ total: 0, resolved: 0 });

  useFocusEffect(
    React.useCallback(() => {
      loadStats();
    }, [])
  );

  const loadStats = async () => {
    try {
      const storedTickets = await AsyncStorage.getItem('@citizen_tickets');
      if (storedTickets) {
        const parsed = JSON.parse(storedTickets);
        const resolvedCount = parsed.filter((t: any) => t.status === 'Resolved').length;
        setStats({ total: parsed.length, resolved: resolvedCount });
      }
    } catch (error) {
      console.error('Error loading stats', error);
    }
  };

  const handleLogout = () => {
    Alert.alert('Secure Sign Out', 'End this official session?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Sign Out', 
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.multiRemove(['@app_user_role']);
          router.replace('/(auth)/login' as any);
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1B1E', padding: 16 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        
        <View style={{ marginBottom: 32, marginTop: 12 }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: '#F2EFE9' }}>Official Profile</Text>
        </View>

        {/* Official Identity Card */}
        <View style={{ backgroundColor: '#16262A', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#1D3238', marginBottom: 24, alignItems: 'center' }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(47, 158, 143, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#2F9E8F' }}>
            <ShieldCheck size={40} color="#2F9E8F" />
          </View>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#F2EFE9', marginBottom: 4 }}>HMC Administrator</Text>
          <Text style={{ color: '#2F9E8F', fontSize: 12, fontWeight: 'bold', marginBottom: 12, letterSpacing: 1 }}>ZONE 2 SUPERVISOR</Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Mail size={14} color="#9BA8A6" style={{ marginRight: 6 }} />
            <Text style={{ color: '#9BA8A6', fontSize: 14 }}>admin@hmc.gov</Text>
          </View>
        </View>

        {/* Team Performance Stats */}
        <Text style={{ color: '#F2EFE9', fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>Department Performance</Text>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 32 }}>
          <View style={{ flex: 1, backgroundColor: '#16262A', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1D3238', alignItems: 'center' }}>
            <Activity size={24} color="#E8A33D" style={{ marginBottom: 8 }} />
            <Text style={{ color: '#F2EFE9', fontSize: 24, fontWeight: 'bold' }}>{stats.total}</Text>
            <Text style={{ color: '#9BA8A6', fontSize: 11, marginTop: 4, textAlign: 'center' }}>TOTAL TICKETS ASSIGNED</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: '#16262A', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1D3238', alignItems: 'center' }}>
            <CheckCircle2 size={24} color="#2F9E8F" style={{ marginBottom: 8 }} />
            <Text style={{ color: '#F2EFE9', fontSize: 24, fontWeight: 'bold' }}>{stats.resolved}</Text>
            <Text style={{ color: '#9BA8A6', fontSize: 11, marginTop: 4, textAlign: 'center' }}>ISSUES RESOLVED</Text>
          </View>
        </View>

        {/* Secure Logout Button */}
        <TouchableOpacity 
          onPress={handleLogout}
          style={{ 
            backgroundColor: 'rgba(248, 113, 113, 0.1)', 
            borderWidth: 1, 
            borderColor: '#F87171', 
            borderRadius: 12, 
            paddingVertical: 16, 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
        >
          <LogOut size={18} color="#F87171" style={{ marginRight: 8 }} />
          <Text style={{ color: '#F87171', fontWeight: 'bold', fontSize: 16 }}>Secure Sign Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}