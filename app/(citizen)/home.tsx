import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Bell, 
  GraduationCap, 
  Briefcase, 
  Sparkles,
  Layers
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function CitizenHomeScreen() {
  const router = useRouter();
  const [tickets, setTickets] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadTickets();
    }, [])
  );

  const loadTickets = async () => {
    try {
      const stored = await AsyncStorage.getItem('@citizen_tickets');
      if (stored) {
        setTickets(JSON.parse(stored));
      } else {
        const defaultChallenges = [
          {
            id: 'CHAL-2026-8432',
            title: 'Solar-Powered Cold Storage for Tribal Farmers',
            domain: 'Agriculture & Rural Livelihoods',
            description: 'Low-cost decentralized preservation units needed for minor forest produce in Khunti district.',
            stage: 'Claimed by University',
            status: 'Team Formed',
            assignedDept: 'AgriTech & Bioengineering',
            suggestedHEI: 'Birsa Agricultural University',
            industryPledge: 'Tata Steel CSR (Mentorship + ₹75,000 Grant)',
            location: 'Khunti, Jharkhand',
            date: '2 hrs ago'
          },
          {
            id: 'CHAL-2026-8721',
            title: 'Fluoride and Arsenic Filtration in Rural Wells',
            domain: 'Water Resources & Sanitation',
            description: 'Indigenous filtration cartridge using locally sourced clay and activated carbon.',
            stage: 'AI Validated',
            status: 'Open for HEI Claim',
            assignedDept: 'Civil & Environmental Engg',
            suggestedHEI: 'IIT (ISM) Dhanbad',
            industryPledge: null,
            location: 'Dhanbad, Jharkhand',
            date: 'Today, 8:40 AM'
          },
          {
            id: 'CHAL-2026-9012',
            title: 'Offline Multilingual STEM Kits for Rural Schools',
            domain: 'Smart Education & Skilling',
            description: 'Gamified regional language science kits for middle school students without internet.',
            stage: 'Deployed Solution',
            status: 'Pilot Successful',
            assignedDept: 'Computer Science & EdTech',
            suggestedHEI: 'IIIT Ranchi',
            industryPledge: 'Jharkhand Innovation Council',
            location: 'Ranchi, Jharkhand',
            date: 'Yesterday'
          }
        ];
        setTickets(defaultChallenges);
        await AsyncStorage.setItem('@citizen_tickets', JSON.stringify(defaultChallenges));
      }
    } catch (error) {
      console.error('Failed to load challenges', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTickets();
    setRefreshing(false);
  };

  const getStageBadge = (stage: string) => {
    switch (stage) {
      case 'Deployed Solution':
        return { bg: 'rgba(47, 158, 143, 0.15)', border: '#2F9E8F', color: '#2F9E8F', icon: CheckCircle2, text: 'Deployed Solution' };
      case 'Claimed by University':
        return { bg: 'rgba(78, 122, 255, 0.15)', border: '#4E7AFF', color: '#4E7AFF', icon: GraduationCap, text: 'HEI Team Active' };
      case 'Industry Pledged':
        return { bg: 'rgba(168, 85, 247, 0.15)', border: '#A855F7', color: '#A855F7', icon: Briefcase, text: 'Industry Funded' };
      default:
        return { bg: 'rgba(232, 163, 61, 0.15)', border: '#E8A33D', color: '#E8A33D', icon: Sparkles, text: 'Open for HEI Claim' };
    }
  };

  const activeCount = tickets.filter((t) => t.stage !== 'Deployed Solution').length;
  const deployedCount = tickets.filter((t) => t.stage === 'Deployed Solution').length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1B1E', padding: 16 }}>
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E8A33D" />}
      >
        {/* Header Branding */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <View>
            <Text style={{ fontSize: 10, color: '#9BA8A6', letterSpacing: 1.2, fontWeight: '700' }}>
              GOVERNMENT OF JHARKHAND • DHTE
            </Text>
            <Text style={{ fontSize: 26, fontWeight: '800', color: '#F2EFE9', marginTop: 2 }}>
              SICP Portal
            </Text>
          </View>
          <TouchableOpacity 
            onPress={() => router.push('/notifications' as any)} 
            style={{ backgroundColor: '#16262A', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#1D3238' }}
          >
            <Bell size={20} color="#E8A33D" />
          </TouchableOpacity>
        </View>

        {/* Quick Stats Grid */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 18 }}>
          <View style={{ flex: 1, backgroundColor: '#16262A', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#1D3238' }}>
            <Text style={{ color: '#9BA8A6', fontSize: 10, fontWeight: '700', marginBottom: 4 }}>RESEARCH IN PROGRESS</Text>
            <Text style={{ color: '#F2EFE9', fontSize: 22, fontWeight: '800' }}>{activeCount}</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: '#16262A', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#1D3238' }}>
            <Text style={{ color: '#9BA8A6', fontSize: 10, fontWeight: '700', marginBottom: 4 }}>DEPLOYED SOLUTIONS</Text>
            <Text style={{ color: '#2F9E8F', fontSize: 22, fontWeight: '800' }}>{deployedCount}</Text>
          </View>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity 
          onPress={() => router.push('/(citizen)/submit-problem' as any)}
          style={{ 
            backgroundColor: '#E8A33D', 
            borderRadius: 18, 
            padding: 18, 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: 24,
            shadowColor: '#E8A33D',
            shadowOpacity: 0.25,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 6 }
          }}
        >
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={{ color: '#0F1B1E', fontSize: 17, fontWeight: '800', marginBottom: 3 }}>
              Crowdsource Challenge
            </Text>
            <Text style={{ color: '#0F1B1E', fontSize: 12, fontWeight: '600', opacity: 0.85 }}>
              Submit grassroots problems for university and industry co-innovation
            </Text>
          </View>
          <View style={{ backgroundColor: 'rgba(15, 27, 30, 0.12)', padding: 10, borderRadius: 12 }}>
            <PlusCircle size={26} color="#0F1B1E" />
          </View>
        </TouchableOpacity>

        {/* Challenges Feed Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Layers size={16} color="#E8A33D" style={{ marginRight: 6 }} />
            <Text style={{ color: '#F2EFE9', fontSize: 16, fontWeight: '700' }}>My Submitted Challenges</Text>
          </View>
          <Text style={{ color: '#9BA8A6', fontSize: 12 }}>{tickets.length} total</Text>
        </View>

        {/* Dynamic Challenges List */}
        {tickets.length === 0 ? (
          <View style={{ backgroundColor: '#16262A', padding: 32, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#1D3238' }}>
            <Sparkles size={32} color="#E8A33D" style={{ marginBottom: 12 }} />
            <Text style={{ color: '#F2EFE9', fontSize: 15, fontWeight: '700', marginBottom: 4 }}>No challenges reported yet</Text>
            <Text style={{ color: '#9BA8A6', fontSize: 13, textAlign: 'center' }}>
              Crowdsource problems in agriculture, education, water, or energy to initiate HEI research.
            </Text>
          </View>
        ) : (
          tickets.map((item, index) => {
            const stageStyle = getStageBadge(item.stage || 'Submitted');
            const StageIcon = stageStyle.icon;

            return (
              <TouchableOpacity 
                key={index} 
                onPress={() => router.push(`/problem/${item.id}` as any)}
                style={{ backgroundColor: '#16262A', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1D3238', marginBottom: 14 }}
              >
                {/* Header: Title & Stage */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={{ color: '#F2EFE9', fontWeight: '700', fontSize: 15, marginBottom: 4 }}>
                      {item.title || item.description}
                    </Text>
                    <Text style={{ color: '#E8A33D', fontSize: 11, fontWeight: '700' }}>
                      {item.domain || item.category || 'Grassroots Innovation'}
                    </Text>
                  </View>

                  <View style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    backgroundColor: stageStyle.bg, 
                    paddingHorizontal: 8, 
                    paddingVertical: 4, 
                    borderRadius: 8, 
                    borderWidth: 1, 
                    borderColor: stageStyle.border 
                  }}>
                    <StageIcon size={12} color={stageStyle.color} style={{ marginRight: 4 }} />
                    <Text style={{ color: stageStyle.color, fontSize: 10, fontWeight: '800' }}>
                      {stageStyle.text}
                    </Text>
                  </View>
                </View>

                {/* Description Excerpt */}
                <Text numberOfLines={2} style={{ color: '#9BA8A6', fontSize: 13, marginBottom: 10, lineHeight: 18 }}>
                  {item.description}
                </Text>

                {/* HEI & Industry Match Badges */}
                <View style={{ backgroundColor: '#0F1B1E', borderRadius: 10, padding: 10, marginBottom: 10, borderWidth: 1, borderColor: '#1D3238' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: item.industryPledge ? 4 : 0 }}>
                    <GraduationCap size={13} color="#2F9E8F" style={{ marginRight: 6 }} />
                    <Text style={{ color: '#F2EFE9', fontSize: 11, fontWeight: '600' }}>
                      HEI: <Text style={{ color: '#9BA8A6' }}>{item.suggestedHEI || 'Pending Allocation'}</Text>
                    </Text>
                  </View>
                  {item.industryPledge && (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Briefcase size={13} color="#E8A33D" style={{ marginRight: 6 }} />
                      <Text style={{ color: '#F2EFE9', fontSize: 11, fontWeight: '600' }}>
                        Partner: <Text style={{ color: '#9BA8A6' }}>{item.industryPledge}</Text>
                      </Text>
                    </View>
                  )}
                </View>

                {/* Location & Meta Footer */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTopWidth: 1, borderTopColor: '#1D3238' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MapPin size={12} color="#9BA8A6" style={{ marginRight: 4 }} />
                    <Text style={{ color: '#9BA8A6', fontSize: 11 }}>{item.location || 'Jharkhand Region'}</Text>
                  </View>
                  <Text style={{ color: '#9BA8A6', fontSize: 11 }}>{item.id}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}