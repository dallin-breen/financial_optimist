import React, { useState, useEffect } from "react";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../firebase";
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  KeyboardAvoidingView,
  Alert,
  ScrollView,
  // Image,
  // TextInput,
  // TouchableOpacity,
  // FlatList,
} from "react-native";
import { doc, getDoc } from "firebase/firestore";
import MonthData from "../../components/MonthData";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import DropDownPicker from "react-native-dropdown-picker";

const auth = FIREBASE_AUTH;
const db = FIRESTORE_DB;

export default function Home() {
  const [currentYear, setCurrentYear] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentBudget, setCurrentBudget] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
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

  function handleMonthSelection(month) {
    if (selectedMonth && selectedMonth === month) {
      setSelectedMonth(null);
    } else {
      setSelectedMonth(month);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.main}>
        <View style={styles.nameBar}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {currentUser || "Loading..."}
          </Text>
          <Pressable onPress={() => auth.signOut()}>
            <Text>Sign Out</Text>
          </Pressable>
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
          <Pressable onPress={() => setCurrentYear(currentYear - 1)}>
            <Text
              style={{ fontSize: 30, fontWeight: "bold", color: "#3E859A" }}
            >
              {"<"}
            </Text>
          </Pressable>
          <Text style={{ fontSize: 30, fontWeight: "bold", color: "#3E859A" }}>
            {currentYear}
          </Text>
          <Pressable onPress={() => setCurrentYear(currentYear + 1)}>
            <Text
              style={{ fontSize: 30, fontWeight: "bold", color: "#3E859A" }}
            >
              {">"}
            </Text>
          </Pressable>
        </View>
        <View style={styles.monthBarContainer}>
          <ScrollView
            style={styles.monthBar}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            {months.map((month) => (
              <View style={styles.monthItem} key={month.id}>
                <Pressable onPress={() => handleMonthSelection(month.name)}>
                  <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                    {month.name}
                  </Text>
                </Pressable>
              </View>
            ))}
          </ScrollView>
        </View>
        {selectedMonth ? (
          <MonthData month={selectedMonth} />
        ) : (
          <View style={styles.instructions}>
            <Text style={{ fontSize: 22, fontWeight: "bold", color: "black" }}>
              Select the month you want to view
            </Text>
          </View>
        )}
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
    flexDirection: "row",
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
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  monthBarContainer: {
    height: 50, // Set the desired height for the monthBar container
    borderBottomWidth: 2,
    borderBottomColor: "black",
  },
  monthBar: {
    flexGrow: 1, // Allow the ScrollView to take the full height of its container
  },
  monthItem: {
    height: "100%", // Take the full height of the monthBar container
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  instructions: {
    width: "100%",
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    height: "50%",
    width: "100%",
    alignItems: "center",
  },
});
