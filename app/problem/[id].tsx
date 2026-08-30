import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ProblemTimelineScreen() {
  const { id } = useLocalSearchParams();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F1B1E' }}>
      <Text style={{ color: '#F2EFE9', fontSize: 18 }}>Problem Timeline ID: {id}</Text>
    </View>
  );
}