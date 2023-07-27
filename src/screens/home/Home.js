import React, { useState, useEffect } from "react";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../firebase";
import { Entypo } from "@expo/vector-icons";
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
          <View>
            <Entypo
              name="menu"
              size={24}
              color={"#3E859A"}
              onPress={() => Alert.alert("Settings", "Settings were pressed!")}
            />
          </View>
          <View>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {currentUser || "Loading..."}
            </Text>
          </View>
          <View>
            <Entypo
              name="log-out"
              size={24}
              color={"#3E859A"}
              onPress={() => auth.signOut()}
            />
          </View>
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
          <View>
            <Entypo
              name="arrow-bold-left"
              size={24}
              color={"white"}
              onPress={() => setCurrentYear(currentYear - 1)}
            />
          </View>
          <Text style={{ fontSize: 30, fontWeight: "bold", color: "white" }}>
            {currentYear}
          </Text>
          <View>
            <Entypo
              name="arrow-bold-right"
              size={24}
              color={"white"}
              onPress={() => setCurrentYear(currentYear + 1)}
            />
          </View>
        </View>
        <View style={styles.monthBarContainer}>
          <ScrollView
            style={styles.monthBar}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            {months.map((month) => (
              <View
                style={[
                  styles.monthItem,
                  selectedMonth === month.name && styles.selectedMonthItem,
                ]}
                key={month.id}
              >
                <Pressable onPress={() => handleMonthSelection(month.name)}>
                  <Text
                    style={[
                      styles.monthText,
                      selectedMonth === month.name && styles.selectedMonthText,
                    ]}
                  >
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
    padding: 10,
    width: "100%",
    height: "7%",
    flexDirection: "row",
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: "black",
    justifyContent: "space-between",
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
    backgroundColor: "#3E859A",
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  monthBarContainer: {
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: "black",
  },
  monthBar: {
    flexGrow: 1,
  },
  monthItem: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  selectedMonthItem: {
    backgroundColor: "#a3a0a0",
  },
  monthText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  selectedMonthText: {
    color: "white",
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
