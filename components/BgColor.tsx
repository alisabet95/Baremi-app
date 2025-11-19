// components/BgColor.tsx
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet } from "react-native";

interface BgColorProps {
  children: React.ReactNode;
  theme: "light" | "dark";
}

const BgColor = ({ children, theme }: BgColorProps) => {
  const isDarkMode = theme === "dark";

  // Softer gradients tuned to your slate/blue scheme
  const lights = [
    "#f8fafcff", // Slate start
    "#e2e8f0ff", // Mid blue-gray
    "#b6eec5ff", // Soft end
  ] as const; // 'as const' fixes TS: makes readonly tuple
  const darks = [
    "#021237ff", // Deep slate
    "#012660ff", // Mid gray-blue
    "#0f172aff", // Fade back
  ] as const;

  return (
    <LinearGradient
      colors={isDarkMode ? darks : lights}
      locations={[0, 0.6, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {children}
    </LinearGradient>
  );
};

export default BgColor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
