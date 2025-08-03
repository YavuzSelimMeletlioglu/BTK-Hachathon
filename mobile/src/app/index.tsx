import { useRouter } from "expo-router";
import { Alert, StyleSheet, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { ThemedView } from "../components/ThemedView";
import { useState } from "react";
import { post } from "../api";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisibility] = useState(false);
  const router = useRouter();

  const onLoginPress = async () => {
    const response = await post("login", { email: email, password: password });
    if (response && response.success) {
      router.navigate({
        pathname: "/dashboard",
        params: {
          name: response.data.name,
        },
      });
      return;
    }
  };

  const onRegisterPress = () => {
    router.push("/register");
  };

  const togglePasswordVisibility = () => {
    setPasswordVisibility(passwordVisible === false);
  };

  return (
    <ThemedView style={styles.container}>
      <TextInput
        label="Email"
        inputMode="email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
        }}
        right={<TextInput.Icon icon="email" />}
      />
      <TextInput
        label="Şifre"
        secureTextEntry={!passwordVisible}
        value={password}
        onChangeText={(text) => {
          setPassword(text);
        }}
        right={
          <TextInput.Icon
            icon={passwordVisible ? "eye" : "eye-off"}
            onPress={togglePasswordVisibility}
          />
        }
      />
      <View style={styles.row}>
        <Button mode="elevated" onPress={onLoginPress}>
          Giriş Yap
        </Button>
        <Button mode="elevated" onPress={onRegisterPress}>
          Kayıt Ol
        </Button>
      </View>
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
