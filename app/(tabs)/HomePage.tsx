import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Button,
} from "react-native";
import { db } from "@/config/firebase";
import { collection, getDocs } from "firebase/firestore";
import axios from "axios";
import * as Location from "expo-location";
// Declare types for querying data
type ProfileData = {
  id: string;
  service: string;
  priceRange: number;
  location: string;
};

function HomePage() {
  const [stylistData, setStylistData] = useState<ProfileData[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProfileData | null>(null);
  const [location, setLocation] = useState();
  // Reference to collection
  const stylistInfo = collection(db, "profile");

  //ask for location permission
  useEffect(() => {
    const getPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("please grant permissions");
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      console.log(currentLocation);
    };
    getPermission();
  }, []);
  // Query the data from the collection
  useEffect(() => {
    const fetchStylistData = async () => {
      try {
        const querySnapshot = await getDocs(stylistInfo); // Get the snapshot
        const convertData = querySnapshot.docs.map((doc) => ({
          // Convert data into array of objects
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
  }, []); // Dependency of [] (called once per mount)

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {stylistData && stylistData.length > 0 ? (
        <>
          <FlatList
            data={stylistData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedItem(item); // Set the selected item
                  setIsModalVisible(true); // Open the modal
                  console.log(item);
                }}
              >
                <View style={styles.flatListContainer}>
                  <Text style={{ padding: 5 }}>Location: {item.location}</Text>
                  <Text style={{ padding: 5 }}>
                    Price Range: {item.priceRange}
                  </Text>
                  <Text style={{ padding: 5 }}>Service: {item.service}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
          <Modal
            visible={isModalVisible}
            animationType="fade"
            transparent={true} // Enable transparency
            onRequestClose={() => setIsModalVisible(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              onPress={() => setIsModalVisible(false)} // Close modal on background tap
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>
                  Location: {selectedItem?.location}
                </Text>
                <Text style={styles.modalText}>
                  Price Range: {selectedItem?.priceRange}
                </Text>
                <Text style={styles.modalText}>
                  Service: {selectedItem?.service}
                </Text>
              </View>
            </TouchableOpacity>
          </Modal>
        </>
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
    backgroundColor: "#f98181",
    height: 140,
    borderRadius: 5,
    marginBottom: 10,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black overlay
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 300,
    height: 500,
    padding: 20,
    backgroundColor: "white", // Solid background for the modal content
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#f98181",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});
