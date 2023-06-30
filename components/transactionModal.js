import { StyleSheet, View, TouchableOpacity, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useSelector, useDispatch } from "react-redux";
import { setTransactionModal } from "../store";
import moment from "moment";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
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
  body1: { flexDirection: "row", marginTop: 15 },
  innerBody: {
    marginLeft: 20,
    flexDirection: "column",
    justifyContent: "center",
  },
  balance: {
    flexDirection: "row",
  },
  cardId: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
});

const TransactionModal = () => {
  const transactionModal = useSelector(
    (state) => state.transactionModal.transactionModal
  );
  //   console.log(cardProfileModal);
  const dispatch = useDispatch();

  const updateTransactionModal = () => {
    dispatch(setTransactionModal(null));
  };

  const handleImagePath = (type) => {
    let imagePath = "";
    if (type == "Bank") imagePath = require("../assets/bank.png");
    else if (type == "Transportation") {
      let imgObj = {
        1: require("../assets/metro.png"),
        2: require("../assets/bus.png"),
        3: require("../assets/train.png"),
      };
      imagePath = imgObj[Math.floor(Math.random() * 3) + 1];
    } else imagePath = require("../assets/randomCard.png");

    return imagePath;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        updateTransactionModal();
      }}
    >
      <View style={styles.cardContainer}>
        <View style={styles.header}>
          <Text
            style={{
              color:
                transactionModal.transactionType == "Received"
                  ? "#2dea8f"
                  : transactionModal.transactionType == "Spent"
                  ? "#f85f73"
                  : "#51adcf",
              fontSize: 20,
              fontWeight: "bold",
              textTransform: "capitalize",
            }}
          >
            <Text>
              {transactionModal.transactionType == "Received"
                ? "+ "
                : transactionModal.transactionType == "Spent"
                ? "- "
                : ""}
            </Text>
            Rs. {transactionModal.amount}
          </Text>
        </View>
        <View style={styles.body1}>
          <Image
            source={handleImagePath(transactionModal.description)}
            style={{ width: 60, borderRadius: 10, height: 60 }}
          />
          <View style={styles.innerBody}>
            <View style={styles.type}></View>
            <View style={styles.balance}>
              <Text
                style={{
                  color: "#393e46",
                  width: "50%",
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
                {transactionModal.transactionType == "Internal Transfer"
                  ? "Int. Transfer"
                  : transactionModal.transactionType}
              </Text>
            </View>
            <View style={styles.balance}>
              <Text
                style={{
                  color: "#393e46",
                  width: "50%",
                  fontWeight: "bold",
                  fontSize: 15,
                }}
              >
                Date
              </Text>
              <Text
                style={{ color: "#393e46", marginLeft: 10, marginRight: 5 }}
              >
                {transactionModal.date}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.cardId}>
          <Text
            style={{
              color: "#393e46",
              width: "45%",
              fontWeight: "bold",
              fontSize: 17,
            }}
          >
            Description
          </Text>
          <Text style={{ color: "#393e46", fontSize: 17 }}>
            {transactionModal.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TransactionModal;
