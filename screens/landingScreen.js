import {
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const LandingScreen = ({ navigation }) => {
  return (
    // <TouchableWithoutFeedback onPress={() => navigation.navigate("Login")}>
    <TouchableWithoutFeedback>
      <View style={styles.container}>
        <Image source={require("../assets/logo.png")} style={styles.image} />
      </View>
    </TouchableWithoutFeedback>
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
