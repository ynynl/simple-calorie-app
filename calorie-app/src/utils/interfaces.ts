export interface FoodEntry {
    food: string;
    date: string;
    calorie: number;
    price: number;
    id: string;
}


export interface User {
    id: string;
    username: string;
    foodEntries: FoodEntry[]
}