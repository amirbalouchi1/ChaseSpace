import { createStackNavigator } from "@react-navigation/stack";
import { Image, Text, View } from "react-native";
import TripScreen from "../screens/Trip/TripScreen";
import AddTripScreen from "../screens/Trip/AddTripScreen";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { TripProvider } from "../context/TripContext";
import TripDetailsScreen from "../screens/Trip/TripDetailsScreen";
import EditTripDetailsScreen from "../screens/Trip/EditTripDetailsScreen";
import UserProfileScreen from "../screens/Account/UserProfileScreen";

const Stack = createStackNavigator();

const TripNavigation = () => {
  const navigation = useNavigation();

  return (
    <TripProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
        }}
      >
        <Stack.Screen
          name="Trip"
          component={TripScreen}
          options={{
            headerStyle: { backgroundColor: "white" },
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("Trip Details")}
              >
                <AntDesign
                  name="plus"
                  size={24}
                  color="black"
                  style={{
                    marginRight: 20,
                    tintColor: "black",
                  }}
                />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="Trip Details"
          component={AddTripScreen}
          options={{
            headerTitleAlign: "center",
            headerRight: () => (
              <Image
                source={require("../assets/images/lifebuoy.png")}
                style={{
                  width: 35,
                  height: 35,
                  marginRight: 20,
                  tintColor: "black",
                }}
              />
            ),
          }}
        />
        <Stack.Screen
          name="Trip Settings"
          component={TripDetailsScreen}
          options={({ route, navigation }) => ({
            headerTitleAlign: "center",
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Edit Trip Details", {
                    tripDetails: route.params.details,
                  });
                }}
              >
                <MaterialCommunityIcons
                  name="dots-vertical"
                  size={24}
                  style={{
                    marginRight: 20,
                    tintColor: "black",
                  }}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Edit Trip Details"
          component={EditTripDetailsScreen}
          options={{
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen name="User Profile" component={UserProfileScreen} />
      </Stack.Navigator>
    </TripProvider>
  );
};

export default TripNavigation;
