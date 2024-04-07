import { View, Text, TouchableOpacity, Modal } from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { COLORS, FONT, SIZES } from "../../../constants";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";
import { decode, encode } from "base-64";

const OfferModal = ({
  isVisible,
  onToggle,
  onSubmit,
  userHasEscrowAccount,
  setUserHasEscrowAccount,
}) => {
  const [offerInputValue, setOfferInputValue] = useState("");
  const { authData } = useAuth();
  const [formData, setFormData] = useState({
    email: authData.email,
    firstName: authData.firstName,
  });
  console.log("OfferModal: ", userHasEscrowAccount);

  const handleOfferSubmit = () => {
    onSubmit(offerInputValue);
    setOfferInputValue("");
  };

  // Used for escrow
  if (!global.btoa) {
    global.btoa = encode;
  }

  if (!global.atob) {
    global.atob = decode;
  }

  const handleFormSubmit = async (email) => {
    const apiKey =
      "16535_fSmik5TaXJTs3Oc8pmNeTwbSfdtf8POLZ8os8unlHjlPszRDw3mvmSssSsB0hWJL";
    const escrowApiBaseUrl = "https://api.escrow.com/2017-09-01/customer";

    requestBody = {
      email: authData.email,
    };

    try {
      const response = await axios.post(escrowApiBaseUrl, requestBody, {
        auth: {
          username: "rkdemy@gmail.com",
          password: apiKey,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        console.log("User does not have an Escrow account.");
        // Proceed with creating an Escrow account for the user if needed.
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log("User already has an Escrow account.");
        // Handle the case where the user already has an Escrow account.
      } else {
        console.error("Error creating Escrow account:", error);
      }
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      {userHasEscrowAccount ? (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Place an Offer</Text>
            <Text style={styles.modalSubtitle}>
              Enter the amount you'd like as a delivery reward:
            </Text>

            <TextInput
              placeholder="Enter amount"
              onChangeText={setOfferInputValue}
              value={offerInputValue}
              style={styles.input}
              keyboardType="numeric"
            />

            <View style={styles.searchContainer}>
              <TouchableOpacity style={styles.searchBtnLeft} onPress={onToggle}>
                <Text style={styles.btnText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.searchBtnRight}
                onPress={handleOfferSubmit}
              >
                <Text style={styles.btnText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create an Escrow Account</Text>
            <TextInput
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="First Name"
              value={formData.firstName}
              onChangeText={(text) =>
                setFormData({ ...formData, firstName: text })
              }
              style={styles.input}
            />
            <TouchableOpacity
              style={styles.searchBtnLeft}
              onPress={handleFormSubmit}
            >
              <Text style={styles.btnText}>Create Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.searchBtnLeft} onPress={onToggle}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  input: {
    borderWidth: 2,
    borderColor: COLORS.bgGray,
    padding: 10,
    marginBottom: 10,
    borderRadius: 18,
    width: "100%",
  },

  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },

  modalTitle: {
    fontFamily: FONT.bold,
    fontSize: 18,
    marginBottom: 10,
  },

  modalSubtitle: {
    fontFamily: FONT.regular,
    fontSize: 14,
    marginBottom: 20,
  },

  searchContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginTop: SIZES.large,
    height: 50,
    marginBottom: SIZES.xxLarge,
  },

  searchBtnLeft: {
    borderBottomWidth: 2,
    borderWidth: 1,
    padding: 15,
    borderColor: COLORS.purple,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.smallMedium,
    color: COLORS.white,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  searchBtnRight: {
    borderBottomWidth: 2,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.purple,
    backgroundColor: COLORS.lightPurple,
    borderRadius: SIZES.smallMedium,
    color: COLORS.white,
    marginLeft: 15,
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

export default OfferModal;
