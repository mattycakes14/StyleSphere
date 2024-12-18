import React, { useState, useEffect, useCallback } from "react";
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
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { db } from "@/config/firebase";
import { collection, getDocs, query, where, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import axios from "axios";
import * as Location from "expo-location";
import { debounce } from "lodash";
// Declare types for querying data
type ProfileData = {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
  phoneNum: number;
  pronouns: string;
  username: string;
  service: string[];
  priceRange: number;
  profilePic: string;
  description: string;
};

function HomePage() {
  const [stylistData, setStylistData] = useState<ProfileData[]>([]); // data for FlatList
  const [isModalVisible, setIsModalVisible] = useState(false); //modal for FlatList item
  const [selectedItem, setSelectedItem] = useState<ProfileData[]>([]); //data for modal
  const [search, setSearch] = useState(""); //state for text in location search
  const [locations, setLocations] = useState([]); //list of locations from Google API
  const [searchVisible, isSearchVisible] = useState(false); //state for showing search locs
  const [long, setLong] = useState<number>(); //longitude for user
  const [lat, setLat] = useState<number>(); //latitude for user
  const [loc, setLoc] = useState<string>(); //get the default location
  const [newLat, setNewLat] = useState<number>();
  const [newLong, setNewLong] = useState<number>();
  const [review, setReview] = useState("");
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
          service: doc.data().stylistInfo,
          priceRange: doc.data().priceRange,
          profilePic: doc.data().profilePic,
          description: doc.data().description,
        }));
        setStylistData(convertData); //update FlatList data
      } catch (error) {
        console.error(error);
      }
    };
    fetchStylistData();
  }, []); // Dependency of [] (called once per mount)

  //Google API text search for Location (debounced for resource purposes)
  //Memoized with useCallback because of state change
  const API_ENDPOINT = "https://places.googleapis.com/v1/places:searchText";
  const API_KEY = "AIzaSyCJOsR3AQhlrFd9uL8Pk56bqXE3MxRN_uo";
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
        console.log(places);
        setLocations(places);
        if (places.length > 0) {
          //Don't display FlatList if locations is empty
          places.map((locations) => {
            //handle when user selects a location
            if (locations.formattedAddress !== search) {
              isSearchVisible(true);
            } else {
              setLoc(locations.formattedAddress);
              getGeoCode();
            }
          });
        }
        console.log(search);
        console.log("API request called");
      } catch (err) {
        console.error(err);
      }
    }
  };
  //ATTEMPTED debounce function (doesn't work as intended...)
  const memoizeGetLoc = debounce(() => {
    getLocations();
  }, 900);
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
      console.log("Geocode Called");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={() => isSearchVisible(false)}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 0.25 }}>
          <TextInput
            style={styles.searchBar}
            placeholder="New Location"
            placeholderTextColor="gray"
            value={search}
            onChangeText={(newText) => {
              console.log("Text change");
              setSearch(newText);
              memoizeGetLoc();
            }}
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
                        <Image
                          source={require("../../assets/images/location.png")}
                          style={{
                            position: "absolute",
                            width: 15,
                            height: 15,
                            top: 20,
                            left: 53,
                          }}
                        />
                        <Text
                          style={{ position: "absolute", top: 20, left: 70 }}
                        >
                          {item.address}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
            <Modal
              visible={isModalVisible}
              animationType="fade"
              transparent={true} // Enable transparency
              onRequestClose={() => setIsModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                    <Image
                      source={require("../../assets/images/close.png")}
                      style={{ width: 25, height: 25 }}
                    />
                  </TouchableOpacity>
                  {selectedItem?.profilePic ? (
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <Image
                        source={{ uri: selectedItem?.profilePic }}
                        style={{ width: 65, height: 65, borderRadius: 50 }}
                      />
                      <Text style={{ fontFamily: "SFPRODISPLAYBLACKITALIC" }}>
                        {selectedItem?.username}
                      </Text>
                    </View>
                  ) : (
                    <Image source={require("../../assets/images/user.png")} />
                  )}
                  <ScrollView>
                    <View style={{ marginTop: 20 }}>
                      <Text>{selectedItem?.description}</Text>
                    </View>
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <Text style={{ fontFamily: "SFPRODISPLAYBLACKITALIC" }}>
                        Services
                      </Text>
                    </View>
                    {selectedItem.service ? (
                      <View>
                        {selectedItem?.service.map((item, index) => (
                          <View key={index} style={{ marginTop: 20 }}>
                            <Text>{item}</Text>
                          </View>
                        ))}
                      </View>
                    ) : (
                      <Text>N/A</Text>
                    )}
                    <View style={{ marginTop: 40 }}></View>
                    <TouchableOpacity>
                      <View>
                        <Text>Like the stylist? Leave a review!</Text>
                      </View>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              </View>
            </Modal>
          </>
        ) : (
          <Text>No Data</Text>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

export default HomePage;

const styles = StyleSheet.create({
  flatListContainer: {
    flex: 1,
    backgroundColor: "white",
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
    padding: 25,
    backgroundColor: "white",
    borderBottomWidth: 0.25,
    borderColor: "gray",
  },
  dropdown: {
    position: "absolute",
    zIndex: 1,
    marginTop: 100,
    marginLeft: 50,
    marginRight: 50,
    maxHeight: 300,
    borderRadius: 5,
  },
});
