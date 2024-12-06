import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  Button,
} from "react-native";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { db } from "@/config/firebase";
import { collection, getDocs } from "firebase/firestore";

//declare types for querying data
type ProfileData = {
  id: string;
  service: string;
  priceRange: number;
  location: string;
};
function HomePage() {
  const [stylistData, setStylistData] = useState<ProfileData[]>([]);
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  //reference to collection
  const stylistInfo = collection(db, "profile");
  //query the data from the collection
  useEffect(() => {
    const fetchStylistData = async () => {
      try {
        const querySnapshot = await getDocs(stylistInfo); //get the snapshot
        const convertData = querySnapshot.docs.map((doc) => ({
          //convert data into array of objects
          id: doc.id,
          service: doc.data().service,
          priceRange: doc.data().priceRange,
          location: doc.data().location,
        }));
        setStylistData(convertData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStylistData();
  }, []); //dependency of [] (called once per mount)

  return (
    <SafeAreaView>
      {stylistData && stylistData.length > 0 ? (
        <FlatList
          data={stylistData}
          renderItem={({ item }) => (
            <View style={styles.flatListContainer}>
              <Text style={{ padding: 5 }}>Location: {item.location}</Text>
              <Text style={{ padding: 5 }}>Price Range: {item.priceRange}</Text>
              <Text style={{ padding: 5 }}>
                Type of Service: {item.service}
              </Text>
            </View>
          )}
        ></FlatList>
      ) : (
        <Text>No Data</Text>
      )}
    </SafeAreaView>
  );
}

export default HomePage;

const styles = StyleSheet.create({
  flatListContainer: {
    flex: 1,
    alignItems: "flex-end",
    backgroundColor: "#f98181",
    height: 120,
    borderRadius: 5,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    paddingRight: 10,
  },
});
