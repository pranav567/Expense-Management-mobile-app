import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { fonts } from "react-native-elements/dist/config";

const transactions = [
  {
    date: "2023-03-08",
    phrase: "Exploring the hidden treasures",
    type: "#51adcf",
  },
  { date: "2023-01-17", phrase: "Coffee and donuts", type: "#2dea8f" },
  { date: "2023-05-02", phrase: "Mountain hike", type: "#f85f73" },
  { date: "2023-02-14", phrase: "Music festival", type: "#2dea8f" },
  { date: "2023-04-27", phrase: "Summer vacation", type: "#f85f73" },
  { date: "2023-01-06", phrase: "Rainy day indoors", type: "#2dea8f" },
  { date: "2023-02-21", phrase: "Artistic inspiration", type: "#51adcf" },
  { date: "2023-03-30", phrase: "Exploring new places", type: "#f85f73" },
  { date: "2023-02-01", phrase: "Road trip adventure", type: "#51adcf" },
  { date: "2023-05-12", phrase: "Gourmet food delight", type: "#2dea8f" },
];
const RecentTransactions = () => {
  const styles = StyleSheet.create({
    container: {
      margin: 20,
      marginTop: 10,
    },
    headerRow: {
      padding: 5,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    innerContainer: { padding: 10, paddingTop: 0, paddingLeft: 5 },
    transaction: {
      flexDirection: "column",
      backgroundColor: "white",
      //#f5f5f5
      margin: 8,
      //   width: 220,
      minWidth: 180,
      height: 110,
      padding: 15,
      borderRadius: 15,
      paddingRight: 20,
      paddingLeft: 20,
      borderWidth: 1,
      borderColor: "#393e46",
    },
    radio: {
      width: 15,
      height: 15,
      borderRadius: 20,
      //   borderWidth: 1,
      marginTop: 5,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={{ fontSize: 22, color: "#393e46" }}>
          Recent Transactions
        </Text>
        {transactions.length > 4 ? (
          <TouchableOpacity>
            <Text
              style={{
                fontSize: 12,
                textDecorationLine: "underline",
                marginTop: 10,
                color: "#393e46",
              }}
            >
              show more
            </Text>
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
      <View style={styles.innerContainer}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {transactions.map((obj, id) => (
            <View
              key={id}
              style={[
                styles.transaction,
                {
                  marginLeft: id == 0 ? 0 : 8,
                },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <Text style={{ fontSize: 20, color: "#393e46" }}>Rs. 25</Text>
                <View
                  style={[
                    styles.radio,
                    {
                      backgroundColor: obj.type,
                    },
                  ]}
                ></View>
              </View>

              <Text style={{ fontSize: 14, marginBottom: 2, color: "#393e46" }}>
                {obj.date}
              </Text>
              <Text style={{ fontSize: 14, color: "#393e46" }}>
                {obj.phrase}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default RecentTransactions;
