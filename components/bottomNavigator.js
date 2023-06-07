import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    backgroundColor: "#8e98f5",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60, // Adjust the height as per your requirement
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});

const BottomNavigator = (props) => {
  const navigation = useNavigation();
  const { buttonActive } = props; //values: home, add, profile
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Home");
        }}
      >
        <Ionicons
          // style={{
          //   paddingTop: 5,
          // }}
          name="home"
          size={buttonActive == "home" ? 35 : 25}
          color={buttonActive == "home" ? "#fde9df" : "white"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("AddExpense");
        }}
      >
        <Ionicons
          // style={{
          //   paddingTop: 5,
          // }}
          name="add"
          size={buttonActive == "add" ? 50 : 40}
          color={buttonActive == "add" ? "#fde9df" : "white"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Profile");
        }}
      >
        <Ionicons
          // style={{
          //   paddingTop: 5,
          // }}
          name="person"
          size={buttonActive == "profile" ? 35 : 25}
          color={buttonActive == "profile" ? "#fde9df" : "white"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavigator;
