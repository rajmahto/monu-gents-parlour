// app/(customer)/_layout.tsx
import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function CustomerLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: '#FAFAFA', // App ka default background match karne ke liye
          // Web aur mobile browsers ke liye extra top padding/spacing fix
          paddingTop: Platform.OS === 'web' ? 0 : 0, 
        },
      }}
    />
  );
}