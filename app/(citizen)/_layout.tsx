import { Tabs } from 'expo-router';
import { LayoutDashboard, Map, ShieldCheck, User } from 'lucide-react-native';

export default function CitizenTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0F1B1E',
          borderTopColor: '#1D3238',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#2F9E8F',
        tabBarInactiveTintColor: '#9BA8A6',
      }}
    >
      {/* 1. Dashboard Tab */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} />,
        }}
      />

      {/* 2. Heatmap Tab */}
      <Tabs.Screen
        name="map"
        options={{
          title: 'Heatmap',
          tabBarIcon: ({ color, size }) => <Map size={size} color={color} />,
        }}
      />

      {/* 3. Official / Authority Tab (Links directly to government control center) */}
      <Tabs.Screen
        name="official"
        options={{
          title: 'Official',
          tabBarIcon: ({ color, size }) => <ShieldCheck size={size} color={color} />,
          href: { pathname: '/(auth)/login', params: { portal: 'authority' } },
        }}
      />

      {/* 4. Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}