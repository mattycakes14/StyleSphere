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
  Image,
} from "react-native";
import { db } from "@/config/firebase";
import { collection, getDocs } from "firebase/firestore";
import openMap from "react-native-open-maps";
import { Calendar, CalendarList, Agenda } from "react-native-calendars"; // Declare types for querying data
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
  profilePic: string;
};

function HomePage() {
  const [stylistData, setStylistData] = useState<ProfileData[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProfileData | null>(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
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
          profilePic: doc.data().profilePic,
        }));
        setStylistData(convertData);
        console.log(convertData);
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
                  <View style={styles.userImage}>
                    {item.profilePic.length > 0 ? (
                      <Image
                        source={{ uri: item.profilePic }}
                        style={{ width: 50, height: 50, borderRadius: 50 }}
                      />
                    ) : (
                      <Image source={require("../../assets/images/user.png")} />
                    )}
                    <Text
                      style={{
                        padding: 5,
                        fontFamily: "SFPRODISPLAYBLACKITALIC",
                        color: "black",
                      }}
                    >
                      {item.username}
                    </Text>
                    <Text
                      style={{
                        fontSize: 30,
                        top: 30,
                        marginLeft: 100,
                        fontFamily: "SFPRODISPLAYBOLD",
                      }}
                    >
                      ${item.priceRange}
                    </Text>
                  </View>
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
                <TouchableOpacity onPress={() => setCalendarVisible(true)}>
                  <Text>See Availability</Text>
                </TouchableOpacity>
                <Modal
                  visible={calendarVisible}
                  transparent={true}
                  animationType="fade"
                >
                  <View style={styles.calendarOverlay}>
                    <View style={styles.calendarModal}>
                      <TouchableOpacity
                        onPress={() => setCalendarVisible(false)}
                      ></TouchableOpacity>
                      <Calendar
                        style={{ padding: 20, width: 300, borderRadius: 10 }}
                        onDayPress={(day) => {
                          console.log(`selected day is ${day}%`);
                          console.log(typeof day);
                          setCalendarVisible(false);
                        }}
                      />
                    </View>
                  </View>
                </Modal>
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
  userImage: {
    flexDirection: "row",
  },
  calendarOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  calendarModal: {
    marginTop: 200,
    justifyContent: "center",
    alignItems: "center",
  },
});
