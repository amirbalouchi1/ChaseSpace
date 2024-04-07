import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  KeyboardAvoidingView,
  Pressable,
  Image,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { COLORS, FONT, SIZES } from "../../constants";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

import { REACT_APP_IP_ADDRESS } from "../../env";
import { buttonStyles } from "../../components/ButtonStyle";
import { useOrderContext } from "../../context/OrderContext";

const AddOrderScreen = () => {
  const [item_name, setItemName] = useState("");
  const [item_price, setItemPrice] = useState("");
  const [item_country, setItemCountry] = useState("");
  const [item_cities, setItemCities] = useState("");
  const [item_description, setItemDescription] = useState("");
  const [item_meetup_instructions, setItemMeetupInstructions] = useState("");
  const [item_meetup_location, setItemMeetupLocation] = useState("");
  const [item_ad_expiry, setItemAdExpiry] = useState(new Date());
  const [visibleDate, setVisibleDate] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const { authData } = useAuth();
  const { addOrder } = useOrderContext();

  const handleCreateOrder = async () => {
    const formattedDate = item_ad_expiry.toISOString().split("T")[0];
    addOrder();

    try {
      const res = await axios.post(`${REACT_APP_IP_ADDRESS}/create_order`, {
        itemName: item_name,
        itemPrice: item_price,
        itemCountry: item_country,
        itemCity: item_cities,
        itemDescription: item_description,
        meetupInstructions: item_meetup_instructions,
        meetupLocation: item_meetup_location,
        date: formattedDate,
        id: authData.id,
      });
      console.log("Response: ", res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };

  const onDateChange = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setItemAdExpiry(currentDate);

      if (Platform.OS === "android") {
        toggleDatePicker();
        setVisibleDate(currentDate.toDateString());
      } else if (Platform.OS === "ios") {
        toggleDatePicker();
        setVisibleDate(currentDate.toDateString());
      }
    } else {
      toggleDatePicker();
    }
  };

  const confirmIOSDate = () => {
    setVisibleDate(item_ad_expiry.toDateString());
    toggleDatePicker();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroller}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Text style={styles.label}>Product Name</Text>
          <TextInput
            value={item_name}
            onChangeText={setItemName}
            placeholder="Item Name"
            style={styles.input}
          />
          <Text style={styles.label}>Price</Text>
          <TextInput
            value={item_price}
            onChangeText={setItemPrice}
            placeholder="Item Price"
            keyboardType="numeric"
            style={styles.input}
          />
          <Text style={styles.label}>Purchase Country</Text>
          <TextInput
            value={item_country}
            onChangeText={setItemCountry}
            placeholder="Item Country"
            style={styles.input}
          />
          <Text style={styles.label}>Purchase City</Text>
          <TextInput
            value={item_cities}
            onChangeText={setItemCities}
            placeholder="Item Cities"
            style={styles.input}
          />
          <Text style={styles.label}>Product Description</Text>
          <TextInput
            value={item_description}
            onChangeText={setItemDescription}
            placeholder="Item Description"
            multiline
            numberOfLines={4}
            style={styles.input}
          />
          <Text style={styles.label}>Meetup Instructions</Text>
          <TextInput
            value={item_meetup_instructions}
            onChangeText={setItemMeetupInstructions}
            placeholder="Meetup Instructions"
            style={styles.input}
          />
          <Text style={styles.label}>Set Meetup Location</Text>
          <TextInput
            value={item_meetup_location}
            onChangeText={setItemMeetupLocation}
            placeholder="Meetup Location"
            style={styles.input}
          />

          <Pressable onPress={toggleDatePicker}>
            {/* Calender */}
            <View style={styles.inputContainerThird}>
              <Image
                source={require("../../assets/images/arriving-calendar.png")}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="How long will the order be open?"
                styles={styles.customInput}
                value={visibleDate}
                editable={false}
                onChangeText={setVisibleDate}
                onPressIn={toggleDatePicker}
              />
            </View>
          </Pressable>

          {showPicker && (
            <DateTimePicker
              mode="date"
              display="spinner"
              value={item_ad_expiry}
              onChange={onDateChange}
              minimumDate={new Date()}
              style={styles.datePicker}
            />
          )}

          {showPicker && Platform.OS === "ios" && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <TouchableOpacity
                style={(styles.button, styles.pickerButton)}
                onPress={toggleDatePicker}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={(styles.button, styles.pickerButton)}
                onPress={confirmIOSDate}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.bottomContainer}>
            <Text
              style={{
                alignItems: "center",
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              Place your order to begin your journey
            </Text>
            <TouchableOpacity
              style={buttonStyles.searchBtn}
              onPress={handleCreateOrder}
            >
              <Text style={buttonStyles.btnText}>Create Order</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scroller: {
    paddingHorizontal: 20,
  },

  label: {
    fontSize: 14,
    fontFamily: FONT.bold,
    color: COLORS.primary,
    marginBottom: 3,
    paddingLeft: 10,
  },

  input: {
    borderWidth: 2,
    borderColor: COLORS.bgGray,
    padding: 10,
    marginBottom: 10,
    borderRadius: 18,
    width: "100%",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
    borderWidth: 2,
    paddingVertical: 1,
    paddingHorizontal: 15,
  },

  inputContainerFirst: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  inputContainerLast: {
    borderTopWidth: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },

  inputContainerThird: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopWidth: 2,
    borderRadius: 10,
    marginTop: 20,
  },

  inputIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
    tintColor: COLORS.primary,
  },

  bottomContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 20,
  },

  searchBtnLeft: {
    justifyContent: "flex-end",
    width: "100%",
    padding: 13,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.xxLarge,
    color: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },

  btnText: {
    fontFamily: FONT.bold,
    color: COLORS.white,
    fontSize: SIZES.large,
  },

  datePicker: {
    height: 120,
    marginTop: -10,
  },

  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.primary,
  },

  pickerButton: {
    paddingHorizontal: 20,
  },
});

export default AddOrderScreen;
