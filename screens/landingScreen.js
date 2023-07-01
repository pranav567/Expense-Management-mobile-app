import {
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as SQLite from "expo-sqlite";
import { useSelector, useDispatch } from "react-redux";
import SecurityPin from "../components/securityPin";
import { setSecurityCode } from "../store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkTableExists, deleteAllTables } from "../queries";

const LandingScreen = ({ navigation }) => {
  const securityCode = useSelector((state) => state.securityCode.securityCode);
  const dispatch = useDispatch();

  const nextPage = async () => {
    try {
      const db = SQLite.openDatabase("ExpenseManagement.db");
      // await deleteAllTables(db);
      const pin = await AsyncStorage.getItem("storedPin");
      const lockApp = await AsyncStorage.getItem("lockApp");
      if (pin == null || lockApp == null || lockApp == "0") {
        let tableExists = false;
        await checkTableExists(db, "userDetails")
          .then((res) => {
            tableExists = res;
          })
          .catch((err) => {});

        if (tableExists) navigation.navigate("Login");
        else navigation.navigate("Register");
      } else {
        dispatch(setSecurityCode(true));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => {
          nextPage();
        }}
      >
        <Image source={require("../assets/logo.png")} style={styles.image} />
      </TouchableWithoutFeedback>
      {securityCode ? <SecurityPin /> : <></>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  image: {
    width: 160,
    height: 160,
  },
});

export default LandingScreen;
