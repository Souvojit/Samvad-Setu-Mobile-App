import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CheckCircle2, Clock, MapPin, ChevronRight, Filter, AlertTriangle } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function GovernmentHomeScreen() {
  const router = useRouter();
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('All');

  useFocusEffect(
    React.useCallback(() => {
      loadAllTickets();
    }, [])
  );

  const loadAllTickets = async () => {
    try {
      const stored = await AsyncStorage.getItem('@citizen_tickets');
      if (stored) {
        setTickets(JSON.parse(stored));
      } else {
        setTickets([
          { id: 'TKT-2026-8432', category: 'Water Supply', description: 'Broken handpump near block market', status: 'Pending', location: 'Howrah, West Bengal', priority: 'High' },
          { id: 'TKT-2026-5511', category: 'Roads/PWD', description: 'Large pothole near station junction', status: 'Pending', location: 'Howrah, West Bengal', priority: 'High' },
          { id: 'TKT-2026-1049', category: 'Lighting', description: 'Streetlight malfunction on main road', status: 'Resolved', location: 'Howrah, West Bengal', priority: 'Low' }
        ]);
      }
    } catch (error) {
      console.error('Failed to load tickets for authority queue', error);
    }
  };

  const filteredTickets = selectedFilter === 'All'
    ? tickets
    : tickets.filter((t) => (t.category || '').trim().toLowerCase() === selectedFilter.trim().toLowerCase());

  const categories = ['All', 'Water Supply', 'Roads/PWD', 'Lighting'];
  const pendingCount = tickets.filter((t) => t.status === 'Pending' || t.status === 'In Review').length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1B1E', padding: 16 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 11, color: '#9BA8A6', letterSpacing: 1.2, marginBottom: 4 }}>MUNICIPAL OPERATIONS</Text>
          <Text style={{ fontSize: 28, fontWeight: '800', color: '#F2EFE9' }}>Authority Control Center</Text>
          <Text style={{ fontSize: 13, color: '#9BA8A6', marginTop: 4 }}>Howrah Municipal Corporation • Zone 2</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          <View style={{ flex: 1, backgroundColor: '#16262A', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#1D3238' }}>
            <Text style={{ color: '#9BA8A6', fontSize: 10, marginBottom: 4 }}>TOTAL ACTIVE</Text>
            <Text style={{ color: '#F2EFE9', fontSize: 22, fontWeight: '800' }}>{tickets.length}</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: '#16262A', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#1D3238' }}>
            <Text style={{ color: '#9BA8A6', fontSize: 10, marginBottom: 4 }}>PENDING</Text>
            <Text style={{ color: '#E8A33D', fontSize: 22, fontWeight: '800' }}>{pendingCount}</Text>
          </View>
        </View>

        <View style={{ backgroundColor: '#16262A', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#1D3238', marginBottom: 18 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <AlertTriangle size={14} color="#E8A33D" style={{ marginRight: 6 }} />
            <Text style={{ color: '#F2EFE9', fontSize: 14, fontWeight: '700' }}>Priority queue</Text>
          </View>
          <Text style={{ color: '#9BA8A6', fontSize: 12 }}>3 high-priority complaints are awaiting field review before 5:00 PM.</Text>
        </View>

        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Filter size={14} color="#9BA8A6" style={{ marginRight: 6 }} />
            <Text style={{ color: '#9BA8A6', fontSize: 11, fontWeight: '700', letterSpacing: 1 }}>FILTER BY DEPARTMENT</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedFilter(cat)}
                style={{
                  backgroundColor: selectedFilter === cat ? '#2F9E8F' : '#16262A',
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: selectedFilter === cat ? '#2F9E8F' : '#1D3238',
                }}
              >
                <Text style={{ color: selectedFilter === cat ? '#0F1B1E' : '#F2EFE9', fontWeight: '700', fontSize: 12 }}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <Text style={{ color: '#F2EFE9', fontSize: 16, fontWeight: '700', marginBottom: 12 }}>
          Grievance Action Queue ({filteredTickets.length})
        </Text>

        {filteredTickets.length === 0 ? (
          <View style={{ backgroundColor: '#16262A', padding: 30, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#1D3238' }}>
            <Text style={{ color: '#9BA8A6', fontSize: 14 }}>No grievances found for &ldquo;{selectedFilter}&rdquo;.</Text>
          </View>
        ) : (
          filteredTickets.map((item, index) => (
            <TouchableOpacity 
              key={index}
              onPress={() => router.push(`/(government)/ticket/${item.id}` as any)}
              style={{ backgroundColor: '#16262A', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1D3238', marginBottom: 12 }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={{ color: '#F2EFE9', fontWeight: '700', fontSize: 15, marginBottom: 4 }}>{item.description}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MapPin size={12} color="#9BA8A6" style={{ marginRight: 4 }} />
                    <Text style={{ color: '#9BA8A6', fontSize: 12 }}>{item.location || 'Howrah, West Bengal'}</Text>
                  </View>
                </View>
                <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  backgroundColor: item.status === 'Resolved' ? 'rgba(47, 158, 143, 0.1)' : 'rgba(232, 163, 61, 0.1)', 
                  paddingHorizontal: 8, 
                  paddingVertical: 4, 
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: item.status === 'Resolved' ? '#2F9E8F' : '#E8A33D'
                }}>
                  {item.status === 'Resolved' ? (
                    <CheckCircle2 size={12} color="#2F9E8F" style={{ marginRight: 4 }} />
                  ) : (
                    <Clock size={12} color="#E8A33D" style={{ marginRight: 4 }} />
                  )}
                  <Text style={{ color: item.status === 'Resolved' ? '#2F9E8F' : '#E8A33D', fontSize: 10, fontWeight: '800' }}>
                    {item.status || 'Pending'}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#1D3238' }}>
                <Text style={{ color: '#E8A33D', fontSize: 11, fontWeight: '700' }}>{item.id} • {item.category || 'General'}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: '#2F9E8F', fontSize: 12, fontWeight: '700', marginRight: 2 }}>Review</Text>
                  <ChevronRight size={14} color="#2F9E8F" />
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}