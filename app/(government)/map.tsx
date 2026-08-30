import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { MapPin, AlertTriangle } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function GovernmentMapScreen() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadMapData();
    }, [])
  );

  const loadMapData = async () => {
    setLoading(true);
    try {
      const stored = await AsyncStorage.getItem('@citizen_tickets');
      if (stored) {
        setChallenges(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load map data', error);
    } finally {
      setLoading(false);
    }
  };

  // Default region set to Jharkhand (Ranchi area)
  const initialRegion = {
    latitude: 23.3441,
    longitude: 85.3096,
    latitudeDelta: 2.5,
    longitudeDelta: 2.5,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1B1E' }}>
      <View style={{ padding: 16, backgroundColor: '#16262A', borderBottomWidth: 1, borderBottomColor: '#1D3238' }}>
        <Text style={{ fontSize: 10, color: '#9BA8A6', letterSpacing: 1.2, fontWeight: '700' }}>
          SPATIAL ANALYTICS
        </Text>
        <Text style={{ fontSize: 22, fontWeight: '800', color: '#F2EFE9', marginTop: 2 }}>
          Live Innovation Map
        </Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2F9E8F" />
          <Text style={{ color: '#9BA8A6', marginTop: 12 }}>Loading spatial data...</Text>
        </View>
      ) : (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={initialRegion}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {challenges.map((challenge, index) => {
              // Ensure coordinates exist, otherwise fallback to default
              const lat = challenge.latitude || 23.3441 + (Math.random() * 0.1);
              const lng = challenge.longitude || 85.3096 + (Math.random() * 0.1);

              return (
                <Marker
                  key={challenge.id || index}
                  coordinate={{ latitude: lat, longitude: lng }}
                >
                  <View style={styles.customMarker}>
                    <MapPin size={24} color="#E8A33D" fill="#C1443B" />
                  </View>
                  <Callout tooltip>
                    <View style={styles.calloutContainer}>
                      <Text style={styles.calloutTitle}>{challenge.domain}</Text>
                      <Text style={styles.calloutDesc} numberOfLines={2}>
                        {challenge.title}
                      </Text>
                      <View style={styles.calloutBadge}>
                        <Text style={styles.badgeText}>{challenge.stage}</Text>
                      </View>
                    </View>
                  </Callout>
                </Marker>
              );
            })}
          </MapView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    margin: 16,
    borderWidth: 1,
    borderColor: '#1D3238',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  customMarker: {
    backgroundColor: 'rgba(15, 27, 30, 0.7)',
    borderRadius: 20,
    padding: 4,
  },
  calloutContainer: {
    backgroundColor: '#16262A',
    borderRadius: 12,
    padding: 12,
    width: 220,
    borderWidth: 1,
    borderColor: '#2F9E8F',
  },
  calloutTitle: {
    color: '#E8A33D',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  calloutDesc: {
    color: '#F2EFE9',
    fontSize: 13,
    marginBottom: 8,
  },
  calloutBadge: {
    backgroundColor: '#0F1B1E',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#1D3238',
  },
  badgeText: {
    color: '#9BA8A6',
    fontSize: 10,
    fontWeight: '700',
  },
});