import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";
import ProfilePokemon from "../screens/ProfilePokemon";

const StackRoutes = createStackNavigator();

const AppRoutes: React.FC = () => (
  <StackRoutes.Navigator headerMode="none" screenOptions={{}}>
    <StackRoutes.Screen name="Home" component={Home} />
    <StackRoutes.Screen name="ProfilePokemon" component={ProfilePokemon} />
  </StackRoutes.Navigator>
);

export default AppRoutes;
