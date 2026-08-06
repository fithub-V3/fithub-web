import { Stack } from 'expo-router';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1}}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(modals)" options={{ presentation: "modal" }} />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}