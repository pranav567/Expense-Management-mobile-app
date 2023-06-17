import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";
// import {  } from "react-native-web";

const Security = () => {
  const [name, setName] = useState("Pranav Nair");
  const [email, setEmail] = useState("pranavpn7@gmail.com");
  const [checkPin, setCheckPin] = useState(-1);
  const [enterOldPin, setEnterOldPin] = useState("");
  const [pinOldLength, setPinOldLength] = useState("");
  const [enterPin, setEnterPin] = useState("");
  const [pinLength, setPinLength] = useState("");
  const [pinStored, setPinStored] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);

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
        const pin = await AsyncStorage.getItem("storedPin");
        if (pin == null) setCheckPin(0);
        else {
          setCheckPin(1);
          setPinStored(pin);
        }
      } catch (error) {
        console.log(error);
      }
    };
    pinSet();
  }, []);

  const setPinOnPress = async () => {
    if (pinLength.length == 4) {
      try {
        await AsyncStorage.setItem("storedPin", pinLength);
        Toast.show({
          type: "success",
          text1: "New Security Pin Set!",
          // text2: "Enter 4 digit security pin!",
          position: "bottom",
          visibilityTime: 4000,
          autoHide: true,
        });
        setCheckPin(1);
        setPinStored(pinLength);
        setShowPassword("");
        setEnterPin("");
        setPinLength("");
      } catch (error) {
        console.log(error);
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Incorrect Pin Length!",
        text2: "Enter 4 digit security pin!",
        position: "bottom",
        visibilityTime: 4000,
        autoHide: true,
      });
    }
  };

  const setNewPin = async () => {
    if (pinOldLength.length == 4 && pinLength.length == 4) {
      if (pinOldLength == pinStored) {
        if (pinLength !== pinOldLength) {
          try {
            await AsyncStorage.setItem("storedPin", pinLength);
            Toast.show({
              type: "success",
              text1: "New Security Pin Set!",
              // text2: "Enter 4 digit security pin!",
              position: "bottom",
              visibilityTime: 4000,
              autoHide: true,
            });
            setCheckPin(1);
            setPinStored(pinLength);
            setShowOldPassword(false);
            setShowPassword(false);
            setEnterOldPin("");
            setEnterPin("");
            setPinLength("");
            setPinOldLength("");
          } catch (error) {
            console.log(error);
          }
        } else {
          Toast.show({
            type: "error",
            text1: "Both Pin matched!",
            text2: "New Pin should be different from Old Pin!",
            position: "bottom",
            visibilityTime: 4000,
            autoHide: true,
          });
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Incorrect Old Pin!",
          position: "bottom",
          visibilityTime: 4000,
          autoHide: true,
        });
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Incorrect Pin Length!",
        text2: "Enter 4 digit security pin!",
        position: "bottom",
        visibilityTime: 4000,
        autoHide: true,
      });
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
            </View>
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
