import { StatusBar as ExpoStatusBar} from 'expo-status-bar';
import React from 'react';
import { StatusBar, StyleSheet, SafeAreaView, Text, View, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const isAndroid = Platform.OS === 'android';
export default function App() {
  return (
    <>
     <SafeAreaView style={{ flex:1, marginTop: StatusBar.currentHeight }}>
       <View style={{ padding: 16, backgroundColor : "green"}}>
         <Text>search</Text>
       </View>
       <View style={{ flex: 1, padding: 16, backgroundColor : "blue"}}>
         <Text>List</Text>
       </View>
     </SafeAreaView>
     <ExpoStatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});