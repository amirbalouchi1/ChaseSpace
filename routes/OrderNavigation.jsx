import { createStackNavigator } from "@react-navigation/stack";
import { Image, Text, View } from "react-native";
import OrderScreen from "../screens/Order/OrderScreen";
import AddOrderScreen from "../screens/Order/AddOrderScreen";
import EditOrderScreen from "../screens/Order/EditOrderScreen";
import OrderDetailsScreen from "../screens/Order/OrderDetailsScreen";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import Experiment from "../screens/Experiment";
import UserProfileScreen from "../screens/Account/UserProfileScreen";
import { COLORS } from "../constants";
import { OrderProvider } from "../context/OrderContext";

const Stack = createStackNavigator();

const OrderNavigation = () => {
  const navigation = useNavigation();

  return (
    <OrderProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
        }}
      >
        <Stack.Screen
          name="Order"
          component={OrderScreen}
          options={{
            headerStyle: { backgroundColor: "white" },
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("Order Details")}
              >
                <AntDesign
                  name="plus"
                  size={24}
                  color="black"
                  style={{
                    marginRight: 20,
                    color: COLORS.primary,
                  }}
                />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="Order Details"
          component={AddOrderScreen}
          options={{
            headerTitleAlign: "center",
            headerRight: () => (
              <Image
                source={require("../assets/images/order.png")}
                style={{
                  width: 35,
                  height: 35,
                  marginRight: 20,
                  color: COLORS.primary,
                }}
              />
            ),
          }}
        />
        <Stack.Screen
          name="OrderDetails"
          component={OrderDetailsScreen}
          options={({ route, navigation }) => ({
            headerTitle: "Order Details",
            headerTitleAlign: "center",
          })}
        />
        <Stack.Screen name="Checkout" component={Experiment} />
        <Stack.Screen name="User Profile" component={UserProfileScreen} />
        <Stack.Screen name="EditOrder" component={EditOrderScreen} />
      </Stack.Navigator>
    </OrderProvider>
  );
};

export default OrderNavigation;
