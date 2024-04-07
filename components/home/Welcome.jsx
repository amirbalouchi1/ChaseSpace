import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import { COLORS, FONT, SIZES } from "../../constants";
import { buttonStyles } from "../ButtonStyle";

const guide = [
  {
    title: "Post a Listing Here",
    content: "Listings visible to our community of verified Travelers",
  },
  {
    title: "Connect with Traveler",
    content: "Get delivery offers from verified travelers",
  },
  {
    title: "Recieve your Product",
    content: "Order delivered through post or in person",
  },
];

const Welcome = () => {
  const { authData } = useAuth();
  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.userName}>
          What are you up to today, {authData.firstName}
        </Text>
      </View>
      <View style={styles.searchContainer}>
        <TouchableOpacity style={buttonStyles.searchBtnLeft} onPress={() => {}}>
          <Text style={buttonStyles.btnText}>Start Order</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={buttonStyles.searchBtnRight}
          onPress={() => {}}
        >
          <Text style={buttonStyles.btnText}>Add Trip</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabsContainer}>
        <Text style={styles.tabText}>How It Works</Text>
        <View style={styles.guideContainer}>
          {guide.map((item) => (
            <View key={item.title} style={styles.guideItemContainer}>
              <Image style={styles.logoBox} />
              <Text style={styles.guideItemTitle}>{item.title}</Text>
              <Text style={styles.guideItemContent}>{item.content}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  userName: {
    fontSize: SIZES.xxLarge,
    fontWeight: 700,
    color: COLORS.primary,
  },

  searchContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: SIZES.large,
    height: 50,
    marginBottom: SIZES.xxLarge,
  },

  tabsContainer: {
    width: "100%",
    marginTop: SIZES.medium,
  },

  tabText: {
    fontWeight: 700,
    fontSize: SIZES.xLarge,
  },

  guideContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },

  logoBox: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.gray2,
    marginBottom: SIZES.xSmall,
    borderRadius: SIZES.xxLarge,
    alignSelf: "center",
  },

  guideItemContainer: {
    width: "33.33%",
    marginBottom: SIZES.medium,
    marginTop: SIZES.medium,
    borderRadius: SIZES.small,
    textAlign: "center",
  },

  guideItemTitle: {
    fontSize: SIZES.medium,
    textAlign: "center",
    fontWeight: 700,
    marginBottom: SIZES.xSmall,
  },

  guideItemContent: {
    textAlign: "center",
    fontSize: SIZES.small,
  },
  tab: (activeJobType, item) => ({
    paddingVertical: SIZES.small / 2,
    paddingHorizontal: SIZES.small,
    borderRadius: SIZES.medium,
    borderWidth: 1,
    borderColor: activeJobType === item ? COLORS.secondary : COLORS.gray2,
  }),
});

export default Welcome;
