import { View, Text, StyleSheet } from "react-native";

export default function MoreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>More screen — coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#07140d", justifyContent: "center", alignItems: "center" },
  text: { color: "#98a39e", fontSize: 16 },
});