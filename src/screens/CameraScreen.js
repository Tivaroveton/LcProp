import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  View,
  Text,
  Dimensions,
  Platform,
  Modal,
  TouchableHighlight,
  Animated,
  ScrollView,
} from "react-native";
import { Camera } from "expo-camera";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";

import ImageCarousel from "../../components/ImageCarousel";
import ImagePreviewScreen from "./ImagePreviewScreen";
import { Component } from "react";

const CameraScreen = ({ navigation }) => {
  //  camera permissions
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);

  // Screen Ratio and image padding
  const [imagePadding, setImagePadding] = useState(0);
  const [ratio, setRatio] = useState("4:3"); // default is 4:3
  const { height, width } = Dimensions.get("window");
  const screenRatio = height / width;
  const [isRatioSet, setIsRatioSet] = useState(false);

  const [type, setType] = useState(Camera.Constants.Type.back);

  const [modalVisible, setModalVisible] = useState(false);

  // on screen  load, ask for permission to use the camera
  useEffect(() => {
    async function getCameraStatus() {
      const { status } = await Camera.requestPermissionsAsync();
      setHasCameraPermission(status == "granted");
    }
    getCameraStatus();
  }, []);

  // set the camera ratio and padding.
  // this code assumes a portrait mode screen
  const prepareRatio = async () => {
    let desiredRatio = "4:3"; // Start with the system default
    // This issue only affects Android
    if (Platform.OS === "android") {
      const ratios = await camera.getSupportedRatiosAsync();

      // Calculate the width/height of each of the supported camera ratios
      // These width/height are measured in landscape mode
      // find the ratio that is closest to the screen ratio without going over
      let distances = {};
      let realRatios = {};
      let minDistance = null;
      for (const ratio of ratios) {
        const parts = ratio.split(":");
        const realRatio = parseInt(parts[0]) / parseInt(parts[1]);
        realRatios[ratio] = realRatio;
        // ratio can't be taller than screen, so we don't want an abs()
        const distance = screenRatio - realRatio;
        distances[ratio] = realRatio;
        if (minDistance == null) {
          minDistance = ratio;
        } else {
          if (distance >= 0 && distance < distances[minDistance]) {
            minDistance = ratio;
          }
        }
      }
      // set the best match
      desiredRatio = minDistance;
      //  calculate the difference between the camera width and the screen height
      const remainder = Math.floor(
        (height - realRatios[desiredRatio] * width) / 2
      );
      // set the preview padding and preview ratio
      setImagePadding(remainder);
      setRatio(desiredRatio);
      // Set a flag so we don't do this
      // calculation each time the screen refreshes
      setIsRatioSet(true);
    }
  };

  // the camera must be loaded in order to access the supported ratios
  const setCameraReady = async () => {
    if (!isRatioSet) {
      await prepareRatio();
    }
  };

  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState([]);
  const __takePicture = async () => {
    console.log("0");
    if (!camera) return;
    const photo = await camera.takePictureAsync();
    setPreviewVisible(true);
    setCapturedImage((capturedImage) => [...capturedImage, photo]);
    // setCapturedImage(photo);
    console.log(previewVisible);
    console.log("Captured ", capturedImage);
  };

  const CameraPreview = ({ capturedImage }: any) => {
    const previewPic = capturedImage[capturedImage.length - 1];
    return (
      <View
        style={{
          marginLeft: 20,
          marginTop: 13,
          maxWidth: "20%",
          height: "90%",
        }}
      >
        <ImageBackground
          source={{ uri: previewPic && previewPic.uri }}
          style={{
            flex: 1,
          }}
        />
      </View>
    );
  };

  if (hasCameraPermission === null) {
    return (
      <View style={styles.information}>
        <Text>Waiting for camera permissions</Text>
      </View>
    );
  } else if (hasCameraPermission === false) {
    return (
      <View style={styles.information}>
        <Text>No access to camera</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        {/*
        We created a Camera height by adding margins to the top and bottom,
        but we could set the width/height instead
        since we know the screen dimensions
        */}
        {/* <PictureModal photo={capturedImage} /> */}
        <Camera
          style={[
            styles.cameraPreview,
            { marginTop: imagePadding, marginBottom: imagePadding },
          ]}
          onCameraReady={setCameraReady}
          ratio={ratio}
          ref={(ref) => {
            setCamera(ref);
          }}
          type={type}
        >
          <View style={{ flex: 0.3 }}>
            <TouchableOpacity
              disabled={!previewVisible}
              onPress={() => {
                // setModalVisible(true);
                navigation.navigate({
                  routeName: "ImagePreviewScreen",
                  params: {
                    photo: { capturedImage },
                  },
                });
              }}
            >
              <CameraPreview capturedImage={capturedImage} />
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            {/* <View style={styles.squareRatio}> */}

            {/* <Image
                source={{
                  uri: "https://wallpaperaccess.com/full/317501.jpg",
                }} */}
            {/* /> */}
            <TouchableOpacity
              style={{}}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}
            >
              <Text style={styles.text}> Flip </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={__takePicture}
              style={{
                width: 70,
                height: 70,
                bottom: 0,
                borderRadius: 50,
                backgroundColor: "#fff",
              }}
            />

            <TouchableOpacity
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}
            >
              <Text style={styles.text}> Flip </Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
  }
};

export default CameraScreen;

const styles = StyleSheet.create({
  information: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  cameraPreview: {
    flex: 1,
  },

  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "space-around",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  button: {
    // flex: 0.1,
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  text: {
    fontSize: 18,
    color: "white",
  },

  squareRatio: {
    maxWidth: "25%",
    aspectRatio: 1,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
