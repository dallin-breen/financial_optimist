/* eslint-disable react-native/no-inline-styles */
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
  Alert,
  ImageBackground,
} from "react-native";
import { FIREBASE_AUTH } from "../../../firebase";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
const auth = FIREBASE_AUTH;

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleEmailChange(text) {
    setEmail(text);
  }

  function handlePasswordChange(text) {
    setPassword(text);
  }

  async function handleLogin() {
    if (email === "") {
      Alert.alert("Error", "Please enter your email");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert("Error", "Please enter a correct email address");
      return;
    }
    if (password === "") {
      Alert.alert("Error", "Please enter your password");
      return;
    }

    try {
      const unsubscribeFromAuthStateChanged = onAuthStateChanged(
        auth,
        async (user) => {
          if (user) {
            auth.signOut();
          } else {
            await signInWithEmailAndPassword(auth, email, password);
          }
        }
      );
      unsubscribeFromAuthStateChanged();
    } catch (error) {
      Alert.alert("Error", `${error}`);
      return;
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ImageBackground
        source={require("../../assets/money-background.jpg")}
        resizeMode="cover"
        style={styles.background}
      >
        <View style={styles.main}>
          <View style={styles.image}>
            <Image
              source={require("../../assets/placeholder_logo.png")}
              resizeMode="contain"
            />
          </View>
          <View style={styles.form}>
            <TextInput
              style={{
                height: "10%",
                width: "75%",
                marginBottom: "5%",
                borderWidth: 2,
                borderColor: "#747474",
                paddingHorizontal: 10,
                backgroundColor: "white",
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={handleEmailChange}
              placeholder="Email"
            />
            <TextInput
              style={{
                height: "10%",
                width: "75%",
                marginBottom: "5%",
                borderWidth: 2,
                borderColor: "#747474",
                paddingHorizontal: 10,
                backgroundColor: "white",
              }}
              keyboardType="default"
              autoCapitalize="none"
              value={password}
              secureTextEntry={true}
              onChangeText={handlePasswordChange}
              placeholder="Password"
            />
            <Pressable
              style={{
                height: "10%",
                width: "60%",
                borderRadius: 20,
                backgroundColor: "#3E859A",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "2.5%",
              }}
              onPress={handleLogin}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                Login
              </Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate("Forgot Password")}>
              <Text
                style={{
                  color: "#3E859A",
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                Forgot Password?
              </Text>
            </Pressable>
            <View
              style={{
                position: "absolute",
                height: "10%",
                width: "100%",
                bottom: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ marginRight: "2%" }}>Don't have an account?</Text>
              <Pressable onPress={() => navigation.navigate("Create Account")}>
                <Text style={{ color: "#3E859A", fontWeight: "600" }}>
                  Sign up
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
  },
  background: {
    flex: 1,
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
