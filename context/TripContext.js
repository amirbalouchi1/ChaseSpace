import React, { createContext, useContext, useState } from "react";

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const [tripUpdate, setTripUpdate] = useState(false);
  const [deletionOccured, setDeletionOccured] = useState(false);

  const addTrip = () => {
    setTripUpdate(!tripUpdate);
  };

  const handleDeletion = () => {
    setDeletionOccured(true);
  };

  return (
    <TripContext.Provider
      value={{ tripUpdate, addTrip, deletionOccured, handleDeletion }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTripContext = () => useContext(TripContext);
