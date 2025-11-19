import { darkColors, lightColors } from "@/const/Colors";
import { Image as ExpoImage } from "expo-image";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  I18nManager,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Switch } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import BgColor from "../components/BgColor";

export default function Index() {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === "dark");
  const colors = isDark ? darkColors : lightColors;
  // Language state
  const [lang, setLang] = useState<"fa" | "en">("fa");
  // Animation refs
  const opAnim = useRef(new Animated.Value(0)).current;
  const displayAnim = useRef(new Animated.Value(1)).current;
  // Track last pressed button
  const [lastPressedButton, setLastPressedButton] = useState<number | null>(
    null
  );
  // Translations
  const t = {
    toggleLang: lang === "fa" ? "En" : "فا",
    toggleTheme: isDark ? "☀️" : "🌙",
    clear: lang === "fa" ? "پاک" : "C",
    title: lang === "fa" ? "بارمی" : "Baremi",
    lastInput: lang === "fa" ? "آخرین ورودی: " : "Last input: ",
  };
  // Force RTL on lang change
  useEffect(() => {
    I18nManager.forceRTL(lang === "fa");
  }, [lang]);
  // Dynamic StatusBar for visibility over gradient
  useEffect(() => {
    const bgColor = isDark ? "#0f172a" : "#f8fafc";
    StatusBar.setBackgroundColor(bgColor, true);
    StatusBar.setBarStyle(isDark ? "light-content" : "dark-content");
  }, [isDark]);
  // Calculator state
  const [total, setTotal] = useState(0);
  const [currentOp, setCurrentOp] = useState("+");
  const [lastInput, setLastInput] = useState<number | null>(null);
  // Dynamic button labels
  const baseButtons = [
    { value: 0.25 },
    { value: 0.5 },
    { value: 0.75 },
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 4 },
    { value: 5 },
  ];
  const buttons = baseButtons.map((btn) => {
    const rawLabel = Number.isInteger(btn.value)
      ? btn.value.toString()
      : btn.value.toFixed(2);
    const label =
      lang === "fa" ? parseFloat(rawLabel).toLocaleString("fa-IR") : rawLabel;
    return { ...btn, label };
  });
  const handleNumberPress = (value: number) => {
    Animated.sequence([
      Animated.timing(displayAnim, {
        toValue: 0.95,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(displayAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    const newTotal = currentOp === "+" ? total + value : total - value;
    setTotal(newTotal);
    setLastInput(value);
    setLastPressedButton(value);
  };
  const toggleOperation = () => {
    // Pulse animation for the operator icon
    Animated.sequence([
      Animated.timing(opAnim, {
        toValue: 1,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(opAnim, {
        toValue: 0,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
    setCurrentOp(currentOp === "+" ? "-" : "+");
  };
  const clear = () => {
    Animated.sequence([
      Animated.timing(displayAnim, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(displayAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    setTotal(0);
    setCurrentOp("+");
    setLastInput(null);
    setLastPressedButton(null); // Reset the highlighted button
    opAnim.setValue(0);
  };
  const toggleLang = () => setLang(lang === "fa" ? "en" : "fa");
  const toggleTheme = () => setIsDark(!isDark);
  // Format number
  const formatNumber = (num: number): string => {
    if (lang === "fa") {
      return num.toLocaleString("fa-IR", {
        minimumFractionDigits: Number.isInteger(num) ? 0 : 2,
        maximumFractionDigits: Number.isInteger(num) ? 0 : 2,
      });
    }
    return Number.isInteger(num) ? num.toString() : num.toFixed(2);
  };
  // Get button background color based on pressed state
  const getButtonBackgroundColor = (value: number) => {
    if (lastPressedButton === value) {
      return isDark ? "#166534" : "#22c55e"; // Dark green for dark mode, green for light mode
    }
    return colors.buttonBg;
  };
  // Get button text color based on pressed state
  const getButtonTextColor = (value: number) => {
    if (lastPressedButton === value) {
      return isDark ? "#f0fdf4" : "#f0fdf4"; // Light text for better contrast on green
    }
    return colors.buttonText;
  };
  // Fonts
  const getNumberFont = () => (lang === "fa" ? "ShabnamDigit" : "Inter");
  const getTextFont = () => (lang === "fa" ? "Shabnam" : "Inter");
  const getOpFont = () => (lang === "fa" ? "ShabnamBold" : "Inter");
  // Animations
  const opRotate = opAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });
  const opScale = opAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });
  const opIconSource =
    currentOp === "+"
      ? require("../assets/plus.png")
      : require("../assets/minus.png");
  return (
    <BgColor theme={isDark ? "dark" : "light"}>
      <SafeAreaView style={styles.container}>
        {/* Header with Toggles */}
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              { color: colors.text, fontFamily: getTextFont() },
            ]}
          >
            {t.title}
          </Text>
          <View style={styles.toggleCluster}>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                { backgroundColor: colors.langToggleBg },
              ]}
              onPress={toggleTheme}
            >
              <Text style={[styles.toggleText, { color: colors.text }]}>
                {t.toggleTheme}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                { backgroundColor: colors.langToggleBg },
              ]}
              onPress={toggleLang}
            >
              <Text
                style={[
                  styles.toggleText,
                  { fontFamily: getTextFont(), color: colors.text },
                ]}
              >
                {t.toggleLang}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Display with animation */}
        <Animated.View
          style={[
            styles.display,
            {
              backgroundColor: colors.displayBg,
              transform: [{ scale: displayAnim }],
            },
          ]}
        >
          {/* Display Op Button - Top Left */}
          <TouchableOpacity
            style={[
              styles.displayOpButton,
              {
                backgroundColor: colors.operatorBg,
                shadowColor: colors.shadow,
              },
            ]}
            onPress={toggleOperation}
          >
            <Animated.View
              style={{
                transform: [{ rotate: opRotate }, { scale: opScale }],
              }}
            >
              <ExpoImage
                source={opIconSource}
                style={styles.opIcon}
                tintColor={colors.opIcon}
                contentFit="cover"
              />
            </Animated.View>
          </TouchableOpacity>
          <Text
            style={[
              styles.displayText,
              { color: colors.text, fontFamily: getNumberFont() },
            ]}
          >
            {formatNumber(total)}
          </Text>
        </Animated.View>
        {/* Last Input Display */}
        {lastInput !== null && (
          <View style={styles.lastInputContainer}>
            <Text
              style={[
                styles.lastInputText,
                { color: colors.text, fontFamily: getTextFont() },
              ]}
            >
              {t.lastInput}
              <Text style={{ fontFamily: getNumberFont() }}>
                {formatNumber(lastInput)}
              </Text>
            </Text>
          </View>
        )}
        {/* Buttons Grid */}
        <View
          style={[
            styles.buttonGrid,
            { flexDirection: I18nManager.isRTL ? "row-reverse" : "row" },
          ]}
        >
          {buttons.map((btn, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.numberButton,
                {
                  backgroundColor: getButtonBackgroundColor(btn.value),
                  borderColor: colors.border,
                  shadowColor: colors.shadow,
                },
              ]}
              onPress={() => handleNumberPress(btn.value)}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: getButtonTextColor(btn.value),
                    fontFamily: getNumberFont(),
                  },
                ]}
              >
                {btn.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Operation Switch with Icon */}
        <View style={styles.opButtons}>
          <View style={styles.opSwitchContainer}>
            <Switch
              value={currentOp === "+"}
              onValueChange={toggleOperation}
              trackColor={{
                false: colors.toggleTrack,
                true: colors.toggleTrackActive,
              }}
              thumbColor={colors.toggleKnob}
              ios_backgroundColor={colors.toggleTrack}
            />
            <ExpoImage
              source={opIconSource}
              style={styles.switchIcon}
              tintColor={colors.opIconsecond}
              contentFit="contain"
            />
          </View>
          <TouchableOpacity
            style={[
              styles.clearButton,
              {
                backgroundColor: colors.clearBg,
                shadowColor: colors.shadow,
              },
            ]}
            onPress={clear}
          >
            <Text
              style={[
                styles.buttonText,
                { color: colors.clearText, fontFamily: getOpFont() },
              ]}
            >
              {t.clear}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </BgColor>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginVertical: 18,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
  },
  toggleCluster: {
    flexDirection: "row",
    gap: 8,
  },
  toggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  toggleText: {
    fontSize: 16,
  },
  display: {
    padding: 24,
    marginBottom: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  displayOpButton: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 1,
  },
  displayText: {
    fontSize: 52,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  lastInputContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  lastInputText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: I18nManager.isRTL ? "right" : "center",
  },
  buttonGrid: {
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 30,
    gap: 12,
  },
  numberButton: {
    width: 72,
    height: 72,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  opButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: 20,
  },
  // Switch Container Styles
  opSwitchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: 80,
    justifyContent: "center",
  },
  switchIcon: {
    width: 24,
    height: 24,
  },
  clearButton: {
    width: 72,
    height: 72,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 20,
  },
  opIcon: {
    width: 30,
    height: 30,
    zIndex: 5000,
  },
});
