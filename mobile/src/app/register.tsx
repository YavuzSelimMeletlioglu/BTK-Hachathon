import { useRouter } from "expo-router";
import { Alert, StyleSheet, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { ThemedView } from "../components/ThemedView";
import { useState } from "react";
import { post } from "../api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisibility] = useState(false);
  const router = useRouter();

  const onSavePress = async () => {
    if (name === "" || email === "" || password === "") {
      Alert.alert("Uyarı", "Tüm alanları doldurunuz.");
      return;
    }
    const response = await post("register", {
      name: name,
      email: email,
      password: password,
    });

    if (!response || !response.success) {
      Alert.alert("Hata", "Kayıt yapılamadı");
      return;
    }
    router.navigate({
      pathname: "/dashboard",
      params: {
        name: response.data.name,
        user_id: response.data.id,
      },
    });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisibility(passwordVisible === false);
  };

  return (
    <ThemedView style={styles.container}>
      <TextInput
        label="İsim*"
        inputMode="text"
        value={name}
        onChangeText={(text) => {
          setName(text);
        }}
        right={<TextInput.Icon icon="account" />}
      />
      <TextInput
        label="Email*"
        inputMode="email"
        value={email}
        onChangeText={(text) => {
          setEmail(text.toLowerCase());
        }}
        right={<TextInput.Icon icon="email" />}
      />
      <TextInput
        label="Şifre*"
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
        <Button mode="elevated" onPress={onSavePress}>
          Kaydet
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
