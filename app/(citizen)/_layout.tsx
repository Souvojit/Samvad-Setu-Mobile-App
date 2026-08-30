import { Tabs } from 'expo-router';
import React from 'react';
import { LayoutDashboard, Map as MapIcon, UserCircle } from 'lucide-react-native';

export default function CitizenTabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#E8A33D', // Accent color for the Citizen portal
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
      
      {/* 🟢 VISIBLE TABS */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <LayoutDashboard size={22} color={color} />,
        }}
      />
      
      {/* Assuming you have a map screen for citizens. If not, you can change 'name' or set href: null */}
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
          title: 'Profile',
          tabBarIcon: ({ color }) => <UserCircle size={22} color={color} />,
        }}
      />

      {/* 🔴 HIDDEN TABS (These can be navigated to, but won't show on the bottom bar) */}
      <Tabs.Screen 
        name="submit-problem" 
        options={{ href: null }} 
      />
      
      <Tabs.Screen 
        name="ticket/[id]" 
        options={{ href: null }} 
      />
      
      <Tabs.Screen 
        name="notifications" 
        options={{ href: null }} 
      />
      
    </Tabs>
  );
}