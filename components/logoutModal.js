import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
  Text,
  Image,
} from "react-native";
import * as SQLite from "expo-sqlite";
import Toast from "react-native-toast-message";
import { useNavigation, StackActions } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import app from "../firebaseConfig";
// import ExpoBlurView from "expo-blur";

import { Ionicons } from "@expo/vector-icons";

import { useSelector, useDispatch } from "react-redux";
import { setLogoutModal } from "../store";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    padding: 20,
    flexDirection: "column",
    justifyContent: "center",
    borderRadius: 10,
  },
  header: { alignItems: "center" },
  body1: { flexDirection: "row", justifyContent: "center" },
  cardId: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
});

const LogoutModal = () => {
  const navigation = useNavigation();

  const auth = getAuth(app);
  const logoutModal = useSelector((state) => state.logoutModal.logoutModal);
  //   console.log(cardProfileModal);
  const dispatch = useDispatch();

  const updateLogoutModal = () => {
    dispatch(setLogoutModal(false));
  };

  // const handleLogout = async () => {
  //   try {
  //     await auth.signOut();
  //     dispatch(setLogoutModal(false));
  //     navigation.replace("Login");
  //     // User has been logged out successfully
  //     // You can perform any necessary actions here
  //   } catch (error) {
  //     dispatch(setLogoutModal(false));

  //     // An error occurred while logging out
  //     // console.log(error);
  //   }
  // };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userId");
      navigation.dispatch(StackActions.popToTop());
      navigation.navigate("Login");
      dispatch(setLogoutModal(false));
    } catch (error) {
      dispatch(setLogoutModal(false));
      Toast.show({
        type: "error",
        text1: "Something went wrong!",
        text2: "Try again later!",
        position: "bottom",
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };

  return (
    <View
      style={styles.container}
      //   onPress={() => {
      //     updateCardProfileModal();
      //   }}
    >
      {/* <ImageBackground source={require("../assets/blur.png")}> */}
      <View style={styles.cardContainer}>
        {/* <View style={styles.header}>
          <Text
            style={{
              color: "#393e46",
              fontSize: 20,
            }}
          >
            Logout
          </Text>
        </View> */}
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
            Are you sure you want to logout?
          </Text>
        </View>
        <View style={styles.cardId}>
          <TouchableOpacity
            style={{
              backgroundColor: "#f5f5f5",
              width: 70,
              alignItems: "center",
              padding: 5,
              borderWidth: 1,
              borderColor: "#393e46",
              borderRadius: 20,
            }}
            onPress={() => updateLogoutModal()}
          >
            <Text>No</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#f5f5f5",
              width: 70,
              alignItems: "center",
              padding: 5,
              borderWidth: 1,
              borderColor: "#393e46",
              borderRadius: 20,
            }}
            onPress={() => handleLogout()}
          >
            <Text>Yes</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* </ImageBackground> */}
    </View>
  );
};

export default LogoutModal;
