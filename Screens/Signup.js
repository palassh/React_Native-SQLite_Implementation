import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Button,
  ScrollView,
  Keyboard,
  Image,
} from "react-native";
import * as SQLite from "expo-sqlite";
import * as AppUtils from "../AppUtils/index";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export default function Signup({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    createTable();
    getData();
  }, []);

  const createTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS " +
          "SignupUsers " +
          "(ID INTEGER PRIMARY KEY AUTOINCREMENT, FirstName TEXT, LastName TEXT, Address TEXT,State TEXT, City TEXT, Mobile INTEGER, Email TEXT UNIQUE, Password TEXT);"
      );
    });
  };

  const getData = async () => {
    try {
      const auth = JSON.parse(await AsyncStorage.getItem("Auth"));
      if (auth !== null) {
        if (auth.loggedIn) {
          navigation.navigate("Home");
        }
      }
    } catch (e) {
      // error reading value
    }
  };

  const setData = async () => {
    if (!AppUtils.isEmailValid(email)) {
      alert("Invalid Email");
    } else if (!AppUtils.isPasswordValid(password || password.length >= 8)) {
      alert("Invalid Password");
    } else {
      try {
        await db.transaction(async (tx) => {
          await tx.executeSql(
            "INSERT INTO SignupUsers (FirstName, LastName, Address, State, City, Mobile, Email, Password) VALUES (?,?,?,?,?,?,?,?)",
            [firstName, lastName, address, state, city, mobile, email, password]
          );
        });
        navigation.replace("Login");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const openImagePickerAsync = async () => {
    const permissionResult =
      await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true) {
      return;
    }

    setSelectedImage({ localUri: pickerResult.uri });
  };

  return (
    <View style={{ backgroundColor: "white" }}>
      <View style={{ flexDirection: "row" }}>
        <View style={{ marginLeft: 50, top: 20, flex: 1 }}>
          <Text style={{ fontWeight: "bold", fontSize: 35 }}>
            Create Account,
          </Text>
          <Text style={{ fontWeight: "400", fontSize: 30, color: "grey" }}>
            Sign up to get started!
          </Text>
          <TouchableOpacity style={styles.loginButton} onPress={setData}>
            <Text style={styles.loginButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            marginTop: 10,
          }}
        >
          <TouchableOpacity onPress={openImagePickerAsync}>
            <Image
              source={{
                uri:
                  selectedImage && selectedImage.localUri
                    ? selectedImage.localUri
                    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
              }}
              style={styles.logo}
            />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="First Name"
            onChangeText={(value) => setFirstName(value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            onChangeText={(value) => setLastName(value)}
          />
          <TextInput
            style={styles.addressInput}
            placeholder="Address"
            multiline={true}
            onChangeText={(value) => setAddress(value)}
          />
          <TextInput
            style={styles.input}
            placeholder="State"
            onChangeText={(value) => setState(value)}
          />
          <TextInput
            style={styles.input}
            placeholder="City"
            onChangeText={(value) => setCity(value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Mobile No."
            onChangeText={(value) => setMobile(value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={(value) => setEmail(value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(value) => setPassword(value)}
          />
        </View>
      </View>
      <View
        style={{
          bottom: 30,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-end",
          flex: 1,
        }}
      >
        <Text style={{ fontSize: 15 }}>Already Have an account, </Text>
        <TouchableOpacity onPress={() => navigation.replace("Login")}>
          <Text style={{ fontSize: 15, fontWeight: "500", color: "#bd362f" }}>
            Login?
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "white",
  },
  input: {
    width: 300,
    height: 45,
    borderWidth: 1.5,
    borderColor: "grey",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    fontSize: 15,
    marginBottom: 20,
    paddingLeft: 8,
  },
  addressInput: {
    width: 300,
    height: 90,
    borderWidth: 1.5,
    borderColor: "grey",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    fontSize: 15,
    marginBottom: 20,
    paddingLeft: 8,
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
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  instructions: {
    color: "#888",
    fontSize: 18,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "blue",
    padding: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 50,
    // resizeMode: "contain",
  },
});
