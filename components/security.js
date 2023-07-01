import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";
import { Picker } from "@react-native-picker/picker";
import { useSelector, useDispatch } from "react-redux";
import CryptoJS from "crypto-js";
// import {  } from "react-native-web";

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

const Security = () => {
  const [checkPin, setCheckPin] = useState(-1);
  const [enterOldPin, setEnterOldPin] = useState("");
  const [pinOldLength, setPinOldLength] = useState("");
  const [enterPin, setEnterPin] = useState("");
  const [pinLength, setPinLength] = useState("");
  const [pinStored, setPinStored] = useState("");
  const [questionStored, setQuestionStored] = useState("");
  const [answerStored, setAnswerStored] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [saltStored, setSaltStored] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(
    "Name your Favorite fictional character?"
  );
  const [answer, setAnswer] = useState("");
  const [forgotPin, setForgotPin] = useState(false);
  const [lockApp, setLockApp] = useState(null);

  // Generate a random salt value
  const generateSalt = () => {
    let createSalt = CryptoJS.SHA256(Math.random().toString()).toString();
    return createSalt;
  };

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

  const dispatch = useDispatch();

  const handleTogglePassword = () => {
    if (showPassword) {
      if (pinLength.length > 0) {
        setEnterPin(pinLength);
      }
    } else {
      if (pinLength.length > 0) {
        let tmp = pinLength[0];
        for (let i = 0; i < pinLength.length - 1; i++) {
          tmp += `  -  ${pinLength[i + 1]}`;
        }
        setEnterPin(tmp);
      }
    }
    setShowPassword(!showPassword);
  };

  const handleToggleOldPassword = () => {
    if (showOldPassword) {
      if (pinOldLength.length > 0) {
        setEnterOldPin(pinOldLength);
      }
    } else {
      if (pinOldLength.length > 0) {
        let tmp = pinOldLength[0];
        for (let i = 0; i < pinOldLength.length - 1; i++) {
          tmp += `  -  ${pinOldLength[i + 1]}`;
        }
        setEnterOldPin(tmp);
      }
    }
    setShowOldPassword(!showOldPassword);
  };

  useEffect(() => {
    const pinSet = async () => {
      try {
        const lock = await AsyncStorage.getItem("lockApp");
        setLockApp(lock == null || lock == "0" ? false : true);
        const pin = await AsyncStorage.getItem("storedPin");
        if (pin == null) setCheckPin(0);
        else {
          setCheckPin(1);
          let { hashedPin, salt } = JSON.parse(pin);
          setPinStored(hashedPin);
          setSaltStored(salt);
        }
        const quest = await AsyncStorage.getItem("question");
        const ans = await AsyncStorage.getItem("answer");
        if (quest !== null) {
          let { hashedQuestion, salt } = JSON.parse(quest);
          setQuestionStored(hashedQuestion);
        }
        if (ans !== null) {
          let { hashedAnswer, salt } = JSON.parse(ans);
          setAnswerStored(hashedAnswer);
        }
      } catch (error) {
        console.log(error);
      }
    };
    pinSet();
  }, []);

  const setPinOnPress = async () => {
    if (pinLength.length == 4) {
      if (selectedQuestion !== "" && answer !== "") {
        try {
          const salt = generateSalt();
          const hashedPin = hashValue(pinLength, salt);
          const hashedQuestion = hashValue(selectedQuestion, salt);
          const hashedAnswer = hashValue(answer, salt);
          const pinSetting = await AsyncStorage.setItem(
            "storedPin",
            JSON.stringify({ hashedPin, salt })
          );
          const questionSetting = await AsyncStorage.setItem(
            "question",
            JSON.stringify({ hashedQuestion, salt })
          );
          const answerSetting = await AsyncStorage.setItem(
            "answer",
            JSON.stringify({ hashedAnswer, salt })
          );

          Toast.show({
            type: "success",
            text1: "New Security Pin Set!",
            // text2: "Enter 4 digit security pin!",
            position: "bottom",
            visibilityTime: 2000,
            autoHide: true,
          });
          setCheckPin(1);
          setPinStored(hashedPin);
          setQuestionStored(hashedQuestion);
          setAnswerStored(hashedAnswer);
          setSaltStored(salt);
          setShowPassword("");
          setEnterPin("");
          setPinLength("");
          setAnswer("");
          setSelectedQuestion("Name your Favorite fictional character?");
        } catch (error) {
          console.log(error);
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Incomplete form!",
          text2: "Enter security question and answer!",
          position: "bottom",
          visibilityTime: 2000,
          autoHide: true,
        });
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Incorrect Pin Length!",
        text2: "Enter 4 digit security pin!",
        position: "bottom",
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };

  const setNewPin = async () => {
    if (
      ((!forgotPin && pinOldLength.length == 4) ||
        (forgotPin && selectedQuestion !== "" && answer !== "")) &&
      pinLength.length == 4
    ) {
      //verify both
      let verifyPin = verifyValue(pinOldLength, pinStored, saltStored);
      let verifyQuest = verifyValue(
        selectedQuestion,
        questionStored,
        saltStored
      );
      let verifyAns = verifyValue(answer, answerStored, saltStored);
      if (
        (!forgotPin && verifyPin) ||
        (forgotPin && verifyQuest && verifyAns)
      ) {
        verifyPin = verifyValue(pinLength, pinStored, saltStored);
        if (!verifyPin) {
          try {
            const hashedPin = hashValue(pinLength, saltStored);
            let salt = saltStored;
            const pinSetting = await AsyncStorage.setItem(
              "storedPin",
              JSON.stringify({ hashedPin, salt })
            );
            Toast.show({
              type: "success",
              text1: "New Security Pin Set!",
              // text2: "Enter 4 digit security pin!",
              position: "bottom",
              visibilityTime: 2000,
              autoHide: true,
            });
            setCheckPin(1);
            setPinStored(hashValue(pinLength, saltStored));
            setShowOldPassword(false);
            setShowPassword(false);
            setEnterOldPin("");
            setEnterPin("");
            setPinLength("");
            setPinOldLength("");
            setForgotPin(false);
            setAnswer("");
            setSelectedQuestion("Name your Favorite fictional character?");
          } catch (error) {
            console.log(error);
          }
        } else {
          Toast.show({
            type: "error",
            text1: "Both Pin matched!",
            text2: "New Pin should be different from Old Pin!",
            position: "bottom",
            visibilityTime: 2000,
            autoHide: true,
          });
        }
      } else {
        if (forgotPin) {
          Toast.show({
            type: "error",
            text1: "Incorrect Security Details!",
            text2: "Select your question and answer!",
            position: "bottom",
            visibilityTime: 2000,
            autoHide: true,
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Incorrect Old Pin!",
            position: "bottom",
            visibilityTime: 2000,
            autoHide: true,
          });
        }
      }
    } else {
      if (forgotPin) {
        Toast.show({
          type: "error",
          text1: "Incomplete fields!",
          text2: "Enter 4 digit new pin and complete security question",
          position: "bottom",
          visibilityTime: 2000,
          autoHide: true,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Incorrect Pin Length!",
          text2: "Enter 4 digit security pin!",
          position: "bottom",
          visibilityTime: 2000,
          autoHide: true,
        });
      }
    }
  };

  const updateLock = async () => {
    try {
      if (lockApp) {
        setLockApp(false);
        await AsyncStorage.setItem("lockApp", "0");
      } else {
        setLockApp(true);
        await AsyncStorage.setItem("lockApp", "1");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const styles = StyleSheet.create({
    personal: {
      width: "100%",
      // backgroundColor: "#ffcccc",
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
  });

  return (
    <View style={styles.personal}>
      <View style={styles.header}>
        <Text style={styles.headerContainerText}>Security</Text>
        <Ionicons name="shield-checkmark" color="#69c181" size={30} />
      </View>
      <View style={styles.fieldsSaved}>
        {checkPin == 2 ? (
          <>
            {forgotPin ? (
              <View style={{ marginTop: 15 }}>
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
                  selectedValue={selectedQuestion}
                  onValueChange={setSelectedQuestion}
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
                <TouchableOpacity
                  onPress={() => {
                    setForgotPin(!forgotPin);
                  }}
                >
                  <Text
                    style={{ marginTop: 8, fontSize: 13, color: "#393e46" }}
                  >
                    Enter Pin?
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ marginTop: 15 }}>
                <Text style={{ fontSize: 18, color: "#393e46" }}>
                  Old Security Pin
                </Text>
                <View
                  style={{
                    marginTop: 5,
                    flexDirection: "row",
                    borderBottomWidth: 1,
                    borderColor: "#393e46",
                    // paddingBottom: 1,
                  }}
                >
                  <TextInput
                    style={{
                      marginLeft: 5,
                      fontSize: 15,
                      width: "90%",
                    }}
                    secureTextEntry={!showOldPassword}
                    value={enterOldPin}
                    keyboardType="numeric"
                    // maxLength={4}
                    onChangeText={(e) => {
                      const num = e.replace(/[^0-9]/g, "");
                      if (num.length <= 4) {
                        setPinOldLength(num);
                        if (num.length > 0) {
                          let tmp = num[0];
                          for (let i = 0; i < num.length - 1; i++) {
                            tmp += `  -  ${num[i + 1]}`;
                          }
                          if (showOldPassword) setEnterOldPin(tmp);
                          else setEnterOldPin(num);
                        } else setEnterOldPin("");
                      }
                    }}
                    placeholder="Enter Old Pin"
                  />

                  <TouchableOpacity onPress={handleToggleOldPassword}>
                    <Ionicons
                      style={{
                        paddingTop: 5,
                      }}
                      name={showOldPassword ? "eye-off" : "eye"}
                      size={24}
                      color="#393e46"
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setForgotPin(!forgotPin);
                  }}
                >
                  <Text
                    style={{ marginTop: 8, fontSize: 13, color: "#393e46" }}
                  >
                    Forgot Pin?
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={{ marginTop: 25 }}>
              <Text style={{ fontSize: 18, color: "#393e46" }}>
                Enter New Security Pin
              </Text>
              <View
                style={{
                  marginTop: 5,
                  flexDirection: "row",
                  borderBottomWidth: 1,
                  borderColor: "#393e46",
                  // paddingBottom: 1,
                }}
              >
                <TextInput
                  style={{
                    marginLeft: 5,
                    fontSize: 15,
                    width: "90%",
                  }}
                  secureTextEntry={!showPassword}
                  value={enterPin}
                  keyboardType="numeric"
                  // maxLength={4}
                  onChangeText={(e) => {
                    const num = e.replace(/[^0-9]/g, "");
                    if (num.length <= 4) {
                      setPinLength(num);
                      if (num.length > 0) {
                        let tmp = num[0];
                        for (let i = 0; i < num.length - 1; i++) {
                          tmp += `  -  ${num[i + 1]}`;
                        }
                        if (showPassword) setEnterPin(tmp);
                        else setEnterPin(num);
                      } else setEnterPin("");
                    }
                  }}
                  placeholder="Enter new 4 digit Pin"
                />

                <TouchableOpacity onPress={handleTogglePassword}>
                  <Ionicons
                    style={{
                      paddingTop: 5,
                    }}
                    name={showPassword ? "eye-off" : "eye"}
                    size={24}
                    color="#393e46"
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setCheckPin(1);
                    setShowOldPassword(false);
                    setShowPassword(false);
                    setEnterOldPin("");
                    setEnterPin("");
                    setPinLength("");
                    setPinOldLength("");
                    setSelectedQuestion(
                      "Name your Favorite fictional character?"
                    );
                    setForgotPin(false);
                    setAnswer("");
                  }}
                  style={{
                    borderWidth: 1,
                    width: "30%",
                    borderColor: "#393e46",
                    alignItems: "center",
                    marginTop: 30,
                    padding: 5,
                    borderRadius: 20,
                  }}
                >
                  <Text style={{ fontSize: 15, fontWeight: "600" }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setNewPin();
                  }}
                  style={{
                    borderWidth: 1,
                    width: "40%",
                    borderColor: "#393e46",
                    alignItems: "center",
                    marginTop: 30,
                    padding: 5,
                    borderRadius: 20,
                  }}
                >
                  <Text style={{ fontSize: 15, fontWeight: "600" }}>
                    Set New Pin
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : checkPin == 1 ? (
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 18 }}>Security Pin to open app</Text>
              {/* <TouchableOpacity> */}
              <Switch
                trackColor={{ false: "#767577", true: "#f4f3f4" }}
                thumbColor={lockApp ? "#69c181" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => {
                  updateLock();
                }}
                value={lockApp}
                style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1 }] }}
              />
              {/* </TouchableOpacity> */}
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <Text style={{ fontSize: 18 }}>
                Security Pin Set{" "}
                <Ionicons name="checkmark-circle" color="#69c181" size={18} />
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setCheckPin(2);
                  setPinLength("");
                  setEnterPin("");
                  setShowPassword(false);
                }}
                style={{
                  borderWidth: 1,
                  width: "30%",
                  borderColor: "#393e46",
                  alignItems: "center",
                  marginRight: 10,
                  padding: 5,
                  borderRadius: 20,
                }}
              >
                <Text>Change</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : checkPin == 0 ? (
          <>
            <Text style={{ fontSize: 18, color: "#393e46" }}>
              Enter Security Pin
            </Text>
            <View
              style={{
                marginTop: 5,
                flexDirection: "row",
                borderBottomWidth: 1,
                borderColor: "#393e46",
                // paddingBottom: 1,
              }}
            >
              <TextInput
                style={{
                  marginLeft: 5,
                  fontSize: 15,
                  width: "90%",
                }}
                secureTextEntry={!showPassword}
                value={enterPin}
                keyboardType="numeric"
                // maxLength={4}
                onChangeText={(e) => {
                  const num = e.replace(/[^0-9]/g, "");
                  if (num.length <= 4) {
                    setPinLength(num);
                    if (num.length > 0) {
                      let tmp = num[0];
                      for (let i = 0; i < num.length - 1; i++) {
                        tmp += `  -  ${num[i + 1]}`;
                      }
                      if (showPassword) setEnterPin(tmp);
                      else setEnterPin(num);
                    } else setEnterPin("");
                  }
                }}
                placeholder="Enter 4 digit Pin"
              />

              <TouchableOpacity onPress={handleTogglePassword}>
                <Ionicons
                  style={{
                    paddingTop: 5,
                  }}
                  name={showPassword ? "eye-off" : "eye"}
                  size={24}
                  color="#393e46"
                />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 18, color: "#393e46", marginTop: 20 }}>
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
              selectedValue={selectedQuestion}
              onValueChange={setSelectedQuestion}
            >
              {securityQuestions.map((obj, id) => (
                <Picker.Item key={id} label={obj} value={obj} />
              ))}
            </Picker>
            <Text style={{ fontSize: 18, color: "#393e46", marginTop: 20 }}>
              Write your answer <Text style={{ color: "#E49393" }}>*</Text>
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
              maxLength={20}
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
                  setPinOnPress();
                }}
                style={{
                  borderWidth: 1,
                  width: "30%",
                  borderColor: "#393e46",
                  alignItems: "center",
                  marginTop: 25,
                  padding: 5,
                  borderRadius: 20,
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: "600" }}>Set Pin</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text>DataBase Issue! Try again later</Text>
        )}
      </View>
    </View>
  );
};

export default Security;
