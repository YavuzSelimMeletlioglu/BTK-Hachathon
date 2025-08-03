import { ProductType } from "../types";
import { Button, List, Text } from "react-native-paper";
import { FlatList, View } from "react-native";

type Props = {
  list: ProductType[];
};

export function Recipe({ list }: Props) {
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

  return (
    <View>
      <FlatList
        data={list}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10, rowGap: 10 }}
        ListFooterComponent={() => (
          <Button icon="cart-arrow-down">Sepete Ekle</Button>
        )}
      />
    </View>
  );
}
