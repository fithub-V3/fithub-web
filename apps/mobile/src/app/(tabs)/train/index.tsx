import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Dumbbell, ClipboardList, ChevronRight } from "lucide-react-native";

const TRAIN_SECTIONS = [
  {
    key: "exercises",
    label: "Exercises",
    description: "Your personal exercise library",
    icon: Dumbbell,
    route: "/train/exercises" as const,
  },
  {
    key: "workouts",
    label: "Workouts",
    description: "Build and manage your routines",
    icon: ClipboardList,
    route: "/train/workouts" as const,
  },
] as const;

//remove as any later

export default function TrainScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Train</Text>

      <View style={styles.list}>
        {TRAIN_SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <Pressable
              key={section.key}
              style={styles.card}
              onPress={() => router.push(section.route as any)}
            >
              <View style={styles.cardIcon}>
                <Icon size={22} color="#34d17e" />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{section.label}</Text>
                <Text style={styles.cardDescription}>{section.description}</Text>
              </View>
              <ChevronRight size={20} color="#6a746f" />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#07140d", padding: 20, paddingTop: 35 },
  title: { fontSize: 28, fontWeight: "700", color: "#fff", marginBottom: 24 },
  list: { gap: 12 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#131917",
    borderRadius: 14,
    padding: 16,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "rgba(52,209,126,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  cardBody: { flex: 1 },
  cardTitle: { color: "#fff", fontSize: 16, fontWeight: "600" },
  cardDescription: { color: "#98a39e", fontSize: 13, marginTop: 2 },
});