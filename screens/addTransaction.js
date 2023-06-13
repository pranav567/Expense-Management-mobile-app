import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";

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

//#393e46

const expenseCategoryData = ["Travel", "Bank", "Food", "Shopping", "other"];

const AddTransaction = ({ navigation }) => {
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  const [cardsList, setCardsList] = useState([]);
  const [transactionType, setTransactionType] = useState(null);
  const [unnecessary, setUnnecessary] = useState(null);
  const [recurring, setRecurring] = useState(null);
  const [amountInvolved, setAmountInvolved] = useState("");
  const [expenseClassification, setExpenseClassification] = useState("");
  const [from, setFrom] = useState("");
  const [fromObj, setFromObj] = useState(null);
  const [toObj, setToObj] = useState(null);
  const [to, setTo] = useState("");
  const [expensePicker, setExpensePicker] = useState(expenseCategoryData);
  const [otherCategory, setOtherCategory] = useState("");
  const [description, setDescription] = useState("");
  const [wordCount, setWordCount] = useState("0");
  const [transactions, setTransactions] = useState([]);
  const [docId, setDocId] = useState("");

  const handleFromChange = (itemValue, itemIndex) => {
    setFromObj(JSON.parse(itemValue));
  };

  const stringifyFrom = () => {
    return JSON.stringify(fromObj);
  };

  const handleToChange = (itemValue, itemIndex) => {
    setToObj(JSON.parse(itemValue));
  };

  const stringifyTo = () => {
    return JSON.stringify(toObj);
  };

  useEffect(() => {
    const expenseCategories = async () => {
      try {
        // await AsyncStorage.removeItem("expensePicker");
        const value = await AsyncStorage.getItem("expensePicker");
        if (value !== null) {
          setExpensePicker(JSON.parse(value));
        } else {
          await AsyncStorage.setItem(
            "expensePicker",
            JSON.stringify(expenseCategoryData)
          );
        }
      } catch (err) {}
    };

    expenseCategories();
  }, []);

  useEffect(() => {
    async function storeData() {
      let uid = "";
      try {
        await new Promise((resolve, reject) => {
          onAuthStateChanged(auth, (user) => {
            if (user) {
              // User is logged in, get user data
              uid = user.uid;
              resolve();
            } else {
              // User is not logged in
              navigation.navigate("Login");
              console.log("No user logged in");
              reject();
            }
          });
        });

        const usersCollectionRef = collection(firestore, "users");
        const queryDoc = query(
          usersCollectionRef,
          where("uid", "==", uid),
          limit(1)
        );

        const querySnapshot = await getDocs(queryDoc);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          // Handle the matching document
          const dataUser = doc.data();
          setDocId(doc.id);
          setCardsList(dataUser.cards);
          setTransactions(dataUser.transactions);
          // console.log(userData);
        } else {
          // No matching document found
          navigation.navigate("Login");
          // console.log("User document does not exist");
        }
      } catch (error) {
        // Handle error
        // console.log(error);
        navigation.navigate("Login");
      }
    }

    storeData();
  }, []);

  const handleAddExpenseCategory = async () => {
    let arr = expensePicker.slice(0, expensePicker.length - 1);
    arr.push(otherCategory);
    arr.push("other");
    try {
      const update = await AsyncStorage.setItem(
        "expensePicker",
        JSON.stringify(arr)
      );
    } catch (error) {
      console.log(error);
    }

    setExpensePicker(arr);
    setExpenseClassification(otherCategory);
    setOtherCategory("");
  };

  const handleAmountChange = (text) => {
    // Remove non-numeric characters
    const numericValue = text.replace(/[^0-9.]/g, "");
    setAmountInvolved(numericValue);
  };

  const compareCards = () => {
    if (toObj == null) return true;
    else if ("mode" in fromObj && "mode" in toObj) {
      if (fromObj["mode"] == toObj["mode"]) return false;
      else return true;
    } else {
      if ("mode" in fromObj) return true;
      else if ("mode" in toObj) return true;
      else {
        if (
          fromObj.cardName == toObj.cardName &&
          fromObj.uniqueId == toObj.uniqueId &&
          fromObj.type == toObj.type
        )
          return false;
        else return true;
      }
    }
  };

  const handleAddTransaction = async () => {
    let data = {};
    let showToast = true;
    if (transactionType !== null) {
      data["transactionType"] = transactionType;
      if (amountInvolved !== "") {
        const amount = parseFloat(amountInvolved);
        data["amount"] = amount;
        data["description"] = description;
        if (transactionType == "Internal Transfer") {
          if (fromObj !== null && toObj !== null && compareCards()) {
            data["from"] = fromObj;
            data["to"] = toObj;
            showToast = true;
          } else showToast = false;
        } else if (transactionType == "Spent") {
          if (
            fromObj !== null &&
            compareCards() &&
            expenseClassification !== "" &&
            expenseClassification !== "other" &&
            unnecessary !== null &&
            recurring !== null
          ) {
            data["from"] = fromObj;
            if (toObj !== null) data["to"] = toObj;
            data["expenseClassification"] = expenseClassification;
            if (unnecessary === "Yes") data["unnecessary"] = true;
            else data["unnecessary"] = false;
            if (recurring === "Yes") data["recurring"] = true;
            else data["recurring"] = false;
            showToast = true;
          } else showToast = false;
        } else if (transactionType == "Received") {
          if (toObj !== null) {
            data["to"] = toObj;
            showToast = true;
          } else showToast = false;
        }
        // console.log(data);
        if (!showToast) {
          Toast.show({
            type: "error",
            text1: "Incomplete Form",
            text2: "Fill all required Fields",
            position: "bottom",
            visibilityTime: 4000,
            autoHide: true,
          });
        } else {
          data["description"] = description;
          data["date"] = new Date();
          let transactionId = 1;
          if (transactions.length > 0) {
            transactionId =
              transactions[transactions.length - 1].transactionId + 1;
          }
          data["transactionId"] = transactionId;
          transactions.push(data);

          //update balance in cards
          let arr = cardsList;
          for (let i = 0; i < arr.length; i++) {
            if (fromObj !== null && !("mode" in fromObj)) {
              if (
                fromObj.cardName == arr[i].cardName &&
                fromObj.uniqueId == arr[i].uniqueId &&
                fromObj.type == arr[i].type
              ) {
                arr[i].balance =
                  parseFloat(arr[i].balance) - parseFloat(amountInvolved);
              }
            }
            if (toObj !== null && !("mode" in toObj)) {
              if (
                toObj.cardName == arr[i].cardName &&
                toObj.uniqueId == arr[i].uniqueId &&
                toObj.type == arr[i].type
              ) {
                arr[i].balance =
                  parseFloat(arr[i].balance) + parseFloat(amountInvolved);
              }
            }
          }
          try {
            const documentRef = doc(firestore, "users", docId);
            await updateDoc(documentRef, {
              transactions: transactions,
              cards: arr,
            });
            // setCardsData(arr);
            Toast.show({
              type: "success",
              text1: "Transaction added",
              // text2: "Fill all required Fields",
              position: "bottom",
              visibilityTime: 4000,
              autoHide: true,
            });
            setTransactionType(null);
            setUnnecessary(null);
            setRecurring(null);
            setAmountInvolved("");
            setExpenseClassification("");
            setAmountInvolved("");
            setFromObj(null);
            setToObj(null);
            setDescription("");
            setWordCount("0");
            navigation.navigate("Home");
          } catch (error) {
            console.log(error);
            Toast.show({
              type: "error",
              text1: "Database issue!",
              text2: "Try again later!",
              position: "bottom",
              visibilityTime: 4000,
              autoHide: true,
            });
          }
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Amount field",
          text2: "Enter Ammount! (input only numbers)",
          position: "bottom",
          visibilityTime: 4000,
          autoHide: true,
        });
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Transaction Type field",
        text2: "Select any one options!",
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
      width: "85%",
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
            <Text style={{ fontSize: 18 }}>
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
                      setToObj(cardsList[0]);
                    } else {
                      setToObj({ mode: "cash" });
                    }
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
                    setExpenseClassification("Travel");
                    if (cardsList.length > 0) {
                      setFromObj(cardsList[0]);
                      setToObj({ mode: "cash" });
                    } else {
                      setFromObj({ mode: "cash" });
                      setToObj(null);
                    }
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
                      setFromObj(cardsList[0]);
                      setToObj(cardsList[0]);
                    } else {
                      setFromObj({ mode: "cash" });
                      setToObj({ mode: "cash" });
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
            <Text style={{ fontSize: 18 }}>
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
                <Text style={{ fontSize: 18 }}>
                  Update Balance <Text style={{ color: "#E49393" }}>*</Text>
                </Text>
                <Picker
                  style={styles.rcvdPicker1}
                  selectedValue={stringifyTo()}
                  onValueChange={handleToChange}
                >
                  {cardsList.map((obj, id) => (
                    <Picker.Item
                      key={id}
                      label={`${obj.cardName}-${obj.uniqueId}`}
                      value={JSON.stringify(obj)}
                    />
                  ))}
                  <Picker.Item
                    label="cash"
                    value={JSON.stringify({ mode: "cash" })}
                  />
                </Picker>
              </View>
            </>
          ) : transactionType == "Spent" ? (
            <>
              {/* dont include travel cards sice they are already recharged that is the amount in them is already spent */}
              <View style={styles.rcvdField1}>
                <Text style={{ fontSize: 18 }}>
                  Deduct From <Text style={{ color: "#E49393" }}>*</Text>
                </Text>
                <Picker
                  style={styles.rcvdPicker1}
                  selectedValue={stringifyFrom()}
                  onValueChange={handleFromChange}
                >
                  {cardsList.map((obj, id) => (
                    <Picker.Item
                      key={id}
                      label={`${obj.cardName}-${obj.uniqueId}`}
                      value={JSON.stringify(obj)}
                    />
                  ))}
                  <Picker.Item
                    label="cash"
                    value={JSON.stringify({ mode: "cash" })}
                  />
                </Picker>
              </View>
              <View style={styles.rcvdField1}>
                <Text style={{ fontSize: 18 }}>
                  Add To{" "}
                  <Text style={{ fontSize: 13 }}>
                    (eg: recharge transactions)
                  </Text>
                </Text>
                <Picker
                  style={styles.rcvdPicker1}
                  selectedValue={stringifyTo()}
                  onValueChange={handleToChange}
                >
                  <Picker.Item
                    label="None"
                    value={JSON.stringify({ mode: "none" })}
                  />
                  {cardsList.map((obj, id) => (
                    <Picker.Item
                      key={id}
                      label={`${obj.cardName}-${obj.uniqueId}`}
                      value={JSON.stringify(obj)}
                    />
                  ))}
                </Picker>
              </View>

              <View style={styles.rcvdField1}>
                <Text style={{ fontSize: 18 }}>
                  Expense Classification{" "}
                  <Text style={{ color: "#E49393" }}>*</Text>
                </Text>
                <Picker
                  style={styles.rcvdPicker1}
                  selectedValue={expenseClassification}
                  onValueChange={(itemValue) => {
                    setExpenseClassification(itemValue);
                  }}
                >
                  {expensePicker.map((obj, id) => (
                    <Picker.Item key={id} label={obj} value={obj} />
                  ))}
                  {/* <Picker.Item label="card-1" value="card-1" />
                  <Picker.Item label="card-2" value="card-2" />
                  <Picker.Item label="card-3" value="card-3" />
                  <Picker.Item label="in-hand" value="in-hand" />
                  <Picker.Item label="other" value="other" /> */}
                </Picker>
              </View>
              {expenseClassification == "other" ? (
                <View style={styles.rcvdField1}>
                  <Text style={{ fontSize: 18 }}>
                    Mention Expense Category{" "}
                    <Text style={{ color: "#E49393" }}>*</Text>
                  </Text>
                  <View style={styles.category}>
                    <TextInput
                      style={{
                        width: "90%",
                        fontSize: 15,
                      }}
                      value={otherCategory}
                      placeholder="Enter Category"
                      onChangeText={setOtherCategory}
                    />
                    <TouchableOpacity
                      style={{ marginTop: 3 }}
                      onPress={() => handleAddExpenseCategory()}
                    >
                      <Ionicons name="add-sharp" size={25} />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <></>
              )}

              <View style={styles.rcvdField1}>
                <Text style={{ fontSize: 18 }}>
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
                <Text style={{ fontSize: 18 }}>
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
              </View>
            </>
          ) : transactionType == "Internal Transfer" ? (
            <>
              <View style={styles.intField1}>
                <Text style={{ fontSize: 18 }}>
                  Deduct From <Text style={{ color: "#E49393" }}>*</Text>
                </Text>
                <Picker
                  style={styles.rcvdPicker1}
                  selectedValue={stringifyFrom()}
                  onValueChange={handleFromChange}
                >
                  {cardsList.map((obj, id) => (
                    <Picker.Item
                      key={id}
                      label={`${obj.cardName}-${obj.uniqueId}`}
                      value={JSON.stringify(obj)}
                    />
                  ))}
                  <Picker.Item
                    label="cash"
                    value={JSON.stringify({ mode: "cash" })}
                  />
                </Picker>
              </View>
              <View style={styles.intField1}>
                <Text style={{ fontSize: 18 }}>
                  Add To <Text style={{ color: "#E49393" }}>*</Text>
                </Text>
                <Picker
                  style={styles.rcvdPicker1}
                  selectedValue={stringifyTo()}
                  onValueChange={handleToChange}
                >
                  {cardsList.map((obj, id) => (
                    <Picker.Item
                      key={id}
                      label={`${obj.cardName}-${obj.uniqueId}`}
                      value={JSON.stringify(obj)}
                    />
                  ))}
                  <Picker.Item
                    label="cash"
                    value={JSON.stringify({ mode: "cash" })}
                  />
                </Picker>
              </View>
            </>
          ) : (
            <></>
          )}
          <View style={styles.describe}>
            <Text style={{ fontSize: 18 }}>
              Description{" "}
              <Text style={{ fontSize: 15 }}>({wordCount}/50 words)</Text>
            </Text>
            <TextInput
              // style={styles.textArea}

              style={styles.describeField}
              multiline={true}
              maxLength={50}
              numberOfLines={2} // Adjust the number of lines as needed
              placeholder="Enter your text here"
              value={description}
              onChangeText={handleDescription}
            />
          </View>
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
    </View>
  );
};

export default AddTransaction;
//Internal Transfer
//#6876f5
