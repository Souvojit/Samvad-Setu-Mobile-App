import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(citizen)" />
      <Stack.Screen name="(government)" />
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(auth)/signup" />
      <Stack.Screen name="problem/[id]" />
    </Stack>
  );
}