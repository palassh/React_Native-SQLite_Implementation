import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
} from "react-native";
import * as SQLite from "expo-sqlite";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useIsFocused } from "@react-navigation/native";

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

export default function Home({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [title, setTitleArr] = useState("");
  const [desc, setDescArr] = useState("");
  const [total, setTotal] = useState("");
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getData();
    }
  }, [isFocused]);

  const getData = () => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT Email, Password, FirstName FROM SignupUsers",
          [],
          (tx, results) => {
            var len = results.rows.length;
            if (len > 0) {
              let i;
              for (i = 0; i < len; i++) {
                var userEmail = results.rows.item(i).Email;
                var userPassword = results.rows.item(i).Password;
                var userFirstName = results.rows.item(i).FirstName;
                setEmail(userEmail);
                setPassword(userPassword);
                setFirstName(userFirstName);
              }
            }
          }
        );
        tx.executeSql(
          "SELECT Title, Desc FROM CreateList",
          [],
          (tx, results) => {
            var len = results.rows.length;
            if (len > 0) {
              let i;
              let total = [];
              for (i = 0; i < len; i++) {
                var userTitle = results.rows.item(i).Title;
                var userDesc = results.rows.item(i).Desc;
                total.push({ userTitle: userTitle, userDesc: userDesc });
              }
              setTotal(total);
            }
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  // const updateData = async () => {
  //   if (email.length == 0) {
  //     alert("Warning!", "Please write your data.");
  //   } else {
  //     try {
  //       db.transaction((tx) => {
  //         tx.executeSql(
  //           "UPDATE SignupUsers SET Email=?",
  //           [email],
  //           () => {
  //             alert("Success! Your data has been updated.");
  //           },
  //           (error) => {
  //             console.log(error);
  //           }
  //         );
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // };

  const data = [...total];

  const renderItem = ({ item }) => {
    console.log("item", item);
    return (
      <View style={{ flexDirection: "row", flex: 1 }}>
        <View
          style={{
            borderWidth: 1,
            borderColor: "black",
            marginVertical: 1,
            flex: 1,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "400" }}>
            {item.userTitle}
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "400" }}>
            {item.userDesc}
          </Text>
        </View>
        {/* <View style={{ justifyContent: "center" }}>
          <TouchableOpacity>
            <MaterialCommunityIcons name="delete" size={30} color="#bd362f" />
          </TouchableOpacity>
        </View> */}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, marginTop: 7 }}>
          <FlatList data={data} renderItem={renderItem} />
        </View>
      </View>

      <View style={{ justifyContent: "flex-end" }}>
        <TouchableOpacity onPress={() => navigation.navigate("CreateList")}>
          <Ionicons name="add-circle-outline" size={50} color="#bd362f" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "row",
    paddingHorizontal: 20,
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
  updateButton: {
    width: 70,
    height: 70,
    backgroundColor: "#bd362f",
    borderRadius: 35,
    marginTop: 20,
  },
  updateButtonText: {
    textAlign: "center",
    marginTop: 26,
    fontSize: 15,
    color: "white",
    fontWeight: "500",
  },
});
