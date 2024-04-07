import React from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useTripContext } from "../../context/TripContext";
import TripInputForm from "../../components/cards/trip/TripInputForm";

import { REACT_APP_IP_ADDRESS } from "../../env";

const AddTripScreen = () => {
  const { authData } = useAuth();
  const { addTrip } = useTripContext();

  const handleCreateTrip = async (tripData) => {
    try {
      const res = await axios.post(`${REACT_APP_IP_ADDRESS}/create_trip`, {
        ...tripData,
        id: authData.id,
      });
      addTrip();
      console.log("Response: ", res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TripInputForm
      initialValues={{
        departingCity: "",
        arrivingCity: "",
        date: new Date(),
      }}
      onSubmit={handleCreateTrip}
    />
  );
};

export default AddTripScreen;
