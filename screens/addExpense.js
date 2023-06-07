import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import BottomNavigator from "../components/bottomNavigator";

const AddExpense = ({ navigation }) => {
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
    scroll: {
      marginTop: 30,
      marginBottom: 60,
    },
  });
  return (
    <View style={styles.container}>
      <BottomNavigator buttonActive="add" />
    </View>
  );
};

export default AddExpense;
