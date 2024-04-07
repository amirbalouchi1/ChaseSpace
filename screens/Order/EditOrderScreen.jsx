import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Pressable,
  Image,
} from "react-native";
import axios from "axios";
import { COLORS, FONT, SIZES } from "../../constants";
import { useAuth } from "../../context/AuthContext";
import { ScrollView } from "react-native-gesture-handler";
import { buttonStyle, buttonStyles } from "../../components/ButtonStyle";
import DateTimePicker from "@react-native-community/datetimepicker";
import { REACT_APP_IP_ADDRESS } from "../../env";
import { useOrderContext } from "../../context/OrderContext";

const EditOrderScreen = ({ route, navigation }) => {
  const { details } = route.params;
  const [item_name, setItemName] = useState(details.item_name);
  const [item_price, setItemPrice] = useState(details.item_price.toString());
  const [item_country, setItemCountry] = useState(details.item_country);
  const [item_cities, setItemCities] = useState(details.item_cities);
  const [item_description, setItemDescription] = useState(
    details.item_description
  );
  const [item_meetup_instructions, setItemMeetupInstructions] = useState(
    details.item_meetup_instructions
  );
  const [item_meetup_location, setItemMeetupLocation] = useState(
    details.item_meetup_location
  );
  const [item_ad_expiry, setItemAdExpiry] = useState(
    new Date(details.item_ad_expiry)
  );
  const [visibleDate, setVisibleDate] = useState(details.visibleDate);
  const [showPicker, setShowPicker] = useState(false);
  const { authData } = useAuth();
  const { addOrder } = useOrderContext;

  const handleSave = async () => {
    const formattedDate = item_ad_expiry.toISOString().split("T")[0];
    addOrder();

    try {
      const updatedOrder = {
        order_id: details.id,
        itemName: item_name,
        itemPrice: item_price,
        itemCountry: item_country,
        itemCity: item_cities,
        itemDescription: item_description,
        meetupInstructions: item_meetup_instructions,
        meetupLocation: item_meetup_location,
        date: formattedDate,
        id: authData.id,
      };

      const response = await axios.put(
        `${REACT_APP_IP_ADDRESS}/update_order`,
        updatedOrder
      );

      if (response.data.message === "Order updated successfully") {
        addOrder();
        alert("Order updated successfully!");
        navigation.goBack();
      } else {
        alert("Failed to update order.");
      }
    } catch (error) {
      console.error("Error updating order:", error);
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.scroller}>
        <Text style={styles.title}>Edit Order</Text>
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
              placeholder={item_ad_expiry.toDateString()}
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

        <TouchableOpacity
          style={[buttonStyles.searchBtn, { marginBottom: 20 }]}
          onPress={handleSave}
        >
          <Text style={buttonStyles.btnText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
  title: {
    fontFamily: FONT.bold,
    fontSize: 24,
    marginBottom: 20,
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

export default EditOrderScreen;
