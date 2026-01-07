import { StatusBar } from "expo-status-bar";
import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { cssInterop } from "nativewind";
import { AuthProvider } from "./src/context/AuthContext";
import Navigation from "./src/navigation/Navigation";

// Manual interop for core components as fallback
cssInterop(View, { className: "style" });
cssInterop(Text, { className: "style" });
cssInterop(TouchableOpacity, { className: "style" });
cssInterop(ScrollView, { className: "style" });

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Navigation />
    </AuthProvider>
  );
}
