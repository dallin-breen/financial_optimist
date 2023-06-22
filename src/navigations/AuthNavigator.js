import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Login, ForgotPassword, CreateAccount } from "../screens";

const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
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
