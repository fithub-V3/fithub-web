import { useMemo, useState, forwardRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import BottomSheet, { BottomSheetView, BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Search, Check, Plus } from "lucide-react-native";
import type { Exercise } from "@/lib/exercises-client";

const MUSCLE_GROUPS = [
  "All",
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Core",
];

type AddFromBankSheetProps = {
  exercises: Exercise[];
  alreadyAddedIds: string[];
  onConfirm: (chosen: Exercise[]) => void;
};

export const AddFromBankSheet = forwardRef<BottomSheet, AddFromBankSheetProps>(
  ({ exercises, alreadyAddedIds, onConfirm }, ref) => {
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [pickedIds, setPickedIds] = useState<string[]>([]);

    const filtered = useMemo(() => {
      return exercises.filter((e) => {
        const alreadyAdded = alreadyAddedIds.includes(e.id);
        const matchesFilter =
          activeFilter === "All" ||
          e.muscleGroup.toLowerCase() === activeFilter.toLowerCase();
        const matchesSearch = e.name
          .toLowerCase()
          .includes(search.toLowerCase());
        return !alreadyAdded && matchesFilter && matchesSearch;
      });
    }, [exercises, alreadyAddedIds, activeFilter, search]);

    function togglePick(id: string) {
      setPickedIds((prev) =>
        prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
      );
    }

    function handleConfirm() {
      const chosen = exercises.filter((e) => pickedIds.includes(e.id));
      onConfirm(chosen);
      setPickedIds([]);
      setSearch("");
    }

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={["75%"]}
        enablePanDownToClose
      >
        <BottomSheetView style={styles.container}>
          <Text style={styles.title}>Add from bank</Text>

          <View style={styles.searchWrapper}>
            <Search size={16} color="#6a746f" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search exercises..."
              placeholderTextColor="#6a746f"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <BottomSheetFlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={MUSCLE_GROUPS}
            keyExtractor={(item) => item}
            style={styles.filterList}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => setActiveFilter(item)}
                style={[
                  styles.pill,
                  activeFilter === item && styles.pillActive,
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    activeFilter === item && styles.pillTextActive,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            )}
          />

          <BottomSheetFlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            style={styles.filteredList}
            renderItem={({ item }) => {
              const isPicked = pickedIds.includes(item.id);
              return (
                <Pressable
                  style={styles.row}
                  onPress={() => togglePick(item.id)}
                >
                  <View style={styles.rowBody}>
                    <Text style={styles.rowTitle}>{item.name}</Text>
                    <Text style={styles.rowSubtitle}>
                      {item.muscleGroup} · {item.equipment}
                    </Text>
                  </View>
                  {isPicked ? (
                    <View style={styles.checkCircle}>
                      <Check size={14} color="#07140d" />
                    </View>
                  ) : (
                    <Plus size={20} color="#34d17e" />
                  )}
                </Pressable>
              );
            }}
          />

          <Pressable
            style={[
              styles.confirmButton,
              pickedIds.length === 0 && styles.confirmButtonDisabled,
            ]}
            onPress={handleConfirm}
            disabled={pickedIds.length === 0}
          >
            <Text style={styles.confirmButtonText}>
              {pickedIds.length === 0
                ? "Select exercises"
                : `Add ${pickedIds.length} exercise${pickedIds.length > 1 ? "s" : ""}`}
            </Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheet>
    );
  },
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#0a0d0c" },
  title: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 16 },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#131917",
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,.1)",
    paddingHorizontal: 14,
    gap: 8,
  },
  searchInput: { flex: 1, paddingVertical: 12, color: "#fff", fontSize: 15 },
  filterList: { marginTop: 12, flexGrow: 0 },
  filteredList: { flex: 1 },
  pill: {
    backgroundColor: "#131917",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  pillActive: { backgroundColor: "#fff" },
  pillText: { color: "#98a39e", fontSize: 13 },
  pillTextActive: { color: "#07140d", fontWeight: "600" },
  list: { paddingTop: 12, paddingBottom: 12 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,.06)",
  },
  rowBody: { flex: 1 },
  rowTitle: { color: "#fff", fontSize: 15, fontWeight: "600" },
  rowSubtitle: { color: "#6a746f", fontSize: 13, marginTop: 2 },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#34d17e",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#34d17e",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  confirmButtonDisabled: { opacity: 0.4 },
  confirmButtonText: { color: "#07140d", fontWeight: "700", fontSize: 16 },
});
