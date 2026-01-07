import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ActivityIndicator, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";
import { useAuth } from "../context/AuthContext";

// Screens
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import TopicDetailScreen from "../screens/TopicDetailScreen";
import CreateTopicScreen from "../screens/CreateTopicScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack - Login/Register
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      // contentStyle: { backgroundColor: Colors.background },
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

// Main Tab Navigator
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;

        if (route.name === "Home") {
          iconName = focused ? "home" : "home";
        } else if (route.name === "Profile") {
          iconName = focused ? "person" : "person";
        } else {
          iconName = "ellipse";
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.textMuted,
      tabBarStyle: {
        backgroundColor: Colors.surface,
        borderTopColor: Colors.border,
        borderTopWidth: 1,
        paddingBottom: 10,
        paddingTop: 8,
        height: 70,
      },
      tabBarLabelStyle: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
      },
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

// App Stack - Contains tabs and other screens
const AppStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      // contentStyle: { backgroundColor: Colors.background },
    }}
  >
    <Stack.Screen name="MainTabs" component={MainTabs} />
    <Stack.Screen name="TopicDetail" component={TopicDetailScreen} />
    <Stack.Screen name="CreateTopic" component={CreateTopicScreen} />
  </Stack.Navigator>
);

// Main Navigation
const Navigation = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.background,
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Navigation;
