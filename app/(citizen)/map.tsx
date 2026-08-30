import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, AlertCircle } from 'lucide-react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const hotspots = [
  { name: 'Howrah Station', count: 18, type: 'Water & Drainage', status: 'Critical' },
  { name: 'Rajabazar', count: 12, type: 'Street Lighting', status: 'Moderate' },
  { name: 'Liluah', count: 9, type: 'Waste Collection', status: 'Watchlist' },
  { name: 'Bally', count: 7, type: 'Road Repairs', status: 'Moderate' }
];

export default function CitizenMapScreen() {
  const [tickets, setTickets] = useState<any[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      loadTickets();
    }, [])
  );

  const loadTickets = async () => {
    try {
      const stored = await AsyncStorage.getItem('@citizen_tickets');
      if (stored) setTickets(JSON.parse(stored));
    } catch (error) {
      console.error('Failed to load tickets for map', error);
    }
  };

  const howrahRegion = {
    latitude: 22.5958,
    longitude: 88.2636,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1B1E', padding: 16 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ marginBottom: 18 }}>
          <Text style={{ fontSize: 11, color: '#9BA8A6', letterSpacing: 1.2, marginBottom: 4 }}>LIVE INFRASTRUCTURE VIEW</Text>
          <Text style={{ fontSize: 28, fontWeight: '800', color: '#F2EFE9' }}>Civic Heat Map</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 18 }}>
          <View style={{ flex: 1, backgroundColor: '#16262A', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#1D3238' }}>
            <Text style={{ color: '#9BA8A6', fontSize: 10, marginBottom: 4 }}>ACTIVE ISSUES</Text>
            <Text style={{ color: '#F2EFE9', fontSize: 22, fontWeight: '800' }}>{tickets.length}</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: '#16262A', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#1D3238' }}>
            <Text style={{ color: '#9BA8A6', fontSize: 10, marginBottom: 4 }}>PENDING</Text>
            <Text style={{ color: '#E8A33D', fontSize: 22, fontWeight: '800' }}>
              {tickets.filter(t => t.status === 'Pending').length}
            </Text>
          </View>
        </View>

        {/* Live Interactive Map Box */}
        <View style={{ backgroundColor: '#16262A', borderRadius: 20, borderWidth: 1, borderColor: '#1D3238', padding: 16, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ color: '#F2EFE9', fontSize: 16, fontWeight: '700' }}>Howrah service zone</Text>
            <Text style={{ color: '#2F9E8F', fontSize: 11, fontWeight: '700' }}>Live GPS Data</Text>
          </View>

          <View style={{ height: 250, backgroundColor: '#0F1B1E', borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: '#1D3238' }}>
            <MapView
              style={StyleSheet.absoluteFillObject}
              initialRegion={howrahRegion}
              userInterfaceStyle="dark"
            >
              {tickets.map((ticket, index) => {
                if (!ticket.latitude || !ticket.longitude) return null;
                const pinColor = ticket.status === 'Resolved' ? '#2F9E8F' : (ticket.status === 'In Progress' ? '#E8A33D' : '#F87171');
                
                return (
                  <Marker
                    key={ticket.id || index}
                    coordinate={{ latitude: parseFloat(ticket.latitude), longitude: parseFloat(ticket.longitude) }}
                    pinColor={pinColor}
                  >
                    <Callout tooltip>
                      <View style={{ backgroundColor: '#16262A', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#1D3238', minWidth: 200 }}>
                        <Text style={{ color: '#F2EFE9', fontWeight: 'bold', fontSize: 14, marginBottom: 4 }}>{ticket.category}</Text>
                        <Text style={{ color: pinColor, fontSize: 12, fontWeight: 'bold' }}>{ticket.status}</Text>
                      </View>
                    </Callout>
                  </Marker>
                );
              })}
            </MapView>
          </View>
        </View>

        <Text style={{ color: '#F2EFE9', fontSize: 16, fontWeight: '700', marginBottom: 12 }}>Hotspots near you</Text>

        {hotspots.map((spot) => (
          <View key={spot.name} style={{ backgroundColor: '#16262A', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#1D3238', marginBottom: 10, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: spot.status === 'Critical' ? 'rgba(232, 163, 61, 0.12)' : 'rgba(47, 158, 143, 0.12)', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              {spot.status === 'Critical' ? <AlertCircle size={20} color="#E8A33D" /> : <MapPin size={20} color="#2F9E8F" />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#F2EFE9', fontSize: 15, fontWeight: '700', marginBottom: 2 }}>{spot.name}</Text>
              <Text style={{ color: '#9BA8A6', fontSize: 12 }}>{spot.type}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ color: spot.status === 'Critical' ? '#E8A33D' : '#2F9E8F', fontSize: 11, fontWeight: '700', marginBottom: 4 }}>{spot.status}</Text>
              <Text style={{ color: '#F2EFE9', fontSize: 12, fontWeight: '700' }}>{spot.count} reports</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}