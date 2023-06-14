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
import { useSelector, useDispatch } from "react-redux";

const AllTransactions = ({ navigation }) => {
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const [transactions, setTransactions] = useState([]);
  const transactionModal = useSelector(
    (state) => state.transactionModal.transactionModal
  );

  const getFormattedDate = (dateObj) => {
    const transactionDate = dateObj.toDate();
    const day = String(transactionDate.getDate()).padStart(2, "0");
    const month = String(transactionDate.getMonth() + 1).padStart(2, "0");
    const year = String(transactionDate.getFullYear());

    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
    // Get current time
    // const hours = String(transactionDate.getHours() % 12 || 12).padStart(2, "0");
    // const minutes = String(transactionDate.getMinutes()).padStart(2, "0");
    // const meridiem = transactionDate.getHours() >= 12 ? "PM" : "AM";

    // const formattedTime = `${hours}:${minutes} ${meridiem}`;
  };

  useEffect(() => {
    async function storeData() {
      let uid = "";
      try {
        await new Promise((resolve, reject) => {
          onAuthStateChanged(auth, (user) => {
            if (user) {
              uid = user.uid;
              resolve();
            } else {
              navigation.navigate("Login");
              reject();
            }
          });
        });

        const usersCollectionRef = collection(firestore, "users");
        const queryDoc = query(
          usersCollectionRef,
          where("uid", "==", uid),
          limit(1)
        );

        const querySnapshot = await getDocs(queryDoc);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          // Handle the matching document
          const dataUser = doc.data();
          setTransactions(dataUser.transactions);
          //   setDocId(doc.id);
        } else {
          navigation.navigate("Login");
        }
      } catch (error) {
        navigation.navigate("Login");
      }
    }

    storeData();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    image: {
      width: 160,
      height: 160,
    },
    innerContainer: {
      margin: 20,
      marginTop: 90,
      marginBottom: 60,
      backgroundColor: "white",
      borderRadius: 20,
    },
  });
  return (
    <View style={styles.container}>
      {/* <Header headerTitle="AllTransactions" /> */}
      <View style={styles.innerContainer}>
        {/* {docId !== "" ? <RecentTransactions docId={docId} /> : <></>} */}
        <Text>Hello</Text>
      </View>
      <BottomNavigator buttonActive="none" />
      {transactionModal !== null ? <TransactionModal /> : <></>}
    </View>
  );
};

export default AllTransactions;
