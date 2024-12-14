import React, { useState, useEffect } from "react";
import {
  Button,
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/types";
import { signOut, getAuth } from "firebase/auth";
import StylistModal from "../../components/StylistModal";
import ProfileModal from "../../components/ProfileModal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  collection,
  query,
  getDocs,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/config/firebase";

const Profile = () => {
  //visibility for stylist setting
  const [stylistVisibility, setStylistVisibility] = useState<boolean>(false);
  // screen defining (types)
  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationProp>();
  //fetch user
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  //state for user and profile modal
  const [profileModal, setProfileModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profilePic, hasProfilePic] = useState(false);
  const data = [
    { id: 1, category: "Adjust Stylist Info" },
    { id: 2, category: "Logout" },
  ];
  const [uri, setUri] = useState("");
  //collection ref
  const accountInfo = collection(db, "AccountInfo");
  //update state of username by filtering docs and getting username field val
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const q = query(accountInfo, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const docRef = querySnapshot.docs[0].data();
          setCurrentUser(docRef.username);
        } else {
          setCurrentUser(auth.currentUser?.email);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsername();
  }, []);
  //handle updates for download url for profile pic
  useEffect(() => {
    const userDoc = query(accountInfo, where("userId", "==", userId)); //find doc based on userId
    const unsubscribe = onSnapshot(userDoc, (snapshot) => {
      if (!snapshot.empty) {
        //callback function to be executed per change
        snapshot.docs.map((doc) => {
          const newUri = doc.data().profilePic;
          setUri(newUri); //get the updated uri
          hasProfilePic(true);
          console.log(uri);
        });
      }
    });
    return () => unsubscribe(); //clean up function: component unmounts we stop the listener
  }, [userId]); //clean up listener and update doc data based on userId
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully:");
    } catch (error) {
      console.error(error);
    }
    navigation.navigate("index");
  };
  console.log(uri);
  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <View style={styles.welcomeBackContainer}>
          {currentUser ? (
            <>
              <Text style={styles.welcomeMessageStyle}>Welcome back</Text>
              <Text style={styles.welcomeMessageStyle}>{currentUser}! 🎉</Text>
            </>
          ) : (
            <Text>Log In please!</Text>
          )}
        </View>
        <View style={styles.profilePicContainer}>
          <TouchableOpacity onPress={() => setProfileModal(true)}>
            {profilePic ? (
              <Image
                source={{ uri: uri }}
                style={styles.imageStyleProfilePic}
              />
            ) : (
              <Image
                style={styles.imageStyle}
                source={require("../../assets/images/user.png")}
              />
            )}
          </TouchableOpacity>
        </View>
        <ProfileModal
          profileModal={profileModal}
          setProfileModal={setProfileModal}
        ></ProfileModal>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                item.category === "Logout"
                  ? Alert.alert("Log Out", "Are you sure you want to logout?", [
                      {
                        text: "LogOut",
                        onPress: handleLogout,
                      },
                      {
                        text: "Cancel",
                        onPress: () => console.log("cancel log out tab"),
                      },
                    ])
                  : console.log(item.category);
              }}
            >
              <View style={styles.stylistInfoContainer}>
                <Text>{item.category}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageStyle: {
    width: 80,
    height: 80,
  },
  imageStyleProfilePic: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  welcomeBackContainer: {
    flex: 0.2,
    marginRight: 130,
    marginTop: 15,
  },
  welcomeMessageStyle: {
    fontSize: 25,
    fontFamily: "Inter_24pt_boldItalic",
    textAlign: "center",
  },
  profilePicContainer: {
    position: "absolute",
    marginLeft: 270,
    marginTop: 45,
  },
  stylistInfoText: {
    fontFamily: "Inter_24pt-BoldItalic",
    fontSize: 20,
  },
  stylistInfoContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
});

export default Profile;
