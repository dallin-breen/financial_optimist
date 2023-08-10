import React, { useState, useEffect, useCallback } from "react";
import { Entypo } from "@expo/vector-icons";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Switch,
  ActivityIndicator,
} from "react-native";
import DatePicker from "react-native-modern-datepicker";
import DropDownPicker from "react-native-dropdown-picker";
import { doc, addDoc, collection, Timestamp } from "firebase/firestore";
import { FIRESTORE_DB } from "../../firebase";

export default function AddData({
  userId,
  visible,
  close,
  month,
  year,
  reload,
}) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("$ 0.00");
  const [openDate, setOpenDate] = useState(false);
  const [date, setDate] = useState(null);
  const [dateMonth, setDateMonth] = useState(null);
  const [dateYear, setDateYear] = useState(null);
  const [dateTimestamp, setDateTimestamp] = useState(null);
  const [minimumDate, setMinimumDate] = useState(null);
  const [current, setCurrent] = useState(null);
  const [openType, setOpenType] = useState(false);
  const [typeValue, setTypeValue] = useState(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [loading, setLoading] = useState(false);
  const types = [
    { label: "Expense", value: "Expense" },
    { label: "Income", value: "Income" },
  ];
  const db = FIRESTORE_DB;

  useEffect(() => {
    let minimum = new Date();
    minimum.setDate(1);
    let minimumString = minimum.toLocaleDateString();
    let [minimumMonth, minimumDay, minimumYear] = minimumString.split("/");

    if (minimumMonth.length < 2) {
      minimumMonth = `0` + minimumMonth;
    }

    if (minimumDay.length < 2) {
      minimumDay = `0` + minimumDay;
    }

    if (month.length < 2) {
      month = `0` + month;
    }

    setMinimumDate(`${minimumYear}/${minimumMonth}/${minimumDay}`);
    setCurrent(`${year}/${month}/${minimumDay}`);
  }, []);

  function handleTitle(text) {
    setTitle(text);
  }

  function handleAmount(text) {
    let numericValue = text.replace(/[^0-9.,]/g, "");
    const valueWithSign = "$ " + numericValue;
    setAmount(valueWithSign);
  }

  function handleDateSelector() {
    setOpenDate(!openDate);
  }

  const handleDateChange = useCallback((selectedDate) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    let [year, month, day] = selectedDate.split("/");

    let dateObject = new Date(year, month - 1, day);

    let monthName = months[dateObject.getMonth()];

    let dayOfMonth = dateObject.getDate();

    let yearString = dateObject.getFullYear();

    let itemDate = days[new Date(year, month - 1, day).getDay()];

    let formattedDate = `${itemDate}, ${monthName} ${dayOfMonth}, ${yearString}`;

    setDate(formattedDate);
    setDateMonth(monthName);
    setDateYear(yearString);
    setDateTimestamp(new Date(year, month - 1, day));
  }, []);

  function handleSwitch() {
    setIsRecurring((previousState) => !previousState);
  }

  async function handleSubmit() {
    if (title === "") {
      Alert.alert("Error", "Please put a title");
      return;
    }

    if (amount === "$ " || amount === "$ 0.00") {
      Alert.alert("Error", "Please enter your amount");
      return;
    }

    if (!/^(\$ )?(\d{1,3}(,\d{3})*|(\d+))(\.\d{2})?$/.test(amount)) {
      Alert.alert(
        "Error",
        "Please enter your budget in the correct form (ex. $1.25 or $1,234.56)"
      );
      return;
    }

    if (!date) {
      Alert.alert("Error", "Please enter a date");
      return;
    }

    if (!typeValue) {
      Alert.alert("Error", "Please select a type");
      return;
    }

    const inputData = {
      title: title,
      amount: amount,
      date: date,
      month: dateMonth,
      year: dateYear,
      recurring: isRecurring,
      confirmed: false,
      // dateTimestamp: Timestamp.fromDate(dateTimestamp),
    };

    if (typeValue === "Income") {
      try {
        setLoading(true);
        let docRef = doc(db, "users", userId);
        let colRef = collection(docRef, "incomes");
        await addDoc(colRef, inputData);
        close();
        reload();
      } catch (error) {
        Alert.alert("Error", `${error}`);
        return;
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        let docRef = doc(db, "users", userId);
        let colRef = collection(docRef, "expenses");
        await addDoc(colRef, inputData);
        close();
        reload();
      } catch (error) {
        Alert.alert("Error", `${error}`);
        return;
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.modalContent}>
            <Entypo
              name="circle-with-cross"
              size={24}
              style={{ marginBottom: 10, marginLeft: "auto" }}
              onPress={close}
            />
            <View style={styles.inputs}>
              <Text style={{ fontSize: 17, fontWeight: "bold" }}>Title</Text>
              <TextInput
                style={{
                  height: "60%",
                  width: "100%",
                  borderWidth: 2,
                  borderColor: "#747474",
                  paddingHorizontal: 10,
                  backgroundColor: "white",
                  borderRadius: 5,
                }}
                keyboardType="default"
                value={title}
                onChangeText={handleTitle}
              />
            </View>
            <View style={styles.inputs}>
              <Text style={{ fontSize: 17, fontWeight: "bold" }}>Amount</Text>
              <TextInput
                style={{
                  height: "60%",
                  width: "100%",
                  borderWidth: 2,
                  borderColor: "#747474",
                  paddingHorizontal: 10,
                  backgroundColor: "white",
                  borderRadius: 5,
                }}
                keyboardType="numeric"
                value={amount}
                returnKeyType="done"
                onChangeText={handleAmount}
              />
            </View>
            <View style={styles.inputs}>
              <Text style={{ fontSize: 17, fontWeight: "bold" }}>Date</Text>
              <Pressable
                style={{
                  height: "60%",
                  width: "100%",
                  borderWidth: 2,
                  borderColor: "#747474",
                  paddingHorizontal: 10,
                  backgroundColor: "white",
                  borderRadius: 5,
                  justifyContent: "center",
                }}
                onPress={handleDateSelector}
              >
                <Text>{!date ? "-- Select a Date --" : date}</Text>
              </Pressable>
              <Modal animationType="fade" transparent={true} visible={openDate}>
                <View style={styles.centeredView}>
                  <View style={styles.dateSelector}>
                    <DatePicker
                      mode="calendar"
                      minimumDate={minimumDate}
                      current={current}
                      onSelectedChange={handleDateChange}
                    />
                    <Pressable onPress={handleDateSelector}>
                      <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                        Close
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>
            </View>
            <View style={styles.inputs}>
              <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                Recurring
              </Text>
              <Switch onValueChange={handleSwitch} value={isRecurring} />
            </View>
            <View style={styles.inputs}>
              <Text style={{ fontSize: 17, fontWeight: "bold" }}>Type</Text>
              <DropDownPicker
                style={{
                  height: "60%",
                  width: "100%",
                  borderWidth: 2,
                  borderColor: "#747474",
                  backgroundColor: "white",
                }}
                open={openType}
                value={typeValue}
                items={types}
                setOpen={setOpenType}
                setValue={setTypeValue}
              />
            </View>
            <View
              style={{
                position: "absolute",
                height: "10%",
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
                <Text
                  style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
                >
                  Add Item
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    height: "70%",
    width: "75%",
    padding: 10,
    backgroundColor: "#D9D9D9",
    flexDirection: "column",
    alignItems: "center",
  },
  inputs: {
    width: "75%",
    height: "10%",
    marginBottom: "5%",
    justifyContent: "space-between",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dateSelector: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "white",
  },
});
