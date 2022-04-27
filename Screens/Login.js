import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Button,
} from "react-native";
import { CheckBox } from "react-native-elements";
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

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT Password FROM SignupUsers WHERE Email = '" + email + "'",
          [],
          async (tx, results) => {
            var len = results.rows.length;
            if (len > 0) {
              let i;
              for (i = 0; i < len; i++) {
              var userEmail = results.rows.item(i).Email;
              var userPassword = results.rows.item(i).Password;
              }
              if (userEmail === email || userPassword === password) {
                try {
                    const jsonValue = JSON.stringify({loggedIn : true});
                    await AsyncStorage.setItem("Auth", jsonValue);
                    console.log("data saved")
                  } catch (e) {
                    console.log(e)
                  }
                navigation.replace("Home");
              } else {
                alert("Email and Password incorrect");
              }
            }
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  const rememberMe = () => {
    if (checked == false) {
      setChecked(!checked);
      // alert("Checked")
    } else {
      setChecked(!checked);
      // alert("unChecked")
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ marginLeft: 50, top: 80 }}>
        <Text style={{ fontWeight: "bold", fontSize: 35 }}>Welcome,</Text>
        <Text style={{ fontWeight: "400", fontSize: 30, color: "grey" }}>
          Log in to continue!
        </Text>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          bottom: 60,
        }}
      >
        <TextInput
          style={styles.input}
          placeholder="Email Id"
          value={email}
          onChangeText={(value) => setEmail(value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={(value) => setPassword(value)}
        />
        <View>
          <CheckBox
            title="Remember me"
            checked={checked}
            containerStyle={{ backgroundColor: "white", borderWidth: 0 }}
            checkedColor="#bd362f"
            onPress={rememberMe}
          />
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={getData}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{ bottom: 50, flexDirection: "row", justifyContent: "center" }}
      >
        <Text style={{ fontSize: 15 }}>Dont have an account, </Text>
        <TouchableOpacity onPress={() => navigation.replace("Signup")}>
          <Text style={{ fontSize: 15, fontWeight: "500", color: "#bd362f" }}>
            Signup?
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
