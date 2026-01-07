import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Colors, Spacing, FontSize, BorderRadius } from "../constants/Colors";
import Input from "../components/Input";
import Button from "../components/Button";
import Header from "../components/Header";
import { Ionicons } from "@expo/vector-icons";

import { authAPI } from "../services/api";

interface ForgotPasswordScreenProps {
  navigation: any;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleResetPassword = async () => {
    if (!email.trim() || !oldPassword.trim() || !newPassword.trim()) {
      setError("All fields are required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await authAPI.resetDirect({
        email,
        oldPassword,
        newPassword,
      });
      setLoading(false);
      setIsSuccess(true);
      Alert.alert(
        "Success",
        response.data.message || "Password updated successfully!",
        [{ text: "OK" }]
      );
    } catch (err: any) {
      setLoading(false);
      Alert.alert(
        "Error",
        err.response?.data?.message ||
          "Something went wrong. Please check your credentials."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Header
        title="Reset Password"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.iconContainer}>
          <View style={styles.circle}>
            <Ionicons
              name={isSuccess ? "checkmark-circle" : "key-outline"}
              size={40}
              color={isSuccess ? Colors.success : Colors.primary}
            />
          </View>
        </View>

        <Text style={styles.title}>
          {isSuccess ? "Password Updated!" : "Direct Reset"}
        </Text>
        <Text style={styles.subtitle}>
          {isSuccess
            ? "Your password has been changed successfully. You can now log in with your new password."
            : "Enter your email and current password to set a new one."}
        </Text>

        <View style={styles.form}>
          {isSuccess && (
            <View style={styles.successContainer}>
              <Text style={styles.successText}>
                Your password has been reset successfully! 🚀
              </Text>
            </View>
          )}

          {!isSuccess ? (
            <>
              <Input
                label="Email Address"
                placeholder="example@email.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (error) setError("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Input
                label="Old Password"
                placeholder="Enter old password"
                value={oldPassword}
                onChangeText={setOldPassword}
                secureTextEntry
              />

              <Input
                label="New Password"
                placeholder="Min 6 characters"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                error={error}
              />

              <Button
                title="Update Password"
                onPress={handleResetPassword}
                loading={loading}
                fullWidth
                size="large"
                style={styles.button}
              />
            </>
          ) : (
            <Button
              title="Go to Login"
              onPress={() => navigation.navigate("Login")}
              fullWidth
              size="large"
              style={styles.button}
            />
          )}

          <TouchableOpacity
            style={styles.backToLogin}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.backToLoginText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  iconContainer: {
    alignItems: "center",
    marginVertical: Spacing.xl,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: "bold",
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.xxl,
    lineHeight: 22,
  },
  form: {
    width: "100%",
  },
  button: {
    marginTop: Spacing.md,
  },
  successContainer: {
    backgroundColor: Colors.success + "20",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  successText: {
    color: Colors.success,
    fontSize: FontSize.md,
    textAlign: "center",
    fontWeight: "600",
  },
  backToLogin: {
    marginTop: 80, // Significant spacing as requested
    marginBottom: 40,
    alignItems: "center",
  },
  backToLoginText: {
    color: Colors.primary,
    fontSize: FontSize.md,
    fontWeight: "600",
  },
});

export default ForgotPasswordScreen;
