import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import CreateAccountScreen from "./src/screens/CreateAccountScreen";
import ListScreen from "./src/screens/ListScreen";
import ProjectScreen from "./src/screens/ProjectScreen";
import CameraScreen from "./src/screens/CameraScreen";
import ImagePreviewScreen from "./src/screens/ImagePreviewScreen";

//Delete testScreen Later todo
// import testScreen from "./src/screens/testScreen";

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Login: LoginScreen,
    CreateAccount: CreateAccountScreen,
    ListScreen: ListScreen,
    ProjectScreen: ProjectScreen,
    CameraScreen: CameraScreen,
    ImagePreviewScreen: ImagePreviewScreen,
    // testScreen: testScreen,
  },
  {
    // initialRouteName: "ListScreen",
    initialRouteName: "CameraScreen",
  }
);

export default createAppContainer(AppNavigator);
