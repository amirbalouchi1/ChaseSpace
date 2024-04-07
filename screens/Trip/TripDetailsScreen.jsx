import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { COLORS, FONT, SIZES } from "../../constants";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import TripDetailsCard from "../../components/cards/trip/TripDetailsCard";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import OfferModal from "../../components/cards/trip/OfferModal";
import { decode, encode } from "base-64";
import {
  REACT_APP_IP_ADDRESS,
  REACT_ESCROW_EMAIL,
  REACT_ESCROW_KEY,
} from "../../env";
import OrderDetail from "./OrderDetail";

const TripDetailsScreen = ({ navigation, route }) => {
  const { details } = route.params;
  const { authData } = useAuth();
  const [matchingOffers, setMatchingOffers] = useState([]);
  const [userHasEscrowAccount, setUserHasEscrowAccount] = useState(false);

  // btoa is used so that escrow request works
  if (!global.btoa) {
    global.btoa = encode;
  }

  if (!global.atob) {
    global.atob = decode;
  }

  useEffect(() => {
    fetchMatchingOffers();
    checkEscrowAccount();
  }, [details]);

  const fetchMatchingOffers = async () => {
    try {
      const response = await axios.get(
        `${REACT_APP_IP_ADDRESS}/get_targeted_offers_escrow`,
        {
          params: {
            meetupLocation: details.arrival_location.toLowerCase(),
            purchaseLocation: details.departing_location.toLowerCase(),
            currentUserId: authData.id,
          },
        }
      );
      const offersResponse = response.data;
      const matches = offersResponse.rows;
      console.log(offersResponse.rows);
      setMatchingOffers(matches);
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  // Check if the user already has a Escrow account
  const checkEscrowAccount = async () => {
    if (authData.email) {
      console.log(authData.email);
      try {
        const apiKey = REACT_ESCROW_KEY;
        const escrowApiBaseUrl = "https://api.escrow.com/2017-09-01/customer";

        requestBody = {
          email: authData.email,
        };

        const response = await axios.post(escrowApiBaseUrl, requestBody, {
          auth: {
            username: REACT_ESCROW_EMAIL,
            password: apiKey,
          },
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 403) {
          console.log("User already has an Escrow account.");
          setUserHasEscrowAccount(true);
        } else {
          console.log("User does not have an Escrow account.");
          setUserHasEscrowAccount(false);
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          console.log("Nice user exists.");
          setUserHasEscrowAccount(true);
        } else {
          console.log("User does not have an Escrow account.");
          setUserHasEscrowAccount(false);
        }
        console.error("Error checking escrow account:", error);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.ticket}>
        <TripDetailsCard
          item={details}
          onPress={() =>
            navigation.navigate("Edit Trip Details", { tripDetails: details })
          }
        />
      </View>

      {/* Below Travel Details */}
      {matchingOffers.map((order) => (
        <OrderDetail
          key={order.id}
          order={order}
          navigation={navigation}
          authData={authData}
          userHasEscrowAccount={userHasEscrowAccount}
          setUserHasEscrowAccount={setUserHasEscrowAccount}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 20,
    height: "100%",
  },
});

export default TripDetailsScreen;
