import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Modal } from "react-native";
import { COLORS, FONT, SIZES } from "../../constants";
import axios from "axios";
import { REACT_APP_IP_ADDRESS } from "../../env";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { buttonStyles } from "../../components/ButtonStyle";

const OrderDetailsScreen = ({ navigation, route }) => {
  const { order } = route.params;
  const [offers, setOffers] = useState([]);

  const fetchDeliveryOffers = async () => {
    try {
      const response = await axios.get(
        `${REACT_APP_IP_ADDRESS}/get_delivery_offers`,
        {
          params: { order_id: order.id },
        }
      );
      setOffers(response.data);
    } catch (error) {
      console.error("Error fetching delivery offers:", error);
    }
  };

  const formattedDate = new Date(order.item_ad_expiry)
    .toISOString()
    .split("T")[0];

  useEffect(() => {
    fetchDeliveryOffers();
  }, []);

  const renderOfferItem = ({ item }) => {
    const totalPrice = Number(item.offer_amount) + Number(order.item_price);
    console.log(totalPrice);
    return (
      <View style={styles.offerItem}>
        <View style={styles.offerHeader}>
          <Text style={styles.offerHeaderText}>
            Traveller: {item.traveller_first_name}
          </Text>
        </View>
        <View style={styles.offerDetails}>
          <Text style={styles.offerDetailText}>
            Product price: ${order.item_price}
          </Text>
          <Text style={styles.offerDetailText}>
            Offer price: ${item.offer_amount}
          </Text>
        </View>

        <View style={styles.webViewContainer}>
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={() =>
              navigation.navigate("Checkout", {
                offerAmount: item.offer_amount,
                travellerEmail: item.traveller_user_email,
                itemPrice: order.item_price,
                totalPrice: totalPrice,
                buyerId: item.buyer_user_id,
                travellerId: item.traveller_user_id,
                itemName: order.item_name,
                itemDescription: order.item_description,
                itemCountry: order.item_country,
                itemCity: order.item_cities,
                itemMeetup: order.item_meetup_location,
                itemExpiryDate: order.item_ad_expiry,
              })
            }
          >
            <Text style={styles.btnText}>Begin Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      style={styles.container}
      data={[
        { label: "Item Name", value: order.item_name },
        { label: "Item Price", value: `$${order.item_price}` },
        { label: "Purchase Country", value: order.item_country },
        { label: "Purchase City", value: order.item_cities },
        { label: "Item Description", value: order.item_description },
        {
          label: "Delivery Instructions",
          value: order.item_meetup_instructions,
        },
        { label: "Delivery Locations", value: order.item_meetup_location },
        {
          label: "Delivery Date",
          value: formattedDate,
        },
      ]}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.detailContainer}>
          <Text style={styles.leftDetail}>{item.label}:</Text>
          <Text style={styles.rightDetail}>{item.value}</Text>
        </View>
      )}
      ListHeaderComponent={() => (
        <>
          <Text style={styles.title}>Order Details</Text>
        </>
      )}
      ListFooterComponent={
        <>
          <View style={styles.container}>
            <TouchableOpacity
              style={buttonStyles.searchBtn}
              onPress={() =>
                navigation.navigate("EditOrder", { details: order })
              }
            >
              <Text style={buttonStyles.btnText}>Edit Order</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.offersTitle}>Delivery Offers:</Text>
          <FlatList
            data={offers}
            keyExtractor={(item) => item.offer_id.toString()}
            renderItem={renderOfferItem}
          />
        </>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.white,
  },
  title: {
    fontFamily: FONT.bold,
    fontSize: 24,
    marginBottom: 20,
  },

  detailContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  leftDetail: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
  },

  rightDetail: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    fontWeight: "800",
  },

  offersTitle: {
    fontFamily: FONT.bold,
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
  },

  offerItem: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  offerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  offerHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  offerDetails: {},

  offerDetailText: {
    fontSize: 16,
    color: "#555",
  },

  searchBtn: {
    borderBottomWidth: 2,
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.purple,
    backgroundColor: COLORS.lightPurple,
    borderRadius: SIZES.smallMedium,
    color: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },

  btnText: {
    color: COLORS.purple,
    fontWeight: "700",
    fontSize: SIZES.medium,
    alignItems: "center",
  },

  webViewContainer: {
    width: "100%",
  },

  editButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default OrderDetailsScreen;
