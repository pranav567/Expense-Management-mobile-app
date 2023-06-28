import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import app from "../firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import * as SQLite from "expo-sqlite";
import {
  getFirestore,
  doc,
  collection,
  query,
  where,
  limit,
  getDocs,
} from "firebase/firestore";
import { useEffect } from "react";
import { getUserDetailsById } from "../queries";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PersonalData = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const setData = async () => {
      const db = SQLite.openDatabase("ExpenseManagement.db");
      const storedId = await AsyncStorage.getItem("userId");
      if (storedId !== null) {
        let id = parseInt(storedId);
        await getUserDetailsById(db, id)
          .then((res) => {
            if (res !== null) {
              setName(res.name);
              setEmail(res.email);
            }
          })
          .catch((err) => {});
      }
    };
    setData();
  }, []);

  const auth = getAuth(app);
  const firestore = getFirestore(app);

  const styles = StyleSheet.create({
    personal: {
      width: "100%",
      // backgroundColor: "#daeaf6",
      // backgroundColor: "white",
      // borderWidth: 1,
      // borderColor: "#d3d6db",
      // borderRadius: 10,
      padding: 20,
      justifyContent: "flex-start",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      height: 40,
    },
    headerContainerText: {
      fontSize: 25,
    },
    fieldsSaved: {
      flexDirection: "column",
      justifyContent: "flex-start",
      padding: 10,
    },
    fields: {
      flexDirection: "row",
      justifyContent: "flex-start",
    },
    fieldKeyValue: {
      fontSize: 18,
      flexWrap: "wrap",
    },
  });

  return (
    <View style={styles.personal}>
      <View style={styles.header}>
        <Text style={styles.headerContainerText}>Personal Data</Text>
        <Ionicons name="person" color="#ff9f68" size={30} />
      </View>
      <View style={styles.fieldsSaved}>
        <View style={styles.fields}>
          <View style={{ width: 65 }}>
            <Text style={[styles.fieldKeyValue, { fontWeight: "bold" }]}>
              Name
            </Text>
          </View>

          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={styles.fieldKeyValue}
          >
            {name}
          </Text>
        </View>
        <View style={[styles.fields, { marginTop: 15 }]}>
          <View style={{ width: 65 }}>
            <Text style={[styles.fieldKeyValue, { fontWeight: "bold" }]}>
              Email
            </Text>
          </View>

          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={styles.fieldKeyValue}
          >
            {email}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PersonalData;
