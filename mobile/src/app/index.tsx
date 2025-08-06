import { useRouter } from "expo-router";
import { Alert, StyleSheet, View } from "react-native";
import {
  Appbar,
  Button,
  Portal,
  Text,
  TextInput,
  useTheme,
  Modal,
  IconButton,
} from "react-native-paper";
import { ThemedView } from "../components/ThemedView";
import { useState } from "react";
import { post } from "../api";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisibility] = useState(false);
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const router = useRouter();
  const theme = useTheme();
  const containerStyle = {
    backgroundColor: theme.colors.surfaceVariant,
    padding: 20,
    borderRadius: 10,
  };

  const onLoginPress = async () => {
    const response = await post("login", { email: email, password: password });
    if (response && response.success) {
      router.navigate({
        pathname: "/dashboard",
        params: {
          name: response.data.name,
          user_id: response.data.id,
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
    <>
      <Appbar.Header>
        <Appbar.Content title="" />
        <Appbar.Action
          icon="information-outline"
          size={30}
          onPress={showModal}
        />
      </Appbar.Header>
      <ThemedView style={styles.container}>
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            theme={theme}
            contentContainerStyle={containerStyle}
            style={{ margin: 20 }}>
            <IconButton
              icon={"close"}
              onPress={hideModal}
              style={{ alignSelf: "flex-end" }}
              size={30}
              iconColor={theme.colors.primary}
            />
            <Text variant="headlineSmall">
              Uygulamayı kullanabilmek için 'Kayıt Ol' butonuna basıp kayıt
              olabilirsiniz. Daha sonra karşınıza çıkan metin grme alanından
              istediğiniz tarifi aratabilirsiniz. Tarif formatı "2 kişilik mantı
              tarifi" veya "Tavuk sote" şeklinde olabilir. Uygun tarif bulunması
              yapay zekanın işleme süresinden dolayı 15 sn civarında
              sürmektedir. Daha sonrasında gelen videoyu izleyebilir veya
              istediğiniz ürün listesini sepetinize ekleyebilirsiniz.
            </Text>
          </Modal>
        </Portal>
        <View style={styles.headerContainer}>
          <Text variant="displaySmall" style={{ color: theme.colors.primary }}>
            Akıllı Tarif
          </Text>
          <Text variant="displaySmall" style={{ color: theme.colors.primary }}>
            Uygulaması
          </Text>
        </View>
        <View style={styles.contentContainer}>
          <TextInput
            label="Email"
            inputMode="email"
            value={email}
            onChangeText={(text) => {
              setEmail(text.toLowerCase());
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
        </View>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  contentContainer: {
    marginTop: 40,
    height: "60%",
    justifyContent: "flex-start",
    rowGap: 20,
  },
  headerContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
    height: "30%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
