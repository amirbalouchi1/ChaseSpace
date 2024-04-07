import React from "react";
import AuthProvider from "../context/AuthContext";
import { Router } from "../routes/Router";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";

const Stack = createStackNavigator();

const index = () => {
  return (
    <AuthProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Router" component={Router} />
      </Stack.Navigator>
    </AuthProvider>
  );
};

export default index;
