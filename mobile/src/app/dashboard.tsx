import { ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Appbar,
  Card,
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
import { ApiResponse, ProductType, RecipeResponse, RecipeType } from "../types";
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
  const { name, user_id } = useLocalSearchParams<{
    name: string;
    user_id: string;
  }>();
  const videoRef = useRef(null);

  const onTextChange = (text: string) => {
    setText(text);
  };
  const theme = useTheme();
  const router = useRouter();

  const onChatPress = async () => {
    setIsRefreshing(true);

    const response = await post("recipe", {
      text: text,
      category: category ? "tarif" : "kırtasiye",
    });

    if (!response) {
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

    // ✅ totalCost hesaplama
    const updatedRecipes = modifiedResponse.data.recipes.map((recipe) => {
      const totalCost = recipe.ingredients.reduce((sum, item) => {
        return sum + parseFloat(item.cost);
      }, 0);
      return {
        ...recipe,
        totalCost,
      };
    });

    // ✅ güncellenmiş veriyi state'e at
    setRecipes(updatedRecipes);

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
            router.push({
              pathname: "/cart",
              params: {
                user_id: user_id,
              },
            });
          }}
        />
      </Appbar.Header>
      <ScrollView
        style={{ backgroundColor: theme.colors.surface }}
        contentContainerStyle={{ flexGrow: 1 }}>
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
                          <Recipe list={item.ingredients} user_id={user_id} />
                        </List.Accordion>
                      );
                    })}
                  </List.AccordionGroup>
                </View>
              </>
            ) : (
              <View style={styles.emptyStateContainer}>
                <View style={styles.greetingView}>
                  <Text variant="displayMedium">Merhaba</Text>
                  <Text variant="displayMedium">{name}</Text>
                </View>
                <View style={styles.bottomContent}>
                  <View>
                    <Card>
                      <Card.Content>
                        <Text variant="titleLarge">Günün Önerisi</Text>
                        <Text variant="bodyLarge">Karnıyarık😀 ?</Text>
                      </Card.Content>
                    </Card>
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
                </View>
              </View>
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
    flex: 1,
  },
  accordionConainer: {
    flex: 1,
    padding: 10,
    justifyContent: "flex-start",
    rowGap: 20,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  greetingView: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  bottomContent: {
    rowGap: 20,
    paddingBottom: 20,
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
