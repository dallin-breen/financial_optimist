import React from "react";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./src/navigations/AuthNavigator";
import HomeNavigator from "./src/navigations/HomeNavigator";

export default function App() {
  // const auth = getAuth();
  let verified = false;
  return (
    <NavigationContainer>
      {!verified ? <AuthNavigator /> : <HomeNavigator />}
    </NavigationContainer>
  );
}
