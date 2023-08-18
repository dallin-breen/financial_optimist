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
} from "react-native";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import MonthData from "../../components/MonthData";
// import { useNavigation, useRoute } from "@react-navigation/native";

const auth = FIREBASE_AUTH;
const db = FIRESTORE_DB;

export default function Home() {
  const [hasCurrentYear, setHasCurrentYear] = useState(null);
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
    const month = new Date().getMonth();

    async function getUserInfo() {
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      setCurrentUser(docSnap.data().name);

      const colSnap = await getDocs(
        collection(db, "users", auth.currentUser.uid, `${year}`)
      );

      if (colSnap.size > 0) {
        setHasCurrentYear(true);
        let q = query(
          collection(db, "users", auth.currentUser.uid, `${year}`),
          where("month", "==", months[month].name)
        );

        let querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          let monthData = { id: doc.id, data: doc.data() };
          setSelectedMonth(monthData);
          setCurrentBudget(monthData.data.budget);
        });
      } else {
        setHasCurrentYear(false);
      }
    }

    getUserInfo();
  }, []);

  async function handleMonthSelection(month) {
    if (selectedMonth.data.month === month) {
      return;
    } else {
      let q = query(
        collection(db, "users", auth.currentUser.uid, `${currentYear}`),
        where("month", "==", month)
      );

      let querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        let monthData = { id: doc.id, data: doc.data() };
        setSelectedMonth(monthData);
        setCurrentBudget(monthData.data.budget);
      });
    }
  }

  function handlePrevYear() {
    Alert.alert("Selected Previous Year");
    return;
  }

  function handleNextYear() {
    Alert.alert("Selected Next Year");
    return;
  }

  function showBudgetChange(budget) {
    setCurrentBudget(budget);
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      {!hasCurrentYear ? null : !selectedMonth ? null : (
        <View style={styles.main}>
          <View style={styles.nameBar}>
            <View>
              <Entypo
                name="cog"
                size={24}
                color={"#3E859A"}
                onPress={() =>
                  Alert.alert("Settings", "Settings were pressed!")
                }
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
              {`${selectedMonth.data.month} Total`}
            </Text>
            <Text style={{ fontSize: 30, fontWeight: "bold" }}>
              {`$ ${parseFloat(currentBudget).toFixed(2)}`}
            </Text>
          </View>
          <View style={styles.yearBar}>
            <View>
              <Entypo
                name="arrow-bold-left"
                size={24}
                color={"white"}
                onPress={handlePrevYear}
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
                onPress={handleNextYear}
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
                    selectedMonth.data.month === month.name &&
                      styles.selectedMonthItem,
                  ]}
                  key={month.id}
                >
                  <Pressable onPress={() => handleMonthSelection(month.name)}>
                    <Text
                      style={[
                        styles.monthText,
                        selectedMonth.data.month === month.name &&
                          styles.selectedMonthText,
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
            <MonthData
              currentBudget={currentBudget}
              showBudgetChange={showBudgetChange}
              userId={auth.currentUser.uid}
              monthId={selectedMonth.id}
              month={selectedMonth.data.month}
              year={currentYear}
            />
          ) : (
            <View style={styles.instructions}>
              <Text
                style={{ fontSize: 22, fontWeight: "bold", color: "black" }}
              >
                Select the month you want to view
              </Text>
            </View>
          )}
        </View>
      )}
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
