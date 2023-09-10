import React, { useState, useEffect } from "react";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebase";
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  KeyboardAvoidingView,
  Alert,
  TextInput,
  ActivityIndicator,
} from "react-native";

import { collection, doc, addDoc } from "firebase/firestore";

const auth = FIREBASE_AUTH;
const db = FIRESTORE_DB;

export default function CreateYear({ reloadCurrentYear }) {
  const currentYear = new Date().getFullYear();
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(false);
  const months = [
    { id: 1, name: "January" },
    { id: 2, name: "February" },
    { id: 3, name: "March" },
    { id: 4, name: "April" },
    { id: 5, name: "May" },
    { id: 6, name: "June" },
    { id: 7, name: "July" },
    { id: 8, name: "August" },
    { id: 9, name: "September" },
    { id: 10, name: "October" },
    { id: 11, name: "November" },
    { id: 12, name: "December" },
  ];

  function setStartingBudget(text) {
    let numericValue = text.replace(/[^0-9.,]/g, "");
    setBudget(numericValue);
  }

  async function handleSubmit() {
    if (budget === null) {
      Alert.alert("Error", "Please enter your balance");
      return;
    }

    if (!/^(\d{1,3}(,\d{3})*|(\d+))(\.\d{2})?$/.test(budget)) {
      Alert.alert(
        "Error",
        "Please enter your budget in the correct form (ex. $1.25 or $1234.56)"
      );
      return;
    }
    try {
      setLoading(true);

      let docRef = doc(db, "users", auth.currentUser.uid);
      let colRef = collection(docRef, `${currentYear}`);

      for (let i = 0; i < months.length; i++) {
        await addDoc(colRef, {
          number: i + 1,
          month: months[i].name,
          budget: parseFloat(budget),
        });
      }
    } catch (error) {
      Alert.alert("Error", "Something happened during your submission");
      return;
    } finally {
      setBudget(null);
      setLoading(false);
      reloadCurrentYear(true);
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
          <Text
            style={{ fontSize: 17, fontWeight: "bold", marginBottom: "5%" }}
          >
            You do not have a a budget set for the current year. Please set one
            now.
          </Text>
          <View style={styles.inputs}>
            <Text style={{ fontSize: 17, fontWeight: "bold" }}>Set Budget</Text>
            <View style={styles.budgetInput}>
              <Text style={{ fontSize: 17, fontWeight: "bold" }}>$</Text>
              <TextInput
                style={{
                  width: "90%",
                  height: "100%",
                  borderWidth: 2,
                  borderColor: "#747474",
                  paddingHorizontal: 10,
                  backgroundColor: "white",
                  borderRadius: 50,
                }}
                keyboardType="decimal-pad"
                value={budget}
                returnKeyType="done"
                onChangeText={setStartingBudget}
              />
            </View>
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
    justifyContent: "center",
  },
  inputs: {
    width: "75%",
    height: "10%",
    marginBottom: "5%",
    justifyContent: "space-between",
  },
  budgetInput: {
    flexDirection: "row",
    height: "60%",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
