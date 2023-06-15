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
import StatsComponent from "../components/statsComponent";
import { useEffect } from "react";
import { useState } from "react";
import app from "../firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  limit,
  getDocs,
} from "firebase/firestore";
import TransactionModal from "../components/transactionModal";
import LogoutModal from "../components/logoutModal";
import { useSelector, useDispatch } from "react-redux";

const Home = ({ navigation }) => {
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const [docId, setDocId] = useState("2RCyQzRdleBR2PTs24jG");
  const transactionModal = useSelector(
    (state) => state.transactionModal.transactionModal
  );
  const logoutModal = useSelector((state) => state.logoutModal.logoutModal);
  // console.log(logoutModal);

  // useEffect(() => {
  //   async function storeData() {
  //     let uid = "";
  //     try {
  //       await new Promise((resolve, reject) => {
  //         onAuthStateChanged(auth, (user) => {
  //           if (user) {
  //             uid = user.uid;
  //             resolve();
  //           } else {
  //             navigation.navigate("Login");
  //             reject();
  //           }
  //         });
  //       });

  //       const usersCollectionRef = collection(firestore, "users");
  //       const queryDoc = query(
  //         usersCollectionRef,
  //         where("uid", "==", uid),
  //         limit(1)
  //       );

  //       const querySnapshot = await getDocs(queryDoc);

  //       if (!querySnapshot.empty) {
  //         const doc = querySnapshot.docs[0];
  //         // Handle the matching document
  //         const dataUser = doc.data();
  //         setDocId(doc.id);
  //       } else {
  //         navigation.navigate("Login");
  //       }
  //     } catch (error) {
  //       navigation.navigate("Login");
  //     }
  //   }

  //   storeData();
  // }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    image: {
      width: 160,
      height: 160,
    },
    innerContainer: {
      // margin: 30,
      marginTop: 90,
      height: "78%",
      // marginBottom: 60,
      backgroundColor: "white",
      borderRadius: 20,
    },
  });
  return (
    <View style={styles.container}>
      <Header headerTitle="Home" />
      <View style={styles.innerContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: "column" }}>
            {docId !== "" ? <StatsComponent docId={docId} /> : <></>}
            {docId !== "" ? <RecentTransactions docId={docId} /> : <></>}
          </View>
        </ScrollView>
      </View>
      <BottomNavigator buttonActive="home" />
      {transactionModal !== null ? <TransactionModal /> : <></>}
      {logoutModal ? <LogoutModal /> : <></>}
    </View>
  );
};

export default Home;
