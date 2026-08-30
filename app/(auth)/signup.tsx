import React from 'react';
import { View, Text } from 'react-native';

export default function AuthScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F1B1E' }}>
      <Text style={{ color: '#F2EFE9', fontSize: 18 }}>Authentication Screen</Text>
    </View>
  );
}