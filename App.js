import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./src/navigations/AuthNavigator";
import HomeNavigator from "./src/navigations/HomeNavigator";
import { FIREBASE_AUTH } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

const auth = FIREBASE_AUTH;

export default function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    const unsubscribeFromAuthStateChanged = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(undefined);
      }
    });
    return unsubscribeFromAuthStateChanged;
  }, []);

  return (
    <NavigationContainer>
      {!user ? <AuthNavigator /> : <HomeNavigator user={user} />}
    </NavigationContainer>
  );
}
