import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import NutrientDetails from "./NutrientDetails";
import axios from "axios";
import type { MealData, MealItem } from "./DailyCalorieDisplay";
import { pluralCheck, titleCase, formatDate } from '@shared/functions/formatting';
type FoodItemDetailsProps = {
    updatedItem: boolean;
    date: Date;
    item: any;
    log_id: string;
    meal_id: string | undefined;
    meal_type: string;
    calsConsumed: number;
    setCalsConsumed: Dispatch<SetStateAction<number>>;
    onAddMealItem?: (mealType: string, item: MealItem, meal_id: string, log_id: string) => void;
    updateLoggedItem?: (meal_item: MealItem) => void;
}


export default function FoodItemDetails({
    updatedItem,
    date,
    item,
    log_id,
    meal_id,
    meal_type,
    calsConsumed,
    setCalsConsumed,
    onAddMealItem,
    updateLoggedItem,
} : FoodItemDetailsProps) {

    const [servingSizeInput, setServingSizeInput] = useState(updatedItem ? String(item.serving_amount) : '1');
    const [servingType, setServingType] = useState(`${item.serving_unit ? item.serving_unit : item.householdServingFullText}`);
    const [adding, setAdding] = useState(false);
    const [updating, setUpdating] = useState(false);

    // serving_unit is used for logged food items, householdServingFullText, is used for search items
    let options = [updatedItem 
        ? item.household_serving 
        : item.householdServingFullText,
        updatedItem
            ? `1 ${pluralCheck(item.household_serving.split(' ')?.at(1)) ?? 'household'}`
            :   `1 ${pluralCheck(item.householdServingFullText.split(' ')?.at(1)) ?? 'household'}`,
        '1 g', `100 g`];

    // If household serving item is already at 1 remove extra 1 household item
    if (options.at(0)?.at(0) === '1') {
        options = options.filter((opt) =>  opt !== '1 household');
    }

    async function newDailyLog() {
        const token = localStorage.getItem('token');

        const sendDate = date ? formatDate(date) : undefined;
        try {
            const result = await axios.post(`${import.meta.env.VITE_API_BASE_ROUTE}/daily_logs`,
                {
                    date : sendDate,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return result.data.data.log_id;
        } catch (err: any) {
            console.error(`Frontend could not create new daily log: ${err.response?.data?.message}`);
        }
    }

    async function addItem() {
        const token = localStorage.getItem('token');
        // If the user has not logged any info for the day, first create a new log and set log_id 
        if(!log_id) log_id = await newDailyLog();

        try {
            setAdding(true);

            // Some items do not have brandName's so set to brandOwner if not available else null
            const brandName = item.brandName &&  item.brandName === 'N/A'
                                    ? item.brandName
                                    : item.brandOwner && item.brandOwner !== 'N/A'
                                        ? item.brandOwner
                                        : null

            const new_serving_type = servingType !== '1 household' ? servingType : `1 ${item.householdServingFullText.split(' ')[1].slice(0, -1) ?? 'household'}`;
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_ROUTE}/meal_items/`,
                {
                    meal_id: meal_id,
                    log_id: log_id,
                    meal_type: meal_type.toLocaleLowerCase(),
                    date: date,
                    fdc_id: String(item.fdcId),                         // When a logged item passed use fdc_id, when a search item use fdcId
                    food_name: brandName ? `${brandName} ${item.description}` : item.description,   // Properly format food name to display brandName and food name if possible
                    brand_owner: item.brandOwner,
                    serving_size: item.servingSize,
                    serving_amount: Number(servingSizeInput),
                    household_serving: item.householdServingFullText,
                    // serving type normal unless its 1 household then format to fit household serving description
                    serving_unit: new_serving_type,
                    macros: {
                        calories: item.foodNutrients.filter((nut : any) => nut.nutrientName === 'Energy')[0]?.value,
                        protein: item.foodNutrients.filter((nut : any) => nut.nutrientName === 'Protein')[0]?.value,
                        fat: item.foodNutrients.filter((nut : any) => nut.nutrientName === 'Total lipid (fat)')[0]?.value,
                        carbohydrates: item.foodNutrients.filter((nut : any) => nut.nutrientName === 'Carbohydrate, by difference')[0]?.value, 
                    },
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const retItem = res.data.data;


            // Create a new mealItem based on the new items data and call our parent function to update meal items in the display
            const newItem: MealItem = {
                meal_item_id: res.data.data.meal_item_id,
                fdc_id: item.fdcId,
                food_name: brandName ? `${brandName} ${item.description}` : item.description,

                brand_owner: item.brandOwner,
                serving_unit: new_serving_type,
                serving_size: item.servingSize,
                serving_amount: Number(servingSizeInput),
                household_serving: item.householdServingFullText,
                calories: retItem.calories,
                protein: retItem.protein,
                fat: retItem.fat,
                carbohydrates: retItem.carbohydrates, 
                per100_calories: retItem.per100_calories,
                per100_protein: retItem.per100_protein,
                per100_fat: retItem.per100_fat,
                per100_carbohydrates: retItem.per100_carbohydrates,
            }
            
            setCalsConsumed(calsConsumed + retItem.calories);

            if (onAddMealItem) {
                onAddMealItem(meal_type.toLocaleLowerCase(), newItem, (res.data?.data?.meal_id ?? ''), (log_id ?? ''));
            }
            setAdding(false);
        } catch (err) {
            setAdding(false);
            return err;
        }
    }
    
    async function updateItem() {
        const token = localStorage.getItem('token');

        // Verfiy the serving values change before sending put request 
        // ex. From 3 Crackers to 1 Cracker type or 1 to 10 servings
        if (servingType === item.serving_unit && Number(servingSizeInput) === item.serving_amount) return;

        try {
            const res = await axios.put(`${import.meta.env.VITE_API_BASE_ROUTE}/meal_items/${item.meal_item_id}`,
                {
                    serving_unit : servingType,
                    serving_amount : Number(servingSizeInput),
                    serving_size: item.serving_size,
                    household_serving: item.household_serving,
                    macros: {
                        calories: item.per100_calories,
                        protein: item.per100_protein,
                        fat: item.per100_fat,
                        carbohydrates: item.per100_carbohydrates, 
                    },
                },
                {
                    headers: {
                        Authorization : `Bearer ${token}`
                    },
                }
            );
            if (updateLoggedItem) {
                updateLoggedItem(res.data.data);
            }
            setUpdating(false);
        } catch (err) {
            setUpdating(false);
            return err;
        }
    };

    return (
        // DETAILS SECTION
        <div className="flex-col gap-y-2 justify-items-center h-80 w-full">

            {/* HEADER */}
            <div className="flex flex-col gap-y-2 items-center">
                <a 
                    className="text-xl font-bold text-black/70 hover:text-black hover:"
                    href={`https://fdc.nal.usda.gov/food-details/${updatedItem ? item.fdc_id : item.fdcId}/nutrients`}
                    target="_blank"
                >
                    {titleCase(item.brandName &&  item.brandName === 'N/A'
                                    ? item.brandName
                                    : item.brandOwner && item.brandOwner !== 'N/A'
                                        ? item.brandOwner
                                        : '')} {titleCase(item.description 
                                                    ? item.description 
                                                    : item.food_name)}
                </a>
                <div className="text-md font-semibold text-black/40">
                    {titleCase(item.brand_owner ? item.brand_owner : item.brandOwner)}
                </div>
            </div>
            <div className="flex justify-between">
                {/* Nutrients Breakdown */}
                <div className="grid grid-cols-4 flex-3 px-4 py-5 gap-y-2">
                    <NutrientDetails 
                        isLoggedItem={updatedItem ? true : false}
                        nutrientLabel='Calories'
                        nutrientData={updatedItem ? item.per100_calories : item.foodNutrients.filter((nut : any) => nut.nutrientName === 'Energy') }
                        servingSize={updatedItem ? item.serving_size : item.servingSize}
                        servingType={servingType}
                        servingInput={servingSizeInput}
                        household={updatedItem 
                            ? item.household_serving
                            : item.householdServingFullText}
                    />
                    <NutrientDetails 
                        isLoggedItem={updatedItem ? true : false}
                        nutrientLabel='Protein'
                        nutrientData={updatedItem ? item.per100_protein : item.foodNutrients.filter((nut : any) => nut.nutrientName === 'Protein')}
                        servingSize={updatedItem ? item.serving_size : item.servingSize}
                        servingType={servingType}
                        servingInput={servingSizeInput}
                        household={updatedItem 
                            ? item.household_serving
                            : item.householdServingFullText}
                    />
                    <NutrientDetails 
                        isLoggedItem={updatedItem ? true : false}
                        nutrientLabel='Carbohydrates'
                        nutrientData={updatedItem ? item.per100_carbohydrates : item.foodNutrients.filter((nut : any) => nut.nutrientName === 'Carbohydrate, by difference')}
                        servingSize={updatedItem ? item.serving_size : item.servingSize}
                        servingType={servingType}
                        servingInput={servingSizeInput}
                        household={updatedItem 
                            ? item.household_serving
                            : item.householdServingFullText}
                    />
                    <NutrientDetails 
                        isLoggedItem={updatedItem ? true : false}
                        nutrientLabel='Fat'
                        nutrientData={updatedItem ? item.per100_fat  : item.foodNutrients.filter((nut : any) => nut.nutrientName === 'Total lipid (fat)')}
                        servingSize={updatedItem ? item.serving_size : item.servingSize}
                        servingType={servingType}
                        servingInput={servingSizeInput}
                        household={updatedItem 
                            ? item.household_serving
                            : item.householdServingFullText}
                    />
                    {item.foodNutrients && item.foodNutrients.filter((nut : any) => nut.nutrientName === 'Total Sugars') ? (
                    <NutrientDetails 
                        isLoggedItem={false}
                        nutrientLabel='Sugar'
                        nutrientData={item.foodNutrients.filter((nut : any) => nut.nutrientName === 'Total Sugars')}
                        servingSize={item.servingSize}
                        servingType={servingType}
                        servingInput={servingSizeInput}
                        household={item.householdServingFullText}
                        
                    />
                    ) : (
                        <></>
                    )}
                </div>
                {/* Side Tab */}
                <div className="flex-1 flex flex-col py-2 gap-y-4">
                    {/* Serving Size */}
                    <div className="flex gap-x-4">
                        <div className="text-black font-semibold">
                            Serving Size
                        </div>
                        <select 
                            className="w-full px-4 py-3 text-sm bg-gray-100 text-black rounded-lg outline-none transition-all duration-150"
                            value={servingType}
                            onChange={(e) => setServingType(e.target.value)}
                        >
                            {options?.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Current Serving */}
                    <div className="flex flex-col gap-y-3 items-center">
                        <div className="text-black font-bold text-md">
                            Servings
                        </div>
                        <input
                            className=" px-3 py-1 text-md bg-white border border-[#d5e4f5] rounded-lg outline-none focus:border-[#4d7cba] transition-colors
                                        text-black placeholder-black/25 text-center"
                            type="number"
                            min={0}
                            value={servingSizeInput}
                            onChange={(e) => setServingSizeInput(e.target.value)}
                        />
                        {updatedItem ? (
                            <button 
                                className="px-6 py-3 bg-green-700/80 hover:bg-green-900 hover: text-sm text-white rounded-xl"
                                onClick={() => updateItem()}
                            >
                                {!updating ? (
                                    'Update'
                                ) : (
                                    'Updating'
                                )}
                            </button>
                        ) : (
                            <button 
                                className="px-6 py-3 bg-green-700/80 hover:bg-green-900 hover: text-sm text-white rounded-xl"
                                onClick={() => addItem()}
                            >
                                {!adding ? (
                                    'Add'
                                ) : (
                                    'Adding'
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}