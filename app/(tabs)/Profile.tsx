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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/types";
import { signOut, getAuth } from "firebase/auth";
import StylistModal from "../../components/StylistModal";
import ProfileModal from "../../components/ProfileModal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { collection, query, getDocs, where } from "firebase/firestore";
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

  //collection ref
  const accountInfo = collection(db, "AccountInfo");
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully:");
    } catch (error) {
      console.error(error);
    }
    navigation.navigate("index");
  };

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
            <Image
              style={styles.imageStyle}
              source={require("../../assets/images/user.png")}
            />
          </TouchableOpacity>
        </View>
        <ProfileModal
          profileModal={profileModal}
          setProfileModal={setProfileModal}
        ></ProfileModal>
        <View style={styles.stylistInfoContainer}>
          <TouchableOpacity onPress={() => setStylistVisibility(true)}>
            <Text style={styles.stylistInfoText}>
              Adjust Stylist Information
            </Text>
          </TouchableOpacity>
        </View>
        <StylistModal
          stylistVisibility={stylistVisibility}
          setStylistVisibility={setStylistVisibility}
        ></StylistModal>
        <Button
          title="Logout"
          color="red"
          onPress={() =>
            Alert.alert("Log Out", "Are you sure you want to logout?", [
              {
                text: "LogOut",
                onPress: handleLogout,
              },
              {
                text: "Cancel",
                onPress: () => console.log("cancel log out tab"),
              },
            ])
          }
        ></Button>
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
    flex: 0.1,
    justifyContent: "center",
    marginLeft: 30,
  },
});

export default Profile;
