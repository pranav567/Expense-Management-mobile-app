import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import BottomNavigator from "../components/bottomNavigator";
import Header from "../components/header";

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
      marginTop: 90,
      marginBottom: 60,
    },
  });
  return (
    <View style={styles.container}>
      <Header headerTitle="Add Expense" />
      <BottomNavigator buttonActive="add" />
    </View>
  );
};

export default AddExpense;
