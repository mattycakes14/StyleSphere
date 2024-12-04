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
function ProfileModal({
  profileModal,
  setProfileModal,
}: {
  profileModal: boolean;
  setProfileModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  //fetch the user
  const auth = getAuth();
  //get the state of username, pronouns, email
  const [username, setUsername] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [phoneNum, setPhoneNum] = useState<number>(0);
  const email = auth.currentUser?.email;
  //collection ref
  const accountInfoRef = collection(db, "AccountInfo");
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
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [auth.currentUser?.uid]);
  //submitting username/pronouns to "AccountInfo" collection db in firebase
  const addInfo = async () => {
    try {
      //get the user object from the collection
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
          userId: auth.currentUser?.uid,
        });
        Alert.alert("Success", "Information submitted successfully!");
      } else {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          username: username,
          pronouns: pronouns,
          phoneNum: phoneNum,
        });
        Alert.alert("Updated success!", "Info has been updated!");
      }
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
          <TouchableOpacity>
            <Image
              style={{ width: 120, height: 120 }}
              source={require("../assets/images/user.png")}
            />
          </TouchableOpacity>
        </View>
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
        <View style={styles.updateContainer}>
          <TouchableOpacity onPress={addInfo}>
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
});
export default ProfileModal;
