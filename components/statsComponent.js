import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useEffect } from "react";
import * as SQLite from "expo-sqlite";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Text, View, Image, StyleSheet, ScrollView } from "react-native";
import app from "../firebaseConfig";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import store, { setTransactionModal } from "../store";
import { useNavigation } from "@react-navigation/native";
import { getMonthlyTransactions, getSpendingDetails } from "../queries";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

const statsComponent = (props) => {
  const db = SQLite.openDatabase("ExpenseManagement.db");
  const firestore = getFirestore(app);
  const [receive, setReceive] = useState("");
  const [spent, setSpent] = useState("");
  const [monthlySpent, setMonthlySpent] = useState("");
  const [monthlyReceived, setMonthlyReceived] = useState("");
  const [monthlyHeader, setMonthlyHeader] = useState("false");
  const [userId, setUserId] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      const setData = async () => {
        let storedId = await AsyncStorage.getItem("userId");
        if (storedId !== null) {
          storedId = parseInt(storedId);
          setUserId(storedId);

          await getSpendingDetails(db, storedId)
            .then((res) => {
              if (res !== null) {
                // console.log(res);
                setReceive(res.received);
                setSpent(res.expenditure);
              }
            })
            .catch((err) => {});

          const month = moment().format("MM");
          const year = moment().format("YYYY");

          await getMonthlyTransactions(db, storedId, month, year)
            .then((res) => {
              setMonthlyReceived(res.income);
              setMonthlySpent(res.spent);
              if (res.income > res.spent) setMonthlyHeader(false);
              else setMonthlyHeader(true);
            })
            .catch((err) => {});
        }
      };
      setData();
    }, [])
  );

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

    return monthMapping[parseInt(moment().format("MM"))];
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
          Rs. {receive}
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: "#393e46",
            marginRight: 5,
            textAlign: "right",
          }}
        >
          Rs. {spent}
        </Text>
      </View>
    </View>
  );
};

export default statsComponent;
