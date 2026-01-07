import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Colors, Spacing, FontSize, BorderRadius } from "../constants/Colors";
import { topicsAPI, repliesAPI } from "../services/api";
import { Topic, Reply } from "../types";
import Header from "../components/Header";
import ReplyCard from "../components/ReplyCard";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

interface TopicDetailScreenProps {
  navigation: any;
  route: {
    params: {
      topicId: string;
    };
  };
}

const TopicDetailScreen: React.FC<TopicDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { topicId } = route.params;
  const { user } = useAuth();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTopicDetails();
  }, [topicId]);

  const fetchTopicDetails = async () => {
    try {
      const [topicRes, repliesRes] = await Promise.all([
        topicsAPI.getById(topicId),
        topicsAPI.getReplies(topicId),
      ]);
      setTopic(topicRes.data.data);
      setReplies(repliesRes.data.data);
    } catch (error) {
      console.error("Error fetching topic:", error);
      Alert.alert("Error", "Failed to load topic");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) {
      Alert.alert("Error", "Please enter a reply");
      return;
    }

    setSubmitting(true);
    try {
      const response = await repliesAPI.create({
        content: replyContent.trim(),
        topicId,
      });
      setReplies((prev) => [...prev, response.data.data]);
      setReplyContent("");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to post reply"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!topic) {
    return null;
  }

  const isOwner = user?._id === topic.author._id;

  return (
    <View style={styles.container}>
      <Header title="Topic" showBack onBack={() => navigation.goBack()} />

      <ScrollView style={styles.content}>
        {/* Topic Content */}
        <View style={styles.topicContainer}>
          <Text style={styles.title}>{topic.title}</Text>

          <View style={styles.authorRow}>
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>{topic.author.username}</Text>
              <Text style={styles.date}>{formatDate(topic.createdAt)}</Text>
            </View>
            <View style={styles.stats}>
              <Text style={styles.statText}>👁 {topic.views}</Text>
              <Text style={styles.statText}>💬 {topic.replyCount}</Text>
            </View>
          </View>

          <Text style={styles.topicContent}>{topic.content}</Text>

          {topic.tags && topic.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {topic.tags.map((tag, idx) => (
                <View key={idx} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Replies Section */}
        <View style={styles.repliesHeader}>
          <Text style={styles.repliesTitle}>
            {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
          </Text>
        </View>

        {replies.map((reply) => (
          <ReplyCard
            key={reply._id}
            reply={reply}
            isOwn={user?._id === reply.author._id}
          />
        ))}

        {replies.length === 0 && (
          <View style={styles.noReplies}>
            <Text style={styles.noRepliesText}>
              No replies yet. Be the first to respond!
            </Text>
          </View>
        )}

        {/* Reply Input */}
        {user && (
          <View style={styles.replyInputContainer}>
            <Text style={styles.replyInputLabel}>Write a reply</Text>
            <TextInput
              style={styles.replyInput}
              placeholder="Share your thoughts..."
              placeholderTextColor={Colors.textMuted}
              value={replyContent}
              onChangeText={setReplyContent}
              multiline
              numberOfLines={4}
            />
            <Button
              title="Post Reply"
              onPress={handleSubmitReply}
              loading={submitting}
              disabled={!replyContent.trim()}
              fullWidth
            />
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  topicContainer: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.xxl,
    fontWeight: "bold",
    marginBottom: Spacing.md,
  },
  authorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  authorInfo: {},
  authorName: {
    color: Colors.link,
    fontSize: FontSize.md,
    fontWeight: "600",
  },
  date: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  stats: {
    flexDirection: "row",
  },
  statText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    marginLeft: Spacing.md,
  },
  topicContent: {
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: Spacing.lg,
  },
  tag: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  tagText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
  },
  repliesHeader: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  repliesTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: "600",
  },
  noReplies: {
    padding: Spacing.xl,
    alignItems: "center",
  },
  noRepliesText: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
  },
  replyInputContainer: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    marginTop: Spacing.md,
  },
  replyInputLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: "500",
    marginBottom: Spacing.sm,
  },
  replyInput: {
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: Spacing.md,
  },
  bottomPadding: {
    height: Spacing.xxl,
  },
});

export default TopicDetailScreen;
