import { useState } from "react";
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

const Register = ({ navigation }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const styles = StyleSheet.create({
    containerOuter: {
      flex: 1,
      backgroundColor: "#b1cbfa",
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
      borderBottomColor: "#7874f2",
    },
    containerInputUsername: {
      paddingTop: 25,
      paddingBottom: 5,
      width: "80%",
      borderBottomWidth: 1,
      borderBottomColor: "#7874f2",
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
      paddingTop: 60,
      alignItems: "center",
    },
    buttonRegister: {
      width: "40%",
      height: 40,
      backgroundColor: "#8e98f5",
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
          <View style={styles.containerDetails}>
            <Text
              style={{
                fontSize: 18,
                color: "#8e98f5",
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
                color: "#8e98f5",
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
                color={email !== "" ? "green" : "red"}
              />
            </View>
          </View>
          <View style={styles.containerInputUsername}>
            <Text
              style={{
                fontSize: 18,
                color: "#8e98f5",
              }}
            >
              Mobile Number
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={
                  Platform.OS == "web" ? styles.webUsername : styles.username
                }
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
          </View>
          <View
            style={[
              styles.containerInputPass,
              { borderBottomColor: validPassword ? "green" : "gray" },
            ]}
          >
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
                placeholder="Enter Password"
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
                color: "#8e98f5",
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
                  color="#7874f2"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.containerButton}>
            <TouchableOpacity
              style={styles.buttonRegister}
              onPress={() => {
                navigation.navigate("AddExpense");
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
                  color: "#8e98f5",
                  fontWeight: "bold",
                }}
              >
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {/* <View style={styles.headers}>
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
        <View style={styles.containerDetails}>
          <Text
            style={{
              fontSize: 18,
              color: "#8e98f5",
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
              color: "#8e98f5",
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
              color={email !== "" ? "green" : "red"}
            />
          </View>
        </View>
        <View style={styles.containerInputUsername}>
          <Text
            style={{
              fontSize: 18,
              color: "#8e98f5",
            }}
          >
            Mobile Number
          </Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={
                Platform.OS == "web" ? styles.webUsername : styles.username
              }
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
        </View>
        <View
          style={[
            styles.containerInputPass,
            { borderBottomColor: validPassword ? "green" : "gray" },
          ]}
        >
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
              placeholder="Enter Password"
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
              color: "#8e98f5",
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
                color="#7874f2"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.containerButton}>
          <TouchableOpacity
            style={styles.buttonRegister}
            onPress={() => {
              navigation.navigate("AddExpense");
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
                color: "#8e98f5",
                fontWeight: "bold",
              }}
            >
              Sign In
            </Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </View>
  );
};

export default Register;
