import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Colors, Spacing, FontSize, BorderRadius } from "../constants/Colors";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const getContainerStyle = (): ViewStyle[] => {
    const styles: ViewStyle[] = [baseStyles.container];

    // Variant styles
    switch (variant) {
      case "primary":
        styles.push(baseStyles.primaryContainer);
        break;
      case "secondary":
        styles.push(baseStyles.secondaryContainer);
        break;
      case "outline":
        styles.push(baseStyles.outlineContainer);
        break;
      case "danger":
        styles.push(baseStyles.dangerContainer);
        break;
    }

    // Size styles
    switch (size) {
      case "small":
        styles.push(baseStyles.smallContainer);
        break;
      case "medium":
        styles.push(baseStyles.mediumContainer);
        break;
      case "large":
        styles.push(baseStyles.largeContainer);
        break;
    }

    if (fullWidth) {
      styles.push({ width: "100%" });
    }

    if (disabled) {
      styles.push(baseStyles.disabled);
    }

    return styles;
  };

  const getTextStyle = (): TextStyle[] => {
    const styles: TextStyle[] = [baseStyles.text];

    switch (variant) {
      case "primary":
      case "danger":
        styles.push(baseStyles.primaryText);
        break;
      case "secondary":
        styles.push(baseStyles.secondaryText);
        break;
      case "outline":
        styles.push(baseStyles.outlineText);
        break;
    }

    switch (size) {
      case "small":
        styles.push(baseStyles.smallText);
        break;
      case "medium":
        styles.push(baseStyles.mediumText);
        break;
      case "large":
        styles.push(baseStyles.largeText);
        break;
    }

    return styles;
  };

  return (
    <TouchableOpacity
      style={[...getContainerStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" ? Colors.primary : Colors.textPrimary}
          size="small"
        />
      ) : (
        <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const baseStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BorderRadius.md,
  },
  primaryContainer: {
    backgroundColor: Colors.primary,
  },
  secondaryContainer: {
    backgroundColor: Colors.surfaceLight,
  },
  outlineContainer: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  dangerContainer: {
    backgroundColor: Colors.error,
  },
  smallContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  mediumContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  largeContainer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: "600",
  },
  primaryText: {
    color: Colors.textPrimary,
  },
  secondaryText: {
    color: Colors.textSecondary,
  },
  outlineText: {
    color: Colors.primary,
  },
  smallText: {
    fontSize: FontSize.sm,
  },
  mediumText: {
    fontSize: FontSize.md,
  },
  largeText: {
    fontSize: FontSize.lg,
  },
});

export default Button;
