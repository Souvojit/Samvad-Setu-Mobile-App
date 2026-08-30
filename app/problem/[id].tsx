import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Share, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  MapPin, 
  Share2, 
  CheckCircle2, 
  Sparkles, 
  GraduationCap, 
  Briefcase, 
  Layers, 
  Calendar,
  AlertCircle
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LIFECYCLE_STAGES = [
  { 
    key: 'Submitted', 
    label: '1. Grassroots Crowdsourced', 
    desc: 'Reported with geo-tag and multimedia evidence by citizen.' 
  },
  { 
    key: 'AI Validated', 
    label: '2. AI Categorized & Routed', 
    desc: 'Thematic domain matched and mapped to target university departments.' 
  },
  { 
    key: 'Claimed by University', 
    label: '3. HEI Project Team Formed', 
    desc: 'Faculty mentor and student multidisciplinary research team actively working on prototype.' 
  },
  { 
    key: 'Industry Pledged', 
    label: '4. CSR & Industry Mentorship', 
    desc: 'Corporate grant, lab testing, or domain mentorship linked.' 
  },
  { 
    key: 'Deployed Solution', 
    label: '5. Field Deployment & Social Impact', 
    desc: 'Solution successfully piloted and operational in the community.' 
  }
];

export default function ProblemTimelineScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProblemDetails();
  }, [id]);

  const loadProblemDetails = async () => {
    try {
      const stored = await AsyncStorage.getItem('@citizen_tickets');
      if (stored) {
        const list = JSON.parse(stored);
        const match = list.find((item: any) => item.id === id);
        if (match) {
          setProblem(match);
        } else {
          // Fallback demo mock if opened directly
          setProblem({
            id: id || 'CHAL-2026-8432',
            title: 'Solar-Powered Cold Storage for Tribal Farmers',
            domain: 'Agriculture & Rural Livelihoods',
            description: 'Low-cost decentralized preservation units needed for minor forest produce in Khunti district.',
            stage: 'Claimed by University',
            status: 'Team Formed',
            assignedDept: 'AgriTech & Bioengineering',
            suggestedHEI: 'Birsa Agricultural University',
            industryPledge: 'Tata Steel CSR (Mentorship + ₹75,000 Grant)',
            location: 'Khunti, Jharkhand',
            submittedAt: new Date().toISOString()
          });
        }
      }
    } catch (e) {
      console.error('Failed to load challenge details', e);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!problem) return;
    try {
      await Share.share({
        message: `SICP Challenge [${problem.id}]: ${problem.title || problem.description}\nDomain: ${problem.domain}\nTracking collaborative innovation progress on Jharkhand SICP Portal.`
      });
    } catch (error) {
      console.error('Error sharing challenge', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1B1E', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#E8A33D" />
        <Text style={{ color: '#9BA8A6', marginTop: 12, fontSize: 13 }}>Loading innovation lifecycle...</Text>
      </SafeAreaView>
    );
  }

  if (!problem) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1B1E', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <AlertCircle size={36} color="#C1443B" style={{ marginBottom: 12 }} />
        <Text style={{ color: '#F2EFE9', fontSize: 16, fontWeight: '700' }}>Challenge not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16, backgroundColor: '#16262A', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 }}>
          <Text style={{ color: '#E8A33D', fontWeight: '700' }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Calculate lifecycle stage progression
  const stageIndexMap: Record<string, number> = {
    'Submitted': 0,
    'AI Validated': 1,
    'Claimed by University': 2,
    'Industry Pledged': 3,
    'Deployed Solution': 4
  };
  const currentStageIndex = stageIndexMap[problem.stage] ?? 1;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F1B1E', padding: 16 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        
        {/* Navigation Bar */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={{ backgroundColor: '#16262A', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#1D3238' }}
          >
            <ArrowLeft size={20} color="#F2EFE9" />
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#9BA8A6', fontSize: 10, letterSpacing: 1, fontWeight: '700' }}>SICP LIFECYCLE</Text>
            <Text style={{ color: '#E8A33D', fontWeight: '800', fontSize: 14 }}>{problem.id}</Text>
          </View>
          <TouchableOpacity 
            onPress={handleShare}
            style={{ backgroundColor: '#16262A', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#1D3238' }}
          >
            <Share2 size={20} color="#2F9E8F" />
          </TouchableOpacity>
        </View>

        {/* Challenge Summary Header Card */}
        <View style={{ backgroundColor: '#16262A', borderRadius: 18, padding: 18, borderWidth: 1, borderColor: '#1D3238', marginBottom: 16 }}>
          <View style={{ backgroundColor: 'rgba(232, 163, 61, 0.12)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#E8A33D', marginBottom: 10 }}>
            <Text style={{ color: '#E8A33D', fontSize: 11, fontWeight: '800', textTransform: 'uppercase' }}>
              {problem.domain || 'Thematic Innovation Challenge'}
            </Text>
          </View>
          
          <Text style={{ color: '#F2EFE9', fontSize: 20, fontWeight: '800', marginBottom: 10, lineHeight: 26 }}>
            {problem.title || problem.description}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MapPin size={13} color="#9BA8A6" style={{ marginRight: 4 }} />
              <Text style={{ color: '#9BA8A6', fontSize: 12 }}>{problem.location || 'Jharkhand Region'}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Calendar size={13} color="#9BA8A6" style={{ marginRight: 4 }} />
              <Text style={{ color: '#9BA8A6', fontSize: 12 }}>{problem.date || 'Active'}</Text>
            </View>
          </View>
        </View>

        {/* Evidence Image (if attached) */}
        {problem.imageUri && (
          <Image 
            source={{ uri: problem.imageUri }} 
            style={{ width: '100%', height: 200, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#1D3238' }} 
          />
        )}

        {/* Problem Narrative Box */}
        <View style={{ backgroundColor: '#16262A', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1D3238', marginBottom: 16 }}>
          <Text style={{ color: '#F2EFE9', fontSize: 14, fontWeight: '700', marginBottom: 6 }}>Grassroots Challenge Statement</Text>
          <Text style={{ color: '#9BA8A6', fontSize: 13, lineHeight: 20 }}>
            {problem.description}
          </Text>
        </View>

        {/* Innovation Ecosystem Allocation Card */}
        <View style={{ backgroundColor: '#16262A', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1D3238', marginBottom: 20 }}>
          <Text style={{ color: '#F2EFE9', fontSize: 14, fontWeight: '700', marginBottom: 12 }}>Assigned Innovation Ecosystem</Text>
          
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ backgroundColor: '#0F1B1E', padding: 8, borderRadius: 10, marginRight: 10, borderWidth: 1, borderColor: '#1D3238' }}>
                <GraduationCap size={16} color="#2F9E8F" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#F2EFE9', fontSize: 12, fontWeight: '700' }}>Leading Academic HEI</Text>
                <Text style={{ color: '#9BA8A6', fontSize: 11 }}>{problem.suggestedHEI || 'Birsa Agricultural University'}</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ backgroundColor: '#0F1B1E', padding: 8, borderRadius: 10, marginRight: 10, borderWidth: 1, borderColor: '#1D3238' }}>
                <Sparkles size={16} color="#E8A33D" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#F2EFE9', fontSize: 12, fontWeight: '700' }}>Academic Specialization</Text>
                <Text style={{ color: '#9BA8A6', fontSize: 11 }}>{problem.assignedDept || 'AgriTech & Bioengineering'}</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ backgroundColor: '#0F1B1E', padding: 8, borderRadius: 10, marginRight: 10, borderWidth: 1, borderColor: '#1D3238' }}>
                <Briefcase size={16} color="#A855F7" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#F2EFE9', fontSize: 12, fontWeight: '700' }}>Industry / CSR Partnership</Text>
                <Text style={{ color: '#9BA8A6', fontSize: 11 }}>{problem.industryPledge || 'Open for CSR funding & mentorship'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Vertical NEP-2020 Lifecycle Progression */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Layers size={16} color="#E8A33D" style={{ marginRight: 6 }} />
          <Text style={{ color: '#F2EFE9', fontSize: 16, fontWeight: '700' }}>
            NEP-2020 Innovation Lifecycle
          </Text>
        </View>

        <View style={{ backgroundColor: '#16262A', borderRadius: 18, padding: 18, borderWidth: 1, borderColor: '#1D3238' }}>
          {LIFECYCLE_STAGES.map((stg, idx) => {
            const isCompleted = idx <= currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <View key={stg.key} style={{ flexDirection: 'row', marginBottom: idx < LIFECYCLE_STAGES.length - 1 ? 20 : 0 }}>
                {/* Timeline Node & Connecting Bar */}
                <View style={{ alignItems: 'center', marginRight: 14, width: 24 }}>
                  <View style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: isCompleted ? '#2F9E8F' : '#0F1B1E',
                    borderWidth: 2,
                    borderColor: isCompleted ? '#2F9E8F' : '#1D3238',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {isCompleted ? (
                      <CheckCircle2 size={14} color="#0F1B1E" />
                    ) : (
                      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#9BA8A6' }} />
                    )}
                  </View>
                  {idx < LIFECYCLE_STAGES.length - 1 && (
                    <View style={{
                      width: 2,
                      flex: 1,
                      backgroundColor: idx < currentStageIndex ? '#2F9E8F' : '#1D3238',
                      marginTop: 4
                    }} />
                  )}
                </View>

                {/* Stage Label & Details */}
                <View style={{ flex: 1 }}>
                  <Text style={{ 
                    color: isCompleted ? '#F2EFE9' : '#9BA8A6', 
                    fontSize: 14, 
                    fontWeight: isCurrent ? '800' : '600',
                    marginBottom: 2
                  }}>
                    {stg.label}
                  </Text>
                  <Text style={{ color: '#9BA8A6', fontSize: 11, lineHeight: 16 }}>
                    {stg.desc}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}