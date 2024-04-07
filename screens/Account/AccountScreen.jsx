import { View, Text, StyleSheet, Image, TextInput } from "react-native";
import { COLORS, FONT, SIZES, images } from "../../constants";
import { useAuth } from "../../context/AuthContext";
import { TouchableOpacity } from "react-native-gesture-handler";
import arrow_right from "../../assets/images/arrow_right.png";
import pencil from "../../assets/images/pencil.png";
import * as ImagePicker from "expo-image-picker";
import React, { useState, useEffect } from "react";
import axios from "axios";

import { REACT_APP_IP_ADDRESS } from "../../env";
import { buttonStyles } from "../../components/ButtonStyle";

const AccountScreen = () => {
  const { authData } = useAuth();
  const { signOut } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    axios
      .get(`${REACT_APP_IP_ADDRESS}/get_user_profile?id=${authData.id}`)
      .then((response) => {
        if (response.data) {
          setUserData(response.data);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message || "Failed to fetch user data");
        setIsLoading(false);
      });
  }, [authData.id]);

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

  const save = async () => {
    console.log(authData.id);
    console.log(userData);
    const res = await saveProfile(
      authData.id,
      userData.first_name,
      userData.last_name,
      userData.email
    );
  };

  const saveProfile = async (id, firstName, lastName, email) => {
    console.log("info", id, firstName, lastName, email);
    try {
      const res = await axios.post(
        `${REACT_APP_IP_ADDRESS}/update_user_profile`,
        {
          id,
          firstName,
          lastName,
          email,
        }
      );
      return res;
    } catch (error) {
      console.error(error);
    }
  };

  const firstNameChangeHandler = (text) => {
    setUserData({
      ...userData,
      ["first_name"]: text,
    });
    console.log(userData);
  };
  const lastNameChangeHandler = (text) => {
    setUserData({
      ...userData,
      ["last_name"]: text,
    });
    console.log(userData);
  };
  const emailChangeHandler = (text) => {
    setUserData({
      ...userData,
      ["email"]: text,
    });
    console.log(userData);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
          <Image
            style={styles.image}
            source={image || require("../../assets/images/camera.png")}
            resizeMode="contain"
          />
        </TouchableOpacity>
        {/* Name */}
        <View style={styles.header_right}>
          <View style={styles.nameContainer}>
            <Text style={styles.nameLabel}>First Name:</Text>
            <View style={styles.nameTextContainer}>
              {/* <Text style={styles.name}>{isLoading ? "Loading..." : (userData?.first_name || "Unavailable")}</Text>
               */}
              <TextInput
                onChangeText={firstNameChangeHandler}
                style={[styles.name]}
                value={
                  isLoading
                    ? "Loading..."
                    : userData?.first_name || "Unavailable"
                }
              />
              <TouchableOpacity style={styles.arrowButton}>
                <Image style={{ width: 20, height: 20 }} source={pencil} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.nameLabel}>Last Name:</Text>
            <View style={styles.nameTextContainer}>
              {/* <Text style={styles.name}>{isLoading ? "Loading..." : (userData?.last_name || "Unavailable")}</Text> */}
              <TextInput
                onChangeText={lastNameChangeHandler}
                style={[styles.name]}
                value={
                  isLoading
                    ? "Loading..."
                    : userData?.last_name || "Unavailable"
                }
              />
              <TouchableOpacity style={styles.arrowButton}>
                <Image style={{ width: 20, height: 20 }} source={pencil} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        <View style={styles.formRow}>
          <Text style={styles.label}>Bio</Text>
          <TouchableOpacity style={styles.arrowButton}>
            <Image style={{ width: 30, height: 30 }} source={arrow_right} />
          </TouchableOpacity>
        </View>
        <View style={styles.formRow}>
          <Text style={styles.label}>Email</Text>

          <View style={styles.nameTextContainer}>
            {/* <TextInput/> */}
            {/* <TextInput placeholde style={styles.label}>{isLoading ? "Loading..." : (userData?.email || "Unavailable")}</TextInput> */}
            <TextInput
              onChangeText={emailChangeHandler}
              style={[styles.name]}
              value={
                isLoading ? "Loading..." : userData?.email || "Unavailable"
              }
            />
            <TouchableOpacity style={styles.arrowButton}>
              <Image style={{ width: 20, height: 20 }} source={pencil} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.formRow}>
          <Text style={styles.label}>Phone Number</Text>

          <TouchableOpacity style={styles.arrowButton}>
            <Image style={{ width: 30, height: 30 }} source={arrow_right} />
          </TouchableOpacity>
        </View>
        <View style={styles.formRow}>
          <Text style={styles.label}>Payout Method</Text>
          <TouchableOpacity style={styles.arrowButton}>
            <Image style={{ width: 30, height: 30 }} source={arrow_right} />
          </TouchableOpacity>
        </View>
        <View style={styles.formRow}>
          <Text style={styles.label}>Notification Settings</Text>
          <TouchableOpacity style={styles.arrowButton}>
            <Image style={{ width: 30, height: 30 }} source={arrow_right} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[buttonStyles.searchBtnLeft, { height: 60 }]}
          onPress={() => save()}
        >
          <Text style={buttonStyles.btnText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[buttonStyles.searchBtnRight, { height: 60 }]}
          onPress={() => signOut()}
        >
          <Text style={buttonStyles.btnText}>Log Out</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Text style={styles.deleteButtonText}>I would like to&nbsp;</Text>
        <TouchableOpacity>
          <Text style={styles.deleteButton}>delete my account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  imageContainer: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.gray2,
    overflow: "hidden",
    borderRadius: 100,
  },

  image: {
    width: 60,
    height: 60,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },

  nameLabel: {
    fontFamily: FONT.bold,
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 5,
    color: COLORS.primary,
  },

  nameTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  name: {
    fontSize: 16,
    fontWeight: "400",
  },

  header_right: {
    flex: 1,
    marginLeft: 20,
  },

  arrowButton: {
    marginLeft: 20,
  },

  nameContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 5,
    paddingTop: 5,
  },

  formContainer: {
    marginBottom: 20,
  },

  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },

  input: {
    fontFamily: FONT.bold,
    backgroundColor: COLORS.gray2,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    fontSize: 16,
    color: COLORS.white,
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: "row",
  },

  deleteButton: {
    color: COLORS.tertiary,
    fontFamily: FONT.bold,
    textDecorationLine: "underline",
  },

  deleteButtonText: {
    fontFamily: FONT.bold,
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "400",
    marginBottom: 20,
  },
});

export default AccountScreen;
