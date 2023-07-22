import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { FIREBASE_AUTH } from "../../../firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();
  const auth = FIREBASE_AUTH;

  async function resetPassword() {
    if (email === "") {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert("Error", "Please enter a correct email address");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Reset Password",
        "Please go to your email and reset your password using the link in the email",
        [
          {
            text: "Return to Login",
            onPress: () => {
              navigation.navigate("Login");
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", `${error}`);
      return;
    } finally {
      setEmail("");
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.main}>
        <View style={styles.form}>
          <View style={styles.inputs}>
            <Text style={{ fontSize: 17, fontWeight: "bold" }}>Email:</Text>
            <TextInput
              style={{
                height: "60%",
                width: "100%",
                borderWidth: 2,
                borderColor: "#747474",
                paddingHorizontal: 10,
                backgroundColor: "white",
                borderRadius: 50,
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
          </View>
          <View
            style={{
              position: "absolute",
              height: "5%",
              width: "100%",
              bottom: 500,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Pressable
              style={{
                height: "100%",
                width: "60%",
                borderRadius: 20,
                backgroundColor: "#3E859A",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={resetPassword}
            >
              <Text
                style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
              >
                Reset Password
              </Text>
            </Pressable>
          </View>
        </View>
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
  form: {
    height: "90%",
    width: "100%",
    alignItems: "center",
  },
  inputs: {
    width: "75%",
    height: "10%",
    marginBottom: "5%",
    justifyContent: "space-between",
  },
});
