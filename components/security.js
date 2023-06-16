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
// import {  } from "react-native-web";

const Security = () => {
  const [name, setName] = useState("Pranav Nair");
  const [email, setEmail] = useState("pranavpn7@gmail.com");
  const [checkPin, setCheckPin] = useState(-1);
  const [enterPin, setEnterPin] = useState("");
  const [pinLength, setPinLength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

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

  useEffect(() => {
    const pinSet = async () => {
      try {
        const pin = await AsyncStorage.getItem("storedPin");
        if (pin == null) setCheckPin(0);
        else setCheckPin(1);
      } catch (error) {
        console.log(error);
      }
    };
    pinSet();
  }, []);

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
        {checkPin == 1 ? (
          <></>
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
                  setPinLength(num);
                  if (num.length > 0) {
                    let tmp = num[0];
                    for (let i = 0; i < num.length - 1; i++) {
                      tmp += `  -  ${num[i + 1]}`;
                    }
                    setEnterPin(tmp);
                  } else setEnterPin("");
                }}
                autoFocus={true}
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
          </>
        ) : (
          <Text>DataBase Issue! Try again later</Text>
        )}
      </View>
    </View>
  );
};

export default Security;
