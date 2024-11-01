import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Profiles from "@/components/Profiles";
import Filter from "@/components/Filter";
import NavBar from "@/components/NavBar";

const Index = () => {
  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Filter></Filter>
      </View>
      <View style={styles.profileContainer}>
        <Profiles></Profiles>
      </View>
      <View style={styles.navBarContainer}>
        <NavBar></NavBar>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    height: 100,
  },
  navBarContainer: {
    height: 60,
  },
  profileContainer: {
    flex: 1,
  },
});

export default Index;
