import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { COLORS, FONT, SIZES } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { useTripContext } from "../../context/TripContext";
import TripDetailsCard from "../../components/cards/trip/TripDetailsCard";

import { REACT_APP_IP_ADDRESS } from "../../env";
import { buttonStyles } from "../../components/ButtonStyle";

const TripScreen = () => {
  const navigation = useNavigation();
  const { authData } = useAuth();
  const { tripUpdate } = useTripContext();
  const [trips, setTrips] = useState([]);
  const handleAddTrip = () => {
    navigation.navigate("Trip Details");
  };

  useEffect(() => {
    // Fetch user's trips when the component mounts
    fetchUserTrips();
  }, [tripUpdate]);

  const fetchUserTrips = async () => {
    try {
      const res = await axios.get(`${REACT_APP_IP_ADDRESS}/get_trip`, {
        params: {
          id: authData.id,
        },
      });
      console.log(res);
      setTrips(res.data);
    } catch (error) {
      console.error("Error fetching user trips:", error);
    }
  };

  return (
    <>
      {trips.length > 0 ? (
        <View style={styles.container}>
          <FlatList
            data={trips}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TripDetailsCard
                fetchUserTrips={fetchUserTrips}
                item={item}
                onPress={() =>
                  navigation.navigate("Trip Settings", { details: item })
                }
              />
            )}
            contentContainerStyle={styles.tripList}
          />
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyContent}>
            <Image
              source={require("../../assets/images/trip.png")}
              style={styles.emptyImage}
            />
            <Text style={styles.emptyText}>
              Log your upcoming trip and unlock global savings - earn as you
              explore the world
            </Text>
          </View>
          <TouchableOpacity
            style={[
              buttonStyles.searchBtn,
              {
                marginBottom: 30,
                width: "100%",
              },
            ]}
            onPress={handleAddTrip}
          >
            <Text style={buttonStyles.btnText}>Create a Trip</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 20,
    height: "100%",
  },

  tripItem: {
    paddingHorizontal: 10,
    backgroundColor: COLORS.white,
    borderRadius: 20,
  },

  tripDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  trimmingTripDetails: {
    backgroundColor: COLORS.white,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 20,
    paddingVertical: 15,
    height: 50,
  },

  detailsText: {
    fontFamily: FONT.bold,
    fontSize: 15,
  },

  trimmingDetails: {
    flex: 1,
    flexDirection: "row",
  },

  columnWide: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  columnNarrow: {
    flex: 1,
    alignItems: "center",
  },

  cityText: {
    fontFamily: FONT.bold,
    fontSize: 18,
    margin: 10,
    fontWeight: "normal",
  },
  dateText: {
    fontFamily: FONT.bold,
    margin: 10,
    fontSize: 14,
    color: COLORS.gray,
  },

  circle: {
    margin: 10,
    width: 5,
    height: 5,
    padding: 8,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    borderWidth: 1,
  },

  airplaneImage: {
    backgroundColor: COLORS.white,
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  tripTitle: {
    fontSize: 16,
    fontFamily: FONT.bold,
    fontWeight: "bold",
  },

  // Empty Trip Screen

  emptyContainer: {
    backgroundColor: COLORS.white,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  emptyContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },

  emptyText: {
    textAlign: "center",
    fontSize: SIZES.xxLarge,
    lineHeight: 40,
    marginBottom: 20,
  },
});

export default TripScreen;
