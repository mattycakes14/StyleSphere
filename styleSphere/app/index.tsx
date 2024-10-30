import React from "react";
import { View, Image, Text, Button, StyleSheet } from "react-native";
import { useState } from "react";
type hooperNames = {
  name: string;
};

const index = () => {
  return (
    <View>
      <Hoopers name="matt"></Hoopers>
      <Hoopers name="Caleb"></Hoopers>
      <Hoopers name="Rishit"></Hoopers>
    </View>
  );
};

const Hoopers = (props: hooperNames) => {
  const [shotsMade, changeShots] = useState(0);

  const incrementShots = () => {
    changeShots(shotsMade + 1);
  };
  return (
    <View>
      <Text>Shot tracker for {props.name}</Text>
      <Button onPress={incrementShots} title="Press IF he made it"></Button>
      <Text>
        {props.name} currently has made {shotsMade} number of shots
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: center;
  }
});
export default index;
