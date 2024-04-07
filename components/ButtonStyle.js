import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../constants";

export const buttonStyles = StyleSheet.create({
  searchBtn: {
    borderBottomWidth: 2,
    marginTop: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.purple,
    backgroundColor: COLORS.lightPurple,
    borderRadius: SIZES.smallMedium,
    color: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },

  searchBtnLeft: {
    width: 150,
    borderBottomWidth: 2,
    borderWidth: 1,
    borderColor: COLORS.purple,
    height: "100%",
    backgroundColor: COLORS.lightPurple,
    borderRadius: SIZES.smallMedium,
    color: COLORS.white,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  searchBtnRight: {
    width: 150,
    borderBottomWidth: 2,
    borderWidth: 1,
    borderColor: COLORS.purple,
    height: "100%",
    backgroundColor: COLORS.lightPurple,
    borderRadius: SIZES.smallMedium,
    color: COLORS.white,
    marginLeft: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  btnText: {
    color: COLORS.purple,
    fontWeight: "700",
    fontSize: SIZES.medium,
    alignItems: "center",
  },

  btnTextGrey: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: SIZES.medium,
    alignItems: "center",
  },

  disabledButton: {
    backgroundColor: COLORS.gray2,
    color: COLORS.primary,
    borderColor: COLORS.gray,
  },
});
