import React, { useEffect, useState } from "react";
import { Button, Text, View, ScrollView } from "react-native";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { COLORS, icons, images, SIZES } from "../constants";
import Welcome from "../components/home/Welcome";
import Popularjobs from "../components/home/Popularjobs";

export const HomeScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      {/* Body */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <Welcome />
          <Popularjobs />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
