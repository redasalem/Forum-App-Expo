import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Colors, Spacing, FontSize, BorderRadius } from "../constants/Colors";
import { topicsAPI } from "../services/api";
import { Topic } from "../types";
import Header from "../components/Header";
import TopicCard from "../components/TopicCard";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchTopics = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      }

      const response = await topicsAPI.getAll(pageNum, 20);
      const newTopics = response.data.data;

      if (pageNum === 1) {
        setTopics(newTopics);
      } else {
        setTopics((prev) => [...prev, ...newTopics]);
      }

      setHasMore(pageNum < response.data.pagination.pages);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching topics:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTopics(1);
    }, [])
  );

  const handleRefresh = () => {
    fetchTopics(1, true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchTopics(page + 1);
    }
  };

  const handleTopicPress = (topic: Topic) => {
    navigation.navigate("TopicDetail", { topicId: topic._id });
  };

  const renderTopicItem = ({ item, index }: { item: Topic; index: number }) => (
    <TopicCard
      topic={item}
      index={index + 1}
      onPress={() => handleTopicPress(item)}
    />
  );

  const renderHeader = () => (
    <View style={styles.listHeader}>
      <View style={styles.headerRow}>
        <Text style={styles.headerIndex}>#</Text>
        <Text style={styles.headerTopic}>Topic</Text>
        <Text style={styles.headerStats}>Replies</Text>
        <Text style={styles.headerStats}>Views</Text>
        <Text style={styles.headerStats}>Activity</Text>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubbles-outline" size={64} color={Colors.textMuted} />
      <Text style={styles.emptyTitle}>No topics yet</Text>
      <Text style={styles.emptySubtitle}>
        Be the first to start a discussion!
      </Text>
    </View>
  );

  if (loading && topics.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading topics...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Forum App"
        rightAction={{
          icon: "search",
          onPress: () => console.log("Search pressed"),
        }}
      />

      <FlatList
        data={topics}
        renderItem={renderTopicItem}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={
          topics.length === 0 ? styles.emptyList : undefined
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateTopic")}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color={Colors.textPrimary} />
      </TouchableOpacity>
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
  loadingText: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    marginTop: Spacing.md,
  },
  listHeader: {
    backgroundColor: Colors.headerBg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIndex: {
    width: 30,
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    textAlign: "center",
  },
  headerTopic: {
    flex: 1,
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    marginLeft: Spacing.sm,
  },
  headerStats: {
    width: 50,
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    textAlign: "center",
  },
  footer: {
    padding: Spacing.lg,
    alignItems: "center",
  },
  emptyList: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xxl,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: "600",
    marginTop: Spacing.md,
  },
  emptySubtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    marginTop: Spacing.xs,
  },
  fab: {
    position: "absolute",
    bottom: Spacing.xl,
    right: Spacing.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
});

export default HomeScreen;
