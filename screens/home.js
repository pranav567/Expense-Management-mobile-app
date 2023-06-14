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

const Home = ({ navigation }) => {
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const [docId, setDocId] = useState("");

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
          setDocId(doc.id);
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
      marginTop: 90,
      marginBottom: 60,
    },
  });
  return (
    <View style={styles.container}>
      <Header headerTitle="Home" />
      <View style={styles.innerContainer}>
        {docId !== "" ? <RecentTransactions docId={docId} /> : <></>}
      </View>
      <BottomNavigator buttonActive="home" />
    </View>
  );
};

export default Home;
