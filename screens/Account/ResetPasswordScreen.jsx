import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet, Text } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { COLORS, FONT, SIZES } from "../../constants";
import { TouchableOpacity } from "react-native-gesture-handler";
import { buttonStyles } from "../../components/ButtonStyle";

const ResetPasswordScreen = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handleNewPasswordChange = (text) => {
    setNewPassword(text);
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
  };

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      alert(
        "The new password does not match the confirmed password. Please try again."
      );
    } else if (!email && !newPassword && !confirmPassword) {
      alert("You need to fill out the form.");
    } else {
      try {
        const res = await forgotPassword(email, newPassword);
        if (res) {
          alert(res.msg);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        onChangeText={handleEmailChange}
        value={email}
        keyboardType="email-address"
      />
      <Text style={styles.label}>New Password</Text>
      <TextInput
        style={styles.input}
        onChangeText={handleNewPasswordChange}
        value={newPassword}
        secureTextEntry={true}
      />
      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        onChangeText={handleConfirmPasswordChange}
        value={confirmPassword}
        secureTextEntry={true}
      />

      <TouchableOpacity onPress={handleSubmit} style={buttonStyles.searchBtn}>
        <Text style={buttonStyles.btnText}>Submit a reset request</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: "100%",
    backgroundColor: COLORS.white,
    justifyContent: "center",
    justifyContent: "flex-start",
  },
  input: {
    borderWidth: 2,
    borderColor: COLORS.bgGray,
    padding: 10,
    marginBottom: 10,
    borderRadius: 18,
    width: "100%",
  },

  label: {
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 3,
    paddingLeft: 10,
  },
});
export default ResetPasswordScreen;
