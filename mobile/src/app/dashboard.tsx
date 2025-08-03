import { ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Appbar,
  Checkbox,
  Icon,
  IconButton,
  List,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { ThemedView } from "../components/ThemedView";
import { useRef, useState } from "react";
import { ApiResponse, RecipeResponse, RecipeType } from "../types";
import { Recipe } from "../components/Recipe";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchYoutubeVideoId, post } from "../api";
import YoutubePlayer from "react-native-youtube-iframe";

export default function Dashboard() {
  const [text, setText] = useState<string>("");
  const [expandedRecipe, setExpandedRecipe] = useState(1);
  const [recipes, setRecipes] = useState<RecipeType[]>([]);
  const [category, setCategory] = useState(true); // true -> Yemek, false -> kırtasiye
  const [videoUrl, setVideoUrl] = useState("");
  const [refreshing, setIsRefreshing] = useState(false);
  const { name } = useLocalSearchParams<{ name: string }>();
  const videoRef = useRef(null);

  const onTextChange = (text: string) => {
    setText(text);
  };
  const theme = useTheme();
  const router = useRouter();

  const onChatPress = async () => {
    setIsRefreshing(true);
    const response = await post<RecipeResponse>("recipe", {
      text: text,
      category: category ? "tarif" : "kırtasiye",
    });

    if (!response) {
      console.log("API response is undefined (hata alındı mı?)");
      setIsRefreshing(false);
      return;
    }
    if (category) {
      const videoId = await fetchYoutubeVideoId(text);
      setVideoUrl(videoId ?? "");
    }

    let modifiedResponse: ApiResponse<RecipeResponse>;
    if (typeof response === "string") {
      modifiedResponse = JSON.parse(response);
    } else {
      modifiedResponse = response;
    }

    if (modifiedResponse && modifiedResponse.success) {
      const cleanedRecipes = modifiedResponse.data.recipes
        .map((recipe: any) => ({
          ...recipe,
          // Filter out invalid ingredients (those with NaN values or URLs as names)
          ingredients: recipe.ingredients.filter(
            (ingredient: any) =>
              ingredient.name &&
              !ingredient.name.includes("http") &&
              !isNaN(ingredient.cost) &&
              ingredient.brand &&
              ingredient.quantity
          ),
          // Calculate total cost from ingredients
          totalCost: recipe.ingredients
            .filter((ingredient: any) => !isNaN(ingredient.cost))
            .reduce((sum: number, ingredient: any) => sum + ingredient.cost, 0),
        }))
        // Filter out recipes with no valid ingredients
        .filter((recipe: any) => recipe.ingredients.length > 0);

      setRecipes(cleanedRecipes);
    }

    setIsRefreshing(false);
  };
  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="" />
        <Appbar.Action
          color={theme.colors.primary}
          icon="cart-outline"
          onPress={() => {
            router.push("/cart");
          }}
        />
      </Appbar.Header>
      <ScrollView style={{ backgroundColor: theme.colors.surface }}>
        {refreshing ? (
          <ActivityIndicator />
        ) : (
          <ThemedView style={styles.container}>
            {recipes.length > 0 ? (
              <>
                <View
                  style={[
                    { justifyContent: "center" },
                    category ? { display: "flex" } : { display: "none" },
                  ]}>
                  <YoutubePlayer
                    videoId={videoUrl}
                    ref={videoRef}
                    height={250}
                    play={false}
                  />
                </View>
                <View style={styles.accordionConainer}>
                  <List.AccordionGroup
                    expandedId={expandedRecipe}
                    onAccordionPress={(id) => {
                      setExpandedRecipe(id === expandedRecipe ? 0 : Number(id));
                    }}>
                    {recipes.map((item, index) => {
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
                            <View
                              style={[
                                styles.inputContainer,
                                { alignItems: "center" },
                              ]}>
                              <Text
                                style={
                                  isExpanded && { color: theme.colors.primary }
                                }>
                                {item.totalCost} ₺
                              </Text>
                              <Icon
                                color={
                                  isExpanded
                                    ? theme.colors.primary
                                    : theme.colors.secondary
                                }
                                source={
                                  isExpanded ? "chevron-down" : "chevron-right"
                                }
                                size={24}
                              />
                            </View>
                          )}
                          id={item.id}
                          style={styles.accordion}>
                          <Recipe list={item.ingredients} />
                        </List.Accordion>
                      );
                    })}
                  </List.AccordionGroup>
                </View>
              </>
            ) : (
              <>
                <View style={styles.greetingView}>
                  <Text variant="displayMedium">Merhaba {name}!!</Text>
                </View>
                <View style={styles.inputContainer}>
                  <Checkbox.Item
                    label="Yemek"
                    status={category ? "checked" : "unchecked"}
                    onPress={() => {
                      setCategory(true);
                    }}
                  />
                  <Checkbox.Item
                    label="Kırtasiye"
                    status={!category ? "checked" : "unchecked"}
                    onPress={() => {
                      setCategory(false);
                    }}
                  />
                </View>
                <View style={styles.inputContainer}>
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
                    onPress={onChatPress}
                  />
                </View>
              </>
            )}
          </ThemedView>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
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
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
});
