import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";

export default function AddData({ visible, close }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("$ 0.00");

  function handleTitle(text) {
    setTitle(text);
  }

  function handleAmount(text) {
    let numericValue = text.replace(/[^0-9.,]/g, "");
    const valueWithSign = "$ " + numericValue;
    setAmount(valueWithSign);
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <Pressable onPress={close}>
            <Text>Close Modal</Text>
          </Pressable>
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
                borderRadius: 50,
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
                borderRadius: 50,
              }}
              keyboardType="numeric"
              value={amount}
              returnKeyType="done"
              onChangeText={handleAmount}
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
});
