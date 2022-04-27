import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Login from "./Screens/Login";
import Home from "./Screens/Home";
import Signup from "./Screens/Signup";
import CreateList from "./Screens/Create";
import DetailScreen from "./Screens/DetailScreen";
import { navigationRef } from "./RootNavigation";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase(
  {
    name: "MainDB",
    location: "default",
  },
  () => {},
  (error) => {
    console.log(error);
  }
);

const Stack = createStackNavigator();
export default function App() {
  const [firstName, setFirstName] = useState("");
    const getData = () => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT FirstName FROM SignupUsers",
          [],
          (tx, results) => {
            var len = results.rows.length;
            if (len > 0) {
              let i;
              for (i = 0; i < len; i++) {
                var userFirstName = results.rows.item(i).FirstName;
                setFirstName(userFirstName);
              }
            }
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerStyle: {
              backgroundColor: "#bd362f",
            },
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerTitle: {firstName},
            headerStyle: {
              backgroundColor: "#bd362f",
            },
            headerTintColor: "white",
            headerRight: () => (
              <TouchableOpacity
                style={{ paddingHorizontal: 12 }}
                onPress={() => navigationRef.navigate("DetailScreen")}
              >
                <Ionicons name="ios-navigate-circle" size={35} color="white" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{
            headerTitle: "Sign up",
            headerStyle: {
              backgroundColor: "#bd362f",
            },
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="CreateList"
          component={CreateList}
          options={{
            headerStyle: {
              backgroundColor: "#bd362f",
            },
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="DetailScreen"
          component={DetailScreen}
          options={{
            headerTitle: "Profile Details",
            headerStyle: {
              backgroundColor: "#bd362f",
            },
            headerTintColor: "white",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
