import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import { login } from "../api/authentication";
import EmailForm from "../forms/EmailForm";
import ListScreen from "./ListScreen";

const LoginScreen = ({ navigation }) => {
  return (
    <EmailForm
      buttonText="Log in"
      onSubmit={login}
      // onAuthentication={() => navigation.navigate('Home')}
      onAuthentication={() => navigation.navigate("ListScreen")}
    >
      <Button
        title="Create account"
        onPress={() => navigation.navigate("CreateAccount")}
      />
    </EmailForm>
  );
};

export default LoginScreen;
