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

  const styles = StyleSheet.create({
    container: {
      // margin: 5,
      marginTop: 10,
      padding: 10,
      paddingLeft: 5,
      paddingRight: 5,
    },
  });

  return (
    <View style={styles.container}>
      <Text>+ Rs. {monthlyReceived}</Text>
      <Text>- Rs. {monthlySpent}</Text>
      <Text>+ Rs. {receive}</Text>
      <Text>- Rs. {spent}</Text>
    </View>
  );
};

export default statsComponent;
