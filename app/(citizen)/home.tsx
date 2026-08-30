import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { PlusCircle, Clock, CheckCircle2, MapPin, Bell, ShieldCheck } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function CitizenHomeScreen() {
  const router = useRouter();
  const [tickets, setTickets] = useState<any[]>([]);

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
      } else {
        setTickets([
          { id: 'TKT-2026-8432', category: 'Water Supply', description: 'Broken handpump near block market', status: 'Pending', location: 'Howrah, West Bengal', date: '2 hrs ago', priority: 'High' },
          { id: 'TKT-2026-8721', category: 'Street Lighting', description: 'Streetlight outage near Rajabazar Crossing', status: 'In Review', location: 'Bally, Howrah', date: 'Today, 8:40 AM', priority: 'Medium' },
          { id: 'TKT-2026-9012', category: 'Waste Management', description: 'Garbage overflow opposite public health office', status: 'Resolved', location: 'Liluah', date: 'Yesterday', priority: 'Low' }
        ]);
      }
    } catch (error) {
      console.error('Failed to load tickets', error);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Resolved':
        return { bg: 'rgba(47, 158, 143, 0.12)', border: '#2F9E8F', color: '#2F9E8F', icon: CheckCircle2 };
      case 'In Review':
        return { bg: 'rgba(78, 122, 255, 0.12)', border: '#4E7AFF', color: '#4E7AFF', icon: ShieldCheck };
      default:
        return { bg: 'rgba(232, 163, 61, 0.12)', border: '#E8A33D', color: '#E8A33D', icon: Clock };
    }
  };

  const activeCount = tickets.filter((t) => t.status !== 'Resolved').length;
  const resolvedCount = tickets.filter((t) => t.status === 'Resolved').length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1B1E', padding: 16 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <View>
            <Text style={{ fontSize: 11, color: '#9BA8A6', letterSpacing: 1.2, marginBottom: 4 }}>HOWRAH MUNICIPAL CORPORATION</Text>
            <Text style={{ fontSize: 28, fontWeight: '800', color: '#F2EFE9' }}>CivicPortal</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/notifications' as any)} style={{ backgroundColor: '#16262A', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#1D3238' }}>
            <Bell size={20} color="#E8A33D" />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 18 }}>
          <View style={{ flex: 1, backgroundColor: '#16262A', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#1D3238' }}>
            <Text style={{ color: '#9BA8A6', fontSize: 10, marginBottom: 4 }}>ACTIVE</Text>
            <Text style={{ color: '#F2EFE9', fontSize: 22, fontWeight: '800' }}>{activeCount}</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: '#16262A', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#1D3238' }}>
            <Text style={{ color: '#9BA8A6', fontSize: 10, marginBottom: 4 }}>RESOLVED</Text>
            <Text style={{ color: '#2F9E8F', fontSize: 22, fontWeight: '800' }}>{resolvedCount}</Text>
          </View>
        </View>

        <TouchableOpacity 
          onPress={() => router.push('/(citizen)/submit-problem' as any)}
          style={{ backgroundColor: '#2F9E8F', borderRadius: 18, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, shadowColor: '#2F9E8F', shadowOpacity: 0.2, shadowRadius: 18, shadowOffset: { width: 0, height: 8 } }}
        >
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={{ color: '#0F1B1E', fontSize: 18, fontWeight: '800', marginBottom: 4 }}>Report a Problem</Text>
            <Text style={{ color: '#0F1B1E', fontSize: 13, opacity: 0.8 }}>Water, roads, lighting, garbage, and public services</Text>
          </View>
          <View style={{ backgroundColor: 'rgba(15, 27, 30, 0.08)', padding: 10, borderRadius: 12 }}>
            <PlusCircle size={27} color="#0F1B1E" />
          </View>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ color: '#F2EFE9', fontSize: 16, fontWeight: '700' }}>My grievance history</Text>
          <Text style={{ color: '#9BA8A6', fontSize: 12 }}>({tickets.length})</Text>
        </View>

        {tickets.length === 0 ? (
          <View style={{ backgroundColor: '#16262A', padding: 30, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#1D3238' }}>
            <Text style={{ color: '#9BA8A6', fontSize: 14 }}>No grievances submitted yet.</Text>
          </View>
        ) : (
          tickets.map((item, index) => {
            const statusStyle = getStatusStyle(item.status || 'Pending');
            const StatusIcon = statusStyle.icon;

            return (
              <View key={index} style={{ backgroundColor: '#16262A', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1D3238', marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={{ color: '#F2EFE9', fontWeight: '700', fontSize: 15, marginBottom: 6 }}>{item.description}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                      <MapPin size={12} color="#9BA8A6" style={{ marginRight: 4 }} />
                      <Text style={{ color: '#9BA8A6', fontSize: 12 }}>{item.location || 'Howrah, West Bengal'}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ backgroundColor: 'rgba(232, 163, 61, 0.12)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#E8A33D' }}>
                        <Text style={{ color: '#E8A33D', fontSize: 10, fontWeight: '700' }}>{item.priority || 'Priority'}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: statusStyle.bg, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: statusStyle.border }}>
                    <StatusIcon size={12} color={statusStyle.color} style={{ marginRight: 4 }} />
                    <Text style={{ color: statusStyle.color, fontSize: 10, fontWeight: '800' }}>{item.status || 'Pending'}</Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#1D3238' }}>
                  <Text style={{ color: '#E8A33D', fontSize: 11, fontWeight: '700' }}>{item.id} • {item.category || 'General'}</Text>
                  <Text style={{ color: '#9BA8A6', fontSize: 11 }}>{item.date || item.timestamp || 'Just now'}</Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}