import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";

const PersonalData = () => {
  const [name, setName] = useState("Pranav Nair");
  const [email, setEmail] = useState("pranavpn7@gmail.com");

  const styles = StyleSheet.create({
    personal: {
      width: "100%",
      backgroundColor: "#daeaf6",
      borderRadius: 30,
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
    fields: {
      flexDirection: "row",
      justifyContent: "flex-start",
    },
    fieldKeyValue: {
      fontSize: 18,
      flexWrap: "wrap",
    },
  });

  return (
    <View style={styles.personal}>
      <View style={styles.header}>
        <Text style={styles.headerContainerText}>Personal Data</Text>
        <Ionicons name="person" color="#ff9f68" size={30} />
      </View>
      <View style={styles.fieldsSaved}>
        <View style={styles.fields}>
          <View style={{ width: 65 }}>
            <Text style={[styles.fieldKeyValue, { fontWeight: "bold" }]}>
              Name
            </Text>
          </View>

          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={styles.fieldKeyValue}
          >
            {name}
          </Text>
        </View>
        <View style={[styles.fields, { marginTop: 15 }]}>
          <View style={{ width: 65 }}>
            <Text style={[styles.fieldKeyValue, { fontWeight: "bold" }]}>
              Email
            </Text>
          </View>

          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={styles.fieldKeyValue}
          >
            {email}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PersonalData;
