import { useCallback, useMemo, useState, forwardRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetFooter,
  type BottomSheetFooterProps,
} from "@gorhom/bottom-sheet";
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

    const handleConfirm = useCallback(() => {
      const chosen = exercises.filter((e) => pickedIds.includes(e.id));
      onConfirm(chosen);
      setPickedIds([]);
      setSearch("");
    }, [exercises, pickedIds, onConfirm]);

    const renderFooter = useCallback(
      (footerProps: BottomSheetFooterProps) => (
        <BottomSheetFooter {...footerProps} style={styles.footer}>
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
        </BottomSheetFooter>
      ),
      [pickedIds, handleConfirm],
    );

    const header = (
      <View style={styles.header}>
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
      </View>
    );

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={["75%"]}
        enablePanDownToClose
        footerComponent={renderFooter}
      >
        <BottomSheetFlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          style={styles.container}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={header}
          stickyHeaderIndices={[0]}
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
      </BottomSheet>
    );
  },
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 20, paddingBottom: 110 },
  header: { backgroundColor: "#0a0d0c", paddingBottom: 12 },
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
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
    backgroundColor: "#0a0d0c",
  },
  confirmButton: {
    backgroundColor: "#34d17e",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
  },
  confirmButtonDisabled: { opacity: 0.4 },
  confirmButtonText: { color: "#07140d", fontWeight: "700", fontSize: 16 },
});
