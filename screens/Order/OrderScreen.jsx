import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { COLORS, FONT, SIZES } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { REACT_APP_IP_ADDRESS } from "../../env";
import { buttonStyles } from "../../components/ButtonStyle";
import { useOrderContext } from "../../context/OrderContext";

const OrderScreen = () => {
  const navigation = useNavigation();
  const { authData } = useAuth();
  const [orders, setOrders] = useState([]);
  const { orderUpdate } = useOrderContext();
  console.log(orders);

  useLayoutEffect(() => {
    // Fetch user's trips when the component mounts
    fetchUserOrders();
  }, [orderUpdate]);

  const fetchUserOrders = async () => {
    try {
      const res = await axios.get(`${REACT_APP_IP_ADDRESS}/get_order`, {
        params: {
          id: authData.id,
        },
      });

      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching user trips:", error);
    }
  };

  const DeleteItem = async (id) => {
    try {
      const response = await axios.delete(
        `${REACT_APP_IP_ADDRESS}/delete_order/${id}`
      );
      console.log(response.data); // You can handle the response as needed
      alert(`Item with ID ${id} deleted successfully`);
    } catch (error) {
      console.error("Error deleting order:", error);
    }

    fetchUserOrders();
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <TouchableOpacity
        style={styles.orderItem}
        onPress={() => navigation.navigate("OrderDetails", { order: item })}
      >
        <View style={styles.orderImageContainer}>
          <Image
            source={require("../../assets/images/camera.png")} // Use the actual image source here
            style={styles.orderImage}
          />
        </View>
        <View style={styles.orderDetailsContainer}>
          <Text style={styles.orderName}>{item.item_name}</Text>
          <Text style={styles.orderPrice}>${item.item_price}</Text>
          <View style={styles.deliveryOffersContainer}>
            <Text style={styles.noDeliveryOffersText}>No delivery offers</Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => DeleteItem(item.id)}>
        <MaterialCommunityIcons name="delete" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <View style={styles.container}>
        {orders.length > 0 ? (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={renderOrderItem}
            contentContainerStyle={styles.orderList}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyContent}>
              <Image
                source={require("../../assets/images/order.png")}
                style={{
                  width: 100,
                  height: 100,
                  margin: 20,
                }}
              />
              <Text
                style={{
                  margin: 20,
                  textAlign: "center",
                  fontSize: 30,
                  lineHeight: 45,
                }}
              >
                Place an order and discover savings from across the globe!
              </Text>
            </View>

            <TouchableOpacity
              style={[
                buttonStyles.searchBtn,
                {
                  marginBottom: 30,
                  width: "100%",
                },
              ]}
              onPress={() => navigation.navigate("Order Details")}
            >
              <Text style={buttonStyles.btnText}>Create an Order</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: "center",
  },

  emptyContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  container: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 20,
    height: "100%",
  },

  input: {
    backgroundColor: COLORS.gray2,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    color: "#000",
    marginBottom: 30,
  },

  searchBtnLeft: {
    justifyContent: "center", // Center the content vertically
    paddingVertical: 13,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.xxLarge,
    color: COLORS.white,
    alignItems: "center", // Center the content horizontally
  },

  btnText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
  },

  // FlatList Styling
  orderItem: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
    alignItems: "center",
    width: "90%",
  },
  orderCard: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: COLORS.bgGray,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingVertical: 10,
    marginBottom: 10,
    alignItems: "center",
  },

  orderImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 10,
  },

  orderImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  orderDetailsContainer: {
    flex: 1,
  },

  orderName: {
    fontFamily: FONT.bold,
    fontSize: 16,
    marginBottom: 5,
  },

  orderPrice: {
    fontFamily: FONT.bold,
    fontSize: 14,
    color: COLORS.gray,
  },

  deliveryOffersContainer: {
    marginTop: 10,
  },

  noDeliveryOffersText: {
    fontFamily: FONT.bold,
    fontSize: 14,
    color: COLORS.gray,
  },
});
export default OrderScreen;
