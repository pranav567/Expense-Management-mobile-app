import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
  Text,
  TextInput,
  Image,
  Keyboard,
} from "react-native";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../firebaseConfig";
// import ExpoBlurView from "expo-blur";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Ionicons } from "@expo/vector-icons";

import { useSelector, useDispatch } from "react-redux";
import { setCredentials, setSecurityCode } from "../store";
import { useState } from "react";
import { useRef } from "react";

const SecurityPin = () => {
  const credentials = useSelector((state) => state.securityCode.credentials);
  const securityCode = useSelector((state) => state.securityCode.securityCode);

  const dispatch = useDispatch();

  const updateSecurityCode = () => {};

  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const inputRef3 = useRef(null);
  const inputRef4 = useRef(null);

  const navigation = useNavigation();

  const auth = getAuth(app);

  const [field1, setField1] = useState("");
  const [field2, setField2] = useState("");
  const [field3, setField3] = useState("");
  const [field4, setField4] = useState("");

  const checkPin = async (fieldLast) => {
    const pin = field1 + field2 + field3 + fieldLast;
    try {
      // const storedPin = "4526";
      const storedPin = await AsyncStorage.getItem("storedPin");
      if (storedPin !== null) {
        if (pin === storedPin) {
          try {
            const { user } = await signInWithEmailAndPassword(
              auth,
              credentials.username,
              credentials.password
            );
            navigation.navigate("Home");

            dispatch(setSecurityCode(false));
            dispatch(setCredentials(null));
          } catch (error) {
            Toast.show({
              type: "error",
              text1: "Sign-In Error",
              text2: "Invalid Credentials!",
              position: "bottom",
              visibilityTime: 4000,
              autoHide: true,
            });

            dispatch(setSecurityCode(false));
            dispatch(setCredentials(null));
          }
        } else {
          setField1("");
          setField2("");
          setField3("");
          setField4("");
          Toast.show({
            type: "error",
            text1: "Incorrect Pin!",
            text2: "Try again!",
            position: "bottom",
            visibilityTime: 4000,
            autoHide: true,
          });
        }
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Storage issue!",
        text2: "Try again later!",
        position: "bottom",
        visibilityTime: 4000,
        autoHide: true,
      });
    }
  };

  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      // backfaceVisibility: "hidden",
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    cardContainer: {
      backgroundColor: "white",
      width: "75%",
      height: 200,
      padding: 20,
      flexDirection: "column",
      justifyContent: "flex-start",
      borderRadius: 10,
    },
    header: { alignItems: "center" },
    body1: { flexDirection: "row", justifyContent: "center", marginTop: 10 },
    cardId: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      marginTop: 40,
    },
    inputBox: {
      borderWidth: 1,
      padding: 10,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={styles.body1}>
          <Text
            style={{
              color: "#393e46",
              fontSize: 18,
              textAlign: "center",
              marginLeft: 10,
              marginRight: 10,
            }}
          >
            Enter your 4 digit security pin
          </Text>
        </View>
        {/* <TextInput style={styles.demoContainer} /> */}
        <View style={styles.cardId}>
          <View style={[styles.inputBox, { borderColor: "#393e46" }]}>
            <TextInput
              ref={inputRef1}
              value={field1}
              keyboardType="numeric"
              maxLength={1}
              onChangeText={(e) => {
                const num = e.replace(/[^0-9]/g, "");
                setField1(num);
                if (num == "") {
                  setField2("");
                  setField3("");
                  setField4("");
                }
              }}
              onSubmitEditing={() => {
                if (field1 == "") {
                } else {
                  inputRef2.current.focus();
                }
              }}
              placeholder="x"
            />
          </View>
          <View
            style={[
              styles.inputBox,
              { borderColor: field1 !== "" ? "#393e46" : "#f5f5f5" },
            ]}
          >
            <TextInput
              ref={inputRef2}
              editable={field1 !== ""}
              value={field2}
              keyboardType="numeric"
              maxLength={1}
              onChangeText={(e) => {
                const num = e.replace(/[^0-9]/g, "");
                setField2(num);
                if (num == "") {
                  setField3("");
                  setField4("");
                }
              }}
              onSubmitEditing={() => {
                if (field1 == "") {
                } else {
                  inputRef3.current.focus();
                }
              }}
              placeholder="x"
            />
          </View>
          <View
            style={[
              styles.inputBox,
              { borderColor: field2 !== "" ? "#393e46" : "#f5f5f5" },
            ]}
          >
            <TextInput
              ref={inputRef3}
              editable={field2 !== ""}
              value={field3}
              keyboardType="numeric"
              maxLength={1}
              onChangeText={(e) => {
                const num = e.replace(/[^0-9]/g, "");
                setField3(num);
                if (num == "") {
                  setField4("");
                }
              }}
              onSubmitEditing={() => {
                if (field1 == "") {
                } else {
                  inputRef4.current.focus();
                }
              }}
              placeholder="x"
            />
          </View>
          <View
            style={[
              styles.inputBox,
              { borderColor: field3 !== "" ? "#393e46" : "#f5f5f5" },
            ]}
          >
            <TextInput
              ref={inputRef4}
              editable={field3 !== ""}
              value={field4}
              keyboardType="numeric"
              maxLength={1}
              onChangeText={(e) => {
                const num = e.replace(/[^0-9]/g, "");
                setField4(num);
                if (num.length > 0) checkPin(num);
              }}
              placeholder="x"
              // onSubmitEditing={() => {

              // }}
            />
          </View>
        </View>
      </View>
      {/* </ImageBackground> */}
    </View>
  );
};

export default SecurityPin;
