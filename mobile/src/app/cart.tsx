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
import { deleteRequest, get } from "../api";
import {
  router,
  useGlobalSearchParams,
  useLocalSearchParams,
} from "expo-router";

export default function CartView() {
  const [cart, setCart] = useState<ProductType[]>([]);
  const { user_id } = useLocalSearchParams<{ user_id: string }>();
  const theme = useTheme();

  const fetchData = async () => {
    const response = await get<ProductType[]>(`cart/${user_id}`);
    if (response && response.success) {
      setCart(response.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const completeOrder = async () => {
    const response = await deleteRequest(`cart/${user_id}`);
    if (response) {
      setCart([]);
      router.back();
    }
  };

  const renderItem = ({ item }: { item: ProductType }) => {
    return (
      <List.Item
        title={item.brand + " " + item.name}
        description={item.quantity}
        titleStyle={{ fontWeight: "600" }}
        right={() => (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>{item.cost}₺</Text>
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
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Sepet" />
      </Appbar.Header>
      <ThemedView>
        <FlatList data={cart} renderItem={renderItem} />
        <Button
          mode="contained"
          style={styles.completeButton}
          onPress={completeOrder}>
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
