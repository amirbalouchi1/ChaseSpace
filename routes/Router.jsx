import React from "react";
import { AppStack } from "./AppStack";
import { AuthStack } from "./AuthStack";
import { useAuth } from "../context/AuthContext";
import { createStackNavigator } from "@react-navigation/stack";
// import { Stack } from "expo-router";

const Stack = createStackNavigator();

export const Router = () => {
  const { authData, loading } = useAuth();

  // This is the heart of security. It separates the Main app from the Authentication Screen. 
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {authData?.authenticated ? (
        <Stack.Screen name="Main" component={AppStack} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};
