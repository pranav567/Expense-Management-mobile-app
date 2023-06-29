import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Dimensions } from "react-native";
import * as SQLite from "expo-sqlite";

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import app from "../firebaseConfig";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

import { useSelector, useDispatch } from "react-redux";
import { setCardProfileModal } from "../store";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  checkUniqueIdExists,
  deleteCard,
  getCards,
  insertIntoCardDetails,
} from "../queries";
import { useNavigation } from "@react-navigation/native";

const cards = [
  {
    type: "bank",
    cardName: "Bank of Maharashtra",
    balance: 10000,
    uniqueId: "123456789",
  },
  {
    type: "travel",
    cardName: "bus",
    balance: 30,
    uniqueId: "xxx",
  },
  {
    type: "travel",
    cardName: "bus",
    balance: 3,
    uniqueId: "xxx",
  },
  {
    type: "travel",
    cardName: "train",
    balance: 35.2,
    uniqueId: "xxx",
  },
  {
    type: "travel",
    cardName: "metro",
    balance: 140,
    uniqueId: "xxx",
  },
];

const CardComponent = (props) => {
  const dispatch = useDispatch();

  const updateCardProfileModal = () => {
    dispatch(setCardProfileModal(props));
  };

  const windowWidth = Dimensions.get("window").width;
  const { type, cardName, uniqueId, balance } = props;
  // const [showId, setShowId] = useState(false);
  const styles = StyleSheet.create({
    cardContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      // backgroundColor: "yellow",
    },
    image: {
      marginTop: 5,
      marginLeft: 8,
      width: 50,
      height: 50,
      borderRadius: 20,
      marginRight: 15,
    },
    cardData: {
      flexDirection: "column",
      justifyContent: "space-evenly",

      marginRight: windowWidth < 405 ? 8 : 15,
    },
  });

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
      onPress={() => updateCardProfileModal()}
      style={styles.cardContainer}
    >
      {/* image box */}
      <Image source={handleImagePath(type, cardName)} style={styles.image} />
      <View style={styles.cardData}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={{
              fontSize: 15,
              width: 90,
              marginRight: 5,
              fontWeight: "bold",
            }}
          >
            Type{"  "}
            <Text
              style={{
                fontSize: 15,
                textTransform: "capitalize",
                fontWeight: "400",
              }}
            >
              {type[0]}
              <Text style={{ fontSize: 15, textTransform: "lowercase" }}>
                {type.slice(1)}
              </Text>
            </Text>
          </Text>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Name{"  "}
            <Text
              style={{
                fontSize: 15,
                textTransform: "capitalize",
                fontWeight: "400",
              }}
            >
              {cardName[0]}
              {cardName.slice(1).length > 4 ? (
                <Text style={{ fontSize: 15, textTransform: "lowercase" }}>
                  {cardName.slice(1, 3)}..
                </Text>
              ) : (
                <Text style={{ fontSize: 15, textTransform: "lowercase" }}>
                  {cardName.slice(1)}
                </Text>
              )}
              {/* <Text style={{ fontSize: 15, textTransform: "lowercase" }}>
                {cardName.slice(1)}
              </Text> */}
            </Text>
          </Text>
          {/* <Text style={{ fontSize: 15 }}>
            Id :{" "}
            {!showId
              ? "****"
              : uniqueId.length > 4
              ? `**${uniqueId.slice(uniqueId.length - 3)}`
              : uniqueId}{" "}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setShowId(!showId);
            }}
          >
            <Ionicons
              size={18}
              name={showId ? "eye-off-outline" : "eye-outline"}
              color="#3d3931"
              style={{ marginLeft: 20 }}
            />
          </TouchableOpacity> */}
        </View>

        <Text style={{ fontSize: 13, marginTop: 3 }}>
          <Text style={{ fontWeight: "bold" }}>Balance </Text> Rs. {balance}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const Cards = (props) => {
  const navigation = useNavigation();
  const db = SQLite.openDatabase("ExpenseManagement.db");
  const windowWidth = Dimensions.get("window").width;

  const [userId, setUserId] = useState("");
  const [cardsLen, setCardsLen] = useState(0);
  const [cardsData, setCardsData] = useState([]);
  const [newCard, setNewCard] = useState(false);
  const [selectedTypeofCard, setSelectedTypeofCard] = useState("bank");
  const [cardName, setCardName] = useState("");
  const [balance, setBalance] = useState("");
  const [cardId, setCardId] = useState("");

  const firestore = getFirestore(app);

  useEffect(() => {
    const setData = async () => {
      let storedId = await AsyncStorage.getItem("userId");
      if (storedId !== null) {
        storedId = parseInt(storedId);
        setUserId(storedId);

        // now set cards;
        await getCards(db, storedId)
          .then((result) => {
            setCardsData(result.cards);
          })
          .catch((err) => {
            Toast.show({
              type: "error",
              text1: "Database Error 0",
              position: "bottom",
              visibilityTime: 4000,
              autoHide: true,
            });
          });
      }
    };
    setData();
  }, []);

  // const paginate = async (num) => {
  //   let newNum = cardPaginationNumber;
  //   if (num == 1) {
  //     if (
  //       cardsLen % 5 == 0 &&
  //       cardPaginationNumber < Math.floor(cardsLen / 5)
  //     ) {
  //       setCardPaginationNumber(cardPaginationNumber + 1);
  //       newNum = newNum + 1;
  //     } else if (
  //       cardsLen % 5 !== 0 &&
  //       cardPaginationNumber < Math.ceil(cardsLen / 5)
  //     ) {
  //       setCardPaginationNumber(cardPaginationNumber + 1);
  //       newNum = newNum + 1;
  //     }
  //   } else if (num == -1 && cardPaginationNumber > 1) {
  //     setCardPaginationNumber(cardPaginationNumber - 1);
  //     newNum = newNum - 1;
  //   }

  //   if (newNum !== cardPaginationNumber) {
  //     await getCards(db, userId, newNum)
  //       .then((result) => {
  //         setCardsData(result.cards);
  //       })
  //       .catch((err) => {
  //         Toast.show({
  //           type: "error",
  //           text1: "Database Error1",
  //           position: "bottom",
  //           visibilityTime: 4000,
  //           autoHide: true,
  //         });
  //       });
  //   }
  // };

  const handleNewCard = async () => {
    // console.log(selectedTypeofCard, cardName, balance, cardId);
    if (
      selectedTypeofCard !== "" &&
      cardName !== "" &&
      balance !== "" &&
      cardId !== ""
    ) {
      let repeatedCard = false;
      // await deleteCard(db, userId, 0);
      await checkUniqueIdExists(db, userId, cardId)
        .then((res) => {
          repeatedCard = res;
        })
        .catch((err) => {});
      if (repeatedCard == false) {
        // add card
        // set pagination 1
        let cardAdded = false;
        await insertIntoCardDetails(
          db,
          userId,
          cardsData.length + 1,
          cardName,
          parseFloat(balance),
          cardId,
          selectedTypeofCard
        )
          .then((result) => {
            cardAdded = result;
          })
          .catch((err) => {
            cardAdded = null;
          });

        if (cardAdded !== null) {
          if (cardAdded == true) {
            let get = null;
            await getCards(db, userId)
              .then((result) => {
                get = result;
              })
              .catch((err) => {});
            if (get !== null) {
              setCardsData(get.cards);
              // setCardPaginationNumber(1);
              setNewCard(false);
              setCardId("");
              setCardName("");
              setBalance("");
              setSelectedTypeofCard("bank");
              Toast.show({
                type: "success",
                text1: "Card Added",
                position: "bottom",
                visibilityTime: 4000,
                autoHide: true,
              });
            } else {
              Toast.show({
                type: "error",
                text1: "Database Error2",
                position: "bottom",
                visibilityTime: 4000,
                autoHide: true,
              });
            }
          } else {
            Toast.show({
              type: "error",
              text1: "Database Error3",
              position: "bottom",
              visibilityTime: 4000,
              autoHide: true,
            });
          }
        } else {
          Toast.show({
            type: "error",
            text1: "Database Error4",
            position: "bottom",
            visibilityTime: 4000,
            autoHide: true,
          });
        }
      } else if (repeatedCard == true) {
        Toast.show({
          type: "error",
          text1: "Duplicate Details",
          text2: "Card already present!",
          position: "bottom",
          visibilityTime: 4000,
          autoHide: true,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Database Error5",
          position: "bottom",
          visibilityTime: 4000,
          autoHide: true,
        });
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Incomplete Details",
        text2: "Fill all the required Fields",
        position: "bottom",
        visibilityTime: 4000,
        autoHide: true,
      });
    }
  };

  const handleAmountChange = (text) => {
    // Remove non-numeric characters
    const numericValue = text.replace(/[^0-9.]/g, "");
    setBalance(numericValue);
  };

  const handleCardRemoval = async (obj) => {
    let deletedCard = null;
    await deleteCard(db, userId, obj.cardNum)
      .then((result) => {
        deletedCard = result;
      })
      .catch((err) => {});
    if (deletedCard == true) {
      await getCards(db, userId)
        .then((result) => {
          setCardsData(result.cards);
          // setCardPaginationNumber(1);
          Toast.show({
            type: "success",
            text1: "Card Deleted",
            position: "bottom",
            visibilityTime: 4000,
            autoHide: true,
          });
        })
        .catch((err) => {
          Toast.show({
            type: "error",
            text1: "Database Error6",
            position: "bottom",
            visibilityTime: 4000,
            autoHide: true,
          });
        });
    } else {
      Toast.show({
        type: "error",
        text1: "Database Error7",
        position: "bottom",
        visibilityTime: 4000,
        autoHide: true,
      });
    }
  };

  const styles = StyleSheet.create({
    cards: {
      width: "100%",
      // backgroundColor: "#d1f6c1",
      // backgroundColor: "white",
      // borderWidth: 1,
      // borderColor: "#d3d6db",
      // borderRadius: 10,
      padding: 20,
      justifyContent: "flex-start",
      // height: 400,
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
      marginTop: 5,
      flexDirection: "column",
      justifyContent: "flex-start",
      padding: 10,
      borderRadius: 20,
      // borderWidth: 0.2,
      backgroundColor: "white",
      paddingBottom: 25,
    },
    newCardHeader: {
      alignItems: "center",
    },
    cardType: {
      marginTop: 25,
    },
    cardTypePicker: {
      backgroundColor: "#F5F5F5",
      // outlineColor: "transparent",
      // borderWidth: 1,
      marginTop: 5,
      fontSize: 18,
    },
    cardComponent: {
      flexDirection: "row",
      // backgroundColor: "rgba(128, 128, 128, 0.1)",
      padding: 5,
      borderRadius: 10,
      justifyContent: "space-between",
      // marginBottom: 10,
      // borderBottomWidth: 1,
    },
  });

  return (
    <View style={styles.cards}>
      {/* <ModalComponent /> */}
      <View style={styles.header}>
        <Text style={[styles.headerContainerText, { width: "70%" }]}>
          Cards
        </Text>
        <TouchableOpacity
          onPress={() => {
            if (!newCard) setNewCard(true);
          }}
        >
          <Ionicons name="add-circle-outline" color="#ff7575" size={30} />
        </TouchableOpacity>
        <Ionicons name="card" color="#ff7575" size={30} />
      </View>
      {newCard ? (
        <View style={styles.fieldsSaved}>
          <View style={styles.newCardHeader}>
            <Text style={{ fontSize: 22 }}>New Card Details</Text>
          </View>
          <View
            style={[
              styles.cardType,
              {
                marginTop: 20,
              },
            ]}
          >
            <Text style={{ fontSize: 15, color: "#393e46" }}>
              Pick a Card Type <Text style={{ color: "red" }}>*</Text>
            </Text>
            <Picker
              style={styles.cardTypePicker}
              selectedValue={selectedTypeofCard}
              onValueChange={(itemValue) => {
                if (itemValue == "travel") setCardName("metro");
                else setCardName("");
                setSelectedTypeofCard(itemValue);
              }}
            >
              <Picker.Item label="Bank Card" value="bank" />
              <Picker.Item label="Travel Card" value="travel" />
              <Picker.Item label="Other (eg: e-wallets)" value="other" />
            </Picker>
          </View>
          {selectedTypeofCard == "bank" ? (
            <View
              style={[
                styles.cardType,
                {
                  paddingBottom: 5,
                  borderBottomWidth: 1,
                },
              ]}
            >
              <Text style={{ fontSize: 15, color: "#393e46" }}>
                Enter Bank Name <Text style={{ color: "red" }}>*</Text>
              </Text>
              <TextInput
                style={{
                  marginTop: 10,
                  marginLeft: 5,
                }}
                value={cardName}
                placeholder="Enter Bank Name"
                onChangeText={setCardName}
              />
            </View>
          ) : selectedTypeofCard == "travel" ? (
            <View style={styles.cardType}>
              <Text style={{ fontSize: 15, color: "#393e46" }}>
                Select Transport
              </Text>
              <Picker
                style={styles.cardTypePicker}
                selectedValue={cardName}
                onValueChange={(itemValue) => {
                  setCardName(itemValue);
                }}
              >
                <Picker.Item label="Metro" value="metro" />
                <Picker.Item label="Bus" value="bus" />
                <Picker.Item label="Train" value="train" />
                <Picker.Item label="Other" value="other" />
                <Picker.Item label="Common" value="common" />
              </Picker>
            </View>
          ) : (
            <View
              style={[
                styles.cardType,
                {
                  paddingBottom: 5,
                  borderBottomWidth: 1,
                },
              ]}
            >
              <Text style={{ fontSize: 15, color: "#393e46" }}>
                Enter Card Name <Text style={{ color: "red" }}>*</Text>
              </Text>
              <TextInput
                style={{ marginTop: 10, marginLeft: 5 }}
                value={cardName}
                placeholder="Enter Card Name"
                onChangeText={setCardName}
              />
            </View>
          )}
          <View
            style={[
              styles.cardType,
              {
                paddingBottom: 5,
                borderBottomWidth: 1,
              },
            ]}
          >
            <Text style={{ fontSize: 15, color: "#393e46" }}>
              Enter Balance <Text style={{ color: "red" }}>*</Text>
            </Text>
            <View style={{ flexDirection: "row" }}>
              {/* <Image
                source={require("../assets/rupee.png")}
                style={{
                  width: 24,
                  height: 30,
                  marginTop: 15,
                }}
              /> */}
              <TextInput
                style={{
                  marginTop: 10,
                  marginLeft: 5,
                  // outlineColor: "transparent",
                }}
                value={balance}
                keyboardType="numeric"
                maxLength={15}
                placeholder="Enter Balance"
                onChangeText={handleAmountChange}
              />
            </View>
          </View>
          <View
            style={[
              styles.cardType,
              {
                paddingBottom: 5,
                borderBottomWidth: 1,
              },
            ]}
          >
            <Text style={{ fontSize: 15, color: "#393e46" }}>
              Enter Card Id <Text style={{ color: "red" }}>*</Text>
              {/* <TouchableOpacity
                onPress={() => {
                  handleInfoToast();
                }}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="red"
                />
              </TouchableOpacity> */}
            </Text>
            <TextInput
              style={{
                marginTop: 10,
                marginLeft: 5,
                // outlineColor: "transparent",
              }}
              value={cardId}
              keyboardType="numeric"
              maxLength={20}
              placeholder="Enter Card Id "
              onChangeText={setCardId}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginTop: 25,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setNewCard(false);
              }}
              style={{
                width: "25%",
                // backgroundColor: "#ff7575",
                borderWidth: 1,
                borderColor: "red",
                borderRadius: 30,
                height: 30,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 15, color: "red" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleNewCard();
              }}
              style={{
                width: "25%",
                // backgroundColor: "#ff7575",
                borderWidth: 1,
                borderColor: "#393e46",
                borderRadius: 30,
                height: 30,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 15, color: "#393e46" }}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : cardsData.length == 0 ? (
        <View
          style={{
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 18 }}>No Cards Added !!</Text>
        </View>
      ) : (
        <View>
          {cardsData.map((obj, id) => (
            <View key={id}>
              <View
                style={[styles.cardComponent, { marginTop: id == 0 ? 15 : 0 }]}
              >
                <CardComponent
                  type={obj.type}
                  cardName={obj.cardName}
                  uniqueId={obj.uniqueId}
                  balance={obj.balance}
                />
                {windowWidth < 405 ? (
                  <TouchableOpacity
                    style={{ marginTop: 20, marginRight: 35 }}
                    onPress={() => {
                      handleCardRemoval(obj);
                    }}
                  >
                    <Ionicons
                      name="trash-bin-outline"
                      color="#3d3931"
                      size={24}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{ marginTop: 20, marginRight: 35 }}
                    onPress={() => {
                      handleCardRemoval(obj);
                    }}
                  >
                    <Ionicons
                      name="trash-bin-outline"
                      color="#3d3931"
                      size={24}
                    />
                  </TouchableOpacity>
                )}
              </View>
              {id >= 0 && id < cardsData.length - 1 ? (
                <View
                  style={{
                    borderBottomWidth: 1,
                    // width: "60%",
                    borderBottomColor: "#d4d4d6",
                    margin: 20,
                    marginRight: 30,
                    marginLeft: 30,
                    alignContent: "center",
                  }}
                ></View>
              ) : (
                <></>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default Cards;
