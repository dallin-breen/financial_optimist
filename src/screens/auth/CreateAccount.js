/* eslint-disable react-native/no-inline-styles */
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
  ActivityIndicator,
} from "react-native";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function CreateAccount() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [budget, setBudget] = useState("$ 0.00");
  const auth = FIREBASE_AUTH;
  const db = FIRESTORE_DB;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  function setUserName(text) {
    setName(text);
  }

  function setUserEmail(text) {
    setEmail(text);
  }

  function setFirstPassword(text) {
    setPassword(text);
  }

  function setSecondPassword(text) {
    setConfirmPassword(text);
  }

  function setStartingBudget(text) {
    let numericValue = text.replace(/[^0-9.,]/g, "");
    const valueWithSign = "$ " + numericValue;
    setBudget(valueWithSign);
  }

  async function handleSubmit() {
    if (name === "") {
      Alert.alert("Error", "Please enter your full name");
      return;
    }

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

    if (confirmPassword === "") {
      Alert.alert("Error", "Please confirm your password");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "The passwords must match");
      return;
    }

    if (budget === "$ ") {
      Alert.alert("Error", "Please enter your balance");
      return;
    }

    if (!/^(\$ )?(\d{1,3}(,\d{3})*|(\d+))(\.\d{2})?$/.test(budget)) {
      // Input format is incorrect
      Alert.alert("Error", "Please enter your budget with the correct form");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name,
      });

      await setDoc(doc(db, "users", user.uid), {
        name: name,
        budget: budget,
      });

      await sendEmailVerification(user);

      Alert.alert(
        "Confirm Email",
        "Please go to your email and verify your account",
        [
          {
            text: "Return to Login",
            onPress: () => {
              auth.signOut();
              navigation.navigate("Login");
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", `${error}`);
      return;
    } finally {
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setBudget("$ 0.00");
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3E859A" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.main}>
        <View style={styles.form}>
          <View style={styles.inputs}>
            <Text style={{ fontSize: 17, fontWeight: "bold" }}>Full Name</Text>
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
              keyboardType="default"
              autoCapitalize="none"
              value={name}
              onChangeText={setUserName}
            />
          </View>
          <View style={styles.inputs}>
            <Text style={{ fontSize: 17, fontWeight: "bold" }}>Email</Text>
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
              onChangeText={setUserEmail}
            />
          </View>
          <View style={styles.inputs}>
            <Text style={{ fontSize: 17, fontWeight: "bold" }}>Password</Text>
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
              keyboardType="default"
              autoCapitalize="none"
              secureTextEntry={true}
              value={password}
              onChangeText={setFirstPassword}
            />
          </View>
          <View style={styles.inputs}>
            <Text style={{ fontSize: 17, fontWeight: "bold" }}>
              Confirm Password
            </Text>
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
              keyboardType="default"
              autoCapitalize="none"
              secureTextEntry={true}
              value={confirmPassword}
              onChangeText={setSecondPassword}
            />
          </View>
          <View style={styles.inputs}>
            <Text style={{ fontSize: 17, fontWeight: "bold" }}>
              Set Starting Budget
            </Text>
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
              keyboardType="numeric"
              value={budget}
              returnKeyType="done"
              onChangeText={setStartingBudget}
            />
          </View>
        </View>
        <View
          style={{
            position: "absolute",
            height: "5%",
            width: "100%",
            bottom: 30,
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
            onPress={handleSubmit}
          >
            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
              Submit
            </Text>
          </Pressable>
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
