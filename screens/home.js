import { Image, StyleSheet, Text, View } from "react-native";

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Hello </Text>
      <Image source={require("../assets/heart.jpg")} style={styles.image} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 22,
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
});

export default Home;
