import React, { useState, useEffect, useCallback } from "react";

import {
  SafeAreaView,
  Button,
  TouchableOpacity,
  Touchable,
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";
import { db } from "../../config/firebase";
import { getDocs, collection } from "firebase/firestore";
import { useRouter } from "expo-router";
import { debounce, filter } from "lodash";
type ProfileData = {
  username: string;
  profilePic: string;
};

function Message() {
  const [search, setSearch] = useState<string>("");
  const router = useRouter();
  const [data, setData] = useState<ProfileData[]>([]);
  const [filteredData, setFilteredData] = useState<ProfileData[]>([]);
  const [username, setUsername] = useState("");
  //collection from firebase
  const accountInfo = collection(db, "AccountInfo");
  //fetch all usernames and download urls for profile pic
  useEffect(() => {
    const getUsers = async () => {
      const snapshot = await getDocs(accountInfo);
      const convertData = snapshot.docs.map((doc) => ({
        username: doc.data().username,
        profilePic: doc.data().profilePic,
      }));
      setData(convertData);
      setFilteredData(convertData);
      console.log("fetched");
    };
    getUsers();
  }, []);
  const filterSearch = () => {
    const filtered = data.filter((item) =>
      item.username.toLowerCase().includes(search.toLowerCase())
    );
    console.log("Function executed");
    setFilteredData(filtered);
  };
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/images/search.png")}
        style={styles.search}
      />
      <TextInput
        style={styles.searchBar}
        placeholder="Search for users"
        value={search}
        onChangeText={(newText) => {
          setSearch(newText);
          filterSearch();
        }}
      ></TextInput>
      <FlatList
        data={filteredData}
        style={{ marginTop: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setUsername(item.username);
              router.push("/chat");
            }}
          >
            <View style={styles.listContainer}>
              <View style={styles.listContent}>
                <Image
                  source={{ uri: item.profilePic }}
                  style={{ width: 50, height: 50, borderRadius: 40 }}
                />
                <Text>{item.username}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      ></FlatList>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    borderWidth: 0.5,
    borderColor: "black",
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 30,
    paddingLeft: 40,
    fontSize: 18,
  },
  search: {
    width: 25,
    height: 20,
    position: "absolute",
    left: 30,
    top: 55,
  },
  listContainer: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    padding: 10,
  },
  listContent: {
    flexDirection: "row",
  },
});
export default Message;
