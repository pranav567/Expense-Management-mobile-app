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
import app from "../firebaseConfig";
import CryptoJS from "crypto-js";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import Toast from "react-native-toast-message";
import {
  checkTableExists,
  createUserDetailsTable,
  insertIntoUserDetails,
  deleteAllTables,
  checkEmailExists,
  createCardsDetailsTable,
  createTransactionDetailsTable,
} from "../queries";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Register = ({ navigation }) => {
  // console.log(firebase);
  const [name, setName] = useState("Pranav");
  const [password, setPassword] = useState("123");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("123");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [email, setEmail] = useState("pranavpn@gmail.com");
  // const [mobile, setMobile] = useState("");

  const verifyEmail = () => {
    //to be done later using mailgun
  };

  const validatePassword = () => {
    //to be done later
  };

  // Generate a random salt value
  const generateSalt = () => {
    let createSalt = CryptoJS.SHA256(Math.random().toString()).toString();
    return createSalt;
  };

  const hashValue = (val, salt) => {
    const hashedValue = CryptoJS.SHA256(val + salt).toString();
    return hashedValue;
  };

  const registerNewUser = async () => {
    const db = SQLite.openDatabase("ExpenseManagement.db");
    if (
      name !== "" &&
      email !== "" &&
      password !== "" &&
      confirmPassword == password
    ) {
      // await deleteAllTables(db);

      let tableExists = false;
      await checkTableExists(db, "userDetails")
        .then((exists) => {
          tableExists = exists;
        })
        .catch((err) => {
          tableExists = null;
        });

      if (tableExists == null) {
        Toast.show({
          type: "error",
          text1: "Database Error 1",
          position: "bottom",
          visibilityTime: 4000,
          autoHide: true,
        });
      } else {
        let tableCreated = true;
        if (tableExists == false) {
          await createUserDetailsTable(db)
            .then(() => (tableCreated = true))
            .catch((err) => (tableCreated = false));
        }
        if (!tableCreated) {
          Toast.show({
            type: "error",
            text1: "Database Error 2",
            position: "bottom",
            visibilityTime: 4000,
            autoHide: true,
          });
        } else {
          let emailExists = false;
          await checkEmailExists(db, email)
            .then((exists) => {
              emailExists = exists;
            })
            .catch((err) => {
              console.log(err);
              emailExists = null;
            });
          if (emailExists == false) {
            let dataInserted = null;
            const getSalt = generateSalt();
            const hashedPassword = hashValue(password, getSalt);
            await insertIntoUserDetails(
              db,
              name,
              email,
              hashedPassword,
              getSalt
            )
              .then((result) => {
                if (result !== null) {
                  dataInserted = result.userId;
                }
              })
              .catch((err) => {
                dataInserted = null;
              });
            if (dataInserted == null) {
              Toast.show({
                type: "error",
                text1: "Database Error 3",
                position: "bottom",
                visibilityTime: 4000,
                autoHide: true,
              });
            } else {
              await AsyncStorage.setItem("userId", dataInserted.toString());
              await createCardsDetailsTable(db);
              await createTransactionDetailsTable(db);
              Toast.show({
                type: "success",
                text1: "Registration Successful",
                position: "bottom",
                visibilityTime: 4000,
                autoHide: true,
              });
              setTimeout(() => {
                navigation.navigate("Profile");
              }, 500);
            }
          } else if (emailExists == true) {
            Toast.show({
              type: "error",
              text1: "Email Exists",
              text2: "Account already exists! Try login!",
              position: "bottom",
              visibilityTime: 4000,
              autoHide: true,
            });
          } else {
            Toast.show({
              type: "error",
              text1: "Database Error 4",
              position: "bottom",
              visibilityTime: 4000,
              autoHide: true,
            });
          }
        }
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Sign-Up Error",
        text2: "Fill up details first and match both passwords!",
        position: "bottom",
        visibilityTime: 4000,
        autoHide: true,
      });
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const styles = StyleSheet.create({
    containerOuter: {
      flex: 1,
      backgroundColor: "#393e46",
    },
    containerTitle: {
      width: "100%",
      height: "15%",
      backgroundColor: "transparent",
      alignItems: "center",
      justifyContent: "center",
    },
    appname: {
      fontSize: 20,
      textAlign: "center",
      color: "white",
    },
    containerRegister: {
      width: "100%",
      height: "85%",
      backgroundColor: "white",
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      //   alignItems: "center",
    },
    headers: {
      paddingTop: 50,
      width: "80%",
    },
    containerDetails: {
      paddingTop: 50,
      paddingBottom: 5,
      width: "80%",
      borderBottomWidth: 1,
      borderBottomColor: "#393e46",
    },
    containerInputUsername: {
      paddingTop: 25,
      paddingBottom: 5,
      width: "80%",
      borderBottomWidth: 1,
      borderBottomColor: "#393e46",
    },
    containerInputPass: {
      paddingTop: 25,
      paddingBottom: 5,
      width: "80%",
      borderBottomWidth: 1,
    },
    username: {
      width: "90%",
      paddingTop: 5,
      fontSize: 15,
      // outlineStyle: "none",
    },
    webUsername: {
      width: "90%",
      paddingTop: 5,
      fontSize: 15,
      outlineStyle: "none",
    },
    webPassword: {
      width: "90%",
      paddingTop: 5,
      fontSize: 15,
      outlineStyle: "none",
    },
    password: {
      width: "90%",
      paddingTop: 5,
      fontSize: 15,
      // outlineStyle: "none",
    },
    passwordContainer: { flexDirection: "row" },
    containerButton: {
      width: "80%",
      paddingTop: 40,
      alignItems: "center",
    },
    buttonRegister: {
      width: "40%",
      height: 40,
      backgroundColor: "#393e46",
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonTextRegister: {
      fontSize: 18,
      fontWeight: "bold",
      color: "white",
    },
  });

  return (
    <View style={styles.containerOuter}>
      <View style={styles.containerTitle}>
        <Text style={styles.appname}>
          Expense Diary - Manage & Track your Expenses effortlessly
        </Text>
      </View>
      <View style={styles.containerRegister}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ alignItems: "center" }}
        >
          <View style={styles.headers}>
            <Text
              style={{
                fontSize: 30,
                fontWeight: "bold",
                color: "#393e46",
              }}
            >
              Welcome
            </Text>
            <Text
              style={{
                fontSize: 18,
              }}
            >
              Please enter your information!
            </Text>
          </View>
          <View style={styles.containerDetails}>
            <Text
              style={{
                fontSize: 18,
                color: "#393e46",
              }}
            >
              Full Name
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={
                  Platform.OS == "web" ? styles.webUsername : styles.username
                }
                value={name}
                placeholder="Enter Name"
                onChangeText={setName}
              />

              <Ionicons
                style={{
                  paddingTop: 5,
                }}
                name={name !== "" ? "checkmark" : ""}
                size={24}
                color={name !== "" ? "green" : "red"}
              />
            </View>
          </View>
          <View style={styles.containerInputUsername}>
            <Text
              style={{
                fontSize: 18,
                color: "#393e46",
              }}
            >
              Email-Id
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={
                  Platform.OS == "web" ? styles.webUsername : styles.username
                }
                value={email}
                placeholder="Enter Email"
                onChangeText={setEmail}
              />

              <Ionicons
                style={{
                  paddingTop: 5,
                }}
                name={email !== "" ? "checkmark" : ""}
                size={24}
                color={email !== "" ? "#393e46" : "red"}
              />
            </View>
          </View>
          {/* <View style={styles.containerInputUsername}>
            <Text
              style={{
                fontSize: 18,
                color: "#393e46",
              }}
            >
              Mobile Number
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={
                  Platform.OS == "web" ? styles.webUsername : styles.username
                }
                keyboardType="numeric"
                value={mobile}
                placeholder="Enter Mobile Number"
                onChangeText={setMobile}
              />

              <Ionicons
                style={{
                  paddingTop: 5,
                }}
                name={mobile.length == 10 ? "checkmark" : ""}
                size={24}
                color={mobile.length == 10 ? "green" : "red"}
              />
            </View>
          </View> */}
          <View
            style={[
              styles.containerInputPass,
              { borderBottomColor: validPassword ? "#393e46" : "gray" },
            ]}
          >
            <Text
              style={{
                fontSize: 18,
                color: "#393e46",
              }}
            >
              Password
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={
                  Platform.OS == "web" ? styles.webPassword : styles.password
                }
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter Password"
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
          </View>
          <View
            style={[
              styles.containerInputPass,
              {
                borderBottomColor:
                  password == confirmPassword && password !== ""
                    ? "green"
                    : "gray",
              },
            ]}
          >
            <Text
              style={{
                fontSize: 18,
                color: "#393e46",
              }}
            >
              Confirm Password
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={
                  Platform.OS == "web" ? styles.webPassword : styles.password
                }
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter Password"
              />
              <TouchableOpacity onPress={handleToggleConfirmPassword}>
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
          </View>
          <View style={styles.containerButton}>
            <TouchableOpacity
              style={styles.buttonRegister}
              onPress={() => {
                registerNewUser(email, password);
              }}
            >
              <Text style={styles.buttonTextRegister}>Register</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: "80%",
              justifyContent: "center",
              flexDirection: "row",
              paddingBottom: 20,
            }}
          >
            <Text
              style={{
                paddingTop: 15,
              }}
            >
              Already have an account?{" "}
            </Text>
            <TouchableOpacity
              style={{
                paddingTop: 15,
              }}
              onPress={() => {
                navigation.navigate("Login");
              }}
            >
              <Text
                style={{
                  color: "#393e46",
                  fontWeight: "bold",
                }}
              >
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Register;
