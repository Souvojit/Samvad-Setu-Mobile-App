import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowRight, Droplet, Zap, HardHat } from 'lucide-react-native';

export default function ProblemDetailsScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('Water Supply');
  const [description, setDescription] = useState('');

  const categories = [
    { name: 'Water Supply', icon: Droplet },
    { name: 'Roads/PWD', icon: HardHat },
    { name: 'Lighting', icon: Zap },
  ];

  const handleNext = () => {
    router.push({
      pathname: '/(citizen)/submit-problem/evidence',
      params: { category: selectedCategory, description }
    } as any);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1B1E', padding: 16 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}>
        
        <View style={{ marginBottom: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#E8A33D' }}>STEP 1 OF 4</Text>
          <Text style={{ fontSize: 12, color: '#9BA8A6' }}>Grievance Details</Text>
        </View>

        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#F2EFE9', marginBottom: 8 }}>Select Department & Issue</Text>
        <Text style={{ fontSize: 14, color: '#9BA8A6', marginBottom: 24 }}>
          Choose the municipal department responsible for this infrastructure category.
        </Text>

        <Text style={{ color: '#F2EFE9', fontSize: 14, fontWeight: '600', marginBottom: 12 }}>DEPARTMENT CATEGORY</Text>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            const isSelected = selectedCategory === cat.name;
            return (
              <TouchableOpacity
                key={cat.name}
                onPress={() => setSelectedCategory(cat.name)}
                style={{
                  flex: 1,
                  backgroundColor: isSelected ? '#1D3238' : '#16262A',
                  padding: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: isSelected ? '#2F9E8F' : '#1D3238',
                  alignItems: 'center',
                }}
              >
                <IconComponent size={20} color={isSelected ? '#2F9E8F' : '#9BA8A6'} style={{ marginBottom: 6 }} />
                <Text style={{ color: isSelected ? '#F2EFE9' : '#9BA8A6', fontSize: 11, fontWeight: 'bold', textAlign: 'center' }}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={{ color: '#F2EFE9', fontSize: 14, fontWeight: '600', marginBottom: 12 }}>ISSUE DESCRIPTION</Text>
        <TextInput
          multiline
          numberOfLines={4}
          placeholder="Describe the issue in detail (e.g., broken handpump, road pothole)..."
          placeholderTextColor="#9BA8A6"
          value={description}
          onChangeText={setDescription}
          style={{
            backgroundColor: '#16262A',
            color: '#F2EFE9',
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: '#1D3238',
            textAlignVertical: 'top',
            height: 120,
            marginBottom: 24,
            fontSize: 14
          }}
        />

        <View style={{ flex: 1 }} />

        <TouchableOpacity 
          onPress={handleNext}
          style={{ 
            backgroundColor: '#E8A33D', 
            paddingVertical: 16, 
            borderRadius: 12, 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
        >
          <Text style={{ color: '#0F1B1E', fontWeight: 'bold', fontSize: 16, marginRight: 8 }}>Next: Camera Evidence</Text>
          <ArrowRight size={18} color="#0F1B1E" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}