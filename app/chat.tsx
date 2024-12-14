import React, { useState, useCallback, useLayoutEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  addDoc,
  query,
  orderBy,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { GiftedChat } from "react-native-gifted-chat";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";

type Message = {
  _id: string;
  createdAt: Date | string;
  text: string;
  user: {
    _id: string;
    name?: string;
    avatar?: string;
  };
};

function Chat({ username }: { username: string }) {
  console.log(username);
  const router = useRouter();
  const auth = getAuth();
  const [messages, setMessages] = useState<Message[]>([]);

  useLayoutEffect(() => {
    const collectionRef = collection(db, "chats");
    const q = query(collectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("snapshot");
      setMessages(
        snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            _id: doc.id,
            createdAt: data?.createdAt?.toDate?.() || data?.createdAt,
            text: data?.text,
            user: data?.user,
          };
        })
      );
    });

    return () => unsubscribe();
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(db, "chats"), {
      _id,
      createdAt,
      text,
      user,
    });
  }, []);

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
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: auth.currentUser?.email,
        }}
      />
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
