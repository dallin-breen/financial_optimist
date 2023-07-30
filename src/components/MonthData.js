import React, { useState, useEffect, useCallback } from "react";
import { Entypo } from "@expo/vector-icons";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Alert,
} from "react-native";
import AddData from "./AddData";

export default function MonthData({ month }) {
  const [refreshing, setRefreshing] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  return (
    <View style={styles.container}>
      <View>
        <Entypo
          name="add-to-list"
          size={24}
          color={"black"}
          onPress={openModal}
        />
      </View>
      <ScrollView
        style={styles.main}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.item}>
          <Text style={styles.itemDate}>Monday, January 1st, 2023</Text>
        </View>
      </ScrollView>
      <AddData visible={modalIsOpen} close={closeModal} />
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
    borderColor: "black",
    borderBottomWidth: 2,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderLeftWidth: 2,
    flexDirection: "column",
  },
  item: {
    height: 30,
    padding: 5,
    backgroundColor: "#3E859A",
    justifyContent: "center",
  },
  itemDate: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
