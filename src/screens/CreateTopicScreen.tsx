import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Colors, Spacing, FontSize, BorderRadius } from "../constants/Colors";
import { topicsAPI } from "../services/api";
import Header from "../components/Header";
import Button from "../components/Button";
import Input from "../components/Input";

interface CreateTopicScreenProps {
  navigation: any;
}

const CreateTopicScreen: React.FC<CreateTopicScreenProps> = ({
  navigation,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>(
    {}
  );

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }

    if (!content.trim()) {
      newErrors.content = "Content is required";
    } else if (content.length < 10) {
      newErrors.content = "Content must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const tagsArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      await topicsAPI.create({
        title: title.trim(),
        content: content.trim(),
        tags: tagsArray,
      });

      console.log("Topic created successfully, navigating to Home");
      navigation.navigate("MainTabs", { screen: "Home" });
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to create topic"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Header title="New Topic" showBack onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label="Title *"
          placeholder="Enter a descriptive title"
          value={title}
          onChangeText={setTitle}
          error={errors.title}
        />

        <View style={styles.contentInputContainer}>
          <Text style={styles.label}>Content *</Text>
          <TextInput
            style={[styles.contentInput, errors.content && styles.inputError]}
            placeholder="Share your thoughts, questions, or ideas..."
            placeholderTextColor={Colors.textMuted}
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={10}
            textAlignVertical="top"
          />
          {errors.content && (
            <Text style={styles.errorText}>{errors.content}</Text>
          )}
        </View>

        <Input
          label="Tags (optional)"
          placeholder="javascript, react, help (comma separated)"
          value={tags}
          onChangeText={setTags}
        />

        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>💡 Tips for a great topic:</Text>
          <Text style={styles.tipItem}>• Use a clear, descriptive title</Text>
          <Text style={styles.tipItem}>
            • Provide enough context in your content
          </Text>
          <Text style={styles.tipItem}>
            • Add relevant tags to help others find it
          </Text>
        </View>

        <Button
          title="Create Topic"
          onPress={handleSubmit}
          loading={loading}
          fullWidth
          size="large"
          style={styles.submitButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: "500",
    marginBottom: Spacing.xs,
  },
  contentInputContainer: {
    marginBottom: Spacing.md,
  },
  contentInput: {
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    minHeight: 200,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSize.sm,
    marginTop: Spacing.xs,
  },
  tips: {
    backgroundColor: Colors.surfaceLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  tipsTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  tipItem: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    marginBottom: 4,
  },
  submitButton: {
    marginTop: Spacing.md,
  },
});

export default CreateTopicScreen;
