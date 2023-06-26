import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
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
  return (
    <KeyboardAvoidingView>
      <View>
        <Text>Hello World!</Text>
      </View>
    </KeyboardAvoidingView>
  );
}
