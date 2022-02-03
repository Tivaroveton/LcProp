import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import CreateAccountScreen from "../screens/CreateAccountScreen";
import ListScreen from "../screens/ListScreen";
import ProjectScreen from "../screens/ProjectScreen";
import CameraScreen from "../screens/CameraScreen";
import ImagePreviewScreen from "../screens/ImagePreviewScreen";

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen, //ยังไม่ได้ใช้
    Login: LoginScreen, //ยังไม่ได้ใช้
    CreateAccount: CreateAccountScreen, //ยังไม่ได้ใช้
    ListScreen: ListScreen, //หน้า list รวมโปรเจค
    ProjectScreen: ProjectScreen, //หน้าโปรเจค รายละเอียดข้อมูล ถ่ายรูป
    CameraScreen: CameraScreen, //ถ่ายรูป ต่อจาก ProjectScreen
    ImagePreviewScreen: ImagePreviewScreen, //หน้าโชว์รูป ต่อจาก ProjectScreen, CameraScreen
  },
  {
    initialRouteName: "ListScreen",
    // initialRouteName: "ImagePreviewScreen",
  }
);

export default createAppContainer(AppNavigator);
