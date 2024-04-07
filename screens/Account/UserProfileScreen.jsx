import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  Pressable,
  TextInput,
} from "react-native";
import { COLORS, FONT } from "../../constants";
import { AntDesign } from "@expo/vector-icons";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import TripDetailsCard from "../../components/cards/trip/TripDetailsCard";
import axios from "axios";
import { REACT_APP_IP_ADDRESS } from "../../env";
import * as SecureStore from "expo-secure-store";

const formatDateString = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

const UserProfileScreen = ({ route, navigation }) => {
  const [userDetails, setUserDetails] = useState({});
  const [offerDetails, setOfferDetails] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [tripDetails, setTripDetails] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [review, setReview] = useState("");
  const [averageReview, setAverageReview] = useState(0);
  const [rating, setRating] = useState(0);

  const handleStarPress = (index) => {
    setRating(0);
    setRating(index);
  };

  const otherUserId = route.params?.otherUserId;
  const otherUsername = route.params?.otherUsername;

  const loadReviews = async () => {
    try {
      const res = await axios.get(
        `${REACT_APP_IP_ADDRESS}/get_reviews?id=${otherUserId}`
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

      setReviews(res.data);
    } catch (error) {
      if (error.response) {
        alert("No data found!");
      }
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadReviews();
    });

    return unsubscribe;
  }, [navigation]);

  // Replace this with an actual function to fetch user details from the server
  const fetchUserDetails = async () => {
    try {
      // Simulate a server request to fetch user details based on otherUserId
      // Replace this with your actual API request logic
      const userDetailsResponse = await axios.get(
        `${REACT_APP_IP_ADDRESS}/get_other_user_profile?id=${otherUserId}`
      );

      const offerResponse = await axios.get(
        `${REACT_APP_IP_ADDRESS}/get_order`,
        {
          params: {
            id: otherUserId,
          },
        }
      );

      const tripResponse = await axios.get(`${REACT_APP_IP_ADDRESS}/get_trip`, {
        params: {
          id: otherUserId,
        },
      });

      const userDetails = userDetailsResponse.data;
      const offerDetails = offerResponse.data;
      const tripDetails = tripResponse.data;

      setUserDetails(userDetails);
      setOfferDetails(offerDetails);
      setTripDetails(tripDetails);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    // Fetch user details when the component mounts
    fetchUserDetails();
  }, []);

  const SubmitReview = async () => {
    try {
      const userId = await SecureStore.getItemAsync("id");

      const newReviewData = {
        review,
        rating,
        reviewed_by_id: userId,
        reviewed_to_id: otherUserId,
      };

      const res = await axios.post(
        `${REACT_APP_IP_ADDRESS}/create_review`,
        newReviewData
      );

      if (res.data) {
        alert("Your Review has been submitted!");
        loadReviews();
      }
    } catch (e) {
      if (e.response) {
        alert(e.response?.data?.detail);
      }
    } finally {
      setModalVisible(!modalVisible);
      setRating(0);
      setReview("");
    }
  };
  return (
    <ScrollView style={styles.container}>
      <View>
        <View style={styles.header}>
          <View style={styles.profileImage}>
            <Text style={styles.profileImageText}></Text>
          </View>
          <View style={styles.headerInfo}>
            <Text
              style={styles.username}
            >{`${userDetails.first_name} ${userDetails.last_name}`}</Text>
            <Text style={styles.headerJoined}>
              Member since: {formatDateString(userDetails?.date_joined)}
            </Text>
          </View>
        </View>
        <View style={styles.detailsWrapper}>
          <View style={styles.details}>
            <View style={styles.column}>
              <Text>📍</Text>
              <Text style={styles.value}>{userDetails.suburb || "N/A"}</Text>
              <Text style={styles.label}>Location</Text>
            </View>
            <View style={styles.column}>
              <Text>✈️</Text>
              <Text style={styles.value}>42</Text>
              <Text style={styles.label}>Deliveries</Text>
            </View>
            <View style={styles.column}>
              <Text>⭐</Text>
              <Text style={styles.value}>{averageReview}</Text>
              <TouchableOpacity>
                <Text style={styles.label}>Review</Text>
              </TouchableOpacity>
            </View>
          </View>
          {modalVisible && (
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Add your review</Text>
              <View style={{ flexDirection: "row" }}>
                {[1, 2, 3, 4, 5].map((index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleStarPress(index)}
                    style={styles.star}
                  >
                    <AntDesign
                      name={index <= rating ? "star" : "staro"}
                      size={34}
                      style={{ margin: 2 }}
                      color="gold"
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                onChangeText={(t) => setReview(t)}
                style={{
                  padding: 6,
                  width: "90%",
                  borderWidth: 1,
                  borderRadius: 10,
                  marginVertical: 6,
                  height: 40,
                }}
                multiline={true}
              />
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  SubmitReview();
                }}
              >
                <Text style={styles.textStyle}>Submit</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>

      <View style={styles.tabNavigation}>
        <TouchableOpacity
          onPress={() => setModalVisible(!modalVisible)}
          style={[styles.tab]}
        >
          <Text style={[styles.tabText]}>Leave a review</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listings}>
        {reviews.map((x) => {
          return (
            <View key={x.id} style={styles.card}>
              <Text style={styles.title}>{x.review}</Text>
              <Text
                style={styles.author}
              >{`${x.first_name} ${x.last_name}`}</Text>
              <Text>Over all rating: {x.rating}</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    fontFamily: FONT.bold,
    fontWeight: "bold",
    fontSize: 24,
    marginLeft: 10,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 10,
  },

  header: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 10,
  },
  username: {
    fontSize: 24,
    marginTop: 10,
    textAlign: "center",
    fontFamily: FONT.bold,
    color: "black",
  },

  headerJoined: {
    marginTop: 5,
    fontSize: 14,
    textAlign: "center",
    fontFamily: FONT.bold,
    color: COLORS.gray,
  },

  detailsWrapper: {
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },

  details: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flex: 1,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    margin: 10,
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  author: {
    fontSize: 16,
    color: "gray",
    marginBottom: 10,
  },
  value: {
    fontSize: 20,
    alignItems: "center",
    textAlign: "center",
    fontFamily: FONT.bold,
    fontWeight: "800",
    marginBottom: 5,
    marginTop: 5,
  },
  label: {
    fontSize: 14,
    fontFamily: FONT.bold,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: COLORS.darkPurple,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  profileImageText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },

  headerInfo: {},

  tabNavigation: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 20,
  },
  tab: {
    padding: 12,
    //paddingHorizontal: 40,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.purple,
    borderRadius: 15,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: COLORS.purple,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.purple,
  },
  activeTabText: {
    color: COLORS.purple,
  },

  listings: {
    // Style for the container of offers or travels
    marginBottom: 30,
  },

  // Messaging button styles
  messagingButtonContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  messagingButton: {
    flexDirection: "row",
    backgroundColor: "blue",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  messagingButtonText: {
    color: "white",
    fontSize: 18,
    marginLeft: 8,
  },

  // Order details
  // FlatList Styling
  orderItem: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1.5,
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    // alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default UserProfileScreen;
