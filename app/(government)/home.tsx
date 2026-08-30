import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Building2, 
  GraduationCap, 
  Briefcase, 
  Sparkles, 
  MapPin, 
  ChevronRight, 
  Filter, 
  LogOut, 
  BarChart2, 
  CheckCircle2, 
  Clock 
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const THEMATIC_DOMAINS = [
  'All',
  'Agriculture & Rural Livelihoods',
  'Water Resources & Sanitation',
  'Smart Education & Skilling',
  'Healthcare & Accessibility',
  'Environment & Clean Energy',
  'Urban & Rural Infrastructure'
];

export default function GovernmentHomeScreen() {
  const router = useRouter();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadAllChallenges();
    }, [])
  );

  const loadAllChallenges = async () => {
    try {
      const stored = await AsyncStorage.getItem('@citizen_tickets');
      if (stored) {
        setChallenges(JSON.parse(stored));
      } else {
        const defaultChallenges = [
          {
            id: 'CHAL-2026-8432',
            title: 'Solar Cold Storage for Tribal Farmers',
            domain: 'Agriculture & Rural Livelihoods',
            description: 'Low-cost decentralized preservation units needed for forest produce in Khunti.',
            stage: 'Claimed by University',
            status: 'Team Formed',
            assignedDept: 'AgriTech & Bioengineering',
            suggestedHEI: 'Birsa Agricultural University',
            industryPledge: 'Tata Steel CSR',
            location: 'Khunti, Jharkhand',
            priority: 'High'
          },
          {
            id: 'CHAL-2026-8721',
            title: 'Fluoride and Arsenic Filtration in Rural Wells',
            domain: 'Water Resources & Sanitation',
            description: 'Indigenous filtration cartridge using locally sourced activated carbon.',
            stage: 'AI Validated',
            status: 'Open for HEI Claim',
            assignedDept: 'Civil & Environmental Engg',
            suggestedHEI: 'IIT (ISM) Dhanbad',
            industryPledge: null,
            location: 'Dhanbad, Jharkhand',
            priority: 'High'
          },
          {
            id: 'CHAL-2026-9012',
            title: 'Offline Multilingual STEM Kits',
            domain: 'Smart Education & Skilling',
            description: 'Gamified regional language science kits for middle school students.',
            stage: 'Deployed Solution',
            status: 'Pilot Successful',
            assignedDept: 'Computer Science & EdTech',
            suggestedHEI: 'IIIT Ranchi',
            industryPledge: 'Jharkhand Innovation Council',
            location: 'Ranchi, Jharkhand',
            priority: 'Medium'
          }
        ];
        setChallenges(defaultChallenges);
        await AsyncStorage.setItem('@citizen_tickets', JSON.stringify(defaultChallenges));
      }
    } catch (error) {
      console.error('Failed to load challenges for DHTE queue', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAllChallenges();
    setRefreshing(false);
  };

  const filteredChallenges = selectedFilter === 'All'
    ? challenges
    : challenges.filter((c) => (c.domain || '').trim().toLowerCase() === selectedFilter.trim().toLowerCase());

  const openForHEICount = challenges.filter(c => c.stage === 'Submitted' || c.stage === 'AI Validated').length;
  const activeHEICount = challenges.filter(c => c.stage === 'Claimed by University' || c.stage === 'Industry Pledged').length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1B1E', padding: 16 }}>
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2F9E8F" />}
      >
        {/* Top Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <View>
            <Text style={{ fontSize: 10, color: '#9BA8A6', letterSpacing: 1.2, fontWeight: '700' }}>
              GOVT. OF JHARKHAND • DHTE
            </Text>
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#F2EFE9', marginTop: 2 }}>
              Innovation Control Center
            </Text>
            <Text style={{ fontSize: 12, color: '#9BA8A6', marginTop: 2 }}>
              Higher & Technical Education Directorate
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity 
              onPress={() => router.push('/(government)/analytics' as any)} 
              style={{ backgroundColor: '#16262A', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#1D3238' }}
            >
              <BarChart2 size={18} color="#2F9E8F" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => router.replace('/(auth)/login' as any)} 
              style={{ backgroundColor: '#16262A', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#1D3238' }}
            >
              <LogOut size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Oversight Metrics Cards */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 18 }}>
          <View style={{ flex: 1, backgroundColor: '#16262A', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#1D3238' }}>
            <Text style={{ color: '#9BA8A6', fontSize: 10, fontWeight: '700', marginBottom: 4 }}>TOTAL CROWDSOURCED</Text>
            <Text style={{ color: '#F2EFE9', fontSize: 22, fontWeight: '800' }}>{challenges.length}</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: '#16262A', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#1D3238' }}>
            <Text style={{ color: '#9BA8A6', fontSize: 10, fontWeight: '700', marginBottom: 4 }}>OPEN FOR HEI CLAIM</Text>
            <Text style={{ color: '#E8A33D', fontSize: 22, fontWeight: '800' }}>{openForHEICount}</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: '#16262A', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#1D3238' }}>
            <Text style={{ color: '#9BA8A6', fontSize: 10, fontWeight: '700', marginBottom: 4 }}>ACTIVE HEI TEAMS</Text>
            <Text style={{ color: '#4E7AFF', fontSize: 22, fontWeight: '800' }}>{activeHEICount}</Text>
          </View>
        </View>

        {/* Thematic Domain Filter Bar */}
        <View style={{ marginBottom: 18 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Filter size={14} color="#9BA8A6" style={{ marginRight: 6 }} />
            <Text style={{ color: '#9BA8A6', fontSize: 11, fontWeight: '700', letterSpacing: 1 }}>
              FILTER BY THEMATIC DOMAIN
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {THEMATIC_DOMAINS.map((domain) => (
              <TouchableOpacity
                key={domain}
                onPress={() => setSelectedFilter(domain)}
                style={{
                  backgroundColor: selectedFilter === domain ? '#2F9E8F' : '#16262A',
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: selectedFilter === domain ? '#2F9E8F' : '#1D3238',
                }}
              >
                <Text style={{ color: selectedFilter === domain ? '#0F1B1E' : '#F2EFE9', fontWeight: '700', fontSize: 12 }}>
                  {domain}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Challenges Moderation Queue */}
        <Text style={{ color: '#F2EFE9', fontSize: 16, fontWeight: '700', marginBottom: 12 }}>
          Statewide Innovation Queue ({filteredChallenges.length})
        </Text>

        {filteredChallenges.length === 0 ? (
          <View style={{ backgroundColor: '#16262A', padding: 30, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#1D3238' }}>
            <Text style={{ color: '#9BA8A6', fontSize: 14 }}>No challenges found for &ldquo;{selectedFilter}&rdquo;.</Text>
          </View>
        ) : (
          filteredChallenges.map((item, index) => {
            const isClaimed = item.stage === 'Claimed by University' || item.stage === 'Deployed Solution';

            return (
              <TouchableOpacity 
                key={index}
                onPress={() => router.push(`/problem/${item.id}` as any)}
                style={{ backgroundColor: '#16262A', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1D3238', marginBottom: 12 }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={{ color: '#E8A33D', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 2 }}>
                      {item.domain || 'Grassroots Innovation'}
                    </Text>
                    <Text style={{ color: '#F2EFE9', fontWeight: '700', fontSize: 15, marginBottom: 4 }}>
                      {item.title || item.description}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <MapPin size={12} color="#9BA8A6" style={{ marginRight: 4 }} />
                      <Text style={{ color: '#9BA8A6', fontSize: 12 }}>{item.location || 'Jharkhand Region'}</Text>
                    </View>
                  </View>

                  <View style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    backgroundColor: isClaimed ? 'rgba(47, 158, 143, 0.15)' : 'rgba(232, 163, 61, 0.15)', 
                    paddingHorizontal: 8, 
                    paddingVertical: 4, 
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: isClaimed ? '#2F9E8F' : '#E8A33D'
                  }}>
                    {isClaimed ? (
                      <CheckCircle2 size={12} color="#2F9E8F" style={{ marginRight: 4 }} />
                    ) : (
                      <Clock size={12} color="#E8A33D" style={{ marginRight: 4 }} />
                    )}
                    <Text style={{ color: isClaimed ? '#2F9E8F' : '#E8A33D', fontSize: 10, fontWeight: '800' }}>
                      {item.stage || 'AI Validated'}
                    </Text>
                  </View>
                </View>

                {/* Institutional & Partner Links */}
                <View style={{ backgroundColor: '#0F1B1E', borderRadius: 10, padding: 10, marginTop: 6, marginBottom: 8, borderWidth: 1, borderColor: '#1D3238' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: item.industryPledge ? 4 : 0 }}>
                    <GraduationCap size={13} color="#2F9E8F" style={{ marginRight: 6 }} />
                    <Text style={{ color: '#F2EFE9', fontSize: 11, fontWeight: '600' }}>
                      Target HEI: <Text style={{ color: '#9BA8A6' }}>{item.suggestedHEI || 'Pending Allocation'}</Text>
                    </Text>
                  </View>
                  {item.industryPledge && (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Briefcase size={13} color="#A855F7" style={{ marginRight: 6 }} />
                      <Text style={{ color: '#F2EFE9', fontSize: 11, fontWeight: '600' }}>
                        CSR Partner: <Text style={{ color: '#9BA8A6' }}>{item.industryPledge}</Text>
                      </Text>
                    </View>
                  )}
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6, borderTopWidth: 1, borderTopColor: '#1D3238' }}>
                  <Text style={{ color: '#9BA8A6', fontSize: 11 }}>{item.id}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: '#2F9E8F', fontSize: 12, fontWeight: '700', marginRight: 2 }}>Inspect Lifecycle</Text>
                    <ChevronRight size={14} color="#2F9E8F" />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}