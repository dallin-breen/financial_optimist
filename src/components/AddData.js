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
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <Pressable onPress={close}>
            <Text>Close Modal</Text>
          </Pressable>
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
});
