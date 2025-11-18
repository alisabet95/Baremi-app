// app/_layout.tsx
import * as Font from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { I18nManager } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  const loadFonts = useCallback(async () => {
    try {
      await Font.loadAsync({
        Shabnam: require("../assets/fonts/shabnam/Shabnam-Medium.ttf"),
        ShabnamBold: require("../assets/fonts/shabnam/Shabnam-Bold.ttf"),
        ShabnamDigit: require("../assets/fonts/shabnam/Shabnam-Bold-FD.ttf"),
        Inter: require("../assets/fonts/inter/Inter-Bold.ttf"), // Your cool 4th font!
      });
    } catch (error) {
      console.error("Error loading fonts:", error);
    }
  }, []);

  useEffect(() => {
    async function prepare() {
      try {
        // Enable RTL support globally
        I18nManager.allowRTL(true);
        // Load fonts
        await loadFonts();
      } catch (e) {
        console.warn("App preparation error:", e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, [loadFonts]);

  if (!appIsReady) return null; // Or your splash screen

  return (
    <>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </>
  );
}
