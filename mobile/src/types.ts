
export type ProductType = {
    id: number;
    name: string;
    quantity: string;
    brand: string;
    cost: string;
}

export type RecipeType = {
    id: number;
    ingredients: ProductType[];
    totalCost: number;
}

export type RecipeResponse = {
    recipes: RecipeType[];
    video_id: string
}

export type ApiResponse<T = any> = {
    message: string;
    data: T;
    success: boolean
}

export type CartRequest = {
    user_id: number;
    added_products: {
        product_id: number;
        quantity: number;
    }[]
}
