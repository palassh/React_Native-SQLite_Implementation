import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Button,
} from "react-native";
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

export default function CreateList({ navigation }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  

  useEffect(() => {
    createTable();
  }, []);

  const createTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS " +
          "CreateList " +
          "(ID INTEGER PRIMARY KEY AUTOINCREMENT, Title TEXT, Desc Text);"
      );
    });
  };

  const setData = async () => {
    if (title.length == 0 || desc.length == 0) {
      alert("Warning!, Please write your data.");
    } else {
      try {
        await db.transaction(async (tx) => {
          await tx.executeSql(
            "INSERT INTO CreateList (Title, Desc) VALUES (?,?)",
            [title, desc]
          );
          navigation.navigate("Home");
        });
        
        
      } catch (error) {
        console.log(error);
      }
    }
  };

  const removeData = async () => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "DELETE FROM CreateList",
          [],
          () => {
            navigation.navigate("Home");
          },
          (error) => {
            console.log(error);
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        flex: 1,
      }}
    >
      <View>
        <TextInput
          style={styles.input}
          placeholder="title"
          value={title}
          onChangeText={(value) => setTitle(value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={desc}
          multiline={true}
          onChangeText={(value) => setDesc(value)}
        />
      </View>
      <View>
        <TouchableOpacity style={styles.updateButton} onPress={setData}>
          <Text style={styles.updateButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity style={styles.updateButton} onPress={removeData}>
          <Text style={styles.updateButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: 500,
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
    width: 300,
    height: 45,
    backgroundColor: "#bd362f",
    borderRadius: 10,
    marginTop: 20,
  },
  updateButtonText: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 19,
    color: "white",
    fontWeight: "500",
  },
});
