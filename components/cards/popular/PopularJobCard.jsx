import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { COLORS, FONT, SHADOWS, SIZES } from "../../../constants";
const PopularJobCard = ({ item, selectedJob, handleCardPress }) => {
  const imageUrl = item.image.replace(/\\/g, "/");

  return (
    <TouchableOpacity
      style={styles.container(selectedJob, item)}
      onPress={() => handleCardPress(item)}
    >
      <TouchableOpacity style={styles.logoContainer(selectedJob, item)}>
        <Image
          source={{
            uri:
              imageUrl ||
              "https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg",
          }}
          resizeMode="contain"
          style={styles.logoImage}
        />
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.item_name}
          </Text>
          <Text style={styles.itemPrice} numberOfLines={1}>
            ${item.item_price}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: (selectedJob, item) => ({
    width: 200,
    backgroundColor: selectedJob === item.job_id ? COLORS.white : "#FFF",
    borderRadius: SIZES.xSmall,
    justifyContent: "space-between",
    ...SHADOWS.medium,
    shadowColor: COLORS.white,
  }),
  logoContainer: (selectedJob, item) => ({
    width: "100%",
    height: 100,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.medium,
    borderTopRightRadius: SIZES.medium,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingTop: 8,
    justifyContent: "center",
    alignItems: "center",
  }),
  logoImage: {
    width: "100%",
    height: "100%",
  },

  infoContainer: {
    padding: 10,
    flex: 1,
  },

  titleContainer: {
    flex: 1,
  },

  itemPrice: {
    fontSize: SIZES.small,
    color: COLORS.primary,
    fontWeight: 600,
    marginBottom: 5,
  },

  itemName: {
    fontSize: SIZES.small,
    color: COLORS.primary,
    marginBottom: 5,
  },

  publisher: (selectedJob, item) => ({
    fontSize: SIZES.medium - 2,
    color: selectedJob === item.job_id ? COLORS.white : COLORS.primary,
  }),

  location: {
    fontSize: SIZES.medium - 2,
    color: "#B3AEC6",
  },
});

export default PopularJobCard;
