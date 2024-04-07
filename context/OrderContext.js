import React, { createContext, useContext, useState } from "react";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orderUpdate, setOrderUpdate] = useState(false);
  const [deletionOccured, setDeletionOccured] = useState(false);

  const addOrder = () => {
    setOrderUpdate(!orderUpdate);
  };

  const handleDeletion = () => {
    setDeletionOccured(true);
  };

  return (
    <OrderContext.Provider
      value={{ orderUpdate, addOrder, deletionOccured, handleDeletion }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => useContext(OrderContext);
