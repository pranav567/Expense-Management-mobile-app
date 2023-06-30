import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import app from "../firebaseConfig";
import { setLogoutModal } from "../store";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";
import { deleteAllTransaction, updateTransactionUserDetails } from "../queries";

const Header = (props) => {
  const db = SQLite.openDatabase("ExpenseManagement.db");
  // const logoutModal = useSelector((state) => state.logoutModal.logoutModal);
  //   console.log(cardProfileModal);
  const dispatch = useDispatch();

  const updateLogoutModal = () => {
    dispatch(setLogoutModal(true));
  };
  const navigation = useNavigation();
  const { headerTitle } = props; //values: home, add, profile

  const auth = getAuth(app);
  const handleLogout = () => {
    // try {
    //   await auth.signOut();
    //   navigation.replace("Login");
    //   // User has been logged out successfully
    //   // You can perform any necessary actions here
    // } catch (error) {
    //   // An error occurred while logging out
    //   // console.log(error);
    // }
    // updateLogoutModal();
  };

  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      backgroundColor: "white",
      top: 0,
      left: 0,
      right: 0,
      height: 68, // Adjust the height as per your requirement
      borderBottomRightRadius: 30,
      borderBottomLeftRadius: 30,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      padding: 15,
      paddingTop: 20,
      borderBottomWidth: 1,
      borderBottomColor: "#d3d6db",
    },
  });

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 20,
          marginTop: 5,
          marginLeft: 10,
          color: "#3d3931",
        }}
      >
        {headerTitle}
      </Text>
      <TouchableOpacity
        onPress={() => {
          // let storedId = await AsyncStorage.getItem("userId");
          // if (storedId !== null) {
          //   storedId = parseInt(storedId);
          //   await deleteAllTransaction(db, storedId);
          //   await updateTransactionUserDetails(db, 0, 0, storedId);
          //   console.log("hellp");
          // }
          updateLogoutModal();
        }}
      >
        <Ionicons
          style={{ marginTop: 2 }}
          name="power"
          size={25}
          color="#3d3931"
        />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
