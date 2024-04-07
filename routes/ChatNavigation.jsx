import { createStackNavigator } from "@react-navigation/stack";
import MessageScreen from "../screens/Message/MessageScreen";
import ChatScreen from "../screens/Message/ChatScreen";
import UserProfileScreen from "../screens/Account/UserProfileScreen";

const Stack = createStackNavigator();

const ChatNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="Messages"
        component={MessageScreen}
        options={{
          headerStyle: { backgroundColor: "white" },
        }}
      />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="User Profile" component={UserProfileScreen} />
    </Stack.Navigator>
  );
};

export default ChatNavigation;
