import { useState, useCallback } from "react";
import { View, Text, TextInput, FlatList, Pressable, StyleSheet, Platform } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { getWorkouts } from "@/lib/workouts-client";

