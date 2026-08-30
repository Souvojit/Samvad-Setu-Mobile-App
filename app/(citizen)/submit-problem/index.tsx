import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowRight, Droplet, Zap, HardHat, Leaf, GraduationCap, HeartPulse } from 'lucide-react-native';
import { useProblemStore } from '../../../store/problemStore';

export default function ProblemDetailsScreen() {
  const router = useRouter();
  
  // Connect to Zustand Global Memory
  const department = useProblemStore((state: any) => state.department);
  const setDepartment = useProblemStore((state: any) => state.setDepartment);
  const description = useProblemStore((state: any) => state.description);
  const setDescription = useProblemStore((state: any) => state.setDescription);

  // Official PS 26043 Thematic Domains
  const categories = [
    { name: 'Agriculture & Rural Livelihoods', icon: Leaf },
    { name: 'Water Resources & Sanitation', icon: Droplet },
    { name: 'Smart Education & Skilling', icon: GraduationCap },
    { name: 'Healthcare & Accessibility', icon: HeartPulse },
    { name: 'Environment & Clean Energy', icon: Zap },
    { name: 'Urban & Rural Infrastructure', icon: HardHat },
  ];

  const handleNext = () => {
    router.push('/(citizen)/submit-problem/evidence' as any);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1B1E', padding: 16 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        
        <View style={{ marginBottom: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#E8A33D' }}>STEP 1 OF 4</Text>
          <Text style={{ fontSize: 12, color: '#9BA8A6' }}>Challenge Details</Text>
        </View>

        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#F2EFE9', marginBottom: 8 }}>Select Thematic Domain</Text>
        <Text style={{ fontSize: 14, color: '#9BA8A6', marginBottom: 24 }}>
          Choose the correct multidisciplinary domain for this societal challenge.
        </Text>

        <Text style={{ color: '#F2EFE9', fontSize: 14, fontWeight: '600', marginBottom: 12 }}>DOMAIN CATEGORY</Text>
        
        {/* Updated to a 2-column wrapping grid to fit the longer text */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 }}>
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            const isSelected = department === cat.name;
            
            return (
              <TouchableOpacity
                key={cat.name}
                onPress={() => setDepartment(cat.name)}
                style={{
                  width: '48%', // 2-column layout
                  backgroundColor: isSelected ? '#1D3238' : '#16262A',
                  padding: 14,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: isSelected ? '#2F9E8F' : '#1D3238',
                  alignItems: 'center',
                  marginBottom: 10
                }}
              >
                <IconComponent size={24} color={isSelected ? '#2F9E8F' : '#9BA8A6'} style={{ marginBottom: 10 }} />
                <Text style={{ color: isSelected ? '#F2EFE9' : '#9BA8A6', fontSize: 11, fontWeight: 'bold', textAlign: 'center', lineHeight: 16 }}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={{ color: '#F2EFE9', fontSize: 14, fontWeight: '600', marginBottom: 12 }}>CHALLENGE DESCRIPTION</Text>
        <TextInput
          multiline
          numberOfLines={4}
          placeholder="Describe the grassroots challenge, affected community, and technical barriers..."
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
          <Text style={{ color: '#0F1B1E', fontWeight: 'bold', fontSize: 16, marginRight: 8 }}>Next: Attach Evidence</Text>
          <ArrowRight size={18} color="#0F1B1E" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}