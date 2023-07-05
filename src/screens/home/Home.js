import React, { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../../../firebase";
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

const auth = FIREBASE_AUTH;

export default function Home() {
  const [currentYear, setCurrentYear] = useState(null);
  useEffect(() => {
    const year = new Date().getFullYear();
    setCurrentYear(year);
  }, []);
  function handleSignout() {
    auth.signOut();
  }
  return (
    <KeyboardAvoidingView style={styles.container}>
      <View>
        <Text>{currentYear}</Text>
        <Pressable onPress={handleSignout}>
          <Text>Sign Out</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#D9D9D9",
    height: "100%",
    width: "100%",
    justifyContent: "center",
  },
  main: {
    height: "90%",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  image: {
    height: "50%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    height: "50%",
    width: "100%",
    alignItems: "center",
  },
});
