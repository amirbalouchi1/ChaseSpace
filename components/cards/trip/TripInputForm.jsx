import {
  View,
  Text,
  StyleSheet,
  Button,
  KeyboardAvoidingView,
  Pressable,
  Image,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { COLORS, FONT, SIZES } from "../../../constants";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import DateTimePicker from "@react-native-community/datetimepicker";
import { REACT_APP_GOOGLE_KEY } from "../../../env";
import { buttonStyles } from "../../ButtonStyle";

export const CustomTextInput = ({
  isFirst,
  iconSource,
  placeholder,
  value,
  onChangeText,
  editable,
}) => {
  const containerStyles = [
    styles.inputContainer,
    isFirst && styles.inputContainerFirst,
    !isFirst && styles.inputContainerLast,
  ];

  return (
    <View style={containerStyles}>
      <Image source={iconSource} style={styles.inputIcon} />
      <GooglePlacesAutocomplete
        placeholder={placeholder}
        value={value}
        onPress={(data, details = null) => {
          onChangeText(data.description);
        }}
        onChangeText={onChangeText}
        debounce={100}
        query={{
          key: `${REACT_APP_GOOGLE_KEY}`,
          language: "en",
        }}
        styles={styles.customInput}
      />
    </View>
  );
};

const TripInputForm = ({ initialValues, onSubmit }) => {
  const [departingCity, setDepartingCity] = useState(
    initialValues.departingCity
  );
  const [arrivingCity, setArrivingCity] = useState(initialValues.arrivingCity);
  const [date, setDate] = useState(new Date(initialValues.date));
  const [arrival, setArrival] = useState(initialValues.date);
  const [showPicker, setShowPicker] = useState(false);

  const handleCreateTrip = async () => {
    let formattedDate;

    // This is necessary since TripInputForm is used in two places. AddTripScreen and EditTripScreen.
    // Sometimes the date will look like 2015-03-25T12:00:00Z or 2015-03-25

    if (typeof date === "string" && date.includes("T")) {
      // Date is in ISO format, no need to split
      formattedDate = date;
    } else {
      // Date needs to be split
      formattedDate = date.toISOString().split("T")[0];
    }
    onSubmit({ departingCity, arrivingCity, date: formattedDate });
  };

  useEffect(() => {
    // Convert the arrival date from string to Date when it changes
    if (initialValues.date) {
      setDate(new Date(initialValues.date));
    }
  }, [initialValues.date]);

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };

  const onDateChange = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setDate(currentDate);

      if (Platform.OS === "android") {
        toggleDatePicker();
        setArrival(currentDate.toDateString());
      } else if (Platform.OS === "ios") {
        toggleDatePicker();
        setArrival(currentDate.toDateString());
      }
    } else {
      toggleDatePicker();
    }
  };

  const confirmIOSDate = () => {
    setArrival(date.toDateString());
    toggleDatePicker();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <CustomTextInput
        iconSource={require("../../../assets/images/departing-icon.png")}
        placeholder={departingCity ? departingCity : "From: "}
        value={departingCity}
        onChangeText={setDepartingCity}
        isFirst={true}
      />

      <CustomTextInput
        iconSource={require("../../../assets/images/arriving-icon.png")}
        placeholder={arrivingCity ? arrivingCity : "To: "}
        value={arrivingCity}
        onChangeText={setArrivingCity}
        isFirst={false}
      />

      {/* Calendar */}

      <Pressable onPress={toggleDatePicker}>
        <View style={styles.inputContainerThird}>
          <Image
            source={require("../../../assets/images/arriving-calendar.png")}
            style={styles.inputIcon}
          />
          <TextInput
            placeholder={date.toDateString()}
            style={styles.customInput}
            value={arrival}
            editable={false}
            onChangeText={setArrival}
            onPressIn={toggleDatePicker}
          />
        </View>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          mode="date"
          display="spinner"
          value={date}
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
          Once you add your trip you can start making multiple offers and make
          more money
        </Text>
        <TouchableOpacity
          style={buttonStyles.searchBtn}
          onPress={handleCreateTrip}
        >
          <Text style={buttonStyles.btnText}>Create Trip</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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

export default TripInputForm;
