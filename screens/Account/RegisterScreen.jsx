import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { COLORS, FONT, SIZES } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

import { REACT_APP_IP_ADDRESS } from "../../env";
import { buttonStyles } from "../../components/ButtonStyle";

const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    const isValid = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(action.val);
    return {
      value: action.val,
      isValid: isValid,
    };
  }

  return { value: "", isValid: false };
};

const nameReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    const isValid = action.val.trim() !== "";
    return {
      value: action.val,
      isValid: isValid,
    };
  }
  return { value: "", isValid: false };
};

const RegisterScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });
  const [firstNameState, dispatchFirstName] = useReducer(nameReducer, {
    value: "",
    isValid: null,
  });
  const [lastNameState, dispatchLastName] = useReducer(nameReducer, {
    value: "",
    isValid: null,
  });

  const navigation = useNavigation();

  const navigateToPartTwo = async () => {
    if (!firstNameState.value || !lastNameState.value || !emailState.value) {
      alert("All fields are required.");
    } else {
      setIsLoading(true); // Show loading animation
      const { emailExists, emailToUsername } = await checkEmail(
        emailState.value,
        firstNameState.value,
        lastNameState.value
      );
      setIsLoading(false); // Hide loading animation

      if (!emailExists) {
        navigation.navigate("RegistrationPartTwo", {
          first_name: firstNameState.value,
          last_name: lastNameState.value,
          email: emailState.value,
          username: emailToUsername,
        });
      }
    }
  };

  const emailChangeHandler = (text) => {
    dispatchEmail({ type: "USER_INPUT", val: text });
  };

  const firstNameChangeHandler = (text) => {
    dispatchFirstName({ type: "USER_INPUT", val: text });
  };

  const lastNameChangeHandler = (text) => {
    dispatchLastName({ type: "USER_INPUT", val: text });
  };

  useEffect(() => {
    const identifier = setTimeout(() => {
      setFormIsValid(
        emailState.isValid && firstNameState.isValid && lastNameState.isValid
      );
    }, 500);
    return () => {
      clearTimeout(identifier);
    };
  }, [emailState.isValid, firstNameState.isValid, lastNameState.isValid]);

  const checkEmail = async (email, first_name, last_name) => {
    try {
      const res = await axios.post(`${REACT_APP_IP_ADDRESS}/check_email`, {
        email,
        first_name,
        last_name,
      });

      const { emailExists, emailToUsername } = res.data;
      return { emailExists, emailToUsername };
    } catch (error) {
      setIsLoading(false);

      if (error.response && error.response.data && error.response.data.detail) {
        alert(error.response.data.detail); // Show the error message
      } else {
        alert("An error occurred"); // Handle other unexpected errors
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            onChangeText={firstNameChangeHandler}
            style={[
              styles.input,
              firstNameState.isValid === false ? styles.invalid : null,
            ]}
            value={firstNameState.value}
          />
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            onChangeText={lastNameChangeHandler}
            style={[
              styles.input,
              lastNameState.isValid === false ? styles.invalid : null,
            ]}
            value={lastNameState.value}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            onChangeText={emailChangeHandler}
            style={[
              styles.input,
              emailState.isValid === false ? styles.invalid : null, // Apply the inputError style conditionally
            ]}
            value={emailState.value}
            keyboardType="email-address"
          />
        </View>
      </View>
      {isLoading && <ActivityIndicator size="large" color={COLORS.primary} />}
      <KeyboardAvoidingView
        style={styles.bottomContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.indicatorContainer}>
          <View style={styles.indicator} />
          <View style={[styles.indicator, styles.greyIndicator]} />
        </View>
        <View style={styles.searchContainer}>
          <TouchableOpacity
            style={[
              buttonStyles.searchBtn,
              { width: 150 },
              formIsValid ? null : buttonStyles.disabledButton,
            ]}
            onPress={navigateToPartTwo}
            disabled={!formIsValid}
          >
            <AntDesign
              name="arrowright"
              size={30}
              color={formIsValid ? COLORS.purple : COLORS.white}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },

  bottomContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },

  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },

  indicator: {
    width: 30,
    height: 9,
    backgroundColor: COLORS.lightPurple,
    marginLeft: 4,
    borderRadius: 10,
  },

  greyIndicator: {
    width: 9,
    backgroundColor: COLORS.gray2,
  },

  form: {
    width: "100%",
    marginTop: 20,
    flex: 1,
    alignItems: "center",
  },

  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },

  imageContainer: {
    width: 130,
    height: 130,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.gray2,
    overflow: "hidden",
    borderRadius: 100,
    marginBottom: 20,
  },

  image: {
    width: 100,
    height: 100,
  },

  input: {
    borderWidth: 2,
    borderColor: COLORS.bgGray,
    padding: 10,
    marginBottom: 10,
    borderRadius: 18,
    width: "100%",
  },

  invalid: {
    borderColor: "red",
    borderWidth: 1,
    backgroundColor: "#fbdada",
  },

  label: {
    fontSize: 16,
    color: COLORS.primary,
    fontFamily: FONT.regular,
    marginBottom: 3,
  },

  emailExistsLabel: {
    fontSize: 12,
    color: "red",
    marginLeft: 10,
    fontFamily: FONT.bold,
  },

  searchContainer: {
    justifyContent: "flex-end", // Place the continue button at the bottom
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },

  terms: {
    fontSize: 12,
    color: COLORS.primary,
    textAlign: "center",
  },
});
