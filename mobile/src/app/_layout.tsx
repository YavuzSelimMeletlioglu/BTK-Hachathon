import { Stack } from "expo-router";
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import { ThemeProp } from "react-native-paper/lib/typescript/types";

export default function RootLayout() {
  const theme: ThemeProp = {
    mode: "adaptive",
    ...MD3DarkTheme,
  };

  return (
    <PaperProvider theme={theme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </PaperProvider>
  );
}
