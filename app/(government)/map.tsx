import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Callout } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function GovernmentMapScreen() {
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
        
        {/* Header */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#F2EFE9' }}>Issue Heatmap</Text>
          <Text style={{ fontSize: 13, color: '#9BA8A6', marginTop: 2 }}>Geographic concentration of reported grievances</Text>
        </View>

        {/* Live Interactive Map Box */}
        <View style={{ backgroundColor: '#16262A', height: 320, borderRadius: 16, borderWidth: 1, borderColor: '#1D3238', marginBottom: 20, overflow: 'hidden' }}>
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
                    <View style={{ backgroundColor: '#16262A', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#1D3238', minWidth: 220 }}>
                      <Text style={{ color: '#F2EFE9', fontWeight: 'bold', fontSize: 14, marginBottom: 4 }}>{ticket.category}</Text>
                      <Text style={{ color: '#9BA8A6', fontSize: 12, marginBottom: 6 }} numberOfLines={2}>{ticket.description}</Text>
                      <Text style={{ color: pinColor, fontSize: 12, fontWeight: 'bold' }}>Status: {ticket.status}</Text>
                    </View>
                  </Callout>
                </Marker>
              );
            })}
          </MapView>
        </View>

        {/* Zone Hotspots Breakdown */}
        <Text style={{ color: '#F2EFE9', fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>High-Density Redzones</Text>

        <View style={{ backgroundColor: '#16262A', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1D3238', marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ color: '#F2EFE9', fontWeight: 'bold', fontSize: 15 }}>Howrah Block Market Area</Text>
            <View style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#EF4444' }}>
              <Text style={{ color: '#EF4444', fontSize: 11, fontWeight: 'bold' }}>Critical Severity</Text>
            </View>
          </View>
          <Text style={{ color: '#9BA8A6', fontSize: 13, marginBottom: 12 }}>Primary issues: Water leakage, drainage clogging, broken utilities.</Text>
          
          <TouchableOpacity style={{ backgroundColor: '#1D3238', padding: 10, borderRadius: 8, alignItems: 'center' }}>
            <Text style={{ color: '#2F9E8F', fontWeight: 'bold', fontSize: 13 }}>Deploy Rapid Response Team</Text>
          </TouchableOpacity>
        </View>

        <View style={{ backgroundColor: '#16262A', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1D3238' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ color: '#F2EFE9', fontWeight: 'bold', fontSize: 15 }}>Main Arterial Road Junction</Text>
            <View style={{ backgroundColor: 'rgba(232, 163, 61, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#E8A33D' }}>
              <Text style={{ color: '#E8A33D', fontSize: 11, fontWeight: 'bold' }}>Moderate Severity</Text>
            </View>
          </View>
          <Text style={{ color: '#9BA8A6', fontSize: 13, marginBottom: 12 }}>Primary issues: Road potholes, streetlight failures.</Text>
          
          <TouchableOpacity style={{ backgroundColor: '#1D3238', padding: 10, borderRadius: 8, alignItems: 'center' }}>
            <Text style={{ color: '#E8A33D', fontWeight: 'bold', fontSize: 13 }}>Dispatch Maintenance Crew</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}