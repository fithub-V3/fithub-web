import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import BottomSheet from "@gorhom/bottom-sheet";
import { ChevronLeft, Rows4, GripVertical, X, Trash2 } from "lucide-react-native";
import { getWorkout, updateWorkout, deleteWorkout } from "@/lib/workouts-client";
import { getExercises, type Exercise } from "@/lib/exercises-client";
import { AddFromBankSheet } from "@/components/workouts/AddFromBankSheet";

type SelectedExercise = {
  exerciseId: string;
  exerciseName: string;
  targetSets: number;
  targetReps: number;
};

export default function EditWorkoutScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const sheetRef = useRef<BottomSheet>(null);

  const [name, setName] = useState("");
  const [selected, setSelected] = useState<SelectedExercise[]>([]);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [workout, exercises] = await Promise.all([
          getWorkout(id),
          getExercises(),
        ]);
        setName(workout.name);
        setSelected(
          workout.exercises
            .slice()
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((e) => ({
              exerciseId: e.exerciseId,
              exerciseName: e.exerciseName,
              targetSets: e.targetSets,
              targetReps: e.targetReps,
            })),
        );
        setAvailableExercises(exercises);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load workout.");
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [id]);

  function openSheet() {
    sheetRef.current?.expand();
  }

  function handleConfirmFromBank(chosen: Exercise[]) {
    const newEntries: SelectedExercise[] = chosen.map((e) => ({
      exerciseId: e.id,
      exerciseName: e.name,
      targetSets: 3,
      targetReps: 10,
    }));
    setSelected((prev) => [...prev, ...newEntries]);
    sheetRef.current?.close();
  }

  function removeExercise(exerciseId: string) {
    setSelected((prev) => prev.filter((e) => e.exerciseId !== exerciseId));
  }

  function updateSets(exerciseId: string, value: string) {
    const targetSets = parseInt(value, 10) || 0;
    setSelected((prev) =>
      prev.map((e) => (e.exerciseId === exerciseId ? { ...e, targetSets } : e))
    );
  }

  function updateReps(exerciseId: string, value: string) {
    const targetReps = parseInt(value, 10) || 0;
    setSelected((prev) =>
      prev.map((e) => (e.exerciseId === exerciseId ? { ...e, targetReps } : e))
    );
  }

  async function handleSave() {
    if (!name.trim() || selected.length === 0) {
      setError("Name and at least one exercise are required.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await updateWorkout(id, {
        name,
        exercises: selected.map((e, index) => ({
          exerciseId: e.exerciseId,
          orderIndex: index,
          targetSets: e.targetSets,
          targetReps: e.targetReps,
        })),
      });
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save workout.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleDelete() {
    Alert.alert("Delete workout?", `"${name}" will be permanently deleted.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setIsDeleting(true);
          setError(null);

          try {
            await deleteWorkout(id);
            router.back();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete workout.");
            setIsDeleting(false);
          }
        },
      },
    ]);
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.statusText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ChevronLeft size={26} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Edit workout</Text>
        <Pressable onPress={handleSave} disabled={isSaving}>
          <Text style={styles.saveText}>{isSaving ? "Saving..." : "Save"}</Text>
        </Pressable>
      </View>

      <View style={styles.input}>
        <TextInput
          style={styles.inputElement}
          value={name}
          onChangeText={setName}
          placeholder="Untitled workout"
          placeholderTextColor="#6a746f"
        />
        <Text style={styles.subtitle}>
          {selected.length} exercise{selected.length === 1 ? "" : "s"}
        </Text>
      </View>

      {selected.length === 0 ? (
        <View style={styles.initialAddPanel}>
          <View style={styles.iconCircle}>
            <Rows4 size={24} color="#34d17e" />
          </View>
          <Text style={styles.initialPanelText}>No exercises yet</Text>
          <Text style={styles.initialPanelSubtext}>
            Add moves from your bank to build this workout.
          </Text>
          <Pressable style={styles.button} onPress={openSheet}>
            <Text style={styles.buttonText}>+ Add from bank</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView style={styles.exerciseList} contentContainerStyle={styles.exerciseListContent}>
          {selected.map((exercise, index) => (
            <View key={exercise.exerciseId} style={styles.exerciseRow}>
              <View style={styles.exerciseRowHeader}>
                <GripVertical size={18} color="#6a746f" />
                <Text style={styles.exerciseRowTitle}>
                  {index + 1}. {exercise.exerciseName}
                </Text>
                <Pressable onPress={() => removeExercise(exercise.exerciseId)}>
                  <X size={18} color="#6a746f" />
                </Pressable>
              </View>

              <View style={styles.exerciseRowInputs}>
                <View style={styles.inputField}>
                  <Text style={styles.inputLabel}>SETS</Text>
                  <TextInput
                    style={styles.numberInput}
                    keyboardType="number-pad"
                    value={String(exercise.targetSets)}
                    onChangeText={(v) => updateSets(exercise.exerciseId, v)}
                  />
                </View>
                <View style={styles.inputField}>
                  <Text style={styles.inputLabel}>REPS</Text>
                  <TextInput
                    style={styles.numberInput}
                    keyboardType="number-pad"
                    value={String(exercise.targetReps)}
                    onChangeText={(v) => updateReps(exercise.exerciseId, v)}
                  />
                </View>
              </View>
            </View>
          ))}

          <Pressable style={styles.addMoreButton} onPress={openSheet}>
            <Text style={styles.addMoreButtonText}>+ Add exercise from bank</Text>
          </Pressable>

          <Pressable
            style={styles.deleteButton}
            onPress={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 size={18} color="#ff6b6b" />
            <Text style={styles.deleteText}>{isDeleting ? "Deleting..." : "Delete workout"}</Text>
          </Pressable>
        </ScrollView>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}

      <AddFromBankSheet
        ref={sheetRef}
        exercises={availableExercises}
        alreadyAddedIds={selected.map((e) => e.exerciseId)}
        onConfirm={handleConfirmFromBank}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0d0c" },
  statusText: { color: "#98a39e", textAlign: "center", marginTop: 80 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 15,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  saveText: { color: "#34d17e", fontSize: 16, fontWeight: "600" },
  input: {
    backgroundColor: "transparent",
    borderRadius: 11,
    padding: 16,
    paddingTop: 8,
  },
  inputElement: {
    backgroundColor: "rgba(0,0,0,0)",
    fontSize: 27,
    color: "#fff",
  },
  subtitle: { color: "#6a746f", fontSize: 13, marginTop: 4 },
  initialAddPanel: {
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(255,255,255,.14)",
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#131917",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  initialPanelText: { color: "#fff", paddingTop: 4, fontWeight: "700" },
  initialPanelSubtext: { color: "#6a746f", paddingTop: 8, paddingBottom: 20, textAlign: "center" },
  button: {
    backgroundColor: "#34d17e",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
  },
  buttonText: { fontWeight: "700", color: "#07140d" },
  errorText: { color: "#ff6b6b", marginTop: 16, textAlign: "center" },
  exerciseList: { flex: 1, paddingHorizontal: 16 },
  exerciseListContent: { paddingBottom: 40 },
  exerciseRow: {
    backgroundColor: "#131917",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  exerciseRowHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  exerciseRowTitle: { flex: 1, color: "#fff", fontSize: 15, fontWeight: "600" },
  exerciseRowInputs: { flexDirection: "row", gap: 12 },
  inputField: { flex: 1 },
  inputLabel: { color: "#6a746f", fontSize: 11, marginBottom: 4, letterSpacing: 0.5 },
  numberInput: {
    backgroundColor: "#07140d",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,.1)",
    color: "#fff",
    padding: 10,
    fontSize: 15,
  },
  addMoreButton: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#34d17e",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
  },
  addMoreButtonText: { color: "#34d17e", fontWeight: "600" },
  deleteButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "rgba(255,107,107,0.3)",
  },
  deleteText: { color: "#ff6b6b", fontSize: 16, fontWeight: "600" },
});
