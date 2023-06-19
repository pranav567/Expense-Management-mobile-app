import {
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import SecurityPin from "../components/securityPin";
import { setSecurityCode } from "../store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LandingScreen = ({ navigation }) => {
  const securityCode = useSelector((state) => state.securityCode.securityCode);
  const lockApp = useSelector((state) => state.lockApp.lockApp);
  const dispatch = useDispatch();

  const nextPage = async () => {
    try {
      const pin = await AsyncStorage.getItem("storedPin");
      if (pin == null || !lockApp) {
        navigation.navigate("Login");
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
  },
  image: {
    width: 160,
    height: 160,
  },
});

export default LandingScreen;
