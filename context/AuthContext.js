import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { REACT_APP_IP_ADDRESS } from "../env";

export const AuthContext = createContext();

const TOKEN_KEY = "my-jwt";

const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    token: null,
    authenticated: false,
    firstName: "",
    email: "",
    id: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const firstName = await SecureStore.getItemAsync("First_Name");
      const email = await SecureStore.getItemAsync("email");
      const id = await SecureStore.getItemAsync("id");

      if (token && firstName && id && email) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        setAuthData({
          token: token,
          authenticated: true,
          firstName: firstName,
          email: email,
          id: id,
        });
      }
    };
    loadToken();
  }, []);

  const signIn = async (email, password) => {
    try {
      const res = await axios.post(`${REACT_APP_IP_ADDRESS}/login`, {
        email,
        password,
      });

      console.log(res.data.email);
      console.log(res.data.firstName);
      setAuthData({
        token: res.data.token,
        authenticated: true,
        firstName: res.data.firstName,
        email: res.data.email,
        id: res.data.id,
      });

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.token}`;

      await SecureStore.setItemAsync(TOKEN_KEY, res.data.token);
      await SecureStore.setItemAsync("First_Name", res.data.firstName);
      await SecureStore.setItemAsync("email", res.data.email);
      await SecureStore.setItemAsync("id", JSON.stringify(res.data.id));

      return res;
    } catch (error) {
      console.error(error);
    }
  };

  const forgotPassword = async (email, password) => {
    const res = await axios.post(`${REACT_APP_IP_ADDRESS}/forgotPassword`, {
      email,
      password,
    });
    console.log(res);
    return res.data;
  };

  const signOut = async () => {
    // Delete Token
    await SecureStore.deleteItemAsync(TOKEN_KEY);

    // Update HTTP Headers
    axios.defaults.headers.common["Authorization"] = "";

    // Reset authData
    setAuthData({ token: null, authenticated: false });
  };

  const register = async (
    username,
    first_name,
    last_name,
    email,
    mobile_number,
    password
  ) => {
    try {
      const res = await axios.post(`${REACT_APP_IP_ADDRESS}/signup`, {
        username,
        first_name,
        last_name,
        email,
        mobile_number,
        password,
      });

      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ authData, loading, signIn, signOut, register, forgotPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return authContext;
};
