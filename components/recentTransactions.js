import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Text, View, Image, StyleSheet, ScrollView } from "react-native";
import app from "../firebaseConfig";
import * as SQLite from "expo-sqlite";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import store, { setTransactionModal } from "../store";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getRecentTransactions } from "../queries";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RecentTransactions = (props) => {
  const db = SQLite.openDatabase("ExpenseManagement.db");
  const navigation = useNavigation();
  // console.log(props);
  const firestore = getFirestore(app);
  const [transactions, setTransactions] = useState([]);
  const dispatch = useDispatch();

  const updateTransactionModal = (obj) => {
    let newObj = {
      amount: obj.amount,
      description: obj.description,
      date: handleDate(obj.date),
      transactionType: obj.transactionType,
    };
    // console.log(newObj);
    dispatch(setTransactionModal(newObj));
  };

  useFocusEffect(
    React.useCallback(() => {
      const setData = async () => {
        let storedId = await AsyncStorage.getItem("userId");
        if (storedId !== null) {
          storedId = parseInt(storedId);

          await getRecentTransactions(db, storedId)
            .then((res) => {
              setTransactions(res.transactions);
            })
            .catch((err) => {});
        }
      };
      setData();
    }, [])
  );

  const getFormattedDate = (dateObj) => {
    const transactionDate = new Date(dateObj);
    const day = String(transactionDate.getDate()).padStart(2, "0");
    const month = String(transactionDate.getMonth() + 1).padStart(2, "0");
    const year = String(transactionDate.getFullYear());

    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
    // Get current time
    // const hours = String(transactionDate.getHours() % 12 || 12).padStart(2, "0");
    // const minutes = String(transactionDate.getMinutes()).padStart(2, "0");
    // const meridiem = transactionDate.getHours() >= 12 ? "PM" : "AM";

    // const formattedTime = `${hours}:${minutes} ${meridiem}`;
  };

  const handleDate = (dateObj) => {
    const currentDate = new Date();

    // Format the date
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = String(currentDate.getFullYear());

    const formattedDate = `${day}/${month}/${year}`;
    const transactionDate = getFormattedDate(dateObj);
    if (formattedDate == transactionDate) return "Today";
    else {
      let date1 = parseInt(day);
      let date2 = parseInt(transactionDate.slice(0, 2));
      if (date1 - date2 == 1) return "Yesterday";
      else return transactionDate;
    }
  };

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

  // console.log(getFormattedDate(transactions[0].date));

  const styles = StyleSheet.create({
    container: {
      // margin: 5,
      marginTop: 10,
      padding: 10,
      paddingLeft: 5,
      paddingRight: 5,
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
    // innerContainer: { padding: 10, paddingTop: 0, paddingLeft: 5 },
    // transaction: {
    //   flexDirection: "column",
    //   backgroundColor: "#f5f5f5",
    //   //#f5f5f5
    //   margin: 8,
    //   //   width: 220,
    //   minWidth: 180,
    //   height: 110,
    //   padding: 15,
    //   borderRadius: 15,
    //   paddingRight: 20,
    //   paddingLeft: 20,
    //   borderWidth: 1,
    //   borderColor: "#393e46",
    // },
    // radio: {
    //   width: 15,
    //   height: 15,
    //   borderRadius: 20,
    //   //   borderWidth: 1,
    //   marginTop: 5,
    // },
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={{ fontSize: 22, color: "#393e46", fontWeight: "bold" }}>
          Transaction History
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("All Transactions");
          }}
        >
          <Text style={{ marginTop: 8 }}>show all</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.transactionContainer}>
        {transactions.length > 0 ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            {transactions.map((obj, id) => (
              <View key={id}>
                <TouchableOpacity
                  onPress={() => {
                    updateTransactionModal(obj);
                  }}
                  style={styles.transaction}
                >
                  <Image
                    source={handleImagePath(obj.description)}
                    style={styles.image}
                  />
                  <View style={styles.content}>
                    <View style={styles.content1}>
                      <Text
                        style={{
                          textAlign: "left",
                          paddingTop: 5,
                          fontSize: 15,
                          fontWeight: "bold",
                          color: "#393e46",
                        }}
                      >
                        {obj.description}
                      </Text>

                      <Text
                        style={{
                          textAlign: "left",
                          marginTop: 5,
                          color: "#393e46",
                          textTransform: "capitalize",
                        }}
                      >
                        {handleDate(obj.date)}
                      </Text>
                    </View>

                    <View style={styles.content2}>
                      <Text
                        style={{
                          textAlign: "right",
                          paddingRight: 5,
                          marginTop: 5,
                          color: "#393e46",
                        }}
                      >
                        {obj.transactionType == "Received" ? (
                          <Text
                            style={{
                              fontSize: 18,
                              color: "#2dea8f",
                              fontWeight: "bold",
                            }}
                          >
                            + {obj.amount}
                          </Text>
                        ) : obj.transactionType == "Spent" ? (
                          <Text
                            style={{
                              fontSize: 18,
                              color: "#f85f73",
                              fontWeight: "bold",
                            }}
                          >
                            - {obj.amount}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              fontSize: 18,
                              color: "#51adcf",
                              fontWeight: "bold",
                            }}
                          >
                            {obj.amount}
                          </Text>
                        )}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        ) : (
          <></>
        )}
        <ScrollView showsVerticalScrollIndicator={false}></ScrollView>
      </View>
    </View>
  );
};

export default RecentTransactions;
