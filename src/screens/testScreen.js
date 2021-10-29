import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Card, ListItem, Icon } from "react-native-elements";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

import CalendarIcon from "../../components/CalendarIcon";

const ProjectScreen = (props) => {
  const projectID = props.navigation.getParam("itemData").id;
  const project = props.navigation.getParam("itemData");
  const dataURL =
    "https://www.jobprocess.landmarkcon.net/api/jobapi/" + projectID;

  const [projectData, setProjectData] = useState("");

  useEffect(() => {
    const fetchMyAPI = () => {
      return fetch(dataURL)
        .then((response) => response.json())
        .then((json) => {
          setProjectData(json);
          return json;
        })
        .catch((error) => {
          console.error(error);
        });
    };
    const initData = fetchMyAPI();
  }, []);

  const [title, setTitle] = useState(project.title);

  const TextInput1 = () => {
    return (
      <TextInput
        style={[styles.textInput, styles.textSize2]}
        value={props.id}
        placeholder="ชื่อโครงการ"
        keyboardType="default"
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <CalendarIcon date="15"></CalendarIcon>
        <Card>
          <TextInput
            style={[styles.textInput, styles.textSize1]}
            value={title}
            placeholder="ชื่อโครงการ"
            onChangeText={(title) => setTitle(title)}
            keyboardType="default"
          />
          <Card.Image
            source={{
              uri: "https://www.sansiri.com/uploads/project/2019/11/08/450_03b5d707-909f-4071-81bd-efad38c73453.jpg",
            }}
          ></Card.Image>

          <TextInput1></TextInput1>
          <TextInput
            style={[styles.textInput, styles.textSize2]}
            value={project.id}
            placeholder="ชื่อโครงการ"
            keyboardType="default"
          />
          <TextInput
            style={[styles.textInput, styles.textSize2]}
            value={project.location}
            placeholder="ชื่อโครงการ"
            keyboardType="default"
          />
          <TextInput
            style={[styles.textInput, styles.textSize2]}
            value={project.fullPrice}
            placeholder="ชื่อโครงการ"
            keyboardType="default"
          />
          <TextInput
            style={[styles.textInput, styles.textSize2]}
            value={project.priceSquareM}
            placeholder="ชื่อโครงการ"
            keyboardType="default"
          />
        </Card>

        <Text>{project.startdate}</Text>
        <Text>{project.inspectiondate}</Text>
        <Text>{project.clientduedate}</Text>
        <Text>{project.lcduedate}</Text>

        <TouchableOpacity
          title="Camera Roll"
          style={styles.button1}
          onPress={() => {
            console.log("Camera");
          }}
        >
          <FontAwesome name="camera" style={styles.fontawesome}>
            {"\u00A0"} Camera Roll
          </FontAwesome>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row",
            maxWidth: "100%",
            alignSelf: "center",
          }}
        >
          <TouchableOpacity
            style={styles.button2}
            onPress={() => {
              console.log("Camera");
            }}
          >
            <FontAwesome name="newspaper-o" style={styles.fontawesome}>
              {"\u00A0"} Work Paper
            </FontAwesome>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button2}
            onPress={() => {
              console.log("Camera");
            }}
          >
            <FontAwesome name="paperclip" style={styles.fontawesome}>
              {"\u00A0"} Documents
            </FontAwesome>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInput: {
    height: 40,
    margin: 6,
    padding: 10,
    borderBottomWidth: 1,
  },
  textSize1: {
    //text importance from 1 to 3
    fontSize: 20,
    textAlign: "center",
  },
  textSize2: {
    fontSize: 15,
  },
  button1: {
    // height: 70,
    padding: 5,
    paddingHorizontal: 5,
    margin: 10,
    marginHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1338BE",
    borderRadius: 5,
  },
  button2: {
    height: 50,
    maxWidth: "43%",
    padding: 10,
    // paddingHorizontal: 5,
    // marginLeft: 6,
    // marginLeft: 5,
    marginHorizontal: 8,
    justifyContent: "space-evenly",
    backgroundColor: "#0492C2",
    borderRadius: 5,
  },
  fontawesome: {
    fontSize: 20,
    color: "white",
  },
});

export default ProjectScreen;
