import React, { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
  Text,
  KeyboardAvoidingView,
  // Alert,
} from "react-native";

export default function Home() {
  const route = useRoute();
  const { user } = route.params;
  return (
    <KeyboardAvoidingView>
      <View>
        <Text>{user.displayName}</Text>
      </View>
    </KeyboardAvoidingView>
  );
}
