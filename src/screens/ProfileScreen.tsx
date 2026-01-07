import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Colors, Spacing, FontSize, BorderRadius } from "../constants/Colors";
import { usersAPI, topicsAPI, repliesAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Topic, Reply } from "../types";
import Header from "../components/Header";
import Button from "../components/Button";
import TopicCard from "../components/TopicCard";
import { Ionicons } from "@expo/vector-icons";

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"topics" | "replies">("topics");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [stats, setStats] = useState({ topics: 0, replies: 0 });
  const [loading, setLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    type: "topic" | "reply";
  } | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      const [profileRes, topicsRes, repliesRes] = await Promise.all([
        usersAPI.getMe(),
        usersAPI.getTopics(user._id),
        usersAPI.getReplies(user._id),
      ]);

      setStats(profileRes.data.data.stats || { topics: 0, replies: 0 });
      setTopics(topicsRes.data.data);
      setReplies(repliesRes.data.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    console.log("Logout triggered directly (Bypassing non-responsive Alert)");
    await logout();
  };

  const executeDelete = async () => {
    if (!itemToDelete) return;

    const { id, type } = itemToDelete;
    console.log(`Executing delete for ${type} with ID:`, id);

    try {
      if (type === "topic") {
        const response = await topicsAPI.delete(id);
        console.log("Delete topic response:", response.data);
        setTopics((prev) => prev.filter((t) => t._id !== id));
        setStats((prev) => ({ ...prev, topics: Math.max(0, prev.topics - 1) }));
      } else {
        const response = await repliesAPI.delete(id);
        console.log("Delete reply response:", response.data);
        setReplies((prev) => prev.filter((r) => r._id !== id));
        setStats((prev) => ({
          ...prev,
          replies: Math.max(0, prev.replies - 1),
        }));
      }
    } catch (error: any) {
      console.error(
        `Delete ${type} error:`,
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        error.response?.data?.message || `Failed to delete ${type}`
      );
    } finally {
      setItemToDelete(null);
    }
  };

  const handleDeleteTopic = (id: string) => {
    console.log("Requesting delete for topic:", id);
    setItemToDelete({ id, type: "topic" });
  };

  const handleDeleteReply = (id: string) => {
    console.log("Requesting delete for reply:", id);
    setItemToDelete({ id, type: "reply" });
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Header title="Profile" />
        <View style={styles.notLoggedIn}>
          <Ionicons
            name="person-circle-outline"
            size={80}
            color={Colors.textMuted}
          />
          <Text style={styles.notLoggedInText}>
            Please login to view your profile
          </Text>
          <Button
            title="Login"
            onPress={() => navigation.navigate("Login")}
            style={{ marginTop: Spacing.lg }}
          />
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Profile" />

      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
          {user.bio ? <Text style={styles.bio}>{user.bio}</Text> : null}

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.topics}</Text>
              <Text style={styles.statLabel}>Topics</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.replies}</Text>
              <Text style={styles.statLabel}>Replies</Text>
            </View>
          </View>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "topics" && styles.activeTab]}
            onPress={() => setActiveTab("topics")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "topics" && styles.activeTabText,
              ]}
            >
              My Topics
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "replies" && styles.activeTab]}
            onPress={() => setActiveTab("replies")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "replies" && styles.activeTabText,
              ]}
            >
              My Replies
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "topics" ? (
          <View style={styles.listContent}>
            {topics.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  You haven't created any topics yet
                </Text>
              </View>
            ) : (
              topics.map((topic, index) => (
                <TopicCard
                  key={`${topic._id}-${index}`}
                  topic={topic}
                  index={index + 1}
                  onPress={() =>
                    navigation.navigate("TopicDetail", { topicId: topic._id })
                  }
                  onDelete={() => handleDeleteTopic(topic._id)}
                />
              ))
            )}
          </View>
        ) : (
          <View style={styles.listContent}>
            {replies.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  You haven't replied to any topics yet
                </Text>
              </View>
            ) : (
              replies.map((reply) => (
                <View key={reply._id} style={styles.replyItemContainer}>
                  <TouchableOpacity
                    style={styles.replyItem}
                    onPress={() => {
                      const topicId =
                        typeof reply.topic === "string"
                          ? reply.topic
                          : reply.topic._id;
                      navigation.navigate("TopicDetail", { topicId });
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.replyTopicTitle} numberOfLines={1}>
                        {typeof reply.topic === "object"
                          ? reply.topic.title
                          : "View Topic"}
                      </Text>
                      <Text style={styles.replyContent} numberOfLines={2}>
                        {reply.content}
                      </Text>
                      <Text style={styles.idMiniText}>
                        ID: {reply._id.substring(reply._id.length - 6)}
                      </Text>
                      <Text style={styles.idMiniText}>
                        ID: {reply._id.substring(reply._id.length - 6)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteReply(reply._id)}
                    style={styles.replyDeleteBtn}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color={Colors.error}
                    />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}

        <View style={styles.logoutContainer}>
          <Button
            title="Logout"
            variant="danger"
            onPress={handleLogout}
            fullWidth
          />
        </View>
      </ScrollView>

      {/* Deletion Confirmation Modal Fallback */}
      {itemToDelete && (
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>Confirm Delete</Text>
            <Text style={styles.confirmMessage}>
              Are you sure you want to delete this {itemToDelete.type}? (ID:{" "}
              {itemToDelete.id.substring(itemToDelete.id.length - 6)})
            </Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity
                style={[styles.confirmBtn, styles.cancelBtn]}
                onPress={() => setItemToDelete(null)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, styles.deleteConfirmBtn]}
                onPress={executeDelete}
              >
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
  notLoggedIn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.lg,
  },
  notLoggedInText: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    marginTop: Spacing.md,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  username: {
    color: Colors.textPrimary,
    fontSize: FontSize.xxl,
    fontWeight: "bold",
    marginTop: Spacing.md,
  },
  email: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    marginTop: Spacing.xs,
  },
  bio: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    textAlign: "center",
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xl,
  },
  statsContainer: {
    flexDirection: "row",
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  statValue: {
    color: Colors.primary,
    fontSize: FontSize.xxl,
    fontWeight: "bold",
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: "500",
  },
  activeTabText: {
    color: Colors.primary,
  },
  listContent: {
    flex: 1,
  },
  emptyState: {
    padding: Spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
  },
  replyItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  replyItem: {
    flex: 1,
    padding: Spacing.md,
  },
  replyDeleteBtn: {
    padding: Spacing.md,
  },
  replyTopicTitle: {
    color: Colors.link,
    fontSize: FontSize.md,
    fontWeight: "500",
    marginBottom: Spacing.xs,
  },
  replyContent: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
  },
  idMiniText: {
    color: Colors.textMuted,
    fontSize: 10,
    marginTop: 4,
    fontFamily: "monospace",
  },
  logoutContainer: {
    padding: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  confirmOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
    zIndex: 1000,
  },
  confirmBox: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  confirmTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: "bold",
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  confirmMessage: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    marginBottom: Spacing.xl,
    textAlign: "center",
    lineHeight: 20,
  },
  confirmActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: Colors.surfaceLight,
    marginRight: Spacing.sm,
  },
  deleteConfirmBtn: {
    backgroundColor: Colors.error,
    marginLeft: Spacing.sm,
  },
  cancelBtnText: {
    color: Colors.textPrimary,
    fontWeight: "600",
  },
  deleteBtnText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});

export default ProfileScreen;
