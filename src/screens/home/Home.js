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
import { async } from "@firebase/util";

const auth = FIREBASE_AUTH;
const db = FIRESTORE_DB;

export default function Home() {
  const [currentYear, setCurrentYear] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentBudget, setCurrentBudget] = useState(null);

  useEffect(() => {
    const year = new Date().getFullYear();
    setCurrentYear(year);
    setCurrentUser(auth.currentUser.displayName);
    async function getBudget() {
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      setCurrentBudget(docSnap.data().budget);
    }
    getBudget();
  }, []);
  function handleSignout() {
    auth.signOut();
  }
  return (
    <KeyboardAvoidingView style={styles.container}>
      <View>
        <Text>{currentYear}</Text>
        <Text>{currentUser}</Text>
        <Text>{currentBudget}</Text>
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
