// app/_layout.tsx
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SalonProvider } from '../context/SalonContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SalonProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade_from_bottom', // 60Hz & 120Hz dono par native smooth transition
          }}
        >
          <Stack.Screen name="(customer)" />
          <Stack.Screen name="owner" />
        </Stack>
      </SalonProvider>
    </SafeAreaProvider>
  );
}