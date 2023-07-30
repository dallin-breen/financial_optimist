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
      <View style={styles.addToList}>
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
        <Text style={styles.item}>{month}</Text>
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
  addToList: {
    width: "100%",
  },
  main: {
    flexDirection: "column",
  },
  item: {
    alignSelf: "center",
  },
});
