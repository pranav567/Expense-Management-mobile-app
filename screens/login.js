import { useState } from "react";
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Login = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validPassword, setValidPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const styles = StyleSheet.create({
    containerOuter: {
      flex: 1,
      backgroundColor: "#b1cbfa",
    },
    containerTitle: {
      width: "100%",
      height: "30%",
      backgroundColor: "transparent",
      alignItems: "center",
      justifyContent: "center",
    },
    appname: {
      fontSize: 24,
    },
    containerLogin: {
      width: "100%",
      height: "70%",
      backgroundColor: "white",
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      alignItems: "center",
    },
    headers: {
      paddingTop: 50,
      width: "80%",
    },
    containerInputUsername: {
      paddingTop: 50,
      paddingBottom: 5,
      width: "80%",
      borderBottomWidth: 1,
      borderBottomColor: username !== "" ? "#7874f2" : "gray",
    },
    containerInputPass: {
      paddingTop: 25,
      paddingBottom: 5,
      width: "80%",
      borderBottomWidth: 1,
      borderBottomColor: validPassword ? "#7874f2" : "gray",
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
      paddingTop: 60,
      alignItems: "center",
    },
    buttonSignIn: {
      width: "40%",
      height: 40,
      backgroundColor: "#8e98f5",
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonTextSignIn: {
      fontSize: 18,
      fontWeight: "bold",
      color: "white",
    },
  });

  return (
    <View style={styles.containerOuter}>
      <View style={styles.containerTitle}>
        <Text style={styles.appname}>Expense Diary</Text>
      </View>
      <View style={styles.containerLogin}>
        <View style={styles.headers}>
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              color: "#8e98f5",
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
        <View style={styles.containerInputUsername}>
          <Text
            style={{
              fontSize: 18,
              color: "#8e98f5",
            }}
          >
            Username
          </Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={
                Platform.OS == "web" ? styles.webUsername : styles.username
              }
              value={username}
              placeholder="Enter Username"
              onChangeText={setUsername}
            />

            <Ionicons
              style={{
                paddingTop: 5,
              }}
              name={username !== "" ? "checkmark" : ""}
              size={24}
              color={username !== "" ? "#7874f2" : "red"}
            />
          </View>
        </View>
        <View style={styles.containerInputPass}>
          <Text
            style={{
              fontSize: 18,
              color: "#8e98f5",
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
              placeholder="Password"
            />
            <TouchableOpacity onPress={handleTogglePassword}>
              <Ionicons
                style={{
                  paddingTop: 5,
                }}
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="#7874f2"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.containerButton}>
          <TouchableOpacity style={styles.buttonSignIn}>
            <Text style={styles.buttonTextSignIn}>Sign In</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: "80%",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              paddingTop: 15,
            }}
          >
            Don't have an account?{" "}
          </Text>
          <TouchableOpacity
            style={{
              paddingTop: 15,
            }}
            onPress={() => {
              navigation.navigate("Register");
            }}
          >
            <Text
              style={{
                color: "#8e98f5",
                fontWeight: "bold",
              }}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;
