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
import openMap from "react-native-open-maps";
// Declare types for querying data
type ProfileData = {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
  phoneNum: number;
  pronouns: string;
  username: string;
  service: string;
  priceRange: number;
};

function HomePage() {
  const [stylistData, setStylistData] = useState<ProfileData[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProfileData | null>(null);

  // Reference to collection
  const accountInfo = collection(db, "AccountInfo");
  // Query the data from the collection
  useEffect(() => {
    const fetchStylistData = async () => {
      try {
        const querySnapshot = await getDocs(accountInfo); // Get the snapshot
        const convertData = querySnapshot.docs.map((doc) => ({
          // Convert data into array of objects
          id: doc.id,
          username: doc.data().username,
          latitude: doc.data().latitude,
          longitude: doc.data().longitude,
          phoneNum: doc.data().phoneNum,
          pronouns: doc.data().pronouns,
          address: doc.data().address,
          service: doc.data().service,
          priceRange: doc.data().priceRange,
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
                  <Text style={{ padding: 5 }}>Username: {item.username}</Text>
                  <Text style={{ padding: 5 }}>Located: {item.address}</Text>
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
                  Location: {selectedItem?.address}
                </Text>
                <Button
                  title="Map to Location"
                  onPress={() =>
                    openMap({
                      latitude: selectedItem?.latitude,
                      longitude: selectedItem?.longitude,
                    })
                  }
                ></Button>
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
