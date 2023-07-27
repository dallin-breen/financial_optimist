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

export default function MonthData({ month }) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.addToList}>
        <Entypo
          name="add-to-list"
          size={24}
          color={"black"}
          onPress={() => Alert.alert("Add to list")}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "70%",
    padding: 10,
    // borderBottomWidth: 2,
    // borderBottomColor: "black",
  },
  addToList: {
    width: "100%",
    // borderBottomWidth: 2,
    // borderBottomColor: "black",
  },
  main: {
    flexDirection: "column",
  },
  item: {
    alignSelf: "center",
  },
});
