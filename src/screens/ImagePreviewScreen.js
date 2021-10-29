import React, { Component } from "react";
import {
  Animated,
  View,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";

// import ImageCarousel from "../../components/ImageCarousel";

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
    const scrollBarVal = animVal.interpolate({
      inputRange: [deviceWidth * (i - 1), deviceWidth * (i + 1)],
      outputRange: [-itemWidth, itemWidth],
      extrapolate: "clamp",
    });

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  barContainer: {
    position: "absolute",
    zIndex: 2,
    bottom: 40,
    flexDirection: "row",
  },
  skip: {
    position: "absolute",
    zIndex: 2,
    bottom: 80,
    flexDirection: "row",
  },
  track: {
    backgroundColor: "#ccc",
    overflow: "hidden",
    height: 2,
  },
  bar: {
    backgroundColor: "#5294d6",
    height: 2,
    position: "absolute",
    left: 0,
    top: 0,
  },
});

export default ImagePreviewScreen;
