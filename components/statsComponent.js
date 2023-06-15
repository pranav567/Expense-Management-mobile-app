import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Text, View, Image, StyleSheet, ScrollView } from "react-native";
import app from "../firebaseConfig";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import { setTransactionModal } from "../store";
import { useNavigation } from "@react-navigation/native";

const statsComponent = (props) => {
  const firestore = getFirestore(app);
  const [receive, setReceive] = useState("");
  const [spent, setSpent] = useState("");
  const [monthlySpent, setMonthlySpent] = useState("");
  const [monthlyReceived, setMonthlyReceived] = useState("");
  const [monthlyHeader, setMonthlyHeader] = useState("false");

  const getFormattedDate = (dateObj) => {
    const transactionDate = dateObj.toDate();
    // const day = String(transactionDate.getDate()).padStart(2, "0");
    const month = String(transactionDate.getMonth() + 1).padStart(2, "0");
    // const year = String(transactionDate.getFullYear());

    // const formattedDate = `${day}/${month}/${year}`;
    return month;
    // Get current time
    // const hours = String(transactionDate.getHours() % 12 || 12).padStart(2, "0");
    // const minutes = String(transactionDate.getMinutes()).padStart(2, "0");
    // const meridiem = transactionDate.getHours() >= 12 ? "PM" : "AM";

    // const formattedTime = `${hours}:${minutes} ${meridiem}`;
  };

  useEffect(() => {
    // console.log(props.docId);
    const userDocRef = doc(firestore, "users", props.docId);
    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      const userData = docSnapshot.data();
      if (userData) {
        let arr = userData.transactions;

        arr = arr.sort((a, b) => b.date.seconds - a.date.seconds);
        let exp = 0;
        let rec = 0;
        const currentDate = new Date();
        // const day = String(currentDate.getDate()).padStart(2, "0");
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        arr.forEach((obj) => {
          if (getFormattedDate(obj.date) == month) {
            if (obj.transactionType == "Received")
              rec += parseFloat(obj.amount);
            else if (obj.transactionType == "Spent")
              exp += parseFloat(obj.amount);
          }
        });
        setMonthlyReceived(rec);
        setMonthlySpent(exp);
        setReceive(userData.received);
        setSpent(userData.expenditure);
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

  const getMonthName = () => {
    const monthMapping = {
      1: "January",
      2: "February",
      3: "March",
      4: "April",
      5: "May",
      6: "June",
      7: "July",
      8: "August",
      9: "September",
      10: "October",
      11: "November",
      12: "December",
    };

    const currentDate = new Date();
    return monthMapping[currentDate.getMonth() + 1];
  };

  const styles = StyleSheet.create({
    container: {
      // margin: 5,
      marginTop: 10,
      paddingTop: 10,
      paddingLeft: 20,
      paddingRight: 20,
      flexDirection: "column",
      // borderWidth: 1,
    },
    monthly: { flexDirection: "row", justifyContent: "flex-start" },
    content: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginLeft: 5,
      marginRight: 10,
      marginTop: 5,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.monthly}>
        <Text
          style={{
            fontSize: 22,
            width: "75%",
            color: "#393e46",
            fontWeight: "bold",
          }}
        >
          {getMonthName()} {monthlyHeader ? "Outgoing" : "Incoming"}{" "}
          <Ionicons
            size={22}
            name={
              monthlyHeader
                ? "arrow-up-circle-outline"
                : "arrow-down-circle-outline"
            }
            color={monthlyHeader ? "#f85f73" : "#2dea8f"}
          />
        </Text>
        <TouchableOpacity
          style={{ marginTop: 3 }}
          onPress={() => {
            setMonthlyHeader(!monthlyHeader);
          }}
        >
          <Ionicons size={22} name="swap-horizontal" />
        </TouchableOpacity>
      </View>
      <Text
        style={{ fontSize: 18, marginLeft: 5, color: "#393e46", marginTop: 5 }}
      >
        Rs. {monthlyHeader ? monthlySpent : monthlyReceived}
      </Text>
      <View style={[styles.content, { marginTop: 20 }]}>
        <Text style={{ color: "#393e46", fontSize: 18 }}>
          <Ionicons
            color="#2dea8f"
            size={18}
            name="arrow-down-circle-outline"
          />{" "}
          Total Received
        </Text>
        <Text style={{ color: "#393e46", fontSize: 18 }}>
          Total Spent{" "}
          <Ionicons color="#f85f73" size={18} name="arrow-up-circle-outline" />
        </Text>
      </View>
      <View style={[styles.content, { marginBottom: 15 }]}>
        <Text
          style={{
            fontSize: 15,
            color: "#393e46",
            marginLeft: 5,
            textAlign: "left",
          }}
        >
          Rs. {monthlyReceived}
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: "#393e46",
            marginRight: 5,
            textAlign: "right",
          }}
        >
          Rs. {monthlySpent}
        </Text>
      </View>
    </View>
  );
};

export default statsComponent;
