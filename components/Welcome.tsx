import {
  Text,
  View,
  Button,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import SignIn from "./SignIn";
import { useFonts } from "expo-font";
import { useState, useEffect } from "react";
import BottomSheet from "@gorhom/bottom-sheet";

function Welcome() {
  const [signInVisible, setSignInVisible] = useState<boolean>(false);
  const [location, setLocation] = useState();
  //user permissions

  let [fontsLoaded] = useFonts({
    "Inter_24pt-BoldItalic": require("../assets/fonts/Inter_24pt-BoldItalic.ttf"),
  });
  if (!fontsLoaded) {
    return <Text>Font is loading</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <BottomSheet>
        <View>
          <Text>Hello this is a bottom sheet</Text>
        </View>
      </BottomSheet>
      <View style={styles.imageContainer}>
        <Image
          style={{ width: 300, height: 300 }}
          source={require("../assets/images/stockImage.jpg")}
        />
      </View>
      <View style={styles.welcomeMessageContainer}>
        <Text style={styles.welcomeMessageText}>Find Your Stylist</Text>
        <Text style={styles.welcomeMessageDescriptor}>
          StyleSphere helps college students connect with local stylists,
          anywhere, anytime.
        </Text>
      </View>
      <TouchableOpacity style={styles.getStartedContainer}>
        <Text
          style={styles.getStartedText}
          onPress={() => setSignInVisible(true)}
        >
          Get Started
        </Text>
      </TouchableOpacity>
      <SignIn
        signInVisible={signInVisible}
        onClose={() => setSignInVisible(false)}
        setSignInVisible={setSignInVisible}
      ></SignIn>
    </SafeAreaView>
  );
}
export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  getStartedContainer: {
    flex: 0.5,
    justifyContent: "flex-end",
    marginBottom: 20,
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  getStartedText: {
    fontFamily: "Inter_24pt-BoldItalic",
    color: "white",
    backgroundColor: "#ff7a7a",
    padding: 15,
    borderRadius: 10,
  },
  welcomeMessageContainer: {
    flex: 0.8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  welcomeMessageText: {
    fontFamily: "Inter_24pt-BoldItalic",
    fontSize: 30,
    textAlign: "center",
  },
  welcomeMessageDescriptor: { margin: 20, textAlign: "center" },
});
