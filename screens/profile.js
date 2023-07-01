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
import PersonalData from "../components/personalData";
import Cards from "../components/cards";
import Security from "../components/security";
import CardModal from "../components/cardModal";
// import SecurityPin from "../components/securityPin";
import LogoutModal from "../components/logoutModal";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";

const Profile = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [docid, setDocid] = useState("");

  const cardProfileModal = useSelector(
    (state) => state.cardProfileModal.cardProfileModal
  );
  const logoutModal = useSelector((state) => state.logoutModal.logoutModal);
  // const securityCode = useSelector((state) => state.securityCode.securityCode);
  // console.log(cardProfileModal);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    contentContainer: {
      flex: 1,
      justifyContent: "flex-start",
      width: "90%",
      marginTop: 90,
      marginBottom: 80,
      borderRadius: 20,
      backgroundColor: "white",
      borderWidth: 1,
      borderColor: "#d3d6db",
    },
    security: {},
    cards: {},
    headerContainerText: {
      fontSize: 25,
      height: 40,
    },
  });
  return (
    <View style={styles.container}>
      <Header headerTitle="Profile" />
      <View style={styles.contentContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: 0,
            margin: 0,
            width: "100%",
          }}
        >
          <PersonalData />
          <View
            style={{
              borderTopWidth: 1,
              margin: 20,
              borderTopColor: "#d4d4d6",
              // width: "60%",
            }}
          ></View>
          <Cards />
          <View
            style={{
              borderTopWidth: 1,
              margin: 20,
              borderTopColor: "#d4d4d6",
              // width: "60%",
            }}
          ></View>
          <Security />
          <View
            style={{
              borderTopWidth: 1,
              margin: 20,
              borderTopColor: "#d4d4d6",
              // width: "60%",
            }}
          ></View>
        </ScrollView>
      </View>
      <BottomNavigator buttonActive="profile" />
      {cardProfileModal !== null ? <CardModal /> : <></>}
      {logoutModal ? <LogoutModal /> : <></>}
      {/* {!securityCode ? <SecurityPin /> : <></>} */}
    </View>
  );
};

export default Profile;
