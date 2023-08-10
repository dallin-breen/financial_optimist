import React, { useState, useEffect, useCallback } from "react";
import { Entypo } from "@expo/vector-icons";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Alert,
  Pressable,
} from "react-native";
import AddData from "./AddData";
import {
  getDocs,
  getDoc,
  doc,
  collection,
  where,
  query,
  deleteDoc,
} from "firebase/firestore";
import { FIRESTORE_DB } from "../../firebase";

export default function MonthData({ userId, month, year }) {
  const selectedMonth = convertMonthToInt(month);
  const selectedYear = year;
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [income, setIncome] = useState({});
  const [expense, setExpense] = useState({});

  const [canAdd, setCanAdd] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const db = FIRESTORE_DB;

  useEffect(() => {
    async function getIncomeDataFirestore() {
      try {
        let q = query(
          collection(db, "users", userId, "incomes"),
          where("month", "==", month),
          where("year", "==", year)
        );
        const incomeSnapshot = await getDocs(q);

        const newIncome = {};

        incomeSnapshot.forEach((doc) => {
          const incomeData = doc.data();
          newIncome[doc.id] = incomeData;
        });
        setIncome(newIncome);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    async function getExpenseDataFirestore() {
      try {
        let q = query(
          collection(db, "users", userId, "expenses"),
          where("month", "==", month),
          where("year", "==", year)
        );
        const expenseSnapshot = await getDocs(q);

        const newExpense = {};

        expenseSnapshot.forEach((doc) => {
          const expenseData = doc.data();
          newExpense[doc.id] = expenseData;
        });
        setExpense(newExpense);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    getIncomeDataFirestore();
    getExpenseDataFirestore();

    if (selectedMonth < currentMonth && selectedYear <= currentYear) {
      setCanAdd(false);
    } else {
      setCanAdd(true);
    }
  }, [selectedMonth, currentMonth, selectedYear]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      async function getIncomeDataFirestore() {
        try {
          let q = query(
            collection(db, "users", userId, "incomes"),
            where("month", "==", month),
            where("year", "==", year)
          );
          const incomeSnapshot = await getDocs(q);

          const newIncome = {};

          incomeSnapshot.forEach((doc) => {
            const incomeData = doc.data();
            newIncome[doc.id] = incomeData;
          });
          setIncome(newIncome);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }

      async function getExpenseDataFirestore() {
        try {
          let q = query(
            collection(db, "users", userId, "expenses"),
            where("month", "==", month),
            where("year", "==", year)
          );
          const expenseSnapshot = await getDocs(q);

          const newExpense = {};

          expenseSnapshot.forEach((doc) => {
            const expenseData = doc.data();
            newExpense[doc.id] = expenseData;
          });
          setExpense(newExpense);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      getIncomeDataFirestore();
      getExpenseDataFirestore();
      setRefreshing(false);
    }, 5000);
  }, []);

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  function convertMonthToInt(month) {
    const months = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };

    let monthNumber = months[month];
    return monthNumber;
  }

  function reloadOnDataAdd() {
    async function getIncomeDataFirestore() {
      try {
        let q = query(
          collection(db, "users", userId, "incomes"),
          where("month", "==", month),
          where("year", "==", year)
        );
        const incomeSnapshot = await getDocs(q);

        const newIncome = {};

        incomeSnapshot.forEach((doc) => {
          const incomeData = doc.data();
          newIncome[doc.id] = incomeData;
        });
        setIncome(newIncome);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    async function getExpenseDataFirestore() {
      try {
        let q = query(
          collection(db, "users", userId, "expenses"),
          where("month", "==", month),
          where("year", "==", year)
        );
        const expenseSnapshot = await getDocs(q);

        const newExpense = {};

        expenseSnapshot.forEach((doc) => {
          const expenseData = doc.data();
          newExpense[doc.id] = expenseData;
        });
        setExpense(newExpense);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    getIncomeDataFirestore();
    getExpenseDataFirestore();
  }

  async function handleDelete(itemType, docId) {
    if (itemType === "incomes") {
      try {
        let docReference = doc(db, "users", userId, itemType, docId);
        const documentSnapshot = await getDoc(docReference);
        if (documentSnapshot.exists()) {
          await deleteDoc(docReference);
          setIncome((prevIncome) => {
            let newIncome = { ...prevIncome };
            delete newIncome[docId];
            return newIncome;
          });
        }
      } catch (error) {
        Alert.alert("Error", `${error}`);
        return;
      }
    }

    if (itemType === "expenses") {
      try {
        let docReference = doc(db, "users", userId, itemType, docId);
        const documentSnapshot = await getDoc(docReference);
        if (documentSnapshot.exists()) {
          await deleteDoc(docReference);
          setExpense((prevExpense) => {
            let newExpense = { ...prevExpense };
            delete newExpense[docId];
            return newExpense;
          });
        }
      } catch (error) {
        Alert.alert("Error", `${error}`);
        return;
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.addButton}>
        {canAdd ? (
          <Entypo
            name="add-to-list"
            size={24}
            color={"black"}
            onPress={openModal}
          />
        ) : (
          <Entypo
            name="add-to-list"
            size={24}
            color={"black"}
            onPress={() =>
              Alert.alert(
                "Oops!",
                "You can no longer add an item to this month, it is in the past!"
              )
            }
          />
        )}
      </View>
      <ScrollView
        style={styles.main}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {Object.keys(income).length > 0 && (
          <View style={styles.typeName}>
            <Text
              style={{
                fontSize: 22,
                color: "black",
                fontWeight: "bold",
              }}
            >
              Incomes
            </Text>
          </View>
        )}

        {Object.keys(income).map((incomeId) => {
          const incomeData = income[incomeId];
          return (
            <View key={incomeId} style={styles.item}>
              <View style={styles.itemDate}>
                <Text
                  style={{
                    fontSize: 20,
                    color: "white",
                    fontWeight: "bold",
                    alignSelf: "center",
                  }}
                >
                  {incomeData.date}
                </Text>
                <Entypo
                  name="circle-with-minus"
                  size={24}
                  color={"black"}
                  onPress={() => handleDelete("incomes", incomeId)}
                />
              </View>
              <View style={styles.itemLabels}>
                <Text style={styles.columnOne}>Title</Text>
                <Text style={styles.columnTwo}>Amount</Text>
                <Text style={styles.columnThree}>Total</Text>
              </View>
              <Pressable onPress={() => Alert.alert("Selected Info")}>
                <View style={styles.itemInfo}>
                  <Text style={styles.columnOne}>{incomeData.title}</Text>
                  <Text style={styles.columnTwo}>{incomeData.amount}</Text>
                </View>
              </Pressable>
            </View>
          );
        })}
        {Object.keys(expense).length > 0 && (
          <View style={styles.typeName}>
            <Text
              style={{
                fontSize: 22,
                color: "black",
                fontWeight: "bold",
              }}
            >
              Expenses
            </Text>
          </View>
        )}
        {Object.keys(expense).map((expenseId) => {
          const expenseData = expense[expenseId];
          return (
            <View key={expenseId} style={styles.item}>
              <View style={styles.itemDate}>
                <Text
                  style={{
                    fontSize: 20,
                    color: "white",
                    fontWeight: "bold",
                    alignSelf: "center",
                  }}
                >
                  {expenseData.date}
                </Text>
                <Entypo
                  name="circle-with-minus"
                  size={24}
                  color={"black"}
                  onPress={() => handleDelete("expenses", expenseId)}
                />
              </View>
              <View style={styles.itemLabels}>
                <Text style={styles.columnOne}>Title</Text>
                <Text style={styles.columnTwo}>Amount</Text>
                <Text style={styles.columnThree}>Total</Text>
              </View>
              <Pressable onPress={() => Alert.alert("Selected Info")}>
                <View style={styles.itemInfo}>
                  <Text style={styles.columnOne}>{expenseData.title}</Text>
                  <Text style={styles.columnTwo}>{expenseData.amount}</Text>
                </View>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
      {modalIsOpen ? (
        <AddData
          userId={userId}
          visible={modalIsOpen}
          close={closeModal}
          month={selectedMonth}
          year={selectedYear}
          reload={reloadOnDataAdd}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "70%",
    flexDirection: "column",
    padding: 10,
  },
  main: {
    width: "100%",
    height: "100%",
    flexDirection: "column",
  },
  addButton: {
    marginBottom: 10,
  },
  typeName: {
    alignSelf: "center",
    marginBottom: 10,
  },
  item: {
    height: 90,
    justifyContent: "space-between",
    marginBottom: 5,
    // borderColor: "black",
    // borderBottomWidth: 2,
    // borderTopWidth: 2,
    // borderRightWidth: 2,
    // borderLeftWidth: 2,
  },
  itemDate: {
    padding: 5,
    backgroundColor: "#3E859A",
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: "black",
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderLeftWidth: 2,
  },
  itemLabels: {
    padding: 5,
    flexDirection: "row",
    borderColor: "black",
    borderBottomWidth: 2,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderLeftWidth: 2,
  },
  itemInfo: {
    padding: 5,
    flexDirection: "row",
    borderColor: "black",
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderLeftWidth: 2,
  },
  columnOne: {
    width: "60%",
  },
  columnTwo: {
    width: "20%",
  },
  columnThree: {
    width: "20%",
  },
});
