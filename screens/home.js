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
import RecentTransactions from "../components/recentTransactions";

const Home = ({ navigation }) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      // justifyContent: "center",
      // alignItems: "center",
    },
    image: {
      width: 160,
      height: 160,
    },
    innerContainer: {
      marginTop: 90,
      marginBottom: 60,
    },
  });
  return (
    <View style={styles.container}>
      <Header headerTitle="Home" />
      <View style={styles.innerContainer}>
        <RecentTransactions />
      </View>
      <BottomNavigator buttonActive="home" />
    </View>
  );
};

export default Home;
