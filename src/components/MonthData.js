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
  updateDoc,
  orderBy,
} from "firebase/firestore";
import { FIRESTORE_DB } from "../../firebase";

export default function MonthData({
  currentBudget,
  showBudgetChange,
  userId,
  monthId,
  month,
  year,
}) {
  const selectedMonth = convertMonthToInt(month);
  const selectedYear = year;
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [items, setItems] = useState({});

  const [canAdd, setCanAdd] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const db = FIRESTORE_DB;

  useEffect(() => {
    async function getIncomeExpenseDataFirestore() {
      try {
        let q = query(
          collection(db, "users", userId, `${selectedYear}`, monthId, "items"),
          orderBy("dateTimestamp")
        );
        const itemSnapshot = await getDocs(q);

        const newItems = {};

        itemSnapshot.forEach((doc) => {
          const itemData = doc.data();
          newItems[doc.id] = itemData;
        });
        setItems(newItems);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    getIncomeExpenseDataFirestore();

    if (selectedMonth < currentMonth && selectedYear <= currentYear) {
      setCanAdd(false);
    } else {
      setCanAdd(true);
    }
  }, [selectedMonth, currentMonth, selectedYear]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      async function getIncomeExpenseDataFirestore() {
        try {
          let q = query(
            collection(
              db,
              "users",
              userId,
              `${selectedYear}`,
              monthId,
              "items"
            ),
            orderBy("dateTimestamp")
          );
          const itemSnapshot = await getDocs(q);

          const newItems = {};

          itemSnapshot.forEach((doc) => {
            const itemData = doc.data();
            newItems[doc.id] = itemData;
          });
          setItems(newItems);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      getIncomeExpenseDataFirestore();
      setRefreshing(false);
    }, 5000);
  }, [month, year]);

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
    async function getIncomeExpenseDataFirestore() {
      try {
        let q = query(
          collection(db, "users", userId, `${selectedYear}`, monthId, "items"),
          orderBy("dateTimestamp")
        );
        const itemSnapshot = await getDocs(q);

        const newItems = {};

        itemSnapshot.forEach((doc) => {
          const itemData = doc.data();
          newItems[doc.id] = itemData;
        });
        setItems(newItems);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    getIncomeExpenseDataFirestore();
  }

  async function handleDelete(docId, type, amount) {
    if (type === "income") {
      try {
        let docReference = doc(db, "users", userId, `${year}`, monthId);
        let newBudget = currentBudget - parseFloat(amount);
        await updateDoc(docReference, {
          budget: newBudget,
        });
        setBudgetChange(newBudget);
      } catch (error) {
        console.error("Error updating doc:", error);
      }
    } else {
      try {
        let docReference = doc(db, "users", userId, `${year}`, monthId);
        let newBudget = currentBudget + parseFloat(amount);
        await updateDoc(docReference, {
          budget: newBudget,
        });
        setBudgetChange(newBudget);
      } catch (error) {
        console.error("Error updating doc:", error);
      }
    }
    try {
      let docReference = doc(
        db,
        "users",
        userId,
        `${selectedYear}`,
        monthId,
        "items",
        docId
      );
      const documentSnapshot = await getDoc(docReference);
      if (documentSnapshot.exists()) {
        await deleteDoc(docReference);
        setItems((prevItem) => {
          let newItems = { ...prevItem };
          delete newItems[docId];
          return newItems;
        });
      }
    } catch (error) {
      Alert.alert("Error", `${error}`);
      return;
    }
  }

  async function handleConfirmation(docId) {
    try {
      let docReference = doc(
        db,
        "users",
        userId,
        `${selectedYear}`,
        monthId,
        "items",
        docId
      );
      await updateDoc(docReference, {
        confirmed: true,
      });
      setItems((prevItem) => {
        let newItems = { ...prevItem };
        newItems[docId]["confirmed"] = true;
        return newItems;
      });
    } catch (error) {
      Alert.alert("Error", `${error}`);
      return;
    }
  }

  function setBudgetChange(budget) {
    showBudgetChange(budget);
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
        {Object.keys(items).length > 0 && (
          <View style={styles.typeName}>
            <Text
              style={{
                fontSize: 22,
                color: "black",
                fontWeight: "bold",
              }}
            >
              Incomes and Expenses
            </Text>
          </View>
        )}

        {Object.keys(items).map((itemId) => {
          const itemData = items[itemId];
          if (itemData.type === "expense") {
            if (!itemData.recurring) {
              return (
                <View key={itemId} style={styles.item}>
                  <View style={styles.itemDate}>
                    <Text
                      style={{
                        fontSize: 20,
                        color: "white",
                        fontWeight: "bold",
                        alignSelf: "center",
                      }}
                    >
                      {itemData.date}
                    </Text>
                    <Entypo
                      name="circle-with-minus"
                      size={24}
                      color={"black"}
                      onPress={() =>
                        handleDelete(itemId, itemData.type, itemData.amount)
                      }
                    />
                  </View>
                  <View style={styles.itemLabels}>
                    <Text style={styles.columnOne}>Title</Text>
                    <Text style={styles.columnTwo}>Amount</Text>
                    {/* <Text style={styles.columnThree}>Total</Text> */}
                  </View>
                  <Pressable onPress={() => handleConfirmation(itemId)}>
                    <View
                      style={[
                        styles.itemInfo,
                        itemData.confirmed && styles.confirmedItem,
                      ]}
                    >
                      <Text style={styles.columnOne}>{itemData.title}</Text>
                      <Text style={styles.columnTwo}>
                        {`$ ${parseFloat(itemData.amount).toFixed(2)}`}
                      </Text>
                    </View>
                  </Pressable>
                </View>
              );
            } else {
              return (
                <View key={itemId} style={styles.item}>
                  <View style={styles.itemDate}>
                    <Text
                      style={{
                        fontSize: 20,
                        color: "white",
                        fontWeight: "bold",
                        alignSelf: "center",
                      }}
                    >
                      {itemData.date}
                    </Text>
                    <Entypo
                      name="circle-with-minus"
                      size={24}
                      color={"black"}
                      onPress={() =>
                        handleDelete(itemId, itemData.type, itemData.amount)
                      }
                    />
                  </View>
                  <View style={styles.itemLabels}>
                    <Text style={styles.columnOne}>Title</Text>
                    <Text style={styles.columnTwo}>Amount</Text>
                    {/* <Text style={styles.columnThree}>Total</Text> */}
                  </View>
                  <Pressable onPress={() => handleConfirmation(itemId)}>
                    <View
                      style={[
                        styles.itemInfo,
                        itemData.confirmed && styles.confirmedExpense,
                      ]}
                    >
                      <Text style={styles.columnOne}>{itemData.title}</Text>
                      <Text style={styles.columnTwo}>
                        {`$ ${parseFloat(itemData.amount).toFixed(2)}`}
                      </Text>
                    </View>
                  </Pressable>
                </View>
              );
            }
          } else {
            return (
              <View key={itemId} style={styles.item}>
                <View style={styles.itemDate}>
                  <Text
                    style={{
                      fontSize: 20,
                      color: "white",
                      fontWeight: "bold",
                      alignSelf: "center",
                    }}
                  >
                    {itemData.date}
                  </Text>
                  <Entypo
                    name="circle-with-minus"
                    size={24}
                    color={"black"}
                    onPress={() =>
                      handleDelete(itemId, itemData.type, itemData.amount)
                    }
                  />
                </View>
                <View style={styles.itemLabels}>
                  <Text style={styles.columnOne}>Title</Text>
                  <Text style={styles.columnTwo}>Amount</Text>
                  {/* <Text style={styles.columnThree}>Total</Text> */}
                </View>
                <Pressable onPress={() => handleConfirmation(itemId)}>
                  <View
                    style={[
                      styles.itemInfo,
                      itemData.confirmed && styles.confirmedIncome,
                    ]}
                  >
                    <Text style={styles.columnOne}>{itemData.title}</Text>
                    <Text style={styles.columnTwo}>
                      {`$ ${parseFloat(itemData.amount).toFixed(2)}`}
                    </Text>
                  </View>
                </Pressable>
              </View>
            );
          }
        })}
      </ScrollView>
      {modalIsOpen ? (
        <AddData
          currentBudget={currentBudget}
          setBudgetChange={setBudgetChange}
          userId={userId}
          monthId={monthId}
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
    width: "80%",
  },
  columnTwo: {
    width: "20%",
  },
  // columnThree: {
  //   width: "20%",
  // },
  confirmedItem: {
    backgroundColor: "#bebf63",
  },
  confirmedExpense: {
    backgroundColor: "#bf6363",
  },
  confirmedIncome: {
    backgroundColor: "#71bf63",
  },
});
