
export type ProductType = {
    id: number;
    name: string;
    quantity: number;
    quantity_type: number; // 0 -> adet, 1 -> kilo
    brand: string;
    cost: number;
}

export type RecipeType = {
    id: number;
    ingredients: ProductType[];
    totalCost: number;
}