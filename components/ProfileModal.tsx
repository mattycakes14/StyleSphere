import React, { useState, useEffect } from "react";
import {
  Modal,
  SafeAreaView,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  Button,
  Touchable,
} from "react-native";
import { getAuth } from "firebase/auth";
import { db } from "../config/firebase";
import {
  addDoc,
  collection,
  query,
  where,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { storage } from "../config/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

function ProfileModal({
  profileModal,
  setProfileModal,
}: {
  profileModal: boolean;
  setProfileModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  //get user id
  const auth = getAuth();
  const user = auth.currentUser?.uid;
  //state for image rendering
  const [image, setImage] = useState("");
  //get the state of username, pronouns, email
  const [username, setUsername] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [phoneNum, setPhoneNum] = useState<number>(0);
  const [address, setAddress] = useState("");
  const [longitude, setLongitude] = useState<number>();
  const [latitude, setLatitude] = useState<number>();
  const [success, setSuccess] = useState(false);
  const [url, setUrl] = useState<string>();
  const [progress, setProgress] = useState(0);
  const [progressModal, setProgressModal] = useState(false);
  const [uploaded, setUploaded] = useState(0);
  const email = auth.currentUser?.email;
  //collection ref for AccountInfo collection
  const accountInfoRef = collection(db, "AccountInfo");
  //collection ref for Stylist Info collection
  const stylistRef = collection(db, "stylistInfo");
  //get pre-text username/pronouns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          accountInfoRef,
          where("userId", "==", auth.currentUser?.uid)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setUsername(userData.username);
          setPronouns(userData.pronouns);
          setPhoneNum(userData.phoneNum);
          setAddress(userData.address);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [auth.currentUser?.uid]);
  //Updating/submitting info to AccountInfo/ stylistInfo collection
  const addInfo = async () => {
    try {
      //reverse geocode location (address -> geocode)
      const geoCoded = await Location.geocodeAsync(address);
      console.log(address);
      const latitude = geoCoded[0].latitude;
      const longitude = geoCoded[0].longitude;
      setLatitude(latitude);
      setLongitude(longitude);
      //get the user object from the collection(filter data)
      const q = query(
        accountInfoRef,
        where("userId", "==", auth.currentUser?.uid)
      );
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot);
      if (username.length == 0 || pronouns.length == 0 || phoneNum == null) {
        Alert.alert(
          "Submission error",
          "Please fill in all the following fields correctly"
        );
      } else if (querySnapshot.empty) {
        await addDoc(accountInfoRef, {
          username: username,
          pronouns: pronouns,
          phoneNum: phoneNum,
          address: address,
          latitude: latitude,
          longitude: longitude,
          profilePic: url,
          userId: auth.currentUser?.uid,
        });
        Alert.alert("Success", "Information submitted successfully!");
      } else {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          username: username,
          pronouns: pronouns,
          phoneNum: phoneNum,
          address: address,
          latitude: latitude,
          profilePic: url,
          longitude: longitude,
        });
        Alert.alert("Updated success!", "Info has been updated!");
      }
    } catch (err) {
      console.error(err);
    }
  };
  const selectImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      console.log("No Permission");
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeImages,
    });

    if (pickerResult.canceled) {
      console.log("Photo albumn cancled");
    } else {
      //if successful get the uri from the object array
      const uri = pickerResult.assets[0].uri;

      //upload image
      const responseData = await fetch(uri);
      const blob = await responseData.blob();
      console.log(blob);
      console.log(blob.type);
      console.log(blob.size);
      try {
        //storage reference
        const storageRef = ref(storage, "images/" + user);

        const uploadTask = uploadBytesResumable(storageRef, blob);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.floor(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgressModal(true);
            setProgress(progress);
            console.log(`File is ${progress}% done`);
            if (snapshot.bytesTransferred == snapshot.totalBytes) {
              console.log("Upload completed!");
              setProgressModal(false);
              setUploaded(uploaded + 1);
            }
          },
          (error) => {
            console.error(error);
          }
        );
      } catch (err) {
        console.error(err);
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, [uploaded]);
  const fetchData = async () => {
    try {
      const imageRef = ref(storage, "images/" + user);
      const url = await getDownloadURL(imageRef);
      console.log("Profile updated");
      setSuccess(true);
      console.log(url);
      setUrl(url);
      addInfo();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Modal transparent={true} visible={profileModal} animationType="slide">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.closeContainer}>
          <TouchableOpacity onPress={() => setProfileModal(false)}>
            <Image
              style={styles.closeButton}
              source={require("../assets/images/close.png")}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.accountInfoStyle}>Account Info</Text>
        <View style={{ marginLeft: 20 }}>
          <TouchableOpacity onPress={selectImage}>
            {success ? (
              <Image
                source={{ uri: url }}
                style={{ width: 150, height: 150, borderRadius: 150 }}
              />
            ) : (
              <Image
                style={{ width: 120, height: 120 }}
                source={require("../assets/images/user.png")}
              />
            )}
          </TouchableOpacity>
        </View>
        <Modal visible={progressModal} transparent={true}>
          <View style={styles.progressModalOverlay}>
            <View style={styles.progressModalContainer}>
              <Text>Image is {progress}% done!</Text>
            </View>
          </View>
        </Modal>
        <View style={styles.accountInfoSettingContainer}>
          <Text style={styles.emailText}> Email: {email}</Text>
        </View>
        <View style={styles.accountInfoSettingContainer}>
          <Text style={styles.accountInfoSettingText}>Username</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(newusername) => setUsername(newusername)}
            value={username}
          ></TextInput>
        </View>
        <View style={styles.accountInfoSettingContainer}>
          <Text style={styles.accountInfoSettingText}>Pronouns</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(newPronouns) => setPronouns(newPronouns)}
            value={pronouns}
          ></TextInput>
        </View>
        <View style={styles.accountInfoSettingContainer}>
          <Text style={styles.accountInfoSettingText}>Phone number</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(newNum) => setPhoneNum(Number(newNum))}
            value={String(phoneNum)}
          ></TextInput>
        </View>
        <View style={styles.accountInfoSettingContainer}>
          <Text style={styles.accountInfoSettingText}>Location</Text>
          <TextInput
            style={styles.textInput}
            value={address}
            onChangeText={(newAddress) => setAddress(newAddress)}
          ></TextInput>
          <View />
        </View>
        <View style={styles.updateContainer}>
          <TouchableOpacity
            onPress={() => {
              addInfo();
            }}
          >
            <Text style={styles.updateText}>Update</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  closeContainer: {
    marginLeft: 20,
    marginTop: 20,
  },
  closeButton: {
    width: 20,
    height: 20,
  },
  accountInfoStyle: {
    fontSize: 50,
  },
  accountInfoSettingContainer: {
    marginTop: 20,
    marginLeft: 10,
  },
  accountInfoSettingText: {
    fontSize: 30,
    fontFamily: "Inter_24pt-Bolditalic",
  },
  textInput: {
    borderWidth: 0.8,
    marginLeft: 8,
    marginRight: 120,
    height: 40,
  },
  updateContainer: {
    marginLeft: 15,
    marginTop: 20,
    backgroundColor: "black",
    width: 75,
    borderRadius: 10,
    alignContent: "center",
  },
  updateText: {
    fontFamily: "Inter_24pt-BoldItalic",
    color: "white",
    padding: 10,
  },
  emailText: {
    fontFamily: "Inter_24pt-BoldItalic",
  },
  progressModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  progressModalContainer: {
    flex: 0.5,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    borderRadius: 50,
  },
});
export default ProfileModal;
