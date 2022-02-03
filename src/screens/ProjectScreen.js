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

function ProjectScreen({ navigation }) {
  const project = navigation.getParam("itemData"); //ข้อมูลส่งจาก ListScreen
  const dataURL =
    "https://www.jobprocess.landmarkcon.net/api/jobapi/" + project.id;

  const [projectData, setProjectData] = useState({}); // ชุดข้อมูลจาก api
  const [Shorteninspectiondate, setShortenInspectiondate] = useState("");

  useEffect(() => {
    function fetchMyAPI() {
      //api จาก dataURL
      return fetch(dataURL)
        .then((response) => response.json())
        .then((json) => {
          setProjectData({
            id: json.id,
            jobcode: json.jobcode,
            projectname: json.projectname,
            valuer_n: json.valuer_n,
            inspectiondate: json.inspectiondate,
            lat: json.lat,
            lng: json.lng,
          });
          setShortenInspectiondate(json.inspectiondate.split("-")[2]);
          // console.log(json);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    fetchMyAPI();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card>
          <TextInput
            style={[styles.textInput, styles.textSize1]}
            value={projectData.projectname}
            placeholder="ชื่อโครงการ"
            onChangeText={(title) => setTitle(title)}
            keyboardType="default"
          />
          <Card.Image
            source={{
              uri: "https://www.sansiri.com/uploads/project/2019/11/08/450_03b5d707-909f-4071-81bd-efad38c73453.jpg",
            }}
          ></Card.Image>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TextInput
              style={[styles.textInput, styles.textSize2, { minWidth: "70%" }]}
              value={projectData.jobcode}
              placeholder="เลขรหัสรายงาน"
              keyboardType="default"
            />
            <CalendarIcon date={Shorteninspectiondate}></CalendarIcon>
          </View>
          <TextInput
            style={[styles.textInput, styles.textSize2]}
            value={projectData.lat}
            placeholder="ชื่อโครงการ"
            keyboardType="default"
          />
          {/* id: json.id, jobcode: json.jobcode, projectname: json.projectname,
          valuer_n: json.valuer_n, inspectiondate: json.inspectiondate, lat:
          json.lat, lng: json.lng, */}
          <TextInput
            style={[styles.textInput, styles.textSize2]}
            value={projectData.fullPrice}
            placeholder="ชื่อโครงการ"
            keyboardType="default"
          />
          <TextInput
            style={[styles.textInput, styles.textSize2]}
            value={projectData.priceSquareM}
            placeholder="ชื่อโครงการ"
            keyboardType="default"
          />
        </Card>

        <Text>{projectData.startdate}</Text>
        <Text>{projectData.inspectiondate}</Text>
        <Text>{projectData.clientduedate}</Text>
        <Text>{projectData.lcduedate}</Text>

        <TouchableOpacity
          title="Camera Roll"
          style={styles.button1}
          onPress={(props) => {
            navigation.navigate({
              routeName: "CameraScreen",
              params: {
                id: props.id,
              },
            });
          }}
        >
          <FontAwesome name="camera" style={styles.fontawesome}>
            {"\u00A0"} Camera Roll
          </FontAwesome>
        </TouchableOpacity>

        <TouchableOpacity
          title="Gallery"
          style={styles.button1}
          onPress={(props) => {
            navigation.navigate({
              routeName: "ImagePreviewScreen",
              params: {
                id: props.id,
              },
            });
          }}
        >
          <FontAwesome name="photo" style={styles.fontawesome}>
            {"\u00A0"} Gallery
          </FontAwesome>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row",
            maxWidth: "100%",
            alignSelf: "center",
          }}
        >
          <TouchableOpacity style={styles.button2}>
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
}

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    margin: 6,
    // padding: 3,
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
