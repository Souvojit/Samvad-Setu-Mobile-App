import { Stack } from 'expo-router';

export default function SubmitProblemLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* This groups all the wizard steps together seamlessly */}
      <Stack.Screen name="index" />
      <Stack.Screen name="evidence" />
      <Stack.Screen name="location" />
      <Stack.Screen name="review" />
      <Stack.Screen name="confirmation" />
    </Stack>
  );
}