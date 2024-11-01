import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";

//child component imports
import Profiles from "@/components/Profiles";
import FilterBar from "@/components/FilterBar";

const Index = () => {
  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <FilterBar></FilterBar>
      </View>
      <View style={styles.profileContainer}>
        <Profiles></Profiles>
      </View>
      <View style={styles.navBarContainer}>
        <Link href="/Page">
          <Button title="Profile"></Button>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  profileContainer: {
    flex: 1, //takes up remain space after navBar and filter bar are set
  },
  filterContainer: {
    height: 60,
  },
  navBarContainer: {
    height: 60,
  },
});

export default Index;
