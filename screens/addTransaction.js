import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import * as SQLite from "expo-sqlite";
import moment from "moment";
import React from "react";
import { useFocusEffect } from "@react-navigation/native";

import { Picker } from "@react-native-picker/picker";
import BottomNavigator from "../components/bottomNavigator";
import Header from "../components/header";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

import app from "../firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  limit,
  getDocs,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";

import { suggestions } from "../suggestions";
import LogoutModal from "../components/logoutModal";
import { useSelector, useDispatch } from "react-redux";
import {
  getCards,
  getSpendingDetails,
  insertIntoTransactionDetails,
  transactionLength,
  updateCardBalance,
  updateTransactionUserDetails,
} from "../queries";
//#393e46

// const expenseCategoryData = ["Travel", "Bank", "Food", "Shopping", "other"];

const AddTransaction = ({ navigation }) => {
  const db = SQLite.openDatabase("ExpenseManagement.db");
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  const [cardsList, setCardsList] = useState([]);
  const [transactionType, setTransactionType] = useState(null);
  const [unnecessary, setUnnecessary] = useState(null);
  const [recurring, setRecurring] = useState(null);
  const [amountInvolved, setAmountInvolved] = useState("");
  const [fromObj, setFromObj] = useState("-1");
  const [toObj, setToObj] = useState("-1");
  const [description, setDescription] = useState("");
  const [wordCount, setWordCount] = useState("0");
  const [transLength, setTransLength] = useState(0);
  const [userId, setUserId] = useState("");
  const [domains, setDomains] = useState([]);
  const [receive, setReceive] = useState("");
  const [spent, setSpent] = useState("");

  const logoutModal = useSelector((state) => state.logoutModal.logoutModal);

  useFocusEffect(
    React.useCallback(() => {
      const setData = async () => {
        let storedId = await AsyncStorage.getItem("userId");
        if (storedId !== null) {
          storedId = parseInt(storedId);
          setUserId(storedId);
          let tmpCards = false;
          let tmpLength = false;
          let tmpSpent = false;
          let tmpRcvd = false;

          await getCards(db, storedId)
            .then((result) => {
              setCardsList(result.cards);
              tmpCards = true;
            })
            .catch((err) => {});

          await getSpendingDetails(db, storedId)
            .then((res) => {
              if (res !== null) {
                // console.log(`hshak- ${JSON.stringify(res)}`);
                setSpent(res.expenditure);
                setReceive(res.received);
                tmpSpent = true;
                tmpRcvd = true;
              }
            })
            .catch((err) => {});

          await transactionLength(db, storedId)
            .then((res) => {
              setTransLength(res);
              tmpLength = true;
            })
            .catch((err) => {});

          if (!tmpCards || !tmpLength || !tmpRcvd || !tmpSpent) {
            Toast.show({
              type: "error",
              text1: "Database Error 0",
              position: "bottom",
              visibilityTime: 4000,
              autoHide: true,
            });
          }
        }
      };
      setData();
    }, [])
  );

  const handleAmountChange = (text) => {
    // Remove non-numeric characters
    const numericValue = text.replace(/[^0-9.]/g, "");
    setAmountInvolved(numericValue);
    let value = parseFloat(numericValue);
    suggestions.forEach((obj) => {
      if ("max" in obj) {
        if (value <= obj.max && obj.min < value) setDomains(obj.category);
      } else {
        if (value > obj.min) setDomains(obj.category);
      }
    });
  };

  const handleAddTransaction = async () => {
    let data = {};
    if (
      transactionType !== null &&
      amountInvolved !== "" &&
      parseFloat(amountInvolved) > 0 &&
      description !== "" &&
      unnecessary !== null &&
      recurring !== null &&
      fromObj !== toObj
    ) {
      data["transactionType"] = transactionType;
      const amount = parseFloat(amountInvolved);
      data["amount"] = amount;
      data["description"] = description;
      if (unnecessary === "Yes") data["unnecessary"] = true;
      else data["unnecessary"] = false;
      if (recurring === "Yes") data["recurring"] = true;
      else data["recurring"] = false;
      data["from"] = fromObj;
      data["to"] = toObj;
      const isoDateString = moment().format();
      data["date"] = isoDateString;
      data["transactionId"] = transLength + 1;

      let newSpent = spent;
      let newReceive = receive;
      let fromBalance =
        fromObj == "-1"
          ? null
          : cardsList.filter((obj) => {
              return obj.cardNum == parseInt(fromObj) && obj.userId == userId;
            })[0].balance;
      let toBalance =
        toObj == "-1" || toObj == "-2"
          ? null
          : cardsList.filter((obj) => {
              return obj.cardNum == parseInt(toObj) && obj.userId == userId;
            })[0].balance;
      if (transactionType == "Internal Transfer") {
        if (fromBalance !== null) fromBalance -= amount;
        if (toBalance !== null) toBalance += amount;
      } else if (transactionType == "Spent") {
        newSpent += amount;
        if (fromBalance !== null) fromBalance -= amount;
        if (toBalance !== null) toBalance += amount;
      } else if (transactionType == "Received") {
        newReceive += amount;
        if (fromBalance !== null) fromBalance -= amount;
        if (toBalance !== null) toBalance += amount;
      }

      data["spent"] = newSpent;
      data["receive"] = newReceive;

      data["fromBalance"] = fromBalance;
      data["toBalance"] = toBalance;

      // console.log(data);

      // add details to transactionDetails
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
        if (parseInt(fromObj) > 0) {
          await updateCardBalance(
            db,
            userId,
            parseInt(fromObj),
            data.fromBalance
          )
            .then((res) => {
              if (!res) cardsUpdated = false;
            })
            .catch((err) => {
              cardsUpdated = false;
            });
        }
        if (parseInt(toObj) > 0) {
          await updateCardBalance(db, userId, parseInt(toObj), data.toBalance)
            .then((res) => {
              if (!res) cardsUpdated = false;
            })
            .catch((err) => {
              cardsUpdated = false;
            });
        }
        if (cardsUpdated) {
          // add details to user details
          await updateTransactionUserDetails(
            db,
            data.spent,
            data.receive,
            userId
          )
            .then((res) => {
              if (res) {
                setTransactionType(null);
                setAmountInvolved("");
                setDescription("");
                setDomains([]);
                setFromObj("-1");
                setReceive("");
                setSpent("");
                setTransLength(transLength + 1);
                setToObj("-1");
                setWordCount("0");
                setUnnecessary(null);
                setRecurring(null);

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
    } else {
      // console.log(
      //   transactionType,
      //   fromObj,
      //   toObj,
      //   description,
      //   amountInvolved,
      //   unnecessary,
      //   recurring
      // );
      Toast.show({
        type: "error",
        text1: "Incomplete Form",
        text2: "Fill all required Fields",
        position: "bottom",
        visibilityTime: 4000,
        autoHide: true,
      });
    }
  };

  const handleDescription = (text) => {
    setWordCount(`${text.length}`);
    setDescription(text);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      width: 160,
      height: 160,
    },
    contentContainer: {
      flex: 1,
      justifyContent: "flex-start",
      marginTop: 90,
      marginBottom: 80,
      width: "90%",
      backgroundColor: "white",
      borderWidth: 1,
      borderColor: "#d3d6db",
      borderRadius: 15,
    },
    header: {
      alignItems: "center",
      marginTop: 10,
      marginBottom: 10,
      // backgroundColor: "#ececec",
      // borderWidth: 1,
      // borderColor: "#d3d6db",
      // borderRadius: 15,
    },
    field1: {
      flexDirection: "column",
      justifyContent: "flex-start",
      margin: 20,
    },
    radioChoice1: {
      marginTop: 15,
      flexDirection: "row",
    },

    radioButton: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: "#393e46",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 5,
    },
    radioButtonSelected: {
      borderColor: "#393e46",
    },
    radioButtonInner: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: "#393e46",
    },
    field2: {
      flexDirection: "column",
      justifyContent: "flex-start",
      margin: 20,
    },
    balanceField: {
      marginTop: 5,
      flexDirection: "row",
      borderBottomWidth: 1,
      borderColor: "#393e46",
      paddingBottom: 5,
    },
    rcvdField1: {
      flexDirection: "column",
      justifyContent: "flex-start",
      margin: 20,
    },
    rcvdPicker1: {
      backgroundColor: "#F5F5F5",
      marginTop: 10,
      color: "#393e46",
    },
    category: {
      marginTop: 15,
      flexDirection: "row",
      borderBottomWidth: 1,
      borderColor: "#393e46",
      paddingBottom: 5,
      // width: "98%",
    },
    spntField1: {},
    spntField2: {},
    spntField3: {},
    spntField4: {},
    intField1: {
      flexDirection: "column",
      justifyContent: "flex-start",
      margin: 20,
    },
    finalButtons: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      margin: 20,
    },
    describe: {
      flexDirection: "column",
      margin: 20,
      marginBottom: 5,
      justifyContent: "flex-start",
      borderBottomWidth: 1,
      borderColor: "#393e46",
      paddingBottom: 5,
    },
    describeField: {
      marginLeft: 5,
      marginTop: 5,
      // backgroundColor: "yellow",
      fontSize: 15,
      // alignContent: "flex-start",
    },
    suggestion: {
      flexDirection: "column",
      margin: 20,
      marginTop: 10,
      justifyContent: "flex-start",
    },
    domain: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "flex-start",
    },
  });
  return (
    <View style={styles.container}>
      <Header headerTitle="Add Transaction" />
      <View style={styles.contentContainer}>
        <ScrollView>
          <View style={styles.header}>
            <Text
              style={{
                fontSize: 25,
                color: "#393e46",
              }}
            >
              New Transaction
            </Text>
          </View>
          <View style={styles.field1}>
            <Text style={{ fontSize: 18, color: "#393e46" }}>
              Transaction Type <Text style={{ color: "#E49393" }}>*</Text>
            </Text>
            <View style={styles.radioChoice1}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  transactionType === "Received" && styles.radioButtonSelected,
                ]}
                onPress={() => {
                  if (transactionType === "Received") setTransactionType(null);
                  else {
                    // setTo("metro");
                    if (cardsList.length > 0) {
                      setToObj(cardsList[0].cardNum.toString());
                    } else {
                      setToObj("-2");
                    }
                    setFromObj("-1");
                    setTransactionType("Received");
                  }
                }}
              >
                {transactionType === "Received" && (
                  <View style={styles.radioButtonInner} />
                )}
              </TouchableOpacity>
              <Text style={{ marginRight: 15 }}>Received</Text>

              <TouchableOpacity
                style={[
                  styles.radioButton,
                  transactionType === "Spent" && styles.radioButtonSelected,
                ]}
                onPress={() => {
                  if (transactionType === "Spent") setTransactionType(null);
                  else {
                    setTransactionType("Spent");
                    // setFrom("metro");
                    // if (cardsList.length > 1) setTo("metro");
                    // setExpenseClassification("Travel");
                    if (cardsList.length > 0) {
                      setFromObj(cardsList[0].cardNum.toString());
                    } else {
                      setFromObj("-1");
                    }
                    setToObj("-2");
                  }
                }}
              >
                {transactionType === "Spent" && (
                  <View style={styles.radioButtonInner} />
                )}
              </TouchableOpacity>
              <Text style={{ marginRight: 15 }}>Spent</Text>

              <TouchableOpacity
                style={[
                  styles.radioButton,
                  transactionType === "Internal Transfer" &&
                    styles.radioButtonSelected,
                ]}
                onPress={() => {
                  if (transactionType === "Internal Transfer")
                    setTransactionType(null);
                  else {
                    setTransactionType("Internal Transfer");
                    // setFrom("metro");
                    // setTo("metro");
                    if (cardsList.length > 0) {
                      setFromObj(cardsList[0].cardNum.toString());
                      setToObj(cardsList[0].cardNum.toString());
                    } else {
                      setFromObj("-1");
                      setToObj("-1");
                    }
                  }
                }}
              >
                {transactionType === "Internal Transfer" && (
                  <View style={styles.radioButtonInner} />
                )}
              </TouchableOpacity>
              <Text style={{ marginRight: 15 }}>Internal Transfer</Text>
            </View>
          </View>
          <View style={styles.field2}>
            <Text style={{ fontSize: 18, color: "#393e46" }}>
              Amount Involved <Text style={{ color: "#E49393" }}>*</Text>
            </Text>
            <View style={styles.balanceField}>
              {/* <Image
                source={require("../assets/rupee-1.png")}
                style={{
                  width: 24,
                  height: 30,
                }}
              /> */}
              <TextInput
                style={{
                  marginLeft: 5,
                  fontSize: 15,
                }}
                value={amountInvolved}
                keyboardType="numeric"
                maxLength={15}
                placeholder="Enter Amount"
                onChangeText={handleAmountChange}
              />
            </View>
          </View>
          {transactionType == "Received" ? (
            <>
              <View style={styles.rcvdField1}>
                <Text style={{ fontSize: 18, color: "#393e46" }}>
                  Update Balance <Text style={{ color: "#E49393" }}>*</Text>
                </Text>
                <Picker
                  style={styles.rcvdPicker1}
                  selectedValue={toObj}
                  onValueChange={(itemValue) => {
                    setToObj(itemValue);
                  }}
                >
                  {cardsList.map((obj, id) => (
                    <Picker.Item
                      key={id}
                      label={`${obj.cardName} - Rs.${obj.balance}`}
                      value={obj.cardNum.toString()}
                    />
                  ))}
                  <Picker.Item label="cash" value={"-1"} />
                </Picker>
              </View>
            </>
          ) : transactionType == "Spent" ? (
            <>
              {/* dont include travel cards sice they are already recharged that is the amount in them is already spent */}
              <View style={styles.rcvdField1}>
                <Text style={{ fontSize: 18, color: "#393e46" }}>
                  Deduct From <Text style={{ color: "#E49393" }}>*</Text>
                </Text>
                <Picker
                  style={styles.rcvdPicker1}
                  selectedValue={fromObj}
                  onValueChange={(itemValue) => {
                    setFromObj(itemValue);
                  }}
                >
                  {cardsList.map((obj, id) => (
                    <Picker.Item
                      key={id}
                      label={`${obj.cardName} - Rs.${obj.balance}`}
                      value={obj.cardNum.toString()}
                    />
                  ))}
                  <Picker.Item label="cash" value={"-1"} />
                </Picker>
              </View>
              <View style={styles.rcvdField1}>
                <Text style={{ fontSize: 18, color: "#393e46" }}>
                  Add To{" "}
                  <Text style={{ fontSize: 13 }}>
                    (eg: recharge transactions)
                  </Text>
                </Text>
                <Picker
                  style={styles.rcvdPicker1}
                  selectedValue={toObj}
                  onValueChange={(itemValue) => {
                    setToObj(itemValue);
                  }}
                >
                  <Picker.Item label="None" value={"-2"} />
                  {cardsList
                    .filter((o) => {
                      return o.type !== "bank";
                    })
                    .map((obj, id) => (
                      <Picker.Item
                        key={id}
                        label={`${obj.cardName} - Rs.${obj.balance}`}
                        value={obj.cardNum.toString()}
                      />
                    ))}
                </Picker>
              </View>

              {/* <View style={styles.rcvdField1}>
                <Text style={{ fontSize: 18, color: "#393e46" }}>
                  Unnecessary Expenditure{" "}
                  <Text style={{ color: "#E49393" }}>*</Text>{" "}
                </Text>
                <View style={styles.radioChoice1}>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      unnecessary === "Yes" && styles.radioButtonSelected,
                    ]}
                    onPress={() => {
                      if (unnecessary === "Yes") setUnnecessary(null);
                      else setUnnecessary("Yes");
                    }}
                  >
                    {unnecessary === "Yes" && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </TouchableOpacity>
                  <Text style={{ marginRight: 15 }}>Yes</Text>

                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      unnecessary === "No" && styles.radioButtonSelected,
                    ]}
                    onPress={() => {
                      if (unnecessary === "No") setUnnecessary(null);
                      else setUnnecessary("No");
                    }}
                  >
                    {unnecessary === "No" && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </TouchableOpacity>
                  <Text style={{ marginRight: 15 }}>No</Text>
                </View>
              </View>
              <View style={styles.rcvdField1}>
                <Text style={{ fontSize: 18, color: "#393e46" }}>
                  Recurring Expenditure{" "}
                  <Text style={{ color: "#E49393" }}>*</Text>{" "}
                </Text>
                <View style={styles.radioChoice1}>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      recurring === "Yes" && styles.radioButtonSelected,
                    ]}
                    onPress={() => {
                      if (recurring === "Yes") setRecurring(null);
                      else setRecurring("Yes");
                    }}
                  >
                    {recurring === "Yes" && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </TouchableOpacity>
                  <Text style={{ marginRight: 15 }}>Yes</Text>

                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      recurring === "No" && styles.radioButtonSelected,
                    ]}
                    onPress={() => {
                      if (recurring === "No") setRecurring(null);
                      else setRecurring("No");
                    }}
                  >
                    {recurring === "No" && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </TouchableOpacity>
                  <Text style={{ marginRight: 15 }}>No</Text>
                </View>
              </View> */}
            </>
          ) : transactionType == "Internal Transfer" ? (
            <>
              <View style={styles.intField1}>
                <Text style={{ fontSize: 18, color: "#393e46" }}>
                  Deduct From <Text style={{ color: "#E49393" }}>*</Text>
                </Text>
                <Picker
                  style={styles.rcvdPicker1}
                  selectedValue={fromObj}
                  onValueChange={(itemValue) => {
                    setFromObj(itemValue);
                  }}
                >
                  {cardsList.map((obj, id) => (
                    <Picker.Item
                      key={id}
                      label={`${obj.cardName} - Rs.${obj.balance}`}
                      value={obj.cardNum.toString()}
                    />
                  ))}
                  <Picker.Item label="cash" value={"-1"} />
                </Picker>
              </View>
              <View style={styles.intField1}>
                <Text style={{ fontSize: 18, color: "#393e46" }}>
                  Add To <Text style={{ color: "#E49393" }}>*</Text>
                </Text>
                <Picker
                  style={styles.rcvdPicker1}
                  selectedValue={toObj}
                  onValueChange={(itemValue) => {
                    setToObj(itemValue);
                  }}
                >
                  {cardsList.map((obj, id) => (
                    <Picker.Item
                      key={id}
                      label={`${obj.cardName} - Rs.${obj.balance}`}
                      value={obj.cardNum.toString()}
                    />
                  ))}
                  <Picker.Item label="cash" value={"-1"} />
                </Picker>
              </View>
            </>
          ) : (
            <></>
          )}
          <View style={styles.rcvdField1}>
            <Text style={{ fontSize: 18, color: "#393e46" }}>
              Unnecessary Transaction{" "}
              <Text style={{ color: "#E49393" }}>*</Text>{" "}
            </Text>
            <View style={styles.radioChoice1}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  unnecessary === "Yes" && styles.radioButtonSelected,
                ]}
                onPress={() => {
                  if (unnecessary === "Yes") setUnnecessary(null);
                  else setUnnecessary("Yes");
                }}
              >
                {unnecessary === "Yes" && (
                  <View style={styles.radioButtonInner} />
                )}
              </TouchableOpacity>
              <Text style={{ marginRight: 15 }}>Yes</Text>

              <TouchableOpacity
                style={[
                  styles.radioButton,
                  unnecessary === "No" && styles.radioButtonSelected,
                ]}
                onPress={() => {
                  if (unnecessary === "No") setUnnecessary(null);
                  else setUnnecessary("No");
                }}
              >
                {unnecessary === "No" && (
                  <View style={styles.radioButtonInner} />
                )}
              </TouchableOpacity>
              <Text style={{ marginRight: 15 }}>No</Text>
            </View>
          </View>
          <View style={styles.rcvdField1}>
            <Text style={{ fontSize: 18, color: "#393e46" }}>
              Recurring Transaction <Text style={{ color: "#E49393" }}>*</Text>{" "}
            </Text>
            <View style={styles.radioChoice1}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  recurring === "Yes" && styles.radioButtonSelected,
                ]}
                onPress={() => {
                  if (recurring === "Yes") setRecurring(null);
                  else setRecurring("Yes");
                }}
              >
                {recurring === "Yes" && (
                  <View style={styles.radioButtonInner} />
                )}
              </TouchableOpacity>
              <Text style={{ marginRight: 15 }}>Yes</Text>

              <TouchableOpacity
                style={[
                  styles.radioButton,
                  recurring === "No" && styles.radioButtonSelected,
                ]}
                onPress={() => {
                  if (recurring === "No") setRecurring(null);
                  else setRecurring("No");
                }}
              >
                {recurring === "No" && <View style={styles.radioButtonInner} />}
              </TouchableOpacity>
              <Text style={{ marginRight: 15 }}>No</Text>
            </View>
          </View>
          <View style={styles.describe}>
            <Text style={{ fontSize: 18, color: "#393e46" }}>
              Description{" "}
              <Text style={{ fontSize: 15 }}>({wordCount}/20 letters)</Text>
              <Text style={{ color: "#E49393" }}>*</Text>
            </Text>
            <TextInput
              // style={styles.textArea}

              style={styles.describeField}
              multiline={true}
              maxLength={20}
              numberOfLines={2} // Adjust the number of lines as needed
              placeholder="Enter your text here"
              value={description}
              onChangeText={handleDescription}
            />
          </View>
          {domains.length > 0 && transactionType !== "Internal Transfer" ? (
            <View style={styles.suggestion}>
              <Text
                style={{ fontSize: 12, fontWeight: "bold", color: "#393e46" }}
              >
                Suggestions
              </Text>
              <View style={styles.domain}>
                {domains.map((obj, id) => (
                  <TouchableOpacity
                    onPress={() => {
                      setDescription(obj);
                      setWordCount(obj.length);
                    }}
                    key={id}
                    style={{
                      borderWidth: 1,
                      borderColor: "#393e46",
                      marginRight: 6,
                      marginTop: 6,
                      padding: 3,
                      borderRadius: 5,
                    }}
                  >
                    <Text style={{ fontSize: 12, color: "#393e46" }}>
                      {obj}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <></>
          )}

          <View style={styles.finalButtons}>
            <TouchableOpacity
              onPress={() => handleAddTransaction()}
              style={{
                width: "30%",
                // borderWidth: 1,
                // backgroundColor: "#96a0f5",
                // backgroundColor: "#393e46",
                borderWidth: 2,
                borderColor: "#393e46",
                borderRadius: 30,
                height: 35,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 18, color: "#393e46" }}>Add</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <BottomNavigator buttonActive="add" />
      {logoutModal ? <LogoutModal /> : <></>}
    </View>
  );
};

export default AddTransaction;
//Internal Transfer
//#6876f5
