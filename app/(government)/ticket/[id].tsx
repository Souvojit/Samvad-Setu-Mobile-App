import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, MapPin, CheckCircle2, Clock, User, ShieldCheck } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TicketDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadTicketDetail();
  }, [id]);

  const loadTicketDetail = async () => {
    try {
      const stored = await AsyncStorage.getItem('@citizen_tickets');
      if (stored) {
        const tickets = JSON.parse(stored);
        const found = tickets.find((t: any) => t.id === id);
        if (found) {
          setTicket(found);
        } else {
          // Fallback dummy data if ID doesn't match local storage
          setTicket({
            id: id || 'TKT-2026-8432',
            category: 'Water Supply',
            description: 'Broken handpump near block market causing severe water logging.',
            location: 'Howrah, West Bengal, India',
            status: 'Pending',
            timestamp: 'Yesterday',
          });
        }
      }
    } catch (error) {
      console.error('Failed to load ticket details', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const stored = await AsyncStorage.getItem('@citizen_tickets');
      if (stored) {
        let tickets = JSON.parse(stored);
        tickets = tickets.map((t: any) => {
          if (t.id === id) {
            return { ...t, status: newStatus };
          }
          return t;
        });
        await AsyncStorage.setItem('@citizen_tickets', JSON.stringify(tickets));
        setTicket((prev: any) => ({ ...prev, status: newStatus }));
      }
      setTimeout(() => {
        setUpdating(false);
      }, 600);
    } catch (error) {
      console.error('Failed to update status', error);
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1B1E', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#2F9E8F" size="large" />
      </SafeAreaView>
    );
  }

  // Determine colors based on current status
  const isResolved = ticket?.status === 'Resolved';
  const isInProgress = ticket?.status === 'In Progress';
  const statusColor = isResolved ? '#2F9E8F' : (isInProgress ? '#E8A33D' : '#F87171');
  const statusBgColor = isResolved ? 'rgba(47, 158, 143, 0.1)' : (isInProgress ? 'rgba(232, 163, 61, 0.1)' : 'rgba(248, 113, 113, 0.1)');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1B1E', padding: 16 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Back Button & Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12, padding: 8, backgroundColor: '#16262A', borderRadius: 8, borderWidth: 1, borderColor: '#1D3238' }}>
            <ArrowLeft size={20} color="#F2EFE9" />
          </TouchableOpacity>
          <View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#F2EFE9' }}>Grievance Review</Text>
            <Text style={{ fontSize: 12, color: '#9BA8A6' }}>{ticket?.id}</Text>
          </View>
        </View>

        {/* Status Badge Card */}
        <View style={{ backgroundColor: '#16262A', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1D3238', marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ color: '#9BA8A6', fontSize: 11, marginBottom: 2 }}>CURRENT STATUS</Text>
            <Text style={{ color: '#F2EFE9', fontWeight: 'bold', fontSize: 16 }}>{ticket?.status}</Text>
          </View>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            backgroundColor: statusBgColor, 
            paddingHorizontal: 12, 
            paddingVertical: 6, 
            borderRadius: 8,
            borderWidth: 1,
            borderColor: statusColor
          }}>
            {isResolved ? (
              <CheckCircle2 size={14} color={statusColor} style={{ marginRight: 6 }} />
            ) : (
              <Clock size={14} color={statusColor} style={{ marginRight: 6 }} />
            )}
            <Text style={{ color: statusColor, fontSize: 12, fontWeight: 'bold' }}>
              {ticket?.status}
            </Text>
          </View>
        </View>

        {/* Details Card */}
        <View style={{ backgroundColor: '#16262A', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#1D3238', marginBottom: 24 }}>
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: '#9BA8A6', fontSize: 11, marginBottom: 4 }}>CATEGORY</Text>
            <Text style={{ color: '#F2EFE9', fontSize: 15, fontWeight: '600' }}>{ticket?.category}</Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: '#9BA8A6', fontSize: 11, marginBottom: 4 }}>DESCRIPTION</Text>
            <Text style={{ color: '#F2EFE9', fontSize: 14, lineHeight: 20 }}>{ticket?.description}</Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: '#9BA8A6', fontSize: 11, marginBottom: 4 }}>LOCATION</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <MapPin size={14} color="#2F9E8F" style={{ marginRight: 6 }} />
              <Text style={{ color: '#F2EFE9', fontSize: 14 }}>{ticket?.location || 'Howrah, West Bengal, India'}</Text>
            </View>
          </View>

          <View>
            <Text style={{ color: '#9BA8A6', fontSize: 11, marginBottom: 4 }}>SUBMITTED BY</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <User size={14} color="#E8A33D" style={{ marginRight: 6 }} />
              <Text style={{ color: '#F2EFE9', fontSize: 14 }}>Verified Citizen (Howrah Zone)</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons for Authorities */}
        <Text style={{ color: '#F2EFE9', fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>Update Ticket Action</Text>

        {updating ? (
          <View style={{ backgroundColor: '#16262A', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 }}>
            <ActivityIndicator color="#2F9E8F" />
          </View>
        ) : (
          <View style={{ gap: 10 }}>
            {ticket?.status === 'Pending' && (
              <>
                <TouchableOpacity 
                  onPress={() => updateTicketStatus('In Progress')}
                  style={{ backgroundColor: '#E8A33D', paddingVertical: 16, borderRadius: 12, alignItems: 'center' }}
                >
                  <Text style={{ color: '#0F1B1E', fontWeight: 'bold', fontSize: 15 }}>Mark as In Progress</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => updateTicketStatus('Resolved')}
                  style={{ backgroundColor: '#16262A', borderWidth: 1, borderColor: '#2F9E8F', paddingVertical: 16, borderRadius: 12, alignItems: 'center' }}
                >
                  <Text style={{ color: '#2F9E8F', fontWeight: 'bold', fontSize: 15 }}>Resolve Immediately</Text>
                </TouchableOpacity>
              </>
            )}

            {ticket?.status === 'In Progress' && (
              <>
                <TouchableOpacity 
                  onPress={() => updateTicketStatus('Resolved')}
                  style={{ backgroundColor: '#2F9E8F', paddingVertical: 16, borderRadius: 12, alignItems: 'center' }}
                >
                  <Text style={{ color: '#0F1B1E', fontWeight: 'bold', fontSize: 15 }}>Mark as Resolved</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => updateTicketStatus('Pending')}
                  style={{ backgroundColor: '#16262A', borderWidth: 1, borderColor: '#F87171', paddingVertical: 16, borderRadius: 12, alignItems: 'center' }}
                >
                  <Text style={{ color: '#F87171', fontWeight: 'bold', fontSize: 15 }}>Revert to Pending</Text>
                </TouchableOpacity>
              </>
            )}

            {ticket?.status === 'Resolved' && (
              <TouchableOpacity 
                onPress={() => updateTicketStatus('In Progress')}
                style={{ backgroundColor: '#16262A', borderWidth: 1, borderColor: '#E8A33D', paddingVertical: 16, borderRadius: 12, alignItems: 'center' }}
              >
                <Text style={{ color: '#E8A33D', fontWeight: 'bold', fontSize: 15 }}>Reopen Issue</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}