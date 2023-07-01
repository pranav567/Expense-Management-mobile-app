import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import * as SQLite from "expo-sqlite";
import moment from "moment";
import BottomNavigator from "../components/bottomNavigator";
import Header from "../components/header";
import RecentTransactions from "../components/recentTransactions";
import { useEffect } from "react";
import { useState } from "react";
import app from "../firebaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Toast from "react-native-toast-message";
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
import store, { setTransactionModal } from "../store";
import LogoutModal from "../components/logoutModal";
import {
  getCards,
  getRecurringTransactions,
  getSpendingDetails,
  getTransactions,
  insertIntoTransactionDetails,
  transactionLength,
  updateCardBalance,
  updateTransactionUserDetails,
} from "../queries";
import { Ionicons } from "@expo/vector-icons";

const RecurringTransactions = ({ navigation }) => {
  const db = SQLite.openDatabase("ExpenseManagement.db");
  const firestore = getFirestore(app);
  const [transactions, setTransactions] = useState([]);
  const [transLength, setTransLength] = useState(0);
  const [allTransLength, setAllTransLength] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const [userId, setUserId] = useState(0);
  const [receive, setReceive] = useState("");
  const [spent, setSpent] = useState("");
  const [cardsList, setCardsList] = useState([]);
  const transactionModal = useSelector(
    (state) => state.transactionModal.transactionModal
  );

  const logoutModal = useSelector((state) => state.logoutModal.logoutModal);

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
    const formattedDate = moment().format("DD/MM/YYYY");
    const transactionDate = getFormattedDate(dateObj);
    if (formattedDate == transactionDate) return "Today";
    else {
      let date1 = parseInt(moment().format("DD"));
      let date2 = parseInt(transactionDate.slice(0, 2));
      if (date1 - date2 == 1) return "Yesterday";
      else return transactionDate;
    }
  };

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
          setUserId(storedId);

          await getCards(db, storedId)
            .then((result) => {
              setCardsList(result.cards);
            })
            .catch((err) => {});

          await getSpendingDetails(db, storedId)
            .then((res) => {
              if (res !== null) {
                setSpent(res.expenditure);
                setReceive(res.received);
              }
            })
            .catch((err) => {});

          await getRecurringTransactions(db, storedId, 1)
            .then((res) => {
              setTransactions(res.transactions);
              let count = res.count;
              count =
                count % 8 == 0 ? Math.floor(count / 8) : Math.ceil(count / 8);
              setMaxPages(count);
              setTransLength(res.count);
            })
            .catch((err) => {});

          await transactionLength(db, storedId)
            .then((res) => {
              setAllTransLength(res);
              tmpLength = true;
            })
            .catch((err) => {});
        }
      };
      setData();
    }, [])
  );

  const paginate = async (direction) => {
    // direction +1 right -1 left
    setPageNumber(pageNumber + direction);
    await getRecurringTransactions(db, userId, pageNumber)
      .then((res) => {
        setTransactions(res.transactions);
      })
      .catch((err) => {});
  };

  const handleAddingRecurringTransaction = async (obj) => {
    let data = {};
    data["transactionType"] = obj.transactionType;
    data["amount"] = obj.amount;
    data["description"] = obj.description;
    data["unnecessary"] = obj.unnecessary;
    data["recurring"] = obj.recurring;
    data["from"] = obj.from;
    data["to"] = obj.to;
    const isoDateString = moment().format();
    data["date"] = isoDateString;
    data["transactionId"] = allTransLength + 1;

    let newSpent = spent;
    let newReceive = receive;
    let fromBalance =
      obj.from == "-1" || obj.from == "-2"
        ? null
        : cardsList.filter((obj1) => {
            return obj1.cardNum == parseInt(obj.from) && obj1.userId == userId;
          })[0].balance;
    let toBalance =
      obj.to == "-1" || obj.to == "-2"
        ? null
        : cardsList.filter((obj1) => {
            return obj1.cardNum == parseInt(obj.to) && obj1.userId == userId;
          })[0].balance;
    if (obj.transactionType == "Internal Transfer") {
      if (fromBalance !== null) fromBalance -= obj.amount;
      if (toBalance !== null) toBalance += obj.amount;
    } else if (obj.transactionType == "Spent") {
      newSpent += obj.amount;
      if (fromBalance !== null) fromBalance -= obj.amount;
      if (toBalance !== null) toBalance += obj.amount;
    } else if (obj.transactionType == "Received") {
      newReceive += obj.amount;
      if (fromBalance !== null) fromBalance -= obj.amount;
      if (toBalance !== null) toBalance += obj.amount;
    }

    data["spent"] = newSpent;
    data["receive"] = newReceive;

    data["fromBalance"] = fromBalance;
    data["toBalance"] = toBalance;

    // console.log(data);

    let transactionAdded = false;
    await insertIntoTransactionDetails(
      db,
      userId,
      data.transactionId,
      data.amount,
      data.date,
      data.description,
      data.from,
      data.to,
      data.unnecessary,
      data.recurring,
      data.transactionType
    )
      .then((res) => {
        if (res == true) transactionAdded = true;
      })
      .catch((err) => {});
    // add details to cards
    if (transactionAdded) {
      let cardsUpdated = true;
      if (parseInt(obj.from) > 0) {
        await updateCardBalance(
          db,
          userId,
          parseInt(obj.from),
          data.fromBalance
        )
          .then((res) => {
            if (!res) cardsUpdated = false;
          })
          .catch((err) => {
            cardsUpdated = false;
          });
      }
      if (parseInt(obj.to) > 0) {
        await updateCardBalance(db, userId, parseInt(obj.to), data.toBalance)
          .then((res) => {
            if (!res) cardsUpdated = false;
          })
          .catch((err) => {
            cardsUpdated = false;
          });
      }
      if (cardsUpdated) {
        // add details to user details
        await updateTransactionUserDetails(db, data.spent, data.receive, userId)
          .then((res) => {
            if (res) {
              setReceive("");
              setSpent("");

              Toast.show({
                type: "success",
                text1: "Transaction added",
                position: "bottom",
                visibilityTime: 4000,
                autoHide: true,
              });
              navigation.navigate("Home");
            } else {
              Toast.show({
                type: "error",
                text1: "Database Error 5",
                position: "bottom",
                visibilityTime: 4000,
                autoHide: true,
              });
            }
          })
          .catch((err) => {
            Toast.show({
              type: "error",
              text1: "Database Error 4",
              position: "bottom",
              visibilityTime: 4000,
              autoHide: true,
            });
          });
      } else {
        Toast.show({
          type: "error",
          text1: "Database Error 3",
          position: "bottom",
          visibilityTime: 4000,
          autoHide: true,
        });
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Database Error 2",
        position: "bottom",
        visibilityTime: 4000,
        autoHide: true,
      });
    }
  };

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
      borderColor: "#d3d6db",
      borderWidth: 1,
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
      width: "70%",
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
        <Header headerTitle="Recurring Transactions" />
        {/* <View style={styles.headerRow}></View> */}
        <View style={styles.transactionContainer}>
          <Text
            style={{
              fontSize: 22,
              color: "#393e46",
              // backgroundColor: "yellow",
              margin: 10,
              fontWeight: "bold",
            }}
          >
            Recurring Transactions
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
                      <View
                        style={{
                          width: "12%",
                          flexDirection: "row",
                          //   backgroundColor: "red",
                          justifyContent: "flex-end",
                          alignItems: "center",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            handleAddingRecurringTransaction(obj);
                          }}
                        >
                          <Ionicons
                            name="add-circle-outline"
                            size={35}
                            color="#393e46"
                          />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}

                {transLength > 8 && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <TouchableOpacity
                      disabled={pageNumber == 1}
                      onPress={() => {
                        //paginate function
                        paginate(-1);
                      }}
                    >
                      <Ionicons
                        name="chevron-back-outline"
                        size={24}
                        color={pageNumber == 1 ? "white" : "#393e46"}
                      />
                    </TouchableOpacity>

                    <Text
                      style={{ fontSize: 20, marginLeft: 20, marginRight: 20 }}
                    >
                      {pageNumber}
                    </Text>
                    <TouchableOpacity
                      disabled={pageNumber == maxPages}
                      onPress={() => {
                        //paginate function
                        paginate(1);
                      }}
                    >
                      <Ionicons
                        name="chevron-forward-outline"
                        size={24}
                        color={pageNumber == maxPages ? "white" : "#393e46"}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </ScrollView>
          ) : (
            <></>
          )}
        </View>
        <BottomNavigator buttonActive="none" />
        {transactionModal !== null ? <TransactionModal /> : <></>}
        {logoutModal ? <LogoutModal /> : <></>}
      </View>
    </>
  );
};

export default RecurringTransactions;
