import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { ThemedView } from "../components/ThemedView";

export default function Index() {
  const router = useRouter();

  const onLoginPress = () => {
    router.navigate("/dashboard");
  };

  const onRegisterPress = () => {};

  return (
    <ThemedView style={styles.container}>
      <TextInput
        label="Email"
        inputMode="email"
        right={<TextInput.Icon icon="email" />}
      />
      <TextInput
        label="Şifre"
        secureTextEntry
        right={<TextInput.Icon icon="eye" />}
      />
      <ThemedView style={styles.row}>
        <Button mode="elevated" onPress={onLoginPress}>
          Giriş Yap
        </Button>
        <Button mode="elevated" onPress={onRegisterPress}>
          Kayıt Ol
        </Button>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    rowGap: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
