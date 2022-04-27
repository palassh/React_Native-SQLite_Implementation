import React, { useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer,useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Login from "../Screens/Login";
import Home from "../Screens/Home";
import Signup from "../Screens/Signup";
import CreateList from "../Screens/Create";
import DetailScreen from "../Screens/DetailScreen";

const Stack = createStackNavigator();
export default function AppNavigation(props) {
    // const navigation = useNavigation();
    // console.log("props",navigation)
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Signup"
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
            headerTitle: "Home",
            headerStyle: {
              backgroundColor: "#bd362f",
            },
            headerTintColor: "white",
            headerRight: () => (
              <TouchableOpacity
                style={{ paddingHorizontal: 12 }}
                onPress={() => {}}
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
