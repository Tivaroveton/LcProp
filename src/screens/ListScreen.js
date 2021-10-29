import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { SearchBar } from "react-native-elements";
import ProjectScreen from "./ProjectScreen"; //Menu Screen of Project
// import { PROJECTS } from "../data/project_data"; //set DATA here
import CalendarIcon from "../../components/CalendarIcon";

function ListScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState("");
  const [masterDataSource, setMasterDataSource] = useState("");
  const dataURL = "https://www.jobprocess.landmarkcon.net/api/jobapi";

  useEffect(() => {
    const fetchMyAPI = () => {
      return fetch(dataURL)
        .then((response) => response.json())
        .then((json) => {
          setFilteredDataSource(json);
          setMasterDataSource(json);
          return json;
        })
        .catch((error) => {
          console.error(error);
        });
    };
    const initData = fetchMyAPI();
  }, []);

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank -> Filter the masterDataSource -> Update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
        const itemTitle = item.projectname
          ? item.projectname.toUpperCase()
          : "".toUpperCase();
        const itemID = item.id ? item.id.toUpperCase() : "".toUpperCase();
        const textData = text.toUpperCase();
        const idData = text.toUpperCase();

        return itemTitle.indexOf(textData) > -1 || itemID.indexOf(idData) > -1;
      });
      setFilteredDataSource(newData);
    } else {
      // Inserted text is blank -> Update FilteredDataSource with masterDataSource
      setFilteredDataSource(masterDataSource);
    }
    setSearch(text);
  };

  const renderItem = (itemData) => {
    return (
      <Item
        id={itemData.item.id}
        jobcode={itemData.item.jobcode}
        projectname={itemData.item.projectname}
        lcduedate={itemData.item.lcduedate}
        valuer_n={itemData.item.valuer_n}
        inspectiondate={itemData.item.inspectiondate}
        lat={itemData.item.lat}
        lng={itemData.item.lng}
      />
    );
  };

  const Item = (props) => (
    <View style={styles.item}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate({
            routeName: "ProjectScreen",
            // routeName: "ProjectScreen",
            params: {
              itemData: {
                id: props.id,
                // jobcode: props.jobcode,
                // projectname: props.projectname,
                // lcduedate: props.lcduedate,
                // valuer_n: props.valuer_n,
                // inspectiondate: props.inspectiondate,
                // lat: props.lat,
                // lng: props.lng,
              },
            },
          });
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.title}>{props.projectname}</Text>
          <CalendarIcon date={props.lcduedate}></CalendarIcon>
        </View>
        <Text>{props.jobcode}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        placeholder="Type Here..."
        onChangeText={searchFilterFunction}
        value={search}
      />

      <FlatList
        data={filteredDataSource}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: "#D7E9F7",
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 15,
    maxWidth: "100%",
  },
  title: {
    justifyContent: "flex-start",
    textAlign: "left",
    fontSize: 20,
    fontWeight: "bold",
    maxWidth: "85%",
  },
});

export default ListScreen;
