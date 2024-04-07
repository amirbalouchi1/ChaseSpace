import React, { useEffect, useReducer, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { TextInput } from "react-native-gesture-handler";
import { COLORS, FONT, SIZES } from "../../constants";
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

const passwordReducer = (state, action) => {
  if (action.type === "PASS_INPUT") {
    return { value: action.val, isValid: action.val.trim().length > 0 };
  }

  return { value: "", isValid: false };
};

export const SignInScreen = () => {
  const { signIn } = useAuth();
  const navigation = useNavigation();
  const [test, setTest] = useState("");
  const [formIsValid, setFormIsValid] = useState(false);
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });

  const login = async () => {
    const res = await signIn(emailState.value, passwordState.value);
    if (res && res.error) {
      alert(res.msg);
    }
  };

  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      setFormIsValid(emailIsValid && passwordIsValid);
    }, 500);
    return () => {
      clearTimeout(identifier);
    };
  }, [emailIsValid, passwordIsValid, setFormIsValid]);

  const emailChangeHandler = (text) => {
    dispatchEmail({ type: "USER_INPUT", val: text });
  };

  const passwordChangeHandler = (text) => {
    dispatchPassword({ type: "PASS_INPUT", val: text });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.logoFormContainer}>
        <View source="" resizeMode="contain" style={styles.logoImage} />
        <View style={styles.form}>
          <Text style={styles.welcomeText}>Welcome Back</Text>
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
          <Text style={styles.label}>Password</Text>
          <TextInput
            onChangeText={passwordChangeHandler}
            style={[
              styles.input,
              passwordState.isValid === false ? styles.invalid : null, // Apply the inputError style conditionally
            ]}
            value={passwordState.value}
            secureTextEntry={true}
          />
          <View style={styles.searchContainer}>
            <TouchableOpacity
              style={[
                buttonStyles.searchBtn,
                { width: 150 },
                formIsValid ? null : styles.disabledButton,
              ]}
              onPress={login}
              disabled={!formIsValid}
            >
              <Text
                style={[
                  buttonStyles.btnText,
                  formIsValid ? null : buttonStyles.btnTextGrey,
                ]}
              >
                Log in
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Reset Password")}
            >
              <Text style={styles.forgotPasswordText}>
                Forgot your password?
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.newToChaseSpace}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Text style={styles.newToChaseSpaceText}>New to ChaseSpace?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Get Started")}>
          <Text style={styles.createAccountText}>CREATE AN ACCOUNT</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },

  logoFormContainer: {
    width: "100%",
    alignItems: "center",
  },

  form: {
    width: "100%",
    justifyContent: "center",
  },

  logoImage: {
    backgroundColor: COLORS.purple,
    width: 80,
    height: 80,
    borderRadius: 100,
  },

  welcomeText: {
    fontSize: SIZES.xLarge,
    fontWeight: "bold",
    fontFamily: FONT.bold,
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },

  label: {
    fontSize: 14,
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

  invalid: {
    borderColor: "red",
    borderWidth: 1,
    backgroundColor: "#fbdada", // Use backgroundColor instead of background
  },

  forgotPasswordText: {
    color: COLORS.primary,
    textDecorationLine: "underline",
    marginTop: 40,
  },

  newToChaseSpace: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
  },

  newToChaseSpaceText: {
    fontSize: 14,
    alignItems: "center",
  },

  createAccountText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#d1114d",
    marginTop: 10,
  },

  disabledButton: {
    backgroundColor: COLORS.gray2,
    color: COLORS.primary,
    borderColor: COLORS.gray,
  },

  searchContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginTop: 10,
  },
});
