import React, { useState, useCallback, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { useRouter } from "expo-router";

function Chat({ username }: { username: string }) {
  console.log(username);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={styles.backBarContainer}
          onPress={() => router.back()}
        >
          <Image
            source={require("../assets/images/back.png")}
            style={styles.backButton}
          />
        </TouchableOpacity>
        <View style={styles.usernameContainer}>
          <Text>{username}</Text>
        </View>
      </View>
      <GiftedChat />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    height: 50,
    borderBottomColor: "#f4f1f1",
    borderBottomWidth: 2,
  },
  container: {
    flex: 1, // Ensures SafeAreaView fills the screen
    backgroundColor: "white",
  },
  backBarContainer: {
    justifyContent: "center",
  },
  usernameContainer: {
    justifyContent: "center",
    marginLeft: 60,
  },
  backButton: {
    marginLeft: 20,
    width: 30,
    height: 30,
  },
});

export default Chat;
