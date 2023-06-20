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
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../firebaseConfig";
// import ExpoBlurView from "expo-blur";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Ionicons } from "@expo/vector-icons";

import { useSelector, useDispatch } from "react-redux";
import { setSecurityCode } from "../store";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";

import CryptoJS from "crypto-js";

const securityQuestions = [
  "Name your Favorite fictional character?",
  "Street name of your first home?",
  "Make and model of your first car?",
  "Name of the hospital you were born in?",
  "Middle name of your oldest cousin?",
  "Name your favorite childhood teacher?",
  "Name your favorite childhood friend?",
  "Name the first concert you attended?",
  "Name the company you had your first job?",
  "Name the first foreign country you visited?",
];

const SecurityPin = () => {
  const dispatch = useDispatch();

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

  const [pinStorage, setPinStorage] = useState("");
  const [questionStorage, setQuestionStorage] = useState("");
  const [answerStorage, setAnswerStorage] = useState("");
  const [saltStorage, setSaltStorage] = useState("");

  const [question, setQuestion] = useState(
    "Name your Favorite fictional character?"
  );
  const [answer, setAnswer] = useState("");

  const [forgotPin, setForgotPin] = useState(false);
  // Hash the PIN code using the salt
  const hashValue = (val, salt) => {
    const hashedValue = CryptoJS.SHA256(val + salt).toString();
    return hashedValue;
  };

  // Verify the entered PIN against the stored hashed PIN
  const verifyValue = (enteredVal, storedHashedValue, salt) => {
    const enteredHashedValue = hashValue(enteredVal, salt);
    return enteredHashedValue === storedHashedValue;
  };

  useEffect(() => {
    const getVals = async () => {
      const storedPin = await AsyncStorage.getItem("storedPin");
      const { hashedPin, salt } = JSON.parse(storedPin);
      setPinStorage(hashedPin);
      // console.log(salt);
      setSaltStorage(salt);
      const storedQuestion = await AsyncStorage.getItem("question");
      const { hashedQuestion } = JSON.parse(storedQuestion);
      setQuestionStorage(hashedQuestion);
      const storedAnswer = await AsyncStorage.getItem("answer");
      const { hashedAnswer } = JSON.parse(storedAnswer);
      setAnswerStorage(hashedAnswer);
    };
    getVals();
  }, []);

  const checkPin = async (fieldLast) => {
    const pin = field1 + field2 + field3 + fieldLast;
    try {
      let verifyPin = verifyValue(pin, pinStorage, saltStorage);
      let verifyQuest = verifyValue(question, questionStorage, saltStorage);
      let verifyAns = verifyValue(answer, answerStorage, saltStorage);
      if (
        (!forgotPin && verifyPin) ||
        (forgotPin && verifyQuest && verifyAns)
      ) {
        dispatch(setSecurityCode(false));
        onAuthStateChanged(auth, (user) => {
          if (user) {
            navigation.navigate("Home");
          } else {
            navigation.navigate("Login");
          }
        });
      } else {
        setField1("");
        setField2("");
        setField3("");
        setField4("");
        Toast.show({
          type: "error",
          text1: "Incorrect Question-Answer / Pin!",
          text2: "Try again!",
          position: "bottom",
          visibilityTime: 4000,
          autoHide: true,
        });
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
      // height: 220,
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
        {forgotPin ? (
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 18, color: "#393e46" }}>
              Select a security question{" "}
              <Text style={{ color: "#E49393" }}>*</Text>
            </Text>
            <Picker
              style={{
                backgroundColor: "#F5F5F5",
                marginTop: 10,
                color: "#393e46",
                fontSize: 15,
              }}
              selectedValue={question}
              onValueChange={setQuestion}
            >
              {securityQuestions.map((obj, id) => (
                <Picker.Item key={id} label={obj} value={obj} />
              ))}
            </Picker>
            <Text style={{ fontSize: 18, color: "#393e46", marginTop: 20 }}>
              Write your answer{" "}
              <Text style={{ color: "#393e46", fontSize: 12 }}>
                (case sensitive)
              </Text>
            </Text>
            <TextInput
              style={{
                marginLeft: 5,
                marginTop: 5,
                // backgroundColor: "yellow",
                fontSize: 15,
                borderBottomWidth: 1,
                borderColor: "#393e46",
              }}
              // multiline={true}
              maxLength={30}
              numberOfLines={2} // Adjust the number of lines as needed
              placeholder="Enter your text here (30 letters)"
              value={answer}
              onChangeText={(e) => {
                if (e.length <= 30) setAnswer(e);
              }}
            />
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => {
                  checkPin(null);
                }}
                style={{
                  alignItems: "center",
                  marginTop: 20,
                  borderColor: "#393e46",
                  borderWidth: 1,
                  borderRadius: 10,
                  width: "30%",
                  padding: 5,
                }}
              >
                <Text style={{ fontSize: 15, color: "#393e46" }}>Done</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => {
                setForgotPin(!forgotPin);
              }}
              style={{ alignItems: "center", marginTop: 15 }}
            >
              <Text
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: "#393e46",
                  marginTop: 8,
                  fontSize: 15,
                  color: "#393e46",
                }}
              >
                Enter Pin ?
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
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
                  autoFocus={true}
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
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                style={{ marginTop: 20, padding: 5, width: "35%" }}
                onPress={() => {
                  setForgotPin(!forgotPin);
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 15,
                    color: "#393e46",
                    borderBottomWidth: 1,
                    borderBottomColor: "#393e46",
                  }}
                >
                  Forgot Pin ?
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      {/* </ImageBackground> */}
    </View>
  );
};

export default SecurityPin;
