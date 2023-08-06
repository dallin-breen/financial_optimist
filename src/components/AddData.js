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
} from "react-native";
import DatePicker from "react-native-modern-datepicker";
import DropDownPicker from "react-native-dropdown-picker";

export default function AddData({ visible, close, month }) {
  // console.log(month);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("$ 0.00");
  const [openDate, setOpenDate] = useState(false);
  const [dateValue, setDateValue] = useState(null);
  const [openType, setOpenType] = useState(false);
  const [typeValue, setTypeValue] = useState(null);
  const types = [
    { label: "Expense", value: "Expense" },
    { label: "Income", value: "Income" },
  ];

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

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
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
              <Text>{!dateValue ? "-- Select a Date --" : dateValue}</Text>
            </Pressable>
            <Modal animationType="fade" transparent={true} visible={openDate}>
              <View style={styles.centeredView}>
                <View style={styles.dateSelector}>
                  <DatePicker
                    mode="calendar"
                    // onSelectedChange={handleDateSelector}
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
        </View>
      </View>
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
    width: "70%",
    height: "35%",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
