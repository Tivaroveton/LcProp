import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const CalendarIcon = (props) => {
  return (
    <View style={styles.calendar}>
      <FontAwesome5
        name="calendar"
        size={40}
        color="black"
        style={styles.calendarIcon}
      />
      <Text style={styles.date}>{props.date}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  calendar: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 45,
    marginTop: 5,
  },
  calendarIcon: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  date: {
    paddingRight: 5,
    paddingTop: 5,
    fontSize: 15,
    // marginTop: 4,
  },
});

export default CalendarIcon;
