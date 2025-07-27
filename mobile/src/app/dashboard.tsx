import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { ThemedView } from "../components/ThemedView";

export default function Dashboard() {
  return (
    <ThemedView style={styles.container}>
      <Text>Merhaba</Text>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
