import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

const BottomNavigator = (props) => {
  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      backgroundColor: "white",
      bottom: 0,
      left: 0,
      right: 0,
      height: 60, // Adjust the height as per your requirement
      borderTopRightRadius: 30,
      borderTopLeftRadius: 30,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      borderTopWidth: 1,
      borderTopColor: "#d3d6db",
    },
    button: {
      height: "100%",
      justifyContent: "center",
    },
  });

  const navigation = useNavigation();
  const { buttonActive } = props; //values: home, add, profile
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            borderTopWidth: buttonActive == "home" ? 3 : 0,
          },
        ]}
        onPress={() => {
          navigation.navigate("Home");
        }}
      >
        <Ionicons
          // style={{
          //   paddingTop: 5,
          // }}
          name={buttonActive == "home" ? "home" : "home-outline"}
          // size={buttonActive == "home" ? 35 : 25}
          size={25}
          color="#393e46"
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          {
            borderTopWidth: buttonActive == "add" ? 3 : 0,
          },
        ]}
        onPress={() => {
          navigation.navigate("AddTransaction");
        }}
      >
        <Ionicons
          // style={{
          //   paddingTop: 5,
          // }}
          // name="add-circle-outline"
          name={buttonActive == "add" ? "add-circle" : "add-circle-outline"}
          // size={buttonActive == "add" ? 45 : 30}
          size={30}
          color="#393e46"
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          {
            borderTopWidth: buttonActive == "profile" ? 3 : 0,
          },
        ]}
        onPress={() => {
          navigation.navigate("Profile");
        }}
      >
        <Ionicons
          // style={{
          //   paddingTop: 5,
          // }}
          name={buttonActive == "profile" ? "person" : "person-outline"}
          // size={buttonActive == "profile" ? 35 : 25}
          size={25}
          color="#393e46"
        />
      </TouchableOpacity>
    </View>
  );
};
//fde9df

export default BottomNavigator;
