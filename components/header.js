import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

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
      <Ionicons
        style={{ marginTop: 2 }}
        name="power"
        size={25}
        color="#3d3931"
      />
    </View>
  );
};

export default Header;
