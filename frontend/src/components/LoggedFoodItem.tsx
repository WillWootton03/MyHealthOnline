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
        <div className="flex flex-col gap-y-2">
            <div 
                key={meal_item.fdc_id}
                className="flex flex-row justify-between py-2 px-5 shadow-md light-card-color border-b border-black/20 rounded-xl"
            >
                <div className="text-lg text-black/80 font-bold hover:cursor-pointer"
                onClick={() => setShowDetails(!showDetails)}
                >
                    {meal_item.food_name}
                </div>
                <div className="text-lg font-semibold tracking-wide flex flex-row gap-x-2 justify-center">
                    Calories: {meal_item.calories}
                <button
                    className="bg-red-600/50 rounded-lg px-1 py-1 hover:cursor-pointer hover:bg-red-600"
                    onClick={() => removeLoggedItem(meal_item)}    
                >
                    <X />
                </button>
                </div>
            </div>
            {showDetails && (
                <div>
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
            )} 
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