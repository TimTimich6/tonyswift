import { StyleSheet, View, Text, ActivityIndicator, FlatList, TouchableWithoutFeedback, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import CountDown from "react-native-countdown-component";
import axios from "axios";
import colors from "../config/colors";

function Rooms() {
  const [isLoading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getRooms();
  }, []);

  const getRooms = () => {
    axios
      .get("https://quickier.xyz/api/rooms?tags=Sports,Games,Others")
      .then((response) => {
        const allRooms = response.data;
        console.log(response.data);
        setRooms(allRooms);
        setFilteredRooms(allRooms);
      })
      .catch((error) => console.log("error"))
      .finally(() => setLoading(false));
  };
  // test commet
  const searchFilter = (text) => {
    if (text) {
      const newData = rooms.filter((item) => {
        const itemData = item.title ? item.title.toUpperCase() : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredRooms(newData);
      setSearch(text);
    } else {
      setFilteredRooms(rooms);
      setSearch(text);
    }
  };

  const handleLike = (id) => {
    {
      rooms.map((room) => {
        if (room.id == id) {
          room.likes += 1;
          console.log("Liked");
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftHeader}>
          <MaterialIcons name="account-circle" size={25} style={styles.userIcon} color={colors.gray} />
          <Feather name="settings" size={25} style={styles.settingsIcon} color={colors.gray} />
        </View>
        <View style={styles.centerHeader}>
          <Text style={styles.headerText}>Chat</Text>
        </View>
        <View style={styles.rightHeader}>
          <Feather name="message-circle" size={25} style={styles.messageIcon} color={colors.gray} />
        </View>
      </View>
      <TextInput
        style={styles.searchBar}
        placeholder="Search"
        value={search}
        underlineColorAndroid="transparent"
        onChangeText={(text) => searchFilter(text)}
      />
      <>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={filteredRooms}
            inverted={true}
            contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            style={styles.list}
            renderItem={({ item }) => {
              return (
                <TouchableWithoutFeedback onPress={() => console.log(item.title)}>
                  <View style={styles.listContainer}>
                    <View style={styles.listContainerHead}>
                      <Text style={styles.title}>{item.title}</Text>
                      <CountDown
                        size={15}
                        until={item.time / 1000}
                        onFinish={() => console.log("Expired")}
                        digitStyle={{ backgroundColor: colors.peach2, borderWidth: 2, borderColor: colors.black }}
                        digitTxtStyle={{ color: colors.black, fontWeight: "bold" }}
                        timeLabelStyle={{ color: "red", fontWeight: "bold" }}
                        separatorStyle={{ color: colors.black }}
                        timeToShow={["H", "M", "S"]}
                        timeLabels={{ m: null, s: null }}
                        showSeparator
                      />
                    </View>
                    <View style={styles.tags}>
                      {item.tags.map((tag, index) => {
                        return (
                          <Text style={styles.tag} key={index.toString()}>
                            {tag}{" "}
                          </Text>
                        );
                      })}
                    </View>
                    <View style={styles.listContainerbottom}>
                      <TouchableWithoutFeedback onPress={() => handleLike(item.id)}>
                        <MaterialCommunityIcons name="heart" size={25} style={styles.heartIcon} />
                      </TouchableWithoutFeedback>
                      <Text style={styles.likes}>{item.likes}</Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              );
            }}
          />
        )}
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 55,
  },
  leftHeader: {
    flexDirection: "row",
  },
  userIcon: {
    marginLeft: 20,
  },
  settingsIcon: {
    marginLeft: 20,
  },
  centerHeader: {
    marginRight: 45,
  },
  headerText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 18,
  },
  rightHeader: {
    marginRight: 20,
  },
  searchBar: {
    height: 35,
    marginTop: 10,
    marginHorizontal: 20,
    backgroundColor: colors.white,
    borderRadius: 10,
  },
  list: {
    marginTop: 20,
    marginHorizontal: 15,
  },
  listContainer: {
    backgroundColor: colors.darkPeach,
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
  },
  listContainerHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: colors.black,
    fontSize: 17,
    fontWeight: "600",
  },
  timer: {
    color: colors.gray,
    fontSize: 17,
    fontWeight: "bold",
    marginRight: 10,
  },
  tags: {
    flexDirection: "row",
  },
  tag: {
    color: colors.gray,
    marginTop: 1,
    fontSize: 17,
  },
  listContainerbottom: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  heartIcon: {
    color: colors.red,
  },
  likes: {
    color: colors.black,
    fontSize: 18,
    marginLeft: 5,
  },
});

export default Rooms;
