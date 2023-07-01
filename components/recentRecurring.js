import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Text, View, Image, StyleSheet, ScrollView } from "react-native";
import * as SQLite from "expo-sqlite";
import { useSelector, useDispatch } from "react-redux";
import store, { setTransactionModal } from "../store";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getRecentRecurring, getRecentTransactions } from "../queries";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

const RecentRecurring = () => {
  const db = SQLite.openDatabase("ExpenseManagement.db");
  const navigation = useNavigation();

  const [transactions, setTransactions] = useState([]);
  useFocusEffect(
    React.useCallback(() => {
      const setData = async () => {
        let storedId = await AsyncStorage.getItem("userId");
        if (storedId !== null) {
          storedId = parseInt(storedId);

          await getRecentRecurring(db, storedId)
            .then((res) => {
              setTransactions(res.transactions);
            })
            .catch((err) => {});
        }
      };
      setData();
    }, [])
  );

  const handleImagePath = (type) => {
    let imagePath = "";
    if (type == "Bank") imagePath = require("../assets/bank.png");
    else if (type == "Transportation") {
      let imgObj = {
        1: require("../assets/metro.png"),
        2: require("../assets/bus.png"),
        3: require("../assets/train.png"),
      };
      imagePath = imgObj[Math.floor(Math.random() * 3) + 1];
    } else imagePath = require("../assets/randomCard.png");

    return imagePath;
  };

  const styles = StyleSheet.create({
    container: {
      // margin: 5,
      marginTop: 10,
      padding: 10,
      paddingLeft: 5,
      paddingRight: 5,
      marginBottom: 20,
    },
    headerRow: {
      padding: 5,
      paddingLeft: 10,
      paddingRight: 10,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    transactionContainer: {
      padding: 10,
      paddingBottom: 0,
      flexDirection: "row",
      justifyContent: "flex-start",
      marginTop: 10,
      // width: "100%",
    },
    transaction: {
      flexDirection: "row",
      justifyContent: "flex-start",
      margin: 5,
      // backgroundColor: "#f5f5f5",
      padding: 5,
      borderRadius: 15,
    },
    image: {
      width: 50,
      height: 60,
      // paddingRight: 5,
      width: "18%",
      borderRadius: 20,
    },
    content: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "82%",
    },
    content1: {
      flexDirection: "column",
      justifyContent: "flex-start",
      // backgroundColor: "yellow",
      // width: "65%",
      paddingLeft: 20,
      paddingRight: 10,
    },
    content2: {
      flexDirection: "column",
      justifyContent: "center",
      // backgroundColor: "green",
      // width: "35%",
      paddingLeft: 10,
      paddingRight: 10,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={{ fontSize: 22, color: "#393e46", fontWeight: "bold" }}>
          Recurring Transactions
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("RecurringTransactions");
          }}
        >
          <Text style={{ marginTop: 8 }}>show all</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.transactionContainer}>
        {transactions.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {transactions.map((obj, id) => (
              <View
                key={id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  borderWidth: 1,
                  padding: 10,
                  marginLeft: 15,
                  borderRadius: 10,
                  borderColor: "#393e46",
                }}
              >
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "bold",
                      color: "#393e46",
                    }}
                  >
                    {obj.description}
                  </Text>
                  <Text
                    style={{
                      marginTop: 5,
                      fontSize: 15,
                      color:
                        obj.transactionType == "Spent"
                          ? "#f85f73"
                          : obj.transactionType == "Received"
                          ? "#2dea8f"
                          : "#51adcf",
                    }}
                  >
                    {obj.transactionType == "Spent"
                      ? "- "
                      : obj.transactionType == "Received"
                      ? "+ "
                      : ""}
                    Rs. {obj.amount}
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: 20,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("RecurringTransactions");
                    }}
                  >
                    <Ionicons
                      name="add-circle-outline"
                      size={28}
                      color={
                        obj.transactionType == "Spent"
                          ? "#f85f73"
                          : obj.transactionType == "Received"
                          ? "#2dea8f"
                          : "#51adcf"
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
};

export default RecentRecurring;
