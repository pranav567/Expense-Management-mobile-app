import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import BottomNavigator from "../components/bottomNavigator";

const Profile = ({ navigation }) => {
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
    scroll: {
      marginTop: 30,
      marginBottom: 60,
    },
  });
  return (
    <View style={styles.container}>
      <BottomNavigator buttonActive="profile" />
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

//   const auth = getAuth(app);
//   const firestore = getFirestore(app);

//   useEffect(() => {
//     async function storeData() {
//       let uid = "";
//       try {
//         await new Promise((resolve, reject) => {
//           onAuthStateChanged(auth, (user) => {
//             if (user) {
//               // User is logged in, get user data
//               uid = user.uid;
//               resolve();
//             } else {
//               // User is not logged in
//               navigation.navigate("Login");
//               console.log("No user logged in");
//               reject();
//             }
//           });
//         });

//         const usersCollectionRef = collection(firestore, "users");
//         const queryDoc = query(
//           usersCollectionRef,
//           where("uid", "==", uid),
//           limit(1)
//         );

//         const querySnapshot = await getDocs(queryDoc);

//         if (!querySnapshot.empty) {
//           const doc = querySnapshot.docs[0];
//           // Handle the matching document
//           const userData = doc.data();
//           setName(userData.name);
//           setEmail(userData.email);
//           setDisplayData(true);
//           // console.log(userData);
//         } else {
//           // No matching document found
//           navigation.navigate("Login");
//           // console.log("User document does not exist");
//         }
//       } catch (error) {
//         // Handle error
//         // console.log(error);
//         navigation.navigate("Login");
//       }
//     }

//     storeData();
//   }, []);

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
