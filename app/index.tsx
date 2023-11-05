import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Dialog from "react-native-dialog";

const Page = () => {
  const groups = useQuery(api.groups.get) || [];
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [greeting, setGreeting] = useState("");
  const performGreeting = useAction(api.greeting.getGreeting);

  useEffect(() => {
    const loadUser = async () => {
      const user = await AsyncStorage.getItem("user");
      if (!user) {
        setTimeout(() => {
          setVisible(true);
        }, 100);
      } else {
        setName(user);
      }
    };
    loadUser();
    // AsyncStorage.clear();
  }, []);

  useEffect(() => {
    if (!name) return;
    const loadGreeting = async () => {
      const greeting = await performGreeting({ name });
      setGreeting(greeting);
    };
    loadGreeting();
  }, [name]);

  const setUser = async () => {
    let random = (Math.random() + 1).toString(36).substring(7);
    const username = `${name}#${random}`;
    await AsyncStorage.setItem("user", username);
    setName(username);
    setVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {groups.map((group) => (
          <Link
            href={{
              pathname: "/(chat)/[chatid]",
              params: { chatid: group._id },
            }}
            key={group._id.toString()}
            asChild
          >
            <TouchableOpacity style={styles.group}>
              <Image
                source={{ uri: group.icon_url }}
                style={{ width: 50, height: 50 }}
              />
              <View style={{ flex: 1 }}>
                <Text>{group.name}</Text>
                <Text style={{ color: "#888" }}>{group.description}</Text>
              </View>
            </TouchableOpacity>
          </Link>
        ))}
        <Text style={{ textAlign: "center", margin: 10 }}>{greeting}</Text>
      </ScrollView>
      <Dialog.Container visible={visible}>
        <Dialog.Title style={styles.dialogTitle}>
          Username Required
        </Dialog.Title>
        <Dialog.Description style={styles.dialogDescription}>
          Please insert a name to start chatting
        </Dialog.Description>
        <Dialog.Input style={styles.dialogInput} onChangeText={setName} />
        <Dialog.Button
          label="Set name"
          onPress={setUser}
          disabled={name === ""}
        />
      </Dialog.Container>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f8f5ea",
  },
  group: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    elevation: 3,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  dialogTitle: {
    color: "#000",
    fontSize: 22,
  },
  dialogDescription: {
    color: "#000",
    fontSize: 20,
  },
  dialogInput: {
    color: "#000",
    borderRadius: 10,
  },
});

export default Page;
