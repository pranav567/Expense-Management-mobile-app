import { useState } from "react";
import * as SQLite from "expo-sqlite";
import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { getCards, getTransactions, getUserDetailsById } from "../queries";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TestDetails = ({ navigation }) => {
  const db = SQLite.openDatabase("ExpenseManagement.db");

  useFocusEffect(
    React.useCallback(() => {
      const settingDetails = async () => {
        const getUserId = await AsyncStorage.getItem("userId");
        await getTransactions(db, parseInt(getUserId), 1)
          .then((result) => {
            setName(result.transactions);
          })
          .catch((err) => {
            console.log(err);
          });
        await getCards(db, parseInt(getUserId))
          .then((result) => {
            setEmail(result.cards);
          })
          .catch((err) => {
            console.log(err);
          });
        // await getUserDetailsById(db, getUserId)
        //   .then((result) => {
        //     if (result !== null) {
        //       setName(result.name);
        //       setEmail(result.email);
        //     }
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //   });
      };

      settingDetails();
    }, [])
  );

  const [name, setName] = useState([]);
  const [email, setEmail] = useState([]);
  const [password, setPassword] = useState("");
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Hello</Text>
      {name.map((obj, id) => (
        <Text key={id}>{JSON.stringify(obj)}</Text>
      ))}
      {email.map((obj, id) => (
        <Text key={id}>{JSON.stringify(obj)}</Text>
      ))}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Profile");
        }}
      >
        <Text>hello</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TestDetails;
