import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Touchable,
  Alert,
} from "react-native";
import { getAuth } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  where,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../config/firebase";

function StylistModal({
  stylistVisibility,
  setStylistVisibility,
}: {
  stylistVisibility: boolean;
  setStylistVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const auth = getAuth();
  //getting state of input
  const [service, setService] = useState("");
  const [priceRange, setPriceRange] = useState(0);
  const [location, setLocation] = useState("");
  //reference to collection
  const stylistInfo = collection(db, "profile");
  //get the user id
  const userId = auth.currentUser?.uid;
  //get pre-text data
  useEffect(() => {
    const fetchStylistData = async () => {
      try {
        const q = query(stylistInfo, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const docRef = querySnapshot.docs[0].data();
          setService(docRef.service);
          setPriceRange(docRef.priceRange);
          setLocation(docRef.location);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStylistData();
  }, []);
  //sending docs to the db
  const submitStylistInfo = async () => {
    try {
      const q = query(stylistInfo, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          location: location,
          service: service,
          priceRange: priceRange,
        });
        Alert.alert("Update Success!", "Your information has been updated");
      } else {
        await addDoc(stylistInfo, {
          service: service,
          location: location,
          priceRange: priceRange,
          userId: userId,
        });
        Alert.alert(
          "Submission Success!",
          "Your information has been successfully submitted!"
        );
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Modal visible={stylistVisibility} animationType="fade" transparent={true}>
      <SafeAreaView style={styles.container}>
        <View style={styles.modalContainer}>
          <View style={styles.closeContainer}>
            <TouchableOpacity onPress={() => setStylistVisibility(false)}>
              <Image
                style={{ width: 20, height: 20 }}
                source={require("../assets/images/close.png")}
              ></Image>
            </TouchableOpacity>
          </View>
          <View style={styles.textContainer}>
            <TextInput
              style={styles.textInputStyle}
              placeholder="service"
              placeholderTextColor="gray"
              onChangeText={(newService) => setService(newService)}
              value={service}
            ></TextInput>
          </View>
          <View style={styles.textContainer}>
            <TextInput
              style={styles.textInputStyle}
              placeholder="Price range"
              placeholderTextColor="gray"
              onChangeText={(newPriceRange) =>
                setPriceRange(Number(newPriceRange))
              }
              value={priceRange.toString()} //change number to String
            ></TextInput>
          </View>
          <View style={styles.textContainer}>
            <TextInput
              style={styles.textInputStyle}
              placeholder="Location"
              placeholderTextColor="gray"
              onChangeText={(newLocation) => setLocation(newLocation)}
              value={location}
            ></TextInput>
          </View>
          <View style={styles.submitContainer}>
            <TouchableOpacity onPress={submitStylistInfo}>
              <Text style={styles.submitText}>Submit </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  closeContainer: {
    position: "absolute",
    top: 20,
    left: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    width: 300,
    height: 400,
  },
  textInputStyle: {
    borderWidth: 0.5,
    borderColor: "black",
    width: 230,
    borderRadius: 5,
    padding: 10,
  },
  textContainer: {
    marginTop: 20,
  },
  submitText: {
    fontFamily: "Inter_24pt-BoldItalic",
    padding: 10,
    textAlign: "center",
  },
  submitContainer: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "#F9F6EE",
    borderRadius: 10,
    width: 80,
  },
});

export default StylistModal;
