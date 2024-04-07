import { Image } from "react-native";
import { HomeScreen } from "../screens/HomeScreen";
import ChatNavigation from "./ChatNavigation";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import OrderScreen from "../screens/Order/OrderScreen";
import AccountScreen from "../screens/Account/AccountScreen";
import { COLORS, FONT, images } from "../constants";
import ScreenHeaderBtn from "../components/header/ScreenHeaderBtn";
import { TouchableOpacity } from "react-native-gesture-handler";
import TripNavigation from "./TripNavigation";
import OrderNavigation from "./OrderNavigation";
import BlogScreen from "../screens/blog";
import { FontAwesome5 } from "@expo/vector-icons";
import Blogs from "./BlogNavigation";

const Tab = createBottomTabNavigator();

export const AppStack = () => {

  // This component is responsible for the bottom tab navigation
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.bgGray },
        headerShadowVisible: false,
        headerRight: () => (
          <ScreenHeaderBtn iconUrl={images.lifebuoy} dimension="90%" />
        ),
        headerTitle: "",
        tabBarStyle: {
          paddingBottom: 7,
          paddingTop: 5,
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerStyle: { backgroundColor: COLORS.white },
          tabBarLabelStyle: {
            fontFamily: FONT.bold, // Use the loaded font
            fontSize: 11, // Adjust font size if needed
          },
          tabBarIcon: () => {
            return (
              <Image
                source={require("../assets/images/home.png")}
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrderNavigation}
        options={{
          headerShown: false,
          tabBarLabelStyle: {
            fontFamily: FONT.bold, // Use the loaded font
            fontSize: 11, // Adjust font size if needed
          },
          headerRight: () => (
            <Image
              source={require("../assets/images/order.png")}
              style={{
                width: 30,
                height: 30,
                marginRight: 20,
              }}
            />
          ),
          tabBarIcon: () => {
            return (
              <Image
                source={require("../assets/images/order.png")}
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            );
          },
        }}
      />
      {/* <Tab.Screen
        name="Experiment"
        component={Experiment}
        options={{
          headerShadowVisible: false,
        }}
      /> */}
      <Tab.Screen
        name="Trips"
        component={TripNavigation}
        options={{
          headerShown: false,
          tabBarLabelStyle: {
            fontFamily: FONT.bold, // Use the loaded font
            fontSize: 11, // Adjust font size if needed
          },
          tabBarIcon: () => {
            return (
              <Image
                source={require("../assets/images/trip.png")}
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Message"
        component={ChatNavigation}
        options={{
          tabBarLabelStyle: {
            fontFamily: FONT.bold, // Use the loaded font
            fontSize: 11, // Adjust font size if needed
          },
          headerShown: false,
          tabBarIcon: () => {
            return (
              <TouchableOpacity>
                <Image
                  source={require("../assets/images/message.png")}
                  style={{
                    width: 30,
                    height: 30,
                  }}
                />
              </TouchableOpacity>
            );
          },
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          headerStyle: { backgroundColor: COLORS.white },
          tabBarLabelStyle: {
            fontFamily: FONT.bold, // Use the loaded font
            fontSize: 11, // Adjust font size if needed
          },
          headerTitle: "Account",
          headerRight: false,
          tabBarIcon: () => {
            return (
              <Image
                source={require("../assets/images/account.png")}
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};
