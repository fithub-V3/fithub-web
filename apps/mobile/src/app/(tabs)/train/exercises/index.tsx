import { useState, useCallback } from "react";
import { View, Text, TextInput, FlatList, Pressable, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { Plus, Search, Dumbbell, ChevronRight } from "lucide-react-native";
import { getExercises, type Exercise } from "@/lib/exercises-client";

const MUSCLE_GROUPS = ["All", "Chest", "Back", "Legs", "Shoulders", "Arms", "Core"];

// Android's safe-area inset doesn't account for the native tab bar's own height
// (only the gesture/nav bar beneath it), unlike iOS where the tab bar is part of
// the safe area. Pad extra for it until we're on an Expo SDK with automatic insets.
const ANDROID_TAB_BAR_HEIGHT = 80;

// remove 'as any' later

export default function ExercisesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const loadExercises = useCallback(async () => {
    try {
      const data = await getExercises();
      setExercises(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load exercises.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadExercises();
    }, [loadExercises])
  );

  const filteredExercises = exercises.filter((exercise) => {
    const matchesFilter =
      activeFilter === "All" || exercise.muscleGroup.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch = exercise.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Exercises</Text>
          <Text style={styles.subtitle}>{exercises.length} exercises · your library</Text>
        </View>
        <Pressable
          style={styles.addButton}
          onPress={() => router.push("/new-exercise" as any)}
        >
          <Plus size={24} color="#07140d" strokeWidth={2.5} />
        </Pressable>
      </View>

      <View style={styles.searchWrapper}>
        <Search size={18} color="#6a746f" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#6a746f"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={MUSCLE_GROUPS}
        keyExtractor={(item) => item}
        style={styles.filterList}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setActiveFilter(item)}
            style={[
              styles.filterPill,
              activeFilter === item && styles.filterPillActive,
            ]}
          >
            <Text
              style={[
                styles.filterPillText,
                activeFilter === item && styles.filterPillTextActive,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        )}
      />

      {isLoading && <Text style={styles.statusText}>Loading exercises...</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {!isLoading && !error && (
        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={{
            paddingBottom:
              insets.bottom + 40 + (Platform.OS === "android" ? ANDROID_TAB_BAR_HEIGHT : 0),
          }}
          ListEmptyComponent={
            <Text style={styles.statusText}>No exercises match your filters yet.</Text>
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => router.push(`/edit-exercise/${item.id}` as any)}
            >
              <View style={styles.cardIcon}>
                <Dumbbell size={20} color="#98a39e" />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <View style={styles.cardMeta}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.muscleGroup}</Text>
                  </View>
                  <Text style={styles.cardEquipment}>{item.equipment}</Text>
                </View>
              </View>
              <ChevronRight size={18} color="#6a746f" />
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#07140d", padding: 20, paddingTop: 50 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  title: { fontSize: 28, fontWeight: "700", color: "#fff" },
  subtitle: { color: "#98a39e", fontSize: 14, marginTop: 4 },
  addButton: {
    backgroundColor: "#34d17e",
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#131917",
    borderRadius: 11,
    borderColor: "rgba(255,255,255,.1)",
    borderWidth: 1.5,
    paddingHorizontal: 14,
    marginTop: 20,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#fff",
  },
  filterList: { marginTop: 16, flexGrow: 0, marginBottom: 16 },
  list: { flex: 1 },
  filterPill: {
    backgroundColor: "#131917",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  filterPillActive: { backgroundColor: "#fff" },
  filterPillText: { color: "#98a39e", fontSize: 14, lineHeight: 18 },
  filterPillTextActive: { color: "#07140d", fontWeight: "600" },
  statusText: { color: "#98a39e", textAlign: "center", marginTop: 20 },
  errorText: { color: "#ff6b6b", textAlign: "center", marginTop: 20 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#131917",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#1c2420",
    marginRight: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  cardBody: { flex: 1 },
  cardTitle: { color: "#fff", fontSize: 16, fontWeight: "600" },
  cardMeta: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  badge: {
    backgroundColor: "rgba(52,209,126,0.15)",
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  badgeText: { color: "#34d17e", fontSize: 12, fontWeight: "600" },
  cardEquipment: { color: "#98a39e", fontSize: 13 },
  chevron: { color: "#6a746f", fontSize: 20 },
});