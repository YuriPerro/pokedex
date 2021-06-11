import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";

const StackRoutes = createStackNavigator();

const AppRoutes: React.FC = () => (
  <StackRoutes.Navigator headerMode="none" screenOptions={{}}>
    <StackRoutes.Screen name="Home" component={Home} />
  </StackRoutes.Navigator>
);

export default AppRoutes;
