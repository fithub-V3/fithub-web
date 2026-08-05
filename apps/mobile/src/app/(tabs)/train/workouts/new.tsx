import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { createWorkout, type WorkoutExercise } from "@/lib/workouts-client";
import { getExercises } from "@/lib/exercises-client";
import { ChevronLeft, Rows4 } from "lucide-react-native";


export default function NewWorkoutScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([])
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialState, setInitialState] = useState(true);

  async function handleSave() {
    console.log("placeholder");
    setInitialState(false)
    console.log(initialState);
  }

  async function placeholder() {
    console.log("Placeholder function");
  }

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <ChevronLeft size={26} color="#fff"/>
            <Text style={styles.headerTitle}>New workout</Text>
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
              autoFocus
            />
        </View>

        {initialState ? (
          <View style={styles.initialAddPanel}>
            <Rows4 size={24} color="#34d17e" style={styles.initialPanelIcon}/>
            <Text style={styles.initialPanelText}>No exercises yet</Text>
            <Text style={styles.initialPanelSubtext}>Add moves from your bank to build this workout.</Text>
            <Pressable style={styles.button} onPress={placeholder}>
                <Text style={styles.buttonText}>+ Add from bank</Text>
            </Pressable>
          </View>
        ) : (  
          <Text>test</Text>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0d0c" },
  content: { padding: 20, paddingBottom: 60 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 0,
    paddingTop: 60,
    paddingLeft: 15,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  saveText: { color: "#34d17e", fontSize: 16, fontWeight: "600", paddingRight: 15 },
  label: { color: "#6a746f", fontSize: 13, marginBottom: 8, marginTop: 20, letterSpacing: 0.5 },
  initialAddPanel: { alignItems: "center", borderWidth: 1, borderStyle: "dashed", borderColor: "rgba(255, 255, 255, .14)", borderRadius: 16, padding: 24, marginLeft: 16, marginRight: 16 },
  initialPanelIcon: { backgroundColor: "#131917", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,255,255,.1)"},
  initialPanelText: { color: "#fff", paddingTop: 15 },
  initialPanelSubtext: { color: "#6a746f", paddingTop: 15, paddingBottom: 23 },
  button: { backgroundColor: "#34d17e", paddingLeft: 70, paddingTop: 15, paddingRight: 70, paddingBottom: 15, borderRadius: 15 }, 
  buttonText: { fontWeight: 700 }, 
  input: {
    backgroundColor: "transparent",
    borderRadius: 11,
    borderColor: "rgba(255,255,255,0)",
    borderWidth: 1.5,
    padding: 16,
    paddingTop: 8,
    fontSize: 16,
    color: "#fff",
  },
  inputElement: {
    backgroundColor: "rgba(0,0,0,0)",
    fontSize: 27,
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