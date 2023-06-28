import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
  Text,
  Image,
} from "react-native";
// import ExpoBlurView from "expo-blur";

import { Ionicons } from "@expo/vector-icons";

import { useSelector, useDispatch } from "react-redux";
import { setCardProfileModal } from "../store";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    // backfaceVisibility: "hidden",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    backgroundColor: "white",
    width: "75%",
    padding: 20,
    flexDirection: "column",
    justifyContent: "center",
    borderRadius: 10,
  },
  header: { alignItems: "center" },
  body1: { flexDirection: "row", marginTop: 20 },
  innerBody: {
    marginLeft: 20,
    flexDirection: "column",
    justifyContent: "center",
  },
  balance: { flexDirection: "row" },
  cardId: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
});

const CardModal = () => {
  const cardProfileModal = useSelector(
    (state) => state.cardProfileModal.cardProfileModal
  );
  //   console.log(cardProfileModal);
  const dispatch = useDispatch();

  const updateCardProfileModal = () => {
    dispatch(setCardProfileModal(null));
  };

  const handleImagePath = (type, cardName) => {
    let imagePath = "";
    if (type == "bank") imagePath = require("../assets/bank.png");
    else if (type == "travel") {
      if (cardName == "metro") imagePath = require("../assets/metro.png");
      else if (cardName == "bus") imagePath = require("../assets/bus.png");
      else if (cardName == "train") imagePath = require("../assets/train.png");
      else imagePath = require("../assets/randomCard.png");
    } else imagePath = require("../assets/randomCard.png");

    return imagePath;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        updateCardProfileModal();
      }}
    >
      {/* <ImageBackground source={require("../assets/blur.png")}> */}
      <View style={styles.cardContainer}>
        <View style={styles.header}>
          <Text
            style={{
              color: "#393e46",
              fontSize: 20,
              textTransform: "capitalize",
            }}
          >
            {cardProfileModal.cardName}
          </Text>
        </View>
        <View style={styles.body1}>
          <Image
            source={handleImagePath(
              cardProfileModal.type,
              cardProfileModal.cardName
            )}
            style={{ width: 60, borderRadius: 10, height: 60 }}
          />
          <View style={styles.innerBody}>
            <View style={styles.type}></View>
            <View style={styles.balance}>
              <Text
                style={{
                  color: "#393e46",
                  width: "40%",
                  fontWeight: "bold",
                  fontSize: 15,
                }}
              >
                Type
              </Text>
              <Text
                style={{
                  color: "#393e46",
                  marginLeft: 10,
                  textTransform: "capitalize",
                }}
              >
                {cardProfileModal.type}
              </Text>
            </View>
            <View style={styles.balance}>
              <Text
                style={{
                  color: "#393e46",
                  width: "40%",
                  fontWeight: "bold",
                  fontSize: 15,
                }}
              >
                Balance
              </Text>
              <Text
                style={{ color: "#393e46", marginLeft: 10, marginRight: 5 }}
              >
                Rs.
              </Text>
              <Text style={{ color: "#393e46" }}>
                {cardProfileModal.balance}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.cardId}>
          <Text
            style={{
              color: "#393e46",
              width: "15%",
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            Id
          </Text>
          <Text style={{ color: "#393e46", fontSize: 18 }}>
            {cardProfileModal.uniqueId}
          </Text>
        </View>
      </View>
      {/* </ImageBackground> */}
    </TouchableOpacity>
  );
};

export default CardModal;
