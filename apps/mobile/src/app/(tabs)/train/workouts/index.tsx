import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { getWorkouts, type Workout } from "@/lib/workouts-client";
import { Plus, Search, Dumbbell, ChevronRight } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ANDROID_TAB_BAR_HEIGHT = 80;

export default function WorkoutsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWorkouts = useCallback(async () => {
    try {
      const data = await getWorkouts();
      setWorkouts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load workouts");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadWorkouts();
    }, [loadWorkouts]),
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Workouts</Text>
          <Text style={styles.subtitle}>
            {workouts.length} templates · your library
          </Text>
        </View>
        <Pressable
          style={styles.addButton}
          onPress={() => router.push("/new-workout" as any)}
        >
          <Plus size={24} color="#07140d" strokeWidth={2.5} />
        </Pressable>
      </View>

      {isLoading && <Text style={styles.statusText}>Loading Workouts...</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {!isLoading && !error && (
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={{
            paddingBottom:
              insets.bottom +
              40 +
              (Platform.OS === "android" ? ANDROID_TAB_BAR_HEIGHT : 0),
          }}
          ListEmptyComponent={
            <Text style={styles.statusText}>No workouts made yet.</Text>
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() =>
                router.push(`/edit-workout/${item.id}` as any)
              }
            >
              <View style={styles.cardIcon}>
                <Dumbbell size={20} color="#98a39e" />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <View style={styles.cardMeta}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {item.exercises.length} exercises
                    </Text>
                  </View>
                  <Text style={styles.cardEquipment}>placeholder</Text>
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
  container: {
    flex: 1,
    backgroundColor: "#07140d",
    padding: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 25,
  },
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
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  badgeText: { color: "#98a39e", fontSize: 12, fontWeight: "600" },
  cardEquipment: { color: "#98a39e", fontSize: 13 },
  chevron: { color: "#6a746f", fontSize: 20 },
});
