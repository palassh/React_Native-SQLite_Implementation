import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import * as SQLite from "expo-sqlite";
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export default function DetailScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT FirstName, LastName, Address, Email, Mobile FROM SignupUsers",
          [],
          (tx, results) => {
            var len = results.rows.length;
            if (len > 0) {
              let i;
              for (i = 0; i < len; i++) {
                var userFirstName = results.rows.item(i).FirstName;
                var userLastName = results.rows.item(i).LastName;
                var userAddress = results.rows.item(i).Address;
                var userEmail = results.rows.item(i).Email;
                var userMobile = results.rows.item(i).Mobile;
                setFirstName(userFirstName);
                setLastName(userLastName);
                setAddress(userAddress);
                setEmail(userEmail);
                setMobile(userMobile);
              }
            }
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  const removeData = async () => {
    try {
      await AsyncStorage.setItem("Auth", null);
      navigation.navigate('Login')
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ paddingVertical: 8 }}>
        <Image
          style={{ width: 100, height: 100, borderRadius: 50 }}
          source={require("../assets/IMG_2402.jpg")}
        />
      </View>
      <View>
        <Text
          style={{
            fontWeight: "450",
            fontSize: 20,
            fontStyle: "italic",
            paddingLeft: 3,
          }}
        >
          {firstName} {lastName}
        </Text>
      </View>

      <View style={{ marginTop: 30, alignItems: "center" }}>
        <Text
          style={{
            fontWeight: "350",
            fontSize: 20,
            paddingLeft: 3,
            paddingVertical: 0,
            borderBottomWidth: 1,
          }}
        >
          Address : {address}
        </Text>
        <Text
          style={{
            fontWeight: "350",
            fontSize: 20,
            paddingLeft: 3,
            paddingVertical: 7,
            borderBottomWidth: 1,
          }}
        >
          Email: {email}
        </Text>
        <Text
          style={{
            fontWeight: "350",
            fontSize: 20,
            paddingLeft: 3,
            paddingVertical: 7,
            borderBottomWidth: 1,
          }}
        >
          Mobile No: {mobile}
        </Text>
      </View>
      <View>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={removeData}
        >
          <Text style={styles.loginButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    alignItems: "center",
    flex: 1,
  },
  loginButton: {
    width: 300,
    height: 45,
    backgroundColor: "#bd362f",
    borderRadius: 10,
    marginTop: 20,
  },
  loginButtonText: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 19,
    color: "white",
    fontWeight: "500",
  },
});
