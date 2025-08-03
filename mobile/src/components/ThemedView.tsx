import { StyleSheet, View, ViewProps } from "react-native";
import { useTheme } from "react-native-paper";

export function ThemedView(props: ViewProps) {
  const theme = useTheme();
  const { style, ...otherProps } = props;
  return (
    <View
      {...otherProps}
      style={[style, styles.style, { backgroundColor: theme.colors.surface }]}
    />
  );
}

const styles = StyleSheet.create({
  style: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
});
