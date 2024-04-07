import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";

import { useRouter } from "expo-router";
import { FONT, SIZES, COLORS } from "../../constants";
import PopularJobCard from "../cards/popular/PopularJobCard";
import axios from "axios";
import { REACT_APP_IP_ADDRESS } from "../../env";

const Popularjobs = () => {
  const router = useRouter();

  const [shows, setShows] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const getData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${REACT_APP_IP_ADDRESS}/get_offers`);
      const data = res.data;
      console.log(data);
      setShows(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Get Inspired</Text>
        <Text style={styles.headerContent}>
          See recent orders that were safely and efficiently delivered
          worldwide.
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : (
          <FlatList
            data={shows}
            renderItem={({ item }) => <PopularJobCard item={item} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ columnGap: SIZES.medium }}
            horizontal
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.xLarge,
  },

  header: {
    flexDirection: "column",
  },

  headerTitle: {
    fontWeight: 700,
    fontSize: SIZES.xLarge,
    marginBottom: SIZES.xxSmall,
  },

  headerContent: {
    fontSize: SIZES.medium,
    fontWeight: 400,
    marginBottom: SIZES.xSmall,
  },

  cardsContainer: {
    marginTop: SIZES.medium,
  },
});

export default Popularjobs;
