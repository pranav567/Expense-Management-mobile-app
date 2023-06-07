import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";

const PersonalData = () => {
  const [saveButtonDisplay, setSaveButtonDisplay] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

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
    },
  });

  return (
    <View style={styles.personal}>
      <View style={styles.header}>
        <Text style={styles.headerContainerText}>Personal Data</Text>
        {saveButtonDisplay ? (
          <TouchableOpacity
            onPress={() => {
              setSaveButtonDisplay(false);
            }}
          >
            <Ionicons name="save" color="#a7cd78" size={30} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setSaveButtonDisplay(true);
            }}
          >
            <Ionicons name="create" color="#ff9f68" size={30} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.fieldsSaved}>
        {saveButtonDisplay ? (
          <></>
        ) : (
          <>
            <View style={styles.fields}>
              <Text
                style={[
                  styles.fieldKeyValue,
                  { fontWeight: "bold", width: 65 },
                ]}
              >
                Name
              </Text>
              <Text style={styles.fieldKeyValue}>Pranav Nair</Text>
            </View>
            <View style={styles.fields}>
              <Text
                style={[
                  styles.fieldKeyValue,
                  { fontWeight: "bold", width: 65 },
                ]}
              >
                Email
              </Text>
              <Text style={styles.fieldKeyValue}>pranavpn7@gmail.com</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default PersonalData;
