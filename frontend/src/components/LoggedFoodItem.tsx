import { X } from "lucide-react";
import type { MealData, MealItem } from "./DailyCalorieDisplay";
import { useState, type Dispatch, type SetStateAction } from "react";
import NutrientDetails from "./NutrientDetails";
import FoodItemDetails from "./FoodItemDetails";

type LoggedFoodItemProps = {
    meal_item: MealItem;
    log_id: string;
    date: Date,
    meal_id: string | undefined;
    meal_type: string;
    calsConsumed: number;
    setCalsConsumed: Dispatch<SetStateAction<number>>;
    removeLoggedItem: (meal_item: MealItem) => void;
    updateLoggedItem: (meal_item: MealItem) => void;
}

export default function LoggedFoodItem({
    meal_item,
    log_id,
    date,
    meal_id,
    meal_type,
    calsConsumed,
    setCalsConsumed,
    removeLoggedItem,
    updateLoggedItem,
} : LoggedFoodItemProps) {

    const [showDetails, setShowDetails] = useState(false);

    return (
        <div>
            <div 
                key={meal_item.fdc_id}
                onClick={() => setShowDetails(!showDetails)}
                className="flex flex-row justify-between py-2 px-2 shadow-md light-card-color border-b border-black/20 rounded-xl cursor-pointer"
            >
                <div className="md:text-lg text-black/80 font-bold"
                >
                    {meal_item.food_name}
                </div>
                <div className="md:text-lg font-semibold tracking-wide flex flex-row items-center gap-x-2 justify-center text-center">
                    Calories: {meal_item.calories}
                <button
                    className="button-danger rounded-lg px-1 h-fit py-1"
                    onClick={() => removeLoggedItem(meal_item)}    
                >
                    <X />
                </button>
                </div>
            </div>
            <div className={`transition-all duration-600 ease-in-out overflow-hidden ${
            showDetails 
                ? "opacity-100 translate-y-0 max-h-1000"
                : 'opacity-0 translate-y-2 max-h-0'
            }`}
            >
                <FoodItemDetails 
                    updatedItem={true}
                    date={date}
                    item={meal_item}
                    log_id={log_id}
                    meal_id={meal_id}
                    meal_type={meal_type}
                    calsConsumed={calsConsumed}
                    setCalsConsumed={setCalsConsumed}
                    updateLoggedItem={updateLoggedItem}
                />
            </div>
        </div>
    );
}



/*
item_id={item.item_id}
itemName={item.food_name}
calories={item.calories}
protein={item.protein}
fat={item.fat}
carbohydrates={item.carbohydrates}
*/