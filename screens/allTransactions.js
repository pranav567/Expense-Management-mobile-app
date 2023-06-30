import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import * as SQLite from "expo-sqlite";
import BottomNavigator from "../components/bottomNavigator";
import Header from "../components/header";
import RecentTransactions from "../components/recentTransactions";
import { useEffect } from "react";
import { useState } from "react";
import app from "../firebaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getFirestore,
  doc,
  onSnapshot,
  query,
  limit,
  collection,
} from "firebase/firestore";
import TransactionModal from "../components/transactionModal";
import { useSelector, useDispatch } from "react-redux";
import { setTransactionModal } from "../store";
import { getTransactions } from "../queries";

const AllTransactions = ({ navigation }) => {
  const db = SQLite.openDatabase("ExpenseManagement.db");
  const firestore = getFirestore(app);
  const [transactions, setTransactions] = useState([]);
  const transactionModal = useSelector(
    (state) => state.transactionModal.transactionModal
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

  // useEffect(() => {
  //   async function storeData() {
  //     let uid = "";
  //     try {
  //       await new Promise((resolve, reject) => {
  //         onAuthStateChanged(auth, (user) => {
  //           if (user) {
  //             uid = user.uid;
  //             resolve();
  //           } else {
  //             navigation.navigate("Login");
  //             reject();
  //           }
  //         });
  //       });

  //       const usersCollectionRef = collection(firestore, "users");
  //       const queryDoc = query(
  //         usersCollectionRef,
  //         where("uid", "==", uid),
  //         limit(1)
  //       );

  //       const querySnapshot = await getDocs(queryDoc);

  //       if (!querySnapshot.empty) {
  //         const doc = querySnapshot.docs[0];
  //         // Handle the matching document
  //         const dataUser = doc.data();
  //         let arr = dataUser.transactions;
  //         arr.reverse();
  //         setTransactions(arr);
  //         //   setDocId(doc.id);
  //       } else {
  //         navigation.navigate("Login");
  //       }
  //     } catch (error) {
  //       navigation.navigate("Login");
  //     }
  //   }

  //   storeData();
  // }, []);

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

  useFocusEffect(
    React.useCallback(() => {
      const setData = async () => {
        let storedId = await AsyncStorage.getItem("userId");
        if (storedId !== null) {
          storedId = parseInt(storedId);

          await getTransactions(db, storedId, 1)
            .then((res) => {
              setTransactions(res.transactions);
            })
            .catch((err) => {});
        }
      };
      setData();
    }, [])
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      // bottom: 60,
    },
    transactionContainer: {
      margin: 20,
      marginTop: 80,
      marginBottom: 120,
      padding: 10,
      backgroundColor: "white",
      borderRadius: 20,
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
      width: 40,
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
      // width: "60%",
      paddingLeft: 20,
      paddingRight: 10,
    },
    content2: {
      flexDirection: "column",
      justifyContent: "center",
      // backgroundColor: "green",
      // width: "40%",
      paddingLeft: 10,
      paddingRight: 10,
    },
  });
  return (
    <>
      <View style={styles.container}>
        <Header headerTitle="All Transactions" />
        {/* <View style={styles.headerRow}></View> */}
        <View style={styles.transactionContainer}>
          <Text
            style={{
              fontSize: 22,
              color: "#393e46",
              // backgroundColor: "yellow",
              margin: 10,
            }}
          >
            Transaction History
          </Text>
          {transactions.length > 0 ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View>
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
                              fontSize: 13,
                              fontWeight: "bold",
                              color: "#393e46",
                              textTransform: "capitalize",
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
              </View>
            </ScrollView>
          ) : (
            <></>
          )}
        </View>
        <BottomNavigator buttonActive="none" />
        {transactionModal !== null ? <TransactionModal /> : <></>}
      </View>
    </>
  );
};

export default AllTransactions;
