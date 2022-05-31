import React from "react";
import { View, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import Routes from "./src/routes";
import { NativeScreenContainer } from "react-native-screens";

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#cf6113" barStyle="default" />
      <Routes />
    </NavigationContainer>
  );
}
