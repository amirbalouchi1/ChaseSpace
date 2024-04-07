import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { WebView } from "react-native-webview";
import { decode, encode } from "base-64";
import { useAuth } from "../context/AuthContext";
import { ScrollView } from "react-native-gesture-handler";
import { COLORS, SIZES } from "../constants";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { database } from "../config/firebase";
import {
  REACT_APP_IP_ADDRESS,
  REACT_ESCROW_EMAIL,
  REACT_ESCROW_KEY,
} from "../env";

const Experiment = ({ route }) => {
  const {
    offerAmount,
    travellerEmail,
    itemPrice,
    totalPrice,
    itemName,
    buyerId,
    travellerId,
    itemDescription,
    itemCountry,
    itemCity,
    itemMeetup,
    itemExpiryDate,
  } = route.params;

  const { authData } = useAuth();

  // This btoa seems to let the escrow verification to work.
  if (!global.btoa) {
    global.btoa = encode;
  }

  if (!global.atob) {
    global.atob = decode;
  }

  const [transactionData, setTransactionData] = useState(null);

  const email = REACT_ESCROW_EMAIL;
  const apiKey = REACT_ESCROW_KEY;

  // The Escrow API endpoint
  const escrowApiBaseUrl = "https://api.escrow.com/2017-09-01/transaction";

  // Establishes a connection between two users in firebase for messaging. And also creates a transaction in escrow
  const handleCreateTransaction = async () => {
    try {
      // Finds the travellers id
      const userResponse = await axios.get(
        `${REACT_APP_IP_ADDRESS}/get_other_user_profile?id=${travellerId}`
      );

      const userDetails = userResponse.data;
      console.log(userDetails);

      // Targets the collection in firebase and then targets the document from that collection.
      const groupChatCollectionRef = collection(database, "GroupChats");
      const chatDocRef = doc(groupChatCollectionRef);

      // Creates a new group chat to connect the users.
      await setDoc(chatDocRef, {
        userId: [authData.id, travellerId],
        username1: authData.firstName,
        username2: userDetails.first_name,
        createdAt: serverTimestamp(),
        conversationId: chatDocRef.id,
      });

      // Buyer is the buyer and seller is the traveller. Broker will be the ChaseSpace email.
      const requestBody = {
        parties: [
          {
            role: "buyer",
            customer: authData.email,
          },
          {
            role: "seller",
            customer: travellerEmail,
          },
          {
            role: "broker",
            customer: email,
          },
        ],
        currency: "aud",
        description: "Transaction description",
        items: [
          {
            title: itemName,
            description: itemDescription,
            type: "general_merchandise",
            inspection_period: 259200,
            quantity: 1,
            schedule: [
              {
                amount: totalPrice,
                payer_customer: authData.email,
                beneficiary_customer: travellerEmail,
              },
            ],
          },
        ],
      };

      const response = await axios.post(escrowApiBaseUrl, requestBody, {
        auth: {
          username: email,
          password: apiKey,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });

      setTransactionData(response.data);
      alert("Escrow Transaction was a success. Please check your email.");
      console.log("Escrow Transaction Created:", response.data);
    } catch (error) {
      alert("An error occurred. Please try again later.");
      console.error("Error creating escrow transaction:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Cost Container */}
      <View style={styles.costContainer}>
        <Text style={styles.costTitle}>Cost</Text>
        <Text style={styles.costItem}>Item Price: ${itemPrice}</Text>
        <Text style={styles.costItem}>Offer Amount: ${offerAmount}</Text>
        <Text style={styles.costItem}>ChaseSpace Fee: ${itemPrice * 0.9}</Text>
        <View style={styles.costTotalContainer}>
          <Text style={styles.costTotal}>Total: ${totalPrice}</Text>
        </View>
      </View>

      {/* Details Container */}
      <View style={styles.detailsContainer}>
        {/* Placeholder for Image */}
        <View style={styles.imageContainer}></View>
        <Text style={styles.detail}>Item Name: {itemName}</Text>
        <Text style={styles.detail}>Purchase Country: {itemCountry}</Text>
        <Text style={styles.detail}>Purchase City: {itemCity}</Text>
        <Text style={styles.detail}>Delivery Locations: {itemMeetup}</Text>
        <Text style={styles.detail}>Item Description:</Text>
        <Text style={styles.description}>{itemDescription}</Text>
        <Text style={styles.detail}>Delivery Date: {itemExpiryDate}</Text>
      </View>

      <TouchableOpacity
        onPress={handleCreateTransaction}
        style={styles.searchBtn}
      >
        <Text style={styles.btnText}>Checkout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  costContainer: {
    backgroundColor: "#fff",
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
  costTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  costItem: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  costTotalContainer: {
    borderTopWidth: 1,
    marginTop: 12,
    paddingTop: 8,
  },
  costTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  detailsContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  imageContainer: {
    width: 100,
    height: 100,
    backgroundColor: COLORS.lightPurple, // Placeholder for image
    alignSelf: "center",
    marginBottom: 16,
  },
  detail: {
    fontSize: 18,
    marginBottom: 10,
    color: "#000",
  },
  description: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 16,
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
});

export default Experiment;
