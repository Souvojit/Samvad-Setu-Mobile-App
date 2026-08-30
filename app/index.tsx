import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ShieldCheck, User, ArrowRight, Building2, Activity, Clock3 } from 'lucide-react-native';

export default function RoleSelectionScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1B1E', padding: 20 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingBottom: 40 }}>
        <View style={{ alignItems: 'center', marginBottom: 28 }}>
          <View style={{ width: 84, height: 84, borderRadius: 24, backgroundColor: '#16262A', borderWidth: 1, borderColor: '#2F9E8F', alignItems: 'center', justifyContent: 'center', marginBottom: 16, shadowColor: '#2F9E8F', shadowOpacity: 0.22, shadowRadius: 18, shadowOffset: { width: 0, height: 10 } }}>
            <ShieldCheck size={38} color="#2F9E8F" />
          </View>
          <Text style={{ fontSize: 30, fontWeight: '800', color: '#F2EFE9', textAlign: 'center', marginBottom: 8 }}>
            Samvad-Setu
          </Text>
          <Text style={{ fontSize: 14, color: '#9BA8A6', textAlign: 'center', paddingHorizontal: 24, lineHeight: 20 }}>
            Public issue reporting, municipal oversight, and transparent civic action in one place.
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          <View style={{ flex: 1, backgroundColor: '#16262A', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#1D3238' }}>
            <Activity size={16} color="#2F9E8F" style={{ marginBottom: 8 }} />
            <Text style={{ color: '#9BA8A6', fontSize: 10, marginBottom: 4, letterSpacing: 0.8 }}>LIVE NODES</Text>
            <Text style={{ color: '#F2EFE9', fontSize: 20, fontWeight: '700' }}>128</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: '#16262A', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#1D3238' }}>
            <Clock3 size={16} color="#E8A33D" style={{ marginBottom: 8 }} />
            <Text style={{ color: '#9BA8A6', fontSize: 10, marginBottom: 4, letterSpacing: 0.8 }}>AVG. SLA</Text>
            <Text style={{ color: '#F2EFE9', fontSize: 20, fontWeight: '700' }}>48h</Text>
          </View>
        </View>

        <Text style={{ fontSize: 16, fontWeight: '700', color: '#F2EFE9', marginBottom: 16 }}>
          Choose your portal
        </Text>

        <TouchableOpacity 
          onPress={() => router.push({ pathname: '/(auth)/login', params: { portal: 'citizen' } } as any)}
          style={{ 
            backgroundColor: '#16262A', 
            borderRadius: 18,
            padding: 20,
            borderWidth: 1,
            borderColor: '#1D3238',
            marginBottom: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View style={{ backgroundColor: 'rgba(232, 163, 61, 0.12)', padding: 12, borderRadius: 12, marginRight: 16 }}>
              <User size={24} color="#E8A33D" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#F2EFE9', fontSize: 18, fontWeight: '700', marginBottom: 4 }}>Citizen Portal</Text>
              <Text style={{ color: '#9BA8A6', fontSize: 13, lineHeight: 18 }}>Report civic issues, track progress, and get status updates in real time.</Text>
            </View>
          </View>
          <ArrowRight size={20} color="#E8A33D" />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => router.push({ pathname: '/(auth)/login', params: { portal: 'authority' } } as any)}
          style={{ 
            backgroundColor: '#16262A', 
            borderRadius: 18,
            padding: 20,
            borderWidth: 1,
            borderColor: '#1D3238',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View style={{ backgroundColor: 'rgba(47, 158, 143, 0.12)', padding: 12, borderRadius: 12, marginRight: 16 }}>
              <Building2 size={24} color="#2F9E8F" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#F2EFE9', fontSize: 18, fontWeight: '700', marginBottom: 4 }}>Authority Portal</Text>
              <Text style={{ color: '#9BA8A6', fontSize: 13, lineHeight: 18 }}>Review municipal queues, assign teams, and resolve infrastructure complaints.</Text>
            </View>
          </View>
          <ArrowRight size={20} color="#2F9E8F" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}