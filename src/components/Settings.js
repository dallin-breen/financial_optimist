import React from "react";
import { Modal, View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { Entypo } from "@expo/vector-icons";

export default function Settings({ visible, close }) {
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
          <Pressable
            onPress={() =>
              Alert.alert(
                "If you wish to delete account, contact: thefinancialoptimist@gmail.com"
              )
            }
          >
            <Text style={{ color: "#bf2419" }}>Delete Account</Text>
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
    height: "12%",
    width: "50%",
    padding: 10,
    backgroundColor: "#D9D9D9",
    flexDirection: "column",
    alignItems: "center",
  },
});
