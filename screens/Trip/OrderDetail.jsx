import React, { useEffect, useState } from "react";
import { REACT_APP_IP_ADDRESS } from "../../env";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import StarRating from "react-native-star-rating";
import OfferModal from "../../components/cards/trip/OfferModal";
import { buttonStyles } from "../../components/ButtonStyle";
import { COLORS, FONT, SIZES } from "../../constants";
import axios from "axios";

const OrderDetail = ({
  order,
  userHasEscrowAccount,
  setUserHasEscrowAccount,
  navigation,
  authData,
}) => {
  const [averageReview, setAverageReview] = useState(0);
  const [isOfferModalVisible, setOfferModalVisible] = useState(false);

  const toggleOfferModal = () => {
    setOfferModalVisible(!isOfferModalVisible);
  };

  const loadReviews = async (id) => {
    try {
      const res = await axios.get(
        `${REACT_APP_IP_ADDRESS}/get_reviews?id=${id}`
      );

      if (res.data && res.data.length > 0) {
        // Calculate the average rating
        const totalRatings = res.data.reduce(
          (sum, review) => sum + parseFloat(review.rating),
          0
        );
        const averageRating = totalRatings / res.data.length;

        setAverageReview(averageRating.toFixed(2));
      } else {
        // Handle the case where there are no reviews
        setAverageReview(0);
      }
    } catch (error) {
      if (error.response) {
        alert("No data found!");
      }
    }
  };

  const handleOfferSubmit = async ({ order, value }) => {
    if (
      value === null ||
      value === undefined ||
      isNaN(value) ||
      parseFloat(value) <= 0
    ) {
      alert("Please enter a valid positive offer amount.");
      return;
    }

    if (!userHasEscrowAccount) {
      alert("Please create an escrow account first.");
      return;
    }

    try {
      const response = await axios.post(
        `${REACT_APP_IP_ADDRESS}/add_delivery_offer`,
        {
          traveller_user_id: authData.id,
          traveller_user_email: authData.email,
          buyer_user_id: order.created_by_id,
          order_id: order.id,
          offer_amount: parseFloat(value),
          offer_status: "pending",
        }
      );

      if (response.status === 200) {
        alert("Offer submitted successfully.");
        console.log(response);
        toggleOfferModal();
      } else {
        alert("Error submitting offer. Please try again later.");
      }
    } catch (error) {
      console.error("Error submitting offer:", error);
      alert("Error submitting offer. Please try again later.");
    }
  };

  loadReviews(order.created_by_id);

  const formattedDate = new Date(order.date_posted).toISOString().split("T")[0];

  const formattedexpiry = new Date(order.item_ad_expiry)
    .toISOString()
    .split("T")[0];

  return (
    <View style={styles.orderContainer}>
      <View style={styles.orderHeader}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("User Profile", {
              otherUserId: order.created_by_id,
              otherUsername: order.username,
            })
          }
        >
          <View style={styles.imageCircle} />
        </TouchableOpacity>

        <View style={styles.headerTextContainer}>
          <Text style={styles.nameText}>{order.username}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>
              <StarRating
                disabled={true}
                maxStars={5}
                rating={averageReview}
                fullStarColor={"gold"}
                starSize={12}
              />
            </Text>
            <Text style={styles.createdAtText}>Posted: {formattedDate}</Text>
          </View>
        </View>
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.greySquare} />
        <View style={styles.productDetails}>
          <Text style={styles.productNameText} numberOfLines={2}>
            {order.item_name}
          </Text>
          <View style={styles.travelDetails}>
            <Text style={styles.fromToText}>From:</Text>
            <Text style={styles.boldDetails}>
              {order.item_cities}, {order.item_country}
            </Text>
          </View>
          <View style={styles.travelDetails}>
            <Text style={styles.fromToText}> To:</Text>
            <Text style={styles.boldDetails}>{order.item_meetup_location}</Text>
          </View>
          <View style={styles.travelDetails}>
            <Text style={styles.endDateText}>By:</Text>
            <Text style={styles.boldDetails}>{formattedexpiry}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.originText}>From: placeholder.com</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.priceText}>
          Product Price: AUD {order.item_price}
        </Text>
      </View>
      <View style={styles.deliveryRewardContainer}>
        <Text style={styles.deliveryRewardText}>Delivery reward:</Text>
        <Text style={styles.deliveryRewardBoldText}>
          AUD {(order.item_price * 0.1).toFixed(2)}
        </Text>
      </View>

      <TouchableOpacity
        style={buttonStyles.searchBtn}
        onPress={toggleOfferModal}
      >
        <Text style={buttonStyles.btnText}>Make a delivery offer</Text>
      </TouchableOpacity>

      <OfferModal
        isVisible={isOfferModalVisible}
        setUserHasEscrowAccount={setUserHasEscrowAccount}
        userHasEscrowAccount={userHasEscrowAccount}
        onToggle={toggleOfferModal}
        onSubmit={(value) => handleOfferSubmit({ order, value })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  orderContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3, // Increase shadow radius to make it more visible on the sides
    elevation: 5,
  },

  orderHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerTextContainer: {
    marginLeft: 10,
  },

  nameText: {
    fontFamily: FONT.regular,
    fontSize: 20,
  },

  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  ratingText: {
    fontFamily: FONT.regular,
    fontSize: 16,
    marginRight: 5,
  },

  createdAtText: {
    fontSize: 14,
    color: COLORS.gray,
  },

  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },

  imageCircle: {
    backgroundColor: COLORS.gray,
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  greySquare: {
    backgroundColor: COLORS.gray,
    width: 80,
    height: 80,
    marginRight: 12,
  },

  travelDetails: {
    flexDirection: "row",
  },

  productDetails: {
    flex: 1,
  },

  productNameText: {
    fontFamily: FONT.regular,
    fontSize: 18,
    marginBottom: 10,
  },

  boldDetails: {
    fontFamily: FONT.regular,
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "800",
    marginLeft: 20,
  },

  fromToText: {
    fontSize: 14,
    color: COLORS.gray,
  },

  endDateText: {
    fontSize: 14,
    color: COLORS.gray,
  },

  originText: {
    fontSize: 14,
    color: COLORS.gray,
  },

  priceText: {
    fontSize: 14,
    color: COLORS.gray,
  },

  deliveryRewardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  deliveryRewardText: {
    fontSize: 14,
    color: COLORS.gray,
  },

  deliveryRewardBoldText: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primary,
  },

  searchContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: SIZES.large,
    height: 50,
    marginBottom: SIZES.xxLarge,
  },
});

export default OrderDetail;
