import React, { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../firebase";
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
import { doc, getDoc } from "firebase/firestore";

const auth = FIREBASE_AUTH;
const db = FIRESTORE_DB;

export default function Home() {
  const [currentYear, setCurrentYear] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentBudget, setCurrentBudget] = useState(null);

  useEffect(() => {
    const year = new Date().getFullYear();
    setCurrentYear(year);

    async function getUserInfo() {
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      setCurrentUser(docSnap.data().name);
      setCurrentBudget(docSnap.data().budget);
    }
    getUserInfo();
  }, []);

  function handleSignout() {
    auth.signOut();
  }
  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.main}>
        <View style={styles.nameBar}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {currentUser || "Loading..."}
          </Text>
        </View>
        <View style={styles.budgetBar}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Your Total Balance
          </Text>
          <Text style={{ fontSize: 30, fontWeight: "bold" }}>
            {currentBudget || "Loading..."}
          </Text>
        </View>
        <View style={styles.yearBar}>
          <Text style={{ fontSize: 30, fontWeight: "bold", color: "#3E859A" }}>
            {currentYear}
          </Text>
        </View>
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
  },
  nameBar: {
    width: "100%",
    height: "7%",
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  budgetBar: {
    width: "100%",
    height: "10%",
    borderBottomWidth: 2,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  yearBar: {
    width: "100%",
    height: "7%",
    borderBottomWidth: 2,
    borderColor: "#3E859A",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    height: "50%",
    width: "100%",
    alignItems: "center",
  },
});
