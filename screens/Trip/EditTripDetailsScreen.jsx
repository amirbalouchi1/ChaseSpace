import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRoute } from "@react-navigation/native";
import TripInputForm from "../../components/cards/trip/TripInputForm";
import { useTripContext } from "../../context/TripContext";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

import { REACT_APP_IP_ADDRESS } from "../../env";

const EditTripDetailsScreen = () => {
  const route = useRoute();
  const { tripDetails } = route.params;
  const { addTrip } = useTripContext();
  const arrivalDate = new Date(tripDetails.arrival_date);

  const handleUpdateTrip = async (tripData) => {
    const { departingCity, arrivingCity, date } = tripData;
    try {
      const res = await axios.post(`${REACT_APP_IP_ADDRESS}/update_trip`, {
        departingCity,
        arrivingCity,
        date,
        id: tripDetails.id,
      });
      addTrip();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {tripDetails && (
        <TripInputForm
          initialValues={{
            departingCity: tripDetails.departing_location,
            arrivingCity: tripDetails.arrival_location,
            date: arrivalDate,
            arrival: arrivalDate,
          }}
          onSubmit={handleUpdateTrip}
        />
      )}
    </>
  );
};

export default EditTripDetailsScreen;
