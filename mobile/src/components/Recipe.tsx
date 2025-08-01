import { ProductType } from "../types";
import { ThemedView } from "./ThemedView";
import { Button, List, Text } from "react-native-paper";
import { FlatList, StyleSheet } from "react-native";

type Props = {
  list: ProductType[];
};

export function Recipe({ list }: Props) {
  const renderItem = ({ item }: { item: ProductType }) => {
    return (
      <List.Item
        title={item.brand + " " + item.name}
        style={styles.itemContainer}
        description={
          item.quantity + " " + (item.quantity_type === 0 ? "ad" : "gr")
        }
        right={() => <Text>{item.cost}₺</Text>}
      />
    );
  };

  return (
    <ThemedView>
      <FlatList
        data={list}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10, rowGap: 10 }}
        ListFooterComponent={() => (
          <Button icon="cart-arrow-down">Sepete Ekle</Button>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
    borderColor: "#fff",
  },
});
