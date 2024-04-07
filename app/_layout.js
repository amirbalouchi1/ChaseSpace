import { Stack } from "expo-router";
import { useCallback } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { LogBox } from "react-native";

// Screen is hidden until stated otherwise. (Called below)
SplashScreen.preventAutoHideAsync();

async function onLayoutRootViewCallback() {
  if (fontsLoaded) {
    await SplashScreen.hideAsync();
  }
}

const Layout = () => {
  // Loads custom fonts
  const [fontsLoaded] = useFonts({
    DMBold: require("../assets/fonts/DMSans-Bold.ttf"),
    DMMedium: require("../assets/fonts/DMSans-Medium.ttf"),
    DMRegular: require("../assets/fonts/DMSans-Regular.ttf"),
  });

  if (!fontsLoaded) return null;
  return (
    <Stack onLayout={onLayoutRootViewCallback}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
