import { ProductType } from "../types";
import { Button, List, Text } from "react-native-paper";
import { FlatList, View } from "react-native";
import { post } from "../api";
import { useRouter } from "expo-router";

type Props = {
  list: ProductType[];
  user_id: string;
};

export function Recipe({ list, user_id }: Props) {
  const router = useRouter();
  const renderItem = ({ item }: { item: ProductType }) => {
    return (
      <List.Item
        title={item.brand}
        titleStyle={{ fontWeight: "600" }}
        description={item.name + " " + item.quantity}
        right={() => <Text>{item.cost}₺</Text>}
      />
    );
  };

  const addToCart = async () => {
    const data = {
      user_id: user_id,
      items: list,
    };
    const response = await post("cart/add-items", data);
    if (response) {
      router.push({
        pathname: "/cart",
        params: {
          user_id: user_id,
        },
      });
    }
  };

  return (
    <View>
      <FlatList
        data={list}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10, rowGap: 10 }}
        ListFooterComponent={() => (
          <Button icon="cart-arrow-down" onPress={addToCart}>
            Sepete Ekle
          </Button>
        )}
      />
    </View>
  );
}
