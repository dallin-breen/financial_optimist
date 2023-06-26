import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./src/navigations/AuthNavigator";
import HomeNavigator from "./src/navigations/HomeNavigator";

export default function App() {
  let verified = false;
  return (
    <NavigationContainer>
      {!verified ? <AuthNavigator /> : <HomeNavigator />}
    </NavigationContainer>
  );
}
