import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import app from "../firebaseConfig";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    backgroundColor: "white",
    top: 0,
    left: 0,
    right: 0,
    height: 70, // Adjust the height as per your requirement
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 15,
    paddingTop: 28,
  },
});

const Header = (props) => {
  const navigation = useNavigation();
  const { headerTitle } = props; //values: home, add, profile

  const auth = getAuth(app);
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.replace("Login");
      // User has been logged out successfully
      // You can perform any necessary actions here
    } catch (error) {
      // An error occurred while logging out
      // console.log(error);
    }
  };
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
      <TouchableOpacity onPress={() => handleLogout()}>
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
