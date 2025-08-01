import { StyleSheet } from "react-native";
import {
  Appbar,
  Icon,
  IconButton,
  List,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { ThemedView } from "../components/ThemedView";
import { useState } from "react";
import { RecipeType } from "../types";
import { Recipe } from "../components/Recipe";

const recipe: RecipeType[] = [
  {
    id: 1,
    ingredients: [
      {
        id: 1,
        name: "Makarna",
        quantity: 200,
        quantity_type: 1,
        brand: "Torku",
        cost: 50,
      },
    ],
    totalCost: 10,
  },
  {
    id: 2,
    ingredients: [
      {
        id: 1,
        name: "Pilav",
        quantity: 200,
        quantity_type: 1,
        brand: "Torku",
        cost: 60,
      },
    ],
    totalCost: 12,
  },
  {
    id: 3,
    ingredients: [
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
    ],
    totalCost: 50,
  },
];

export default function Dashboard() {
  const [text, setText] = useState<string>("");
  const [expandedRecipe, setExpandedRecipe] = useState(1);
  const onTextChange = (text: string) => {
    setText(text);
  };
  const theme = useTheme();

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="" />
        <Appbar.Action
          color={theme.colors.primary}
          icon="cart-outline"
          onPress={() => {}}
        />
      </Appbar.Header>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.greetingView}>
          <Text variant="displayMedium">Merhaba!!</Text>
        </ThemedView>
        <ThemedView style={styles.accordionConainer}>
          <List.AccordionGroup
            expandedId={expandedRecipe}
            onAccordionPress={(id) => {
              setExpandedRecipe(id === expandedRecipe ? 0 : Number(id));
            }}>
            {recipe.map((item, index) => {
              return (
                <List.Accordion
                  key={item.id}
                  title={
                    index === 0
                      ? "Ucuz Tarif"
                      : index === 1
                      ? "Orta Tarif"
                      : "Pahalı Tarif"
                  }
                  right={({ isExpanded }) => (
                    <ThemedView
                      style={[styles.inputContainer, { alignItems: "center" }]}>
                      <Text
                        style={isExpanded && { color: theme.colors.primary }}>
                        {item.totalCost} ₺
                      </Text>
                      <Icon
                        color={
                          isExpanded
                            ? theme.colors.primary
                            : theme.colors.secondary
                        }
                        source={isExpanded ? "chevron-down" : "chevron-right"}
                        size={24}
                      />
                    </ThemedView>
                  )}
                  id={item.id}
                  style={styles.accordion}>
                  <Recipe list={item.ingredients} />
                </List.Accordion>
              );
            })}
          </List.AccordionGroup>
        </ThemedView>
        <ThemedView style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            label="Tarif sorunuz..."
            mode="outlined"
            value={text}
            onChangeText={onTextChange}
            autoFocus={true}
          />
          <IconButton
            icon="arrow-right"
            size={20}
            style={styles.inputButton}
            onPress={() => {}}
          />
        </ThemedView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    rowGap: 20,
  },
  accordionConainer: {
    flex: 1,
    padding: 10,
    justifyContent: "flex-start",
    rowGap: 20,
  },
  greetingView: {
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  textInput: {
    marginBottom: 30,
    width: "80%",
  },
  inputButton: {
    marginTop: 13,
  },
  accordion: {
    width: "90%",
    alignSelf: "center",
  },
});
