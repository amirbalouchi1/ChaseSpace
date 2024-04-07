import React, { useState, useLayoutEffect, useEffect, useReducer } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { COLORS, FONT, SIZES } from "../../constants";
import * as ImagePicker from "expo-image-picker";
import { buttonStyles } from "../../components/ButtonStyle";

const passwordReducer = (state, action) => {
  if (action.type === "PASS_INPUT") {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }

  return { value: "", isValid: false };
};

const usernameReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    const isValid = action.val.trim() !== "";
    return {
      value: action.val,
      isValid: isValid,
    };
  }
  if (action.type === "SET_USERNAME") {
    return {
      value: action.val,
      isValid: true,
    };
  }
  return { value: "", isValid: false };
};

const phoneReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    const isValid = action.val.trim() !== "";
    return {
      value: action.val,
      isValid: isValid,
    };
  }
  return { value: "", isValid: false };
};

const RegisterPartTwoScreen = ({ navigation, route }) => {
  const [usernameState, dispatchUsername] = useReducer(usernameReducer, {
    value: "",
    isValid: null,
  });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });
  const [formIsValid, setFormIsValid] = useState(false);

  // Previous
  const [image, setImage] = useState("");
  const [mobile_number, setMobile_Number] = useState("");

  const { email, first_name, last_name, username } = route.params;
  const { register } = useAuth();

  const setUsernameHandler = (text) => {
    dispatchUsername({ type: "SET_USERNAME", val: text });
  };

  const usernameChangeHandler = (text) => {
    dispatchUsername({ type: "USER_INPUT", val: text });
  };

  const passwordChangeHandler = (text) => {
    dispatchPassword({ type: "PASS_INPUT", val: text });
  };

  //Auto sets the username using email value
  useEffect(() => {
    setUsernameHandler(username);
  }, []);

  //Checks for input validation. Is used for styling
  useEffect(() => {
    setFormIsValid(
      usernameState.isValid &&
        mobile_number.trim() !== "" &&
        passwordState.isValid
    );
  }, [usernameState.isValid, mobile_number, passwordState.isValid]);

  //Sends data to authContext for registration
  const signup = async () => {
    if (
      !first_name ||
      !last_name ||
      !email ||
      !usernameState.value ||
      !mobile_number ||
      !passwordState.value
    ) {
      alert("All fields are required");
    } else {
      try {
        const res = await register(
          usernameState.value,
          first_name,
          last_name,
          email,
          mobile_number,
          passwordState.value
        );

        if (res.success) {
          alert("send Registeration Email to verify your account");
          navigation.navigate("Sign In Screen");
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.detail
        ) {
          alert(error.response.data.detail); // Show the error message
        } else {
          alert("An error occurred"); // Handle other unexpected errors
        }
      }
    }
  };

  // Think about image compression.
  // https://pqina.nl/blog/compress-image-before-upload/

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: first_name ? `Welcome, ${first_name}` : "Nearly there",
    });
  }, [navigation, first_name]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.form}>
        <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
          <Image
            style={styles.image}
            source={image || require("../../assets/images/camera.png")}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            onChangeText={usernameChangeHandler}
            style={[
              styles.input,
              usernameState.isValid === false ? styles.invalid : null,
            ]}
            value={usernameState.value}
            placeholderTextColor="grey"
          />
          <Text style={styles.label}>Mobile</Text>
          <TextInput
            onChangeText={setMobile_Number}
            style={styles.input}
            value={mobile_number}
            placeholderTextColor="grey"
            keyboardType="number-pad"
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            onChangeText={passwordChangeHandler}
            style={[
              styles.input,
              passwordState.isValid === false ? styles.invalid : null,
            ]}
            value={passwordState.value}
            placeholderTextColor="grey"
            secureTextEntry={true}
          />
        </View>
        <Text style={styles.terms}>
          By continuing, you are agreeing to the Terms of Service & Privacy
          Policy
        </Text>
      </View>

      <View style={styles.indicatorContainer}>
        <View style={[styles.indicator, styles.greyIndicator]} />
        <View style={styles.indicator} />
      </View>
      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={[
            buttonStyles.searchBtn,
            { width: 150 },
            formIsValid ? null : buttonStyles.disabledButton,
          ]}
          onPress={signup}
          disabled={!formIsValid}
        >
          <Text
            style={[
              buttonStyles.btnText,
              formIsValid ? null : buttonStyles.btnTextGrey,
            ]}
          >
            Create Account
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start", // Place the form at the top
    alignItems: "center",
    backgroundColor: "#fff",
  },

  bottomContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },

  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },

  indicator: {
    width: 30,
    height: 9,
    backgroundColor: COLORS.lightPurple,
    marginLeft: 4,
    borderRadius: 4,
  },

  greyIndicator: {
    width: 9,
    backgroundColor: COLORS.gray2,
  },

  form: {
    width: "90%",
    marginTop: 30,
    flex: 1,
    alignItems: "center",
  },

  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },

  imageContainer: {
    width: 90,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.gray2,
    overflow: "hidden",
    borderRadius: 100,
    marginBottom: 20,
  },

  image: {
    width: 60,
    height: 60,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    width: "100%", // Set the input to take up the entire width
    borderWidth: 2,
    borderColor: COLORS.bgGray,
    padding: 10,
    marginBottom: 20,
    borderRadius: 18,
  },

  invalid: {
    borderColor: "red",
    borderWidth: 1,
    backgroundColor: "#fbdada",
  },

  label: {
    fontSize: 16,
    fontWeight: 500,
    color: COLORS.primary,
    marginBottom: 5,
  },
  searchBtnLeft: {
    width: 190,
    padding: 13,
    backgroundColor: COLORS.purple,
    borderRadius: SIZES.xxLarge,
    color: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  searchContainer: {
    justifyContent: "flex-end", // Place the button at the bottom
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },

  terms: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: "center",
  },
});

export default RegisterPartTwoScreen;
