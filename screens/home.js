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
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { transactionLength } from "../queries";

const appDescription = [
  "The app's designed to help you track your expenses, income, and internal transfers easily.",
  "With this app, you can conveniently monitor where you spend your money and keep track of your financial activities.",
  "To add a new transaction, simply tap on the button with plus sign located in the bottom bar. It allows you to input the details of your expense or income quickly.",
  "If you have transactions that occur frequently, you can set them as recurring transactions. Once set, you can add them again without filling in the entire form by simply selecting the repeating transaction.",
  "Before you start using the app, we recommend completing your profile. You can access your profile from the bottom bar. Make sure to fill in essential details like your security PIN and the information of the cards you commonly use for expenses, such as travel cards, e-wallets, or debit cards.",
  "Our app aims to simplify your financial management and provide you with valuable insights into your spending habits.",
  "Stay organized and stay in control of your finances with our user-friendly interface and intuitive features.",
  "Start tracking your expenses, managing your income, and optimizing your financial decisions with our app today!",
];

const Home = ({ navigation }) => {
  const db = SQLite.openDatabase("ExpenseManagement.db");
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const [docId, setDocId] = useState("");
  const [transactionPresent, setTransactionPresent] = useState(0);
  const [userId, setUserId] = useState(0);
  const transactionModal = useSelector(
    (state) => state.transactionModal.transactionModal
  );
  const logoutModal = useSelector((state) => state.logoutModal.logoutModal);
  // console.log(logoutModal);

  useEffect(() => {
    const setData = async () => {
      let storedPin = await AsyncStorage.getItem("userId");
      if (storedPin !== null) {
        storedPin = parseInt(storedPin);
        setUserId(storedPin);

        await transactionLength(db, storedPin)
          .then((res) => {
            if (res > 0) {
              setTransactionPresent(2);
            } else {
              setTransactionPresent(1);
            }
          })
          .catch((err) => {});
      }
    };
    setData();
  }, []);

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
  //         if (dataUser.transactions.length > 0) setTransactionPresent(2);
  //         else setTransactionPresent(1);
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
      margin: 20,
      marginTop: 90,
      height: "78%",
      // marginBottom: 60,
      backgroundColor: "white",
      borderRadius: 20,
    },
    welcome: {
      flexDirection: "column",
      // justifyContent: "center",
      // alignItems: "center",
      padding: 20,
    },
  });
  return (
    <View style={styles.container}>
      <Header headerTitle="Home" />
      <View
        style={[
          styles.innerContainer,
          { justifyContent: transactionPresent == 2 ? "flex-start" : "center" },
        ]}
      >
        {transactionPresent == 2 ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ flexDirection: "column" }}>
              {userId !== 0 ? <StatsComponent /> : <></>}
              <View
                style={{
                  borderTopWidth: 1,
                  marginLeft: 20,
                  marginRight: 20,
                  marginTop: 15,
                  borderTopColor: "#d4d4d6",
                  // width: "60%",
                }}
              ></View>
              {userId !== 0 ? <RecentTransactions /> : <></>}
            </View>
          </ScrollView>
        ) : transactionPresent == 1 ? (
          <View style={styles.welcome}>
            <Text
              style={{
                width: "100%",
                textAlign: "center",
                marginBottom: 15,
                fontSize: 22,
                color: "#393e46",
                fontWeight: "bold",
              }}
            >
              Welcome !! &#x1F64F;
            </Text>
            <View style={{ height: "85%" }}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {appDescription.map((obj, id) => (
                  <View
                    key={id}
                    style={{ flexDirection: "row", marginBottom: 10 }}
                  >
                    <View
                      style={{
                        width: "8%",
                      }}
                    >
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 10,
                          borderColor: "#393e46",
                          borderWidth: 1,
                          marginTop: 5,
                        }}
                      ></View>
                    </View>
                    <Text
                      style={{
                        width: "92%",
                        textAlign: "justify",
                        fontSize: 13,
                        color: "#393e46",
                      }}
                    >
                      {obj}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
            <Text
              style={{
                width: "100%",
                textAlign: "center",
                marginTop: 15,
                fontSize: 20,
                color: "#393e46",
                fontWeight: "bold",
              }}
            >
              Happy Spending !! &#x1F607;
            </Text>
          </View>
        ) : (
          <></>
        )}
      </View>
      <BottomNavigator buttonActive="home" />
      {transactionModal !== null ? <TransactionModal /> : <></>}
      {logoutModal ? <LogoutModal /> : <></>}
    </View>
  );
};

export default Home;
