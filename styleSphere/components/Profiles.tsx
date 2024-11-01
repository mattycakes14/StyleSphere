import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, PanResponder } from "react-native";
import Swiper from "react-native-deck-swiper";
import { WebView } from "react-native-webview";

//each barber profile
const profiles = [
  {
    id: 1,
    name: "matt",
    services: ["Fades", "Tapers", "Eyebrows", "Trimming"],
  },
  {
    id: 2,
    name: "caleb",
    services: ["Fades", "Tapers", "Eyebrows", "Trimming"],
  },
  {
    id: 3,
    name: "rishit",
    services: ["Fades", "Tapers", "Eyebrows", "Trimming"],
  },
  {
    id: 4,
    name: "emmalyn",
    services: ["Fades", "Tapers", "Eyebrows", "Trimming"],
  },
];

const Profiles = () => {
  const [cardVal, updateCard] = useState<number>(0); //State for card indexing

  const handleSwipeRight = (index: number) => {
    if (index >= profiles.length - 1) {
      //last card in data
      updateCard(0);
    } else {
      updateCard(index + 1);
    }
  };
  return (
    <View>
      <View style={styles.container}>
        <Swiper
          key={cardVal} //key prop allows Swiper to re-render
          cards={profiles}
          cardIndex={cardVal}
          renderCard={(
            profile //param corresponds to each val in cards(data) arbitrary param
          ) => (
            <View style={styles.card}>
              <Text style={styles.cardText}>{profile.name}</Text>
            </View>
          )}
          onSwipedRight={handleSwipeRight} //only right swipe
          disableLeftSwipe={true}
          verticalSwipe={false}
        ></Swiper>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  card: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#000",
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    margin: 10,
    height: 500,
  },
  cardText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Profiles;
