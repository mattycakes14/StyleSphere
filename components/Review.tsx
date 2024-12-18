import React from "react";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Touchable,
} from "react-native";
const Review = ({
  review,
  setReview,
}: {
  review: boolean;
  setReview: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Modal transparent={true} visible={review} animationType="fade">
      <TouchableWithoutFeedback onPress={() => setReview(false)}>
        <SafeAreaView style={style.modalOverlay}>
          <View style={style.modalContent}>
            <Text>Hello</Text>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
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
    justifyContent: "center",
    alignItems: "center",
    width: 300,
    borderRadius: 50,
  },
});
export default Review;
