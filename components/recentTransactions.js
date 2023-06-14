import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import app from "../firebaseConfig";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";

const RecentTransactions = (props) => {
  // console.log(props);
  const firestore = getFirestore(app);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // console.log(props.docId);
    const userDocRef = doc(firestore, "users", props.docId);
    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      const userData = docSnapshot.data();
      if (userData) {
        let arr = userData.transactions;
        arr.reverse();
        setTransactions(arr);
        // Handle the change in the 'transaction' field
        // console.log("Transactions updated:", transactions);
        // Update the transaction array in your other screen or component
        // ...
      }
    });

    return () => {
      // Clean up the listener when the component is unmounted
      unsubscribe();
    };
  }, []);

  const getFormattedDate = (dateObj) => {
    const transactionDate = dateObj.toDate();
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

  // console.log(getFormattedDate(transactions[0].date));

  const styles = StyleSheet.create({
    container: {
      margin: 20,
      marginTop: 10,
    },
    headerRow: {
      padding: 5,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    innerContainer: { padding: 10, paddingTop: 0, paddingLeft: 5 },
    transaction: {
      flexDirection: "column",
      backgroundColor: "white",
      //#f5f5f5
      margin: 8,
      //   width: 220,
      minWidth: 180,
      height: 110,
      padding: 15,
      borderRadius: 15,
      paddingRight: 20,
      paddingLeft: 20,
      borderWidth: 1,
      borderColor: "#393e46",
    },
    radio: {
      width: 15,
      height: 15,
      borderRadius: 20,
      //   borderWidth: 1,
      marginTop: 5,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={{ fontSize: 22, color: "#393e46" }}>
          Recent Transactions
        </Text>
      </View>
      <View style={styles.innerContainer}>
        {transactions.length == 0 ? (
          <Text>No data</Text>
        ) : transactions.length < 6 ? (
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {transactions.map((obj, id) => (
              <View
                key={id}
                style={[
                  styles.transaction,
                  {
                    marginLeft: id == 0 ? 0 : 8,
                  },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ fontSize: 20, color: "#393e46" }}>
                    Rs. {obj.amount}
                  </Text>
                  <View
                    style={[
                      styles.radio,
                      {
                        backgroundColor:
                          obj.transactionType == "Received"
                            ? "#2dea8f"
                            : obj.transactionType == "Spent"
                            ? "#f85f73"
                            : "#51adcf",
                      },
                    ]}
                  ></View>
                </View>

                <Text
                  style={{ fontSize: 14, marginBottom: 2, color: "#393e46" }}
                >
                  {/* {String(obj.date.getDate())} */}
                  {getFormattedDate(obj.date)}
                </Text>
                <Text style={{ fontSize: 14, color: "#393e46" }}>
                  {obj.description}
                </Text>
              </View>
            ))}
          </ScrollView>
        ) : (
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {transactions.slice(0, 5).map((obj, id) => (
              <View
                key={id}
                style={[
                  styles.transaction,
                  {
                    marginLeft: id == 0 ? 0 : 8,
                  },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ fontSize: 20, color: "#393e46" }}>
                    Rs. {obj.amount}
                  </Text>
                  <View
                    style={[
                      styles.radio,
                      {
                        backgroundColor:
                          obj.transactionType == "Received"
                            ? "#2dea8f"
                            : obj.transactionType == "Spent"
                            ? "#f85f73"
                            : "#51adcf",
                      },
                    ]}
                  ></View>
                </View>

                <Text
                  style={{ fontSize: 14, marginBottom: 2, color: "#393e46" }}
                >
                  {/* {String(obj.date.getDate())} */}
                  {getFormattedDate(obj.date)}
                </Text>
                <Text style={{ fontSize: 14, color: "#393e46" }}>
                  {obj.description}
                </Text>
              </View>
            ))}
            <View
              key={5}
              style={[
                styles.transaction,
                {
                  marginLeft: 8,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "transparent",
                  borderWidth: 0,
                  minWidth: 50,
                  paddingRight: 0,
                },
              ]}
            >
              <TouchableOpacity>
                <Ionicons name="arrow-forward-circle-outline" size={50} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default RecentTransactions;
