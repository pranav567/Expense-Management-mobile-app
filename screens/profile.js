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
import app from "../firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import CardModal from "../components/cardModal";

import LogoutModal from "../components/logoutModal";
import { useSelector, useDispatch } from "react-redux";

import {
  getFirestore,
  collection,
  query,
  where,
  limit,
  getDocs,
} from "firebase/firestore";
import { useState, useEffect } from "react";

const Profile = ({ navigation }) => {
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  const [userData, setUserData] = useState(null);
  const [docid, setDocid] = useState("");

  useEffect(() => {
    async function storeData() {
      let uid = "";
      try {
        await new Promise((resolve, reject) => {
          onAuthStateChanged(auth, (user) => {
            if (user) {
              // User is logged in, get user data
              uid = user.uid;
              resolve();
            } else {
              // User is not logged in
              navigation.navigate("Login");
              console.log("No user logged in");
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
          setUserData(dataUser);
          setDocid(doc.id);
          // console.log(userData);
        } else {
          // No matching document found
          navigation.navigate("Login");
          // console.log("User document does not exist");
        }
      } catch (error) {
        // Handle error
        // console.log(error);
        navigation.navigate("Login");
      }
    }

    storeData();
  }, []);

  const cardProfileModal = useSelector(
    (state) => state.cardProfileModal.cardProfileModal
  );
  const logoutModal = useSelector((state) => state.logoutModal.logoutModal);
  // console.log(cardProfileModal);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      width: 160,
      height: 160,
    },
    contentContainer: {
      flex: 1,
      justifyContent: "flex-start",
      width: "90%",
      marginTop: 90,
      marginBottom: 65,
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
          {userData !== null && docid !== "" ? (
            <>
              <PersonalData name={userData.name} email={userData.email} />
              {/* <Security /> */}
              <Cards cards={userData.cards} docId={docid} />
            </>
          ) : (
            <></>
          )}
          {/* personal info */}
        </ScrollView>
      </View>
      <BottomNavigator buttonActive="profile" />
      {cardProfileModal !== null ? <CardModal /> : <></>}
      {logoutModal ? <LogoutModal /> : <></>}
    </View>
  );
};

export default Profile;

// import { Text, View, TouchableOpacity } from "react-native";
// import { useEffect, useState } from "react";

// import app from "../firebaseConfig";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import {
//   getFirestore,
//   doc,
//   collection,
//   query,
//   where,
//   limit,
//   getDocs,
// } from "firebase/firestore";

// const Profile = ({ navigation }) => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [displayData, setDisplayData] = useState(false);

// const auth = getAuth(app);
// const firestore = getFirestore(app);

// useEffect(() => {
//   async function storeData() {
//     let uid = "";
//     try {
//       await new Promise((resolve, reject) => {
//         onAuthStateChanged(auth, (user) => {
//           if (user) {
//             // User is logged in, get user data
//             uid = user.uid;
//             resolve();
//           } else {
//             // User is not logged in
//             navigation.navigate("Login");
//             console.log("No user logged in");
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
//         const userData = doc.data();
//         setName(userData.name);
//         setEmail(userData.email);
//         setDisplayData(true);
//         // console.log(userData);
//       } else {
//         // No matching document found
//         navigation.navigate("Login");
//         // console.log("User document does not exist");
//       }
//     } catch (error) {
//       // Handle error
//       // console.log(error);
//       navigation.navigate("Login");
//     }
//   }

//   storeData();
// }, []);

//   const handleLogout = async () => {
//     try {
//       await auth.signOut();
//       navigation.replace("Login");
//       // User has been logged out successfully
//       // You can perform any necessary actions here
//     } catch (error) {
//       // An error occurred while logging out
//       // console.log(error);
//     }
//   };

//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       {displayData ? (
//         <>
//           <Text>Uid : {name}</Text>
//           <Text>Email : {email}</Text>
//           <TouchableOpacity
//             onPress={() => {
//               handleLogout();
//             }}
//           >
//             <Text>Logout</Text>
//           </TouchableOpacity>
//         </>
//       ) : (
//         <Text>No data found!</Text>
//       )}
//     </View>
//   );
// };

// export default Profile;
