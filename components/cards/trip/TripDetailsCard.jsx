import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { COLORS, FONT } from "../../../constants";
import DashedLine from "react-native-dashed-line";
import axios from "axios";

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { REACT_APP_IP_ADDRESS } from "../../../env";


const formatDateString = (dateString) => {
  const date = new Date(dateString);
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.getDate();
  return `${month} ${day}`;
};



const TripDetailsCard = ({ item, onPress, fetchUserTrips}) => {
  const [matchingOffers, setMatchingOffers] = useState([]);
  //const { deletionOccured } = useTripContext();
  console.log("TripDetailsCard", item);

  const fetchMatchingOffers = async () => {
    console.log("Server Request");
    try {
      const response = await axios.get(
        `${REACT_APP_IP_ADDRESS}/get_targeted_offers`,
        {
          params: {
            departingLocation: item.departing_location.toLowerCase(),
            arrivalLocation: item.arrival_location.toLowerCase(),
          },
        }
      );

      setMatchingOffers(response.data);
      console.log("before matched");
      console.log("Matches: ", response.data);
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  useEffect(() => {
    fetchMatchingOffers();  
  }, []);


  const DeleteItem = async (id) => {
    try {
      const response = await axios.delete(`${REACT_APP_IP_ADDRESS}/delete_trip/${id}`);
      console.log(response.data); // You can handle the response as needed
      alert(`item deleted with id ${id}`)
    } catch (error) {
      console.error('Error deleting order:', error);
    }


   /* try {
      alert(`item deleted with id ${id}`)
    } catch (e) {
      console.log(e)
    } */
    fetchUserTrips();
  }
  return (
    <View>
      <TouchableOpacity style={styles.tripItem} onPress={onPress}>
        <View style={styles.tripDetails}>
          <View style={styles.columnWide}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Text style={styles.cityText} numberOfLines={1}>
                {item.departing_location}
              </Text>
            </ScrollView>
            <View style={styles.circle} />
            <Text style={styles.dateText}>
              {new Date(item.departing_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
          </View>

          {/* Airplane */}
          <View style={styles.columnNarrow}>
            <Image
              source={require("../../../assets/images/airplane.png")}
              style={styles.airplaneImage}
            />
            <DashedLine dashLength={3} dashThickness={2} dashColor="black" />
          </View>

          <View style={styles.columnWide}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Text style={styles.cityText} numberOfLines={1}>
                {item.arrival_location}
              </Text>
            </ScrollView>
            <View style={styles.circle} />
            <Text style={styles.dateText}>
              {new Date(item.arrival_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
          </View>
          <TouchableOpacity style={{ position: 'absolute', bottom: 10, right: 0 }} onPress={() => DeleteItem(item.id)}>
            <MaterialCommunityIcons name="delete" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Connecting Line */}
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <DashedLine
            style={{ width: "90%" }}
            dashLength={3}
            dashThickness={2}
            dashColor="black"
          />
        </View>
      </TouchableOpacity>

      <View style={styles.trimmingTripDetails}>
        <View style={styles.columnNarrow}>
          <Text style={styles.detailsText}>{matchingOffers.length} Orders</Text>
        </View>
        <View style={styles.columnNarrow}>
          <Text style={styles.detailsText}>0 offers</Text>
        </View>
        <View style={styles.columnNarrow}>
          <Text style={styles.detailsText}>0 to deliver</Text>
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  tripItem: {
    paddingHorizontal: 10,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    borderRadius: 10,
  },

  tripDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  trimmingTripDetails: {
    backgroundColor: COLORS.white,
    borderTopWidth: 0,
    borderWidth: 1.5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 10,

    paddingVertical: 15,
    height: 50,
  },

  detailsText: {
    fontFamily: FONT.regular,
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
    fontFamily: FONT.regular,
    fontSize: 18,
    margin: 10,

  },
  dateText: {
    fontFamily: FONT.regular,
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
  },

  airplaneImage: {
    backgroundColor: COLORS.white,
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
});

export default TripDetailsCard;
