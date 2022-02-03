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

// import ImageCarousel from "../../components/ImageCarousel";
// import ImagePreviewScreen from "./ImagePreviewScreen";
// import { Component } from "react";
import * as MediaLibrary from "expo-media-library";

import { NavigationContainer } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
// import { withNavigationFocus } from "react-navigation";

// import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

import { withNavigationFocus } from "react-navigation";

function CameraScreen({ navigation }) {
  //  camera permissions
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  //MediaLibrary permission
  const [hasMediaLibraryPermission, setMediaLibraryPermission] =
    MediaLibrary.usePermissions();
  const [hasImagePickerPermission, setImagePickerPermission] = useState(null);

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
    //Permission Requests
    async function requestCameraStatus() {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status == "granted");
    }
    async function requestMediaLibraryPermission() {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setMediaLibraryPermission(status == "granted");
    }

    async function requestImagePickerPermission() {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setImagePickerPermission(status == "granted");
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }

    requestCameraStatus();
    requestMediaLibraryPermission();
    requestImagePickerPermission();
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
    //Save to photo album
    // if (hasMediaLibraryPermission) {
    //   try {
    //     const asset = await MediaLibrary.createAssetAsync(photo.uri);
    //     const albumName = "LandMark/Room1";
    //     MediaLibrary.createAlbumAsync(albumName, asset, false)
    //       .then(() => {
    //         console.log("File Saved Successfully!");
    //       })
    //       .catch(() => {
    //         console.log("Error In Saving File!");
    //       });
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
  };

  async function UploadPhotoAsync(capturedImage) {
    //todo: project number to save as foldername
    let folderName = "LC-123";
    console.log("UploadPhotoAsync");
    console.log(capturedImage);

    // ImagePicker saves the taken photo to disk and returns a local URI to it
    // let result = capturedImage[0];
    let nPictures = capturedImage.length - 1;
    let localUri = capturedImage[nPictures].uri;
    let filename = localUri.split("/").pop();

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    // Upload the image using the fetch and FormData APIs
    // Assume "photo" is the name of the form field the server expects

    let formData = new FormData();

    console.log("nPics: " + (nPictures + 1));
    for (let i = 0; i < nPictures + 1; i++) {
      console.log(i);
      formData.append("photo" + "_" + i, {
        uri: capturedImage[i].uri,
        name: capturedImage[i].uri.split("/").pop(),
        type,
      });
    }

    formData.append("folderName", folderName);

    console.log(formData);
    return await fetch(
      //todo : redirect to real server ip
      "http://192.168.1.161/test_ReactNative_Connection/uploadRN.php",
      {
        method: "POST",
        body: formData,
        header: {
          "content-type": "multipart/form-data",
        },
      }
    );
  }

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
        <NavigationContainer>
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
              <TouchableOpacity onPress={() => UploadPhotoAsync(capturedImage)}>
                <Text style={styles.text}> Upload </Text>
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
        </NavigationContainer>
      </View>
    );
  }

  const deviceWidth = Dimensions.get("window").width;
  const FIXED_BAR_WIDTH = 280;
  const BAR_SPACE = 10;

  function ImagePreviewScreen(props) {
    const photo = props.navigation.getParam("photo");
    // if (photo) return;
    console.log("Enter ImagePreview");
    console.log(photo.capturedImage);
    // console.log(images);
    const images = photo.capturedImage;

    let numItems = photo.lengthw;
    let itemWidth = FIXED_BAR_WIDTH / numItems - (numItems - 1) * BAR_SPACE;
    let animVal = new Animated.Value(0);

    let imageArray = [];
    let barArray = [];

    images.forEach((image, i) => {
      const thisImage = (
        <Image
          key={`image${i}`}
          source={{ uri: image.uri }}
          style={{ width: deviceWidth }}
        />
      );
      imageArray.push(thisImage);
      // const scrollBarVal = animVal.interpolate({
      //   inputRange: [deviceWidth * (i - 1), deviceWidth * (i + 1)],
      //   outputRange: [-itemWidth, itemWidth],
      //   extrapolate: "clamp",
      // });

      // const thisBar = (
      //   <View key={`bar${i}`} style={[styles.track]}>
      //     <Animated.View
      //       style={[
      //         styles.bar,
      //         {
      //           width: itemWidth,
      //           transform: [
      //             { translateX: scrollBarVal },
      //             { translateY: scrollBarVal },
      //           ],
      //         },
      //       ]}
      //     />
      //   </View>

      //   // {/* </View> */}
      // );
      // barArray.push(thisBar);
    });

    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={10}
          pagingEnabled
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: animVal } } }],
            { useNativeDriver: false }
          )}
        >
          {imageArray}
        </ScrollView>
        {/* <View style={styles.barContainer}>{barArray}</View> */}
      </View>
    );
  }
}

export default withNavigationFocus(CameraScreen);

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
