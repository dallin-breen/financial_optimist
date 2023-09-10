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
  addDoc,
} from "firebase/firestore";
import MonthData from "../../components/MonthData";
import CreateYear from "../../components/CreateYear";
import Settings from "../../components/Settings";

const auth = FIREBASE_AUTH;
const db = FIRESTORE_DB;

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCurrentYear, setHasCurrentYear] = useState(null);
  const [currentYear, setCurrentYear] = useState({
    year: new Date().getFullYear(),
    direction: "current",
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [currentBudget, setCurrentBudget] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState({
    data: {
      budget: 0,
      month: new Date().getMonth(),
    },
    id: "0",
  });
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
    if (currentUser === null) {
      async function getCurrentUser() {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        setCurrentUser(docSnap.data().name);
      }
      getCurrentUser();
    }

    async function getYearData() {
      const colSnap = await getDocs(
        collection(db, "users", auth.currentUser.uid, `${currentYear.year}`)
      );

      if (colSnap.size > 0) {
        setHasCurrentYear(true);
        if (typeof selectedMonth.data.month === "number") {
          let q = query(
            collection(
              db,
              "users",
              auth.currentUser.uid,
              `${currentYear.year}`
            ),
            where("month", "==", months[selectedMonth.data.month].name)
          );
          let querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            let monthData = { id: doc.id, data: doc.data() };
            setSelectedMonth(monthData);
            setCurrentBudget(monthData.data.budget);
          });
        } else {
          let q = query(
            collection(
              db,
              "users",
              auth.currentUser.uid,
              `${currentYear.year}`
            ),
            where("month", "==", selectedMonth.data.month)
          );
          let querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            let monthData = { id: doc.id, data: doc.data() };
            setSelectedMonth(monthData);
            setCurrentBudget(monthData.data.budget);
          });
        }
        setIsLoading(false);
      } else {
        setHasCurrentYear(false);
      }
    }

    getYearData();

    async function loadNextYearsData() {
      if (months[new Date().getMonth()].name === "October") {
        let colSnap = await getDocs(
          collection(
            db,
            "users",
            auth.currentUser.uid,
            `${currentYear.year + 1}`
          )
        );

        if (colSnap.size > 0) {
          return;
        } else {
          let currentDaysYear = new Date().getFullYear();
          if (currentYear.year + 1 - currentDaysYear === 1) {
            let lastMonthData = {};
            let q = query(
              collection(
                db,
                "users",
                auth.currentUser.uid,
                `${currentYear.year}`
              ),
              where("month", "==", "December")
            );
            let querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              lastMonthData = { id: doc.id, data: doc.data() };
            });
            let docSnap = doc(db, "users", auth.currentUser.uid);
            let colRef = collection(docSnap, `${currentYear.year + 1}`);

            for (let i = 0; i < months.length; i++) {
              await addDoc(colRef, {
                number: i + 1,
                month: months[i].name,
                budget: parseFloat(lastMonthData.data.budget),
              });
            }
          }
        }
      }
    }

    loadNextYearsData();
  }, [hasCurrentYear, currentYear]);

  async function handleMonthSelection(month) {
    if (selectedMonth.data.month === month) {
      return;
    } else {
      let q = query(
        collection(db, "users", auth.currentUser.uid, `${currentYear.year}`),
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

  async function handlePrevYear() {
    const columnSnap = await getDocs(
      collection(db, "users", auth.currentUser.uid, `${currentYear.year - 1}`)
    );
    if (columnSnap.size > 0) {
      setCurrentYear((prevYear) => ({
        year: prevYear.year - 1,
        direction: "previous",
      }));
    } else {
      Alert.alert("You have no data for the previous year");
      return;
    }
  }

  async function handleNextYear() {
    const columnSnap = await getDocs(
      collection(db, "users", auth.currentUser.uid, `${currentYear.year + 1}`)
    );
    if (columnSnap.size > 0) {
      setCurrentYear((prevYear) => ({
        year: prevYear.year + 1,
        direction: "next",
      }));
    } else {
      Alert.alert(
        "You have no data for the next year",
        "The next years calendar will be generated in October"
      );
      return;
    }
  }

  function reloadCurrentYear(yearWasCreated) {
    setHasCurrentYear(yearWasCreated);
  }

  function showBudgetChange(budget) {
    setCurrentBudget(budget);
  }

  function openModal() {
    setSettingsOpen(true);
  }

  function closeModal() {
    setSettingsOpen(false);
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      {isLoading ? null : !hasCurrentYear ? (
        <CreateYear reloadCurrentYear={reloadCurrentYear} />
      ) : (
        <View style={styles.main}>
          <View style={styles.nameBar}>
            <View>
              <Entypo
                name="cog"
                size={24}
                color={"#3E859A"}
                onPress={openModal}
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
              {currentYear.year}
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
          <MonthData
            currentBudget={currentBudget}
            showBudgetChange={showBudgetChange}
            userId={auth.currentUser.uid}
            monthId={selectedMonth.id}
            month={selectedMonth.data.month}
            year={currentYear.year}
          />
          {settingsOpen ? (
            <Settings visible={settingsOpen} close={closeModal} />
          ) : null}
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
