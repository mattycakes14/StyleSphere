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
  TouchableWithoutFeedback,
  Keyboard,
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
  onSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";

function Description({
  descriptionVisibility,
  setDescriptionVisibiity,
}: {
  descriptionVisibility: boolean;
  setDescriptionVisibiity: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const auth = getAuth();
  //getting state of input
  const [desc, setDesc] = useState("");
  const [char, setCharCount] = useState(0);
  const max = 200;
  //reference to stylist collection
  const stylistInfo = collection(db, "AccountInfo");
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
          setDesc(docRef.description);
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
          description: desc,
        });
        Alert.alert("Update Success!", "Your information has been updated");
      } else {
        console.log("No info found");
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Modal
      visible={descriptionVisibility}
      animationType="fade"
      transparent={true}
    >
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={() => setDescriptionVisibiity(false)}>
              <Image
                source={require("../assets/images/close.png")}
                style={{ width: 20, height: 20, left: -120 }}
              />
            </TouchableOpacity>
            <View style={styles.textContainer}>
              <Text>{desc?.length} of 200 max characters</Text>
              <TextInput
                style={styles.textInputStyle}
                placeholder="Add description here"
                placeholderTextColor="gray"
                multiline
                numberOfLines={5}
                value={desc}
                onChangeText={(newText) => {
                  setCharCount(newText?.length);
                  if (newText?.length < max) {
                    setDesc(newText);
                  }
                }}
              ></TextInput>
            </View>
            <View style={styles.submitContainer}>
              <TouchableOpacity onPress={submitStylistInfo}>
                <Text style={styles.submitText}>Submit </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
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
    height: 200,
  },
  textContainer: {
    marginTop: 20,
  },
  submitText: {
    fontFamily: "Inter_24pt-BoldItalic",
    padding: 10,
    textAlign: "center",
    color: "white",
  },
  submitContainer: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "black",
    borderRadius: 10,
    width: 80,
  },
});

export default Description;
