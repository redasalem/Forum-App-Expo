import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Colors, Spacing, FontSize } from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
  };
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack,
  onBack,
  rightAction,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.headerBg} />
      <View style={styles.container}>
        {/* Left: Back Button or Logo */}
        <View style={styles.leftContainer}>
          {showBack ? (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={Colors.textPrimary}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Ionicons name="home" size={20} color={Colors.textPrimary} />
              </View>
            </View>
          )}
        </View>

        {/* Center: Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {/* Right: Action Button */}
        <View style={styles.rightContainer}>
          {rightAction && (
            <TouchableOpacity
              onPress={rightAction.onPress}
              style={styles.actionButton}
            >
              <Ionicons
                name={rightAction.icon}
                size={24}
                color={Colors.textPrimary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.headerBg,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.headerBg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  leftContainer: {
    width: 50,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    padding: Spacing.xs,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: "600",
  },
  rightContainer: {
    width: 50,
    alignItems: "flex-end",
  },
  actionButton: {
    padding: Spacing.xs,
  },
});

export default Header;
