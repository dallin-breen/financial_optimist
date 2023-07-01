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

export default function Home(props) {
  return (
    <KeyboardAvoidingView>
      <View>
        <Text>{props.user}</Text>
      </View>
    </KeyboardAvoidingView>
  );
}
