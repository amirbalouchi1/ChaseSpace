import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  ImageBackground,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { COLORS, FONT, SIZES } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import AppIntroSlider from "react-native-app-intro-slider";

const onBoarding_content = [
  {
    title: "Shop smarter, travel further - save and earn with us 💰",
    description: "",
    button: "Next",
  },
  {
    title: "Shop like a local, save like a pro 🛒",
    description:
      "Earn extra cash by delivering other people's international shopping to your destination. 💰",
    button: "Next",
  },
  {
    title: "Travel more, spend less 🌏",
    description:
      "Discover popular internation finds with massive savings on delivery costs and time. ✈️",
    button: "Sign Up",
  },
];

const OnboardingScreen = () => {
  const navigation = useNavigation();

  const buttonLabel = (label) => {
    return (
      <View
        style={{
          padding: 12,
        }}
      >
        <Text
          style={{
            color: COLORS.primary,
            fontWeight: "600",
            fontSize: SIZES.h4,
          }}
        >
          {label}
        </Text>
      </View>
    );
  };

  return (
    <AppIntroSlider
      data={onBoarding_content}
      renderItem={({ item }) => {
        return (
          <View style={styles.slideContainer}>
            <ImageBackground style={styles.backgroundImage}>
              <View style={styles.topContent}></View>
            </ImageBackground>
            <View style={styles.bottom}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        );
      }}
      activeDotStyle={{
        backgroundColor: COLORS.lightPurple,
        width: 30,
      }}
      showSkipButton
      renderNextButton={() => buttonLabel("Next")}
      renderSkipButton={() => buttonLabel("Skip")}
      renderDoneButton={() => buttonLabel("Done")}
      onDone={() => {
        navigation.navigate("Your Almost Done!");
      }}
    />
  );
};

const styles = StyleSheet.create({
  bottom: {
    flex: 0.6,
    width: "100%",
    borderTopWidth: 0,
    backgroundColor: COLORS.white,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    paddingVertical: 40,
    paddingHorizontal: 20,
  },

  slideContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },

  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "110%",
    justifyContent: "center",
    alignItems: "center",
  },

  topContent: {
    width: "100%",
    height: "110%",
    backgroundColor: "#E9CFEA",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  title: {
    textAlign: "center",
    fontFamily: FONT.bold,
    fontSize: SIZES.xxLarge,
    width: 300,
    fontWeight: "500",
  },

  description: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    textAlign: "center",
    color: COLORS.primary,
    marginTop: 30,
  },
});

export default OnboardingScreen;
