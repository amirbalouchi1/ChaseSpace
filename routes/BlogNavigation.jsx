import { createStackNavigator } from "@react-navigation/stack";
import { Image, Text, View } from "react-native";
import OrderDetailsScreen from "../screens/Order/OrderDetailsScreen";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import BlogScreen from "../screens/blog";
import AddBlogScreen from "../screens/addBlog";

const Stack = createStackNavigator();

const Blogs = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="Blog"
        component={BlogScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Post Blog"
        component={AddBlogScreen}
        options={({ route, navigation }) => ({
          headerTitleAlign: "center",
        })}
      />
    </Stack.Navigator>
  );
};

export default Blogs;
