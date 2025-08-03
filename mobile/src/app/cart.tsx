import {
  Appbar,
  Button,
  IconButton,
  List,
  Text,
  useTheme,
} from "react-native-paper";
import { ThemedView } from "../components/ThemedView";
import { FlatList, SafeAreaView, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import { ProductType } from "../types";

export default function CartView() {
  const [cart, setCart] = useState<ProductType[]>([]);
  const theme = useTheme();

  useEffect(() => {
    setCart([
      {
        id: 1,
        name: "Makarna",
        quantity: 200,
        quantity_type: 1,
        brand: "Torku",
        cost: 50,
      },
      {
        id: 2,
        name: "Tavuk",
        quantity: 200,
        quantity_type: 1,
        brand: "Şen Piliç",
        cost: 200,
      },
    ]);
  }, []);

  const renderItem = ({ item }: { item: ProductType }) => {
    return (
      <List.Item
        title={item.brand + " " + item.name}
        description={
          item.quantity + " " + (item.quantity_type === 0 ? "ad" : "gr")
        }
        titleStyle={{ fontWeight: "600" }}
        right={() => (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>
              {(item.cost * item.quantity) /
                (item.quantity_type === 1 ? 1000 : 1)}
              ₺
            </Text>
            <IconButton
              icon="trash-can-outline"
              iconColor={theme.colors.error}
            />
          </View>
        )}
      />
    );
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Sepet" />
      </Appbar.Header>
      <ThemedView>
        <FlatList data={cart} renderItem={renderItem} />
        <Button mode="contained" style={styles.completeButton}>
          Alışverişi Tamamla
        </Button>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  completeButton: {
    marginBottom: 20,
  },
});
