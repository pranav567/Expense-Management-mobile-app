import { useState } from "react";
import * as SQLite from "expo-sqlite";

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

import { getCards, getUserDetailsById } from "../queries";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TestDetails = ({ navigation }) => {
  const db = SQLite.openDatabase("ExpenseManagement.db");
  useEffect(() => {
    const settingDetails = async () => {
      const getUserId = await AsyncStorage.getItem("userId");
      await getCards(db, getUserId, 1)
        .then((result) => {
          setName(JSON.stringify(result.cards));
          setEmail(result.count);
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
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
      <Text>{name}</Text>
      <Text>{email}</Text>
    </View>
  );
};

export default TestDetails;
