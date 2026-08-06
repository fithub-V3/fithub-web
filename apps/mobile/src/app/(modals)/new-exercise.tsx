import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { createExercise } from "@/lib/exercises-client";

const MUSCLE_GROUP_OPTIONS = ["Chest", "Shoulders", "Back", "Legs", "Arms", "Core"];
const EQUIPMENT_OPTIONS = ["Barbell", "Dumbbell", "Machine", "Bodyweight", "Cable", "Kettlebell"];

export default function NewExerciseScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState(MUSCLE_GROUP_OPTIONS[0]);
  const [equipment, setEquipment] = useState(EQUIPMENT_OPTIONS[0]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await createExercise({ name, muscleGroup, equipment });
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save exercise.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ChevronLeft size={26} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>New exercise</Text>
        <Pressable onPress={handleSave} disabled={isSaving}>
          <Text style={styles.saveText}>{isSaving ? "Saving..." : "Save"}</Text>
        </Pressable>
      </View>

      <Text style={styles.label}>NAME</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="e.g. Incline Dumbbell Press"
        placeholderTextColor="#6a746f"
        autoFocus
      />

      <Text style={styles.label}>MUSCLE GROUP</Text>
      <View style={styles.pillRow}>
        {MUSCLE_GROUP_OPTIONS.map((group) => (
          <Pressable
            key={group}
            onPress={() => setMuscleGroup(group)}
            style={[styles.pill, muscleGroup === group && styles.pillActive]}
          >
            <Text style={[styles.pillText, muscleGroup === group && styles.pillTextActive]}>
              {group}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>EQUIPMENT</Text>
      <View style={styles.pillRow}>
        {EQUIPMENT_OPTIONS.map((option) => (
          <Pressable
            key={option}
            onPress={() => setEquipment(option)}
            style={[styles.pill, equipment === option && styles.pillActive]}
          >
            <Text style={[styles.pillText, equipment === option && styles.pillTextActive]}>
              {option}
            </Text>
          </Pressable>
        ))}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#07140d", paddingTop: 35 },
  content: { padding: 20, paddingBottom: 60 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  saveText: { color: "#34d17e", fontSize: 16, fontWeight: "600" },
  label: { color: "#6a746f", fontSize: 13, marginBottom: 8, marginTop: 20, letterSpacing: 0.5 },
  input: {
    backgroundColor: "#131917",
    borderRadius: 11,
    borderColor: "rgba(255,255,255,.1)",
    borderWidth: 1.5,
    padding: 16,
    fontSize: 16,
    color: "#fff",
  },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill: {
    backgroundColor: "#131917",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,.1)",
  },
  pillActive: { backgroundColor: "#34d17e", borderColor: "#34d17e" },
  pillText: { color: "#98a39e", fontSize: 14 },
  pillTextActive: { color: "#07140d", fontWeight: "600" },
  errorText: { color: "#ff6b6b", marginTop: 16, textAlign: "center" },
});