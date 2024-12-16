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
  TextInput,
  Touchable,
} from "react-native";
import { db } from "@/config/firebase";
import { collection, getDocs, query, where, getDoc } from "firebase/firestore";
import openMap from "react-native-open-maps";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import { getAuth } from "firebase/auth";
import axios from "axios";
import * as Location from "expo-location";

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
  profilePic: string;
};

function HomePage() {
  const [stylistData, setStylistData] = useState<ProfileData[]>([]); // data for FlatList
  const [isModalVisible, setIsModalVisible] = useState(false); //modal for FlatList item
  const [selectedItem, setSelectedItem] = useState<ProfileData | null>(null); //data for modal
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [search, setSearch] = useState(""); //state for text in location search
  const [locations, setLocations] = useState([]); //list of locations from Google API
  const [searchVisible, isSearchVisible] = useState(false); //state for showing search locs
  const [long, setLong] = useState<number>(); //longitude for user
  const [lat, setLat] = useState<number>(); //latitude for user
  const [loc, setLoc] = useState<number>(); //get the default location
  const [newLat, setNewLat] = useState<number>();
  const [newLong, setNewLong] = useState<number>();
  //auth for userId
  const userId = getAuth().currentUser?.uid;
  // Reference to collection
  const accountInfo = collection(db, "AccountInfo");
  // Query each user of AccountInfo collection and render all users
  useEffect(() => {
    const fetchStylistData = async () => {
      try {
        const querySnapshot = await getDocs(accountInfo); // Get snapshots of all users
        const convertData = querySnapshot.docs.map((doc) => ({
          //for each doc snapshot, set the key to corresponding field vals
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
        setStylistData(convertData); //update FlatList data
      } catch (error) {
        console.error(error);
      }
    };
    fetchStylistData();
  }, []); // Dependency of [] (called once per mount)

  //Google API text search for Location
  const API_ENDPOINT = "https://places.googleapis.com/v1/places:searchText";
  const API_KEY = "API_KEY";
  useEffect(() => {
    const getLocations = async () => {
      if (search.length > 0) {
        try {
          const response = await axios.post(
            API_ENDPOINT,
            {
              textQuery: search,
              locationBias: {
                circle: {
                  center: {
                    latitude: newLat ? newLat : lat,
                    longitude: newLong ? newLong : long,
                  },
                  radius: 500.0,
                },
              },
            },
            {
              headers: {
                "Content-Type": "application/json", //request response as JSON format
                "X-Goog-Api-Key": API_KEY,
                //fieldmask to only get desired fields
                "X-Goog-FieldMask": "places.formattedAddress",
              },
            }
          );
          const places = response.data.places;
          setLocations(places);
          if (places.length > 0) {
            //Don't display FlatList if locations is empty
            places.map((locations) => {
              //handle when user selects a location
              if (locations.formattedAddress !== search) {
                isSearchVisible(true);
              } else {
                getGeoCode();
              }
            });
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    getLocations();
  }, [search, lat, long]);

  //fetch the user default location
  const getDefaultLoc = async () => {
    try {
      const q = query(accountInfo, where("userId", "==", userId));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setLat(data.latitude);
        setLong(data.longitude);
        setLoc(data.address);
      } else {
        console.log("No matching document found.");
      }
    } catch (err) {
      console.error("Error fetching location:", err);
    }
  };
  useEffect(() => {
    getDefaultLoc();
  }, []);

  const getGeoCode = async () => {
    try {
      const geoCoded = await Location.geocodeAsync(search);
      const latitude = geoCoded[0].latitude;
      const longitude = geoCoded[0].longitude;
      setNewLat(latitude);
      setNewLong(longitude);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Button title="debug" onPress={getGeoCode} />
      <View style={{ flex: 0.25 }}>
        <TextInput
          style={styles.searchBar}
          placeholder="New Location"
          placeholderTextColor="gray"
          value={search}
          onChangeText={(newText) => setSearch(newText)}
        ></TextInput>
        <TextInput
          style={styles.searchBar}
          placeholder="Your Location"
          placeholderTextColor="gray"
          value={loc}
          editable={false}
        ></TextInput>
        {searchVisible ? (
          <FlatList
            data={locations}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSearch(item.formattedAddress);
                  isSearchVisible(false);
                }}
              >
                <View style={styles.locationSearches}>
                  <Text>{item.formattedAddress}</Text>
                </View>
              </TouchableOpacity>
            )}
            style={styles.dropdown}
          />
        ) : (
          <> </>
        )}
      </View>
      {stylistData && stylistData.length > 0 ? (
        <>
          <View style={{ flex: 1 }}>
            <FlatList
              data={stylistData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedItem(item); // Set the selected item
                    setIsModalVisible(true); // Open the modal
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
                        <Image
                          source={require("../../assets/images/user.png")}
                        />
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
          </View>
          <Button title="test" onPress={getDefaultLoc} />
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
                <Text style={styles.modalText}>Price Range:</Text>
                <Text style={styles.modalText}>Service:</Text>
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
  searchBar: {
    borderWidth: 0.5,
    borderColor: "black",
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 30,
    paddingLeft: 40,
    fontSize: 18,
  },
  locationSearches: {
    padding: 20,
    backgroundColor: "orange",
    borderBottomWidth: 5,
    borderColor: "black",
  },
  dropdown: {
    position: "absolute",
    zIndex: 1,
    marginTop: 100,
    marginLeft: 50,
    marginRight: 50,
    maxHeight: 200,
  },
});
