import { Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LayoutDashboard, Map as MapIcon, UserCircle } from 'lucide-react-native';

export default function GovernmentTabLayout() {
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      const role = await AsyncStorage.getItem('@app_user_role');

      if (role !== 'official') {
        router.replace({ pathname: '/(auth)/login', params: { portal: 'authority' } } as any);
      }
    };

    checkAccess();
  }, [router]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2F9E8F',
        tabBarInactiveTintColor: '#9BA8A6',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#16262A',
          borderTopColor: '#1D3238',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <LayoutDashboard size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Heatmap',
          tabBarIcon: ({ color }) => <MapIcon size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Official',
          tabBarIcon: ({ color }) => <UserCircle size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}