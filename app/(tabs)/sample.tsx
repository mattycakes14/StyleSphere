// TabNavigator.tsx
import React from "react";
import HomePage from "./HomePage";
import Message from "./Message";
import Profile from "./Profile";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{
          title: "",
          tabBarIcon: ({ size, color }) => (
            <Ionicons
              name={"home-outline"}
              color={color}
              size={size}
            ></Ionicons>
          ),
        }}
      />
      <Tab.Screen
        name="Message"
        component={Message}
        options={{
          title: "",
          tabBarIcon: ({ size, color }) => (
            <Ionicons
              name={"chatbubble-ellipses-outline"}
              size={size}
              color={color}
            ></Ionicons>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: "",
          tabBarIcon: ({ size, color }) => (
            <Ionicons
              name={"person-circle-outline"}
              size={size}
              color={color}
            ></Ionicons>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
