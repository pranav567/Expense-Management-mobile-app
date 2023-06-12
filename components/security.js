import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";

const Security = () => {
  const [name, setName] = useState("Pranav Nair");
  const [email, setEmail] = useState("pranavpn7@gmail.com");

  const styles = StyleSheet.create({
    personal: {
      width: "100%",
      marginTop: 40,
      // backgroundColor: "#ffcccc",
      backgroundColor: "white",
      borderWidth: 1,
      borderColor: "#d3d6db",
      borderRadius: 10,
      padding: 20,
      justifyContent: "flex-start",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      height: 40,
    },
    headerContainerText: {
      fontSize: 25,
    },
    fieldsSaved: {
      flexDirection: "column",
      justifyContent: "flex-start",
      padding: 10,
    },
  });

  return (
    <View style={styles.personal}>
      <View style={styles.header}>
        <Text style={styles.headerContainerText}>Security</Text>
        <Ionicons name="shield-checkmark" color="#69c181" size={30} />
      </View>
      <View style={styles.fieldsSaved}>
        <Text>Soon!!</Text>
      </View>
    </View>
  );
};

export default Security;
