import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { getDocs, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "@/config/firebase";
import { FontAwesome } from "@expo/vector-icons";
const Review = ({
  review,
  setReview,
}: {
  review: boolean;
  setReview: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  //reference to review collection
  const reviewInfo = collection(db, "Reviews");
  //userId
  const userId = getAuth().currentUser?.uid;
  //object array for reviews
  const [reviews, setReviews] = useState([]);
  //stars value
  const stars = [1, 2, 3, 4, 5];
  useEffect(() => {
    const getReviews = async () => {
      try {
        const reviews = await getDocs(reviewInfo);
        const convertData = reviews.docs.map((doc) => {
          return {
            ...doc.data(),
          };
        });
        const filteredData = convertData.filter(
          (review) => review.revieweeUserId === userId
        );
        setReviews(filteredData);
      } catch (err) {
        console.error(err);
      }
    };
    getReviews();
  }, []);

  console.log(reviews);
  return (
    <Modal transparent={true} visible={review} animationType="fade">
      <SafeAreaView style={style.modalOverlay}>
        <View style={style.modalContent}>
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text>Your Reviews</Text>
          </View>
          <TouchableOpacity onPress={() => setReview(false)}>
            <Image
              source={require("../assets/images/close.png")}
              style={{
                width: 20,
                height: 20,
                marginLeft: 20,
                top: -15,
                marginBottom: 15,
              }}
            />
          </TouchableOpacity>
          <ScrollView>
            {reviews.map((reviews) => (
              <View>
                <View style={{ flexDirection: "row" }}>
                  <Image
                    source={require("../assets/images/user.png")}
                    style={{ width: 40, height: 40, marginLeft: 5 }}
                  />
                  <Text style={{ marginLeft: 10, marginTop: 10 }}>
                    {stars.map((starVal) => (
                      <FontAwesome
                        style={{ padding: 2 }}
                        name="star"
                        size={20}
                        color={starVal <= reviews.stars ? "#FFD700" : "#D3D3D3"}
                      ></FontAwesome>
                    ))}
                  </Text>
                </View>
                <Text style={{ marginTop: 10 }}>{reviews.review}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
const style = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    flex: 0.5,
    backgroundColor: "white",
    width: 300,
    borderRadius: 50,
  },
});
export default Review;
