import react from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Home } from "../screens";

const Stack = createStackNavigator();

export default function HomeNavigator({ user }) {
  return (
    <Stack.Navigator screenOptions={{}} initialRouteName="Home">
      <Stack.Screen
        options={{ headerShown: false }}
        name="Home"
        component={() => <Home user={user} />}
      />
    </Stack.Navigator>
  );
}
