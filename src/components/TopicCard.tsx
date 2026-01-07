import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, FontSize, BorderRadius } from "../constants/Colors";
import { Topic } from "../types";

interface TopicCardProps {
  topic: Topic;
  onPress: () => void;
  index: number;
  onDelete?: () => void;
}

const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  onPress,
  index,
  onDelete,
}) => {
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Row Number */}
      <View style={styles.indexContainer}>
        <Text style={styles.indexText}>{index}</Text>
      </View>

      {/* Topic Info */}
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {topic.title}
        </Text>

        {/* Tags */}
        {topic.tags && topic.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {topic.tags.slice(0, 3).map((tag, idx) => (
              <View key={idx} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Participants Avatars */}
      <View style={styles.avatarsContainer}>
        {topic.recentParticipants?.slice(0, 4).map((participant, idx) => (
          <Image
            key={`${participant._id}-${idx}`}
            source={{ uri: participant.avatar }}
            style={[
              styles.avatar,
              { marginLeft: idx > 0 ? -10 : 0, zIndex: 4 - idx },
            ]}
          />
        ))}
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{topic.replyCount}</Text>
          <Text style={styles.statLabel}>Replies</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.activityText}>
            {topic.timeAgo || formatTimeAgo(topic.lastActivity)}
          </Text>
        </View>

        {onDelete && (
          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={20} color={Colors.error} />
          </TouchableOpacity>
        )}
      </View>

      {/* Visible ID for management */}
      <View style={styles.idBadge}>
        <Text style={styles.idText}>
          ID: {topic._id.substring(topic._id.length - 6)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  indexContainer: {
    width: 30,
    alignItems: "center",
  },
  indexText: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: "500",
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: Spacing.sm,
  },
  title: {
    color: Colors.link,
    fontSize: FontSize.md,
    fontWeight: "500",
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: "row",
    marginTop: Spacing.xs,
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.xs,
  },
  tagText: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
  },
  avatarsContainer: {
    flexDirection: "row",
    marginHorizontal: Spacing.sm,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 120,
    justifyContent: "flex-end",
  },
  statItem: {
    alignItems: "center",
    marginLeft: Spacing.md,
    minWidth: 35,
  },
  statValue: {
    color: Colors.textPrimary,
    fontSize: FontSize.sm,
    fontWeight: "600",
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
  },
  activityText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
  },
  deleteButton: {
    padding: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  idBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  idText: {
    color: Colors.textMuted,
    fontSize: 8,
    fontFamily: "monospace",
  },
});

export default TopicCard;
