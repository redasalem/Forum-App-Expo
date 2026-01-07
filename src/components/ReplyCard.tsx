import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Colors, Spacing, FontSize, BorderRadius } from "../constants/Colors";
import { Reply } from "../types";

interface ReplyCardProps {
  reply: Reply;
  isOwn?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ReplyCard: React.FC<ReplyCardProps> = ({
  reply,
  isOwn,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View style={styles.container}>
      {/* Author Info */}
      <View style={styles.header}>
        <Image source={{ uri: reply.author.avatar }} style={styles.avatar} />
        <View style={styles.authorInfo}>
          <Text style={styles.username}>{reply.author.username}</Text>
          <Text style={styles.date}>{formatDate(reply.createdAt)}</Text>
        </View>
        {/* Deletion handled in Profile screen exclusively */}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.contentText}>{reply.content}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: Spacing.sm,
  },
  authorInfo: {
    flex: 1,
  },
  username: {
    color: Colors.link,
    fontSize: FontSize.md,
    fontWeight: "600",
  },
  date: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
  },
  actions: {
    flexDirection: "row",
  },
  actionText: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    marginLeft: Spacing.md,
  },
  deleteText: {
    color: Colors.error,
  },
  content: {
    paddingLeft: Spacing.xl + Spacing.sm,
  },
  contentText: {
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    lineHeight: 22,
  },
});

export default ReplyCard;
