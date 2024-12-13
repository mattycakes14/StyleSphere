import React, { useEffect, useState } from "react";
import { SafeAreaView, Button } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { storage } from "../../config/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
function Message() {
  const selectImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      console.log("No Permission");
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeImages,
    });

    if (pickerResult.canceled) {
      console.log("Photo albumn cancled");
    } else {
      //if successful get the uri from the object array
      const uri = pickerResult.assets[0].uri;

      //upload image
      const responseData = await fetch(uri);
      const blob = await responseData.blob();
      console.log(blob);
      console.log(blob.type);
      console.log(blob.size);
      try {
        //storage reference
        const storageRef = ref(storage, "image/" + new Date().getTime());

        const uploadTask = uploadBytesResumable(storageRef, blob);
        uploadTask.on("state_changed", null, (error) => {
          console.error("Upload failed:", error);
          console.error("Error payload:", error.serverResponse);
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <SafeAreaView>
      <Button title="upload image" onPress={selectImage}></Button>
      <Button title="debug" onPress={() => console.log(storage)} />
    </SafeAreaView>
  );
}

export default Message;
