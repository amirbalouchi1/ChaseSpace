import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants";

const ValidationInput = ({ label, value, onChangeText, isValid }) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        onChangeText={onChangeText}
        style={[styles.input, isValid === false ? styles.invalid : null]}
        value={value}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    marginBottom: 20,
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
    marginBottom: 3,
  },
});

export default ValidationInput;
