import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { SignInScreen } from "../screens/Account/SignInScreen";
import RegisterScreen from "../screens/Account/RegisterScreen";
import { COLORS } from "../constants";
import RegisterPartTwoScreen from "../screens/Account/RegisterPartTwoScreen";
import OnboardingScreen from "../screens/Account/OnboardingScreen";
import ResetPasswordScreen from "../screens/Account/ResetPasswordScreen";

const Stack = createStackNavigator();

export const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.white },
      }}
    >
      <Stack.Screen
        name="Sign In Screen"
        component={SignInScreen}
        options={{
          headerTitle: "",
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="Get Started"
        component={OnboardingScreen}
        options={{
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="Your Almost Done!"
        component={RegisterScreen}
        options={{
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="RegistrationPartTwo"
        component={RegisterPartTwoScreen}
      />
      <Stack.Screen
        name="Reset Password"
        component={ResetPasswordScreen}
        options={{
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  );
};
