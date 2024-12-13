import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState, useEffect } from "react";
import { auth } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
} from "firebase/auth";
//defining the types for props
interface SignInProps {
  signInVisible: boolean;
  onClose: () => void;
  setSignInVisible: React.Dispatch<React.SetStateAction<boolean>>; //syntax for setting the type of a setter for useState() function
}
const SignIn: React.FC<SignInProps> = ({
  signInVisible,
  onClose,
  setSignInVisible,
}) => {
  //defining screens
  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<NavigationProp>();

  //state for signUp and signIn content
  const [signUpVisible, setSignUpVisible] = useState<boolean>(false);

  //state for taking password and email
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  //Successful login (navigates to home and closes modal)
  const handleLogIn = () => {
    navigation.navigate("(tabs)/sample");
    setSignInVisible(false);
  };
  //register function
  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      console.log("User login success:", user);
      setSignInVisible(false);
      handleLogIn();
    } catch (err) {
      console.error(err);
    }
  };
  //login function
  const login = async () => {
    try {
      const userAlready = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      console.log("User logged in successfully", userAlready);
      handleLogIn();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <View>
      <Modal transparent={true} visible={signInVisible} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.closeContainer}>
            <TouchableOpacity onPress={onClose}>
              <Image
                source={require("../assets/images/close.png")}
                style={styles.closeStyle}
              />
            </TouchableOpacity>
          </View>
          {signUpVisible ? ( //rendering conditional depending on state value of signUpVisible
            <>
              <View style={{ marginTop: 30 }}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Email"
                  placeholderTextColor="gray"
                  onChangeText={(newRegisterEmail) =>
                    setRegisterEmail(newRegisterEmail)
                  }
                ></TextInput>
              </View>
              <View style={{ margin: 10 }}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Password"
                  placeholderTextColor="gray"
                  onChangeText={(newRegisterPassword) =>
                    setRegisterPassword(newRegisterPassword)
                  }
                  secureTextEntry={true}
                ></TextInput>
              </View>
              <View style={styles.alreadyHaveAccountContainer}>
                <TouchableOpacity onPress={() => setSignUpVisible(false)}>
                  <Text>Already have an account?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.createAccountContainer}>
                <TouchableOpacity onPress={register}>
                  <Text>Create account</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View style={{ marginTop: 30 }}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Email"
                  placeholderTextColor="gray"
                  onChangeText={(newEmail) => setLoginEmail(newEmail)}
                ></TextInput>
              </View>
              <View style={{ margin: 10 }}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Password"
                  placeholderTextColor="gray"
                  onChangeText={(newPassword) => setLoginPassword(newPassword)}
                  secureTextEntry={true}
                ></TextInput>
              </View>
              <View>
                <TouchableOpacity onPress={() => setSignUpVisible(true)}>
                  <Text>Don't Have An Account?</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 0.2, justifyContent: "flex-end" }}>
                <TouchableOpacity onPress={login}>
                  <Text>Sign In </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    shadowOpacity: 1,
    marginLeft: 50,
    marginRight: 50,
    marginTop: 250,
    marginBottom: 250,
    borderRadius: 10,
  },
  closeContainer: {
    position: "absolute",
    right: 20,
    top: 20,
  },
  closeStyle: { width: 20, height: 20 },
  textInputContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  textInput: {
    borderWidth: 0.5,
    borderColor: "black",
    width: 170,
    height: 25,
    borderRadius: 3,
    padding: 2,
  },
  alreadyHaveAccountContainer: {
    flex: 0.25,
  },
  createAccountContainer: {
    backgroundColor: "#ff7a7a",
    flex: 0.1,
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 5,
    padding: 4,
  },
});
