import React, { useState, useEffect, useRef } from "react";
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
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/types";
import { signOut, getAuth } from "firebase/auth";
import ProfileModal from "../../components/ProfileModal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  collection,
  query,
  getDocs,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import DropDownPicker from "react-native-dropdown-picker";
import BottomSheet, { BottomSheetMethods } from "@devvie/bottom-sheet";
import Description from "@/components/Description";
import Review from "@/components/Review";
const Profile = () => {
  const sheetRef = useRef<BottomSheetMethods>(null);
  const sheetRef2 = useRef<BottomSheetMethods>(null);
  //visibility for stylist setting
  const [descriptionVisibility, setDescriptionVisibility] =
    useState<boolean>(false);
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
  const [review, setReview] = useState(false);
  const data = [
    { id: 1, category: "Adjust Stylist Info" },
    { id: 2, category: "Stylist Description Information" },
    { id: 3, category: "Your Reviews" },
    { id: 4, category: "Settings" },
    { id: 5, category: "Logout" },
  ];
  const [uri, setUri] = useState("");
  //reference to AccountInfo
  const accountInfo = collection(db, "AccountInfo");
  //reference to review
  const reviewInfo = collection(db, "Reviews");
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
  }, []); //clean up listener and update doc data based on userId
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
        <Description
          descriptionVisibility={descriptionVisibility}
          setDescriptionVisibiity={setDescriptionVisibility}
        ></Description>
        <Review review={review} setReview={setReview}></Review>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                if (item.category === "Logout") {
                  Alert.alert("Log Out", "Are you sure you want to logout?", [
                    {
                      text: "LogOut",
                      onPress: handleLogout,
                    },
                    {
                      text: "Cancel",
                      onPress: () => console.log("cancel log out tab"),
                    },
                  ]);
                } else if (
                  item.category === "Stylist Description Information"
                ) {
                  setDescriptionVisibility(true);
                } else if (item.category === "Your Reviews") {
                  setReview(true);
                } else {
                  sheetRef.current?.open();
                }
              }}
            >
              <View style={styles.stylistInfoContainer}>
                <Text>{item.category}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
      <BottomSheet
        children={stylistInfo}
        height="40%"
        ref={sheetRef}
      ></BottomSheet>
    </GestureHandlerRootView>
  );
};

const stylistInfo = () => {
  const [updated, isUpdated] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Barber Services", value: "1" },
    { label: "Fades and Tapers", value: "Fades and Tapers", parent: "1" },
    {
      label: "Line-up(Hairline/beard)",
      value: "Line-up(Hairline/beard)",
      parent: "1",
    },

    { label: "Hair Styling Services", value: "2" },
    {
      label: "Hair Extensions (Clip-In, Tape-In, Sew-In)",
      value: "Hair Extensions (Clip-In, Tape-In, Sew-In)",
      parent: "2",
    },
    {
      label: "Braiding (Box Braids, Cornrows, etc.)",
      value: "Braiding (Box Braids, Cornrows, etc.)",
      parent: "2",
    },

    { label: "Lash Services", value: "3" },
    { label: "Lash Extensions", value: "Lash Extensions", parent: "3" },
    { label: "Lash Lifts", value: "Lash Lifts", parent: "3" },

    { label: "Nail services", value: "4" },
    {
      label: "Manicures (Regular, Gel, Dip Powder)",
      value: "Manicures (Regular, Gel, Dip Powder)",
      parent: "4",
    },
    { label: "Acrylic Nails", value: "Acrylic Nails", parent: "4" },
  ]);
  const [desc, setDesc] = useState("");
  const [selectedItem, setSelectedItem] = useState([]);

  //function to handle selected item
  const handleSelection = (item) => {
    setSelectedItem(item);
  };
  const addStylistInfo = async () => {
    const userId = getAuth().currentUser?.uid;
    const collectionRef = collection(db, "AccountInfo");
    const q = query(collectionRef, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const docRef = snapshot.docs[0].ref;
      await updateDoc(docRef, {
        stylistInfo: selectedItem,
      });
      console.log("Update executed");
    } else {
      console.log("No document found");
    }
  };
  return (
    <View>
      <Text style={{ fontFamily: "SFPRODISPLAYBOLD" }}>
        Which service best suits you?
      </Text>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder={"Select a service"}
        multiple={true}
        min={0}
        max={5}
        onChangeValue={(item) => {
          handleSelection(item);
          isUpdated(false);
        }}
        categorySelectable={false} // Prevents selecting the category itself
      />
      {updated ? (
        <View>
          <Text style={{ color: "green" }}>Changes have been Saved!</Text>
        </View>
      ) : (
        <View>
          <Text style={{ color: "red" }}>Info hasn't been saved!</Text>
        </View>
      )}
      <TouchableOpacity
        style={{
          backgroundColor: "black",
          width: 90,
          borderRadius: 5,
          marginLeft: 140,
          marginTop: 70,
        }}
        onPress={() => {
          addStylistInfo();
          isUpdated(true);
        }}
      >
        <Text
          style={{
            color: "white",
            marginLeft: 10,
            padding: 3,
            fontSize: 30,
          }}
        >
          Save
        </Text>
      </TouchableOpacity>
    </View>
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
