const COLORS = {
  primary: "#141414",
  secondary: "#444262",
  tertiary: "#FF7754",

  darkPurple: "#4a1e9e",
  purple: "#8a2be2",
  lightPurple: "#ddcbff",
  lightestPurple: "#ddcbff",
  lightPink: "#F9EEFF",

  gray: "#83829A",
  gray2: "#D9D9D9",
  bgGray: "#ECECEC",
  white: "#ffffff",
  lightWhite: "#FAFAFC",
};

const FONT = {
  regular: "DMRegular",
  medium: "DMMedium",
  bold: "DMBold",
};

const SIZES = {
  xSmall: 10,
  small: 13,
  smallMedium: 14,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 32,
};

const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5,
  },
};

export { COLORS, FONT, SIZES, SHADOWS };
