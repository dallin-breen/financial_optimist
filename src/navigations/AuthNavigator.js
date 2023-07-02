import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeNavigator from "./HomeNavigator";
import { Login, ForgotPassword, CreateAccount } from "../screens";
import { FIREBASE_AUTH } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

const Stack = createStackNavigator();
const auth = FIREBASE_AUTH;

export default function AuthNavigator() {
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
  return user ? (
    <HomeNavigator user={user} />
  ) : (
    <Stack.Navigator screenOptions={{}} initialRouteName="Login">
      <Stack.Screen
        options={{ headerShown: false }}
        name="Login"
        component={Login}
      />
      <Stack.Screen name="Forgot Password" component={ForgotPassword} />
      <Stack.Screen name="Create Account" component={CreateAccount} />
    </Stack.Navigator>
  );
}
