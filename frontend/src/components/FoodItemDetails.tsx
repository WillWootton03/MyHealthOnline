import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import NutrientDetails from "./NutrientDetails";
import axios from "axios";
import type { MealData, MealItem } from "./DailyCalorieDisplay";

type FoodItemDetailsProps = {
    updatedItem: boolean;
    date?: Date;
    item: any;
    log_id: string;
    meal_id: string | undefined;
    meal_type: string;
    calsConsumed: number;
    setCalsConsumed: Dispatch<SetStateAction<number>>;
    onAddMealItem?: (mealType: string, item: MealItem, meal_id: string, log_id: string) => void;
    updateLoggedItem?: (meal_item: MealItem) => void;
}

type ReturningMacros = {
    type: string;
    amount: number;
    serving_type: string;
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
    const [returningMacros, setReturningMacros] = useState<ReturningMacros[]>([]); 
    const [updating, setUpdating] = useState(false);


    // serving_unit is used for logged food items, householdServingFullText, is used for search items
    let options = [updatedItem ? item.household_serving : item.householdServingFullText, '1 household', '1 g', `100 g`];

    // If item serving is already set at a single serving do not set the option
    if ((updatedItem ? item.household_serving.charAt(0) : item.householdServingFullText.charAt(0)) === '1') {
        options = options.filter((opt) =>  opt !== '1 household');
    }

    async function newDailyLog() {
        const token = localStorage.getItem('token');
        const sendDate = date ? date : undefined;
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
            // Try to find calories in returning macros and add it to cals consumed, if not found add 0 to calsConsumed
            const addedCals = calsConsumed + (returningMacros.find((m) => m.type === 'calories')?.amount ?? 0);

            // Some items do not have brandName's so set to brandOwner if not available else null
            const brandName = item.brandName &&  item.brandName === 'N/A'
                                    ? item.brandName
                                    : item.brandOwner && item.brandOwner !== 'N/A'
                                        ? item.brandOwner
                                        : null

            const res = await axios.post(`${import.meta.env.VITE_API_BASE_ROUTE}/meal_items/`,
                {
                    meal_id: meal_id,
                    log_id: log_id,
                    meal_type: meal_type.toLocaleLowerCase(),
                    fdc_id: item.fdcId,                         // When a logged item passed use fdc_id, when a search item use fdcId
                    food_name: brandName ? `${brandName} ${item.description}` : item.description,   // Properly format food name to display brandName and food name if possible
                    brand_owner: item.brandOwner,
                    serving_size: item.servingSize,
                    serving_amount: Number(servingSizeInput),
                    household_serving: item.householdServingFullText,
                    serving_unit: servingType,
                    macros: returningMacros,
                    // per_100 holds all calulating data for items and needs to be stored to properly calulate calories
                    per_100: [
                        item.foodNutrients.filter((nut : any) => nut.nutrientName === 'Energy')[0]?.value,
                        item.foodNutrients.filter((nut : any) => nut.nutrientName === 'Protein')[0]?.value,
                        item.foodNutrients.filter((nut : any) => nut.nutrientName === 'Total lipid (fat)')[0]?.value,
                        item.foodNutrients.filter((nut : any) => nut.nutrientName === 'Carbohydrate, by difference')[0]?.value,
                    ]
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setCalsConsumed(addedCals);

            console.log((returningMacros.find(m => m.type === 'calories')?.amount ?? 0));

            // Create a new mealItem based on the new items data and call our parent function to update meal items in the display
            const newItem: MealItem = {
                meal_item_id: res.data.data.meal_item_id,
                fdc_id: item.fdcId,
                food_name: brandName ? `${brandName} ${item.description}` : item.description,

                brand_owner: item.brandOwner,
                serving_unit: servingType,
                serving_size: item.servingSize,
                serving_amount: Number(servingSizeInput),
                household_serving: item.householdServingFullText,
                calories: (returningMacros.find(m => m.type === 'calories')?.amount ?? 0),
                protein: (returningMacros.find(m => m.type === 'protein')?.amount ?? 0),
                fat: (returningMacros.find(m => m.type === 'fat')?.amount ?? 0),
                carbohydrates: (returningMacros.find(m => m.type === 'carbohydrates')?.amount ?? 0),

                // Stores the items macros per 100 grams in order to accurately check macro data when changing serving types and sizes
                per100_calories: item.foodNutrients.filter((nut : any) => nut.nutrientName === 'Energy')[0]?.value,
                per100_protein: item.foodNutrients.filter((nut : any) => nut.nutrientName === 'Protein')[0]?.value,
                per100_fat: item.foodNutrients.filter((nut : any) => nut.nutrientName === 'Total lipid (fat)')[0]?.value,
                per100_carbohydrates: item.foodNutrients.filter((nut : any) => nut.nutrientName === 'Carbohydrate, by difference')[0]?.value, 

            }
            console.log('newItem', returningMacros);
            if (onAddMealItem) {
                onAddMealItem(meal_type.toLocaleLowerCase(), newItem, (res.data.data.meal_id ? res.data.data.meal_id : ''), (log_id ? log_id : ''));
            }
            setAdding(false);
        } catch (err) {
            setAdding(false);
            return err;
        }
    }

    async function updateItem() {
        const token = localStorage.getItem('token');
        // Verfiy the item's values change before sending put request
        if (servingType === item.serving_unit && servingSizeInput === item.serving_amount) return;
        try {
            const res = await axios.put(`${import.meta.env.VITE_API_BASE_ROUTE}/meal_items/`,
                {
                    serving_type : servingType,
                    serving_amount : servingSizeInput,
                    macros: returningMacros,
                },
                {
                    headers: {
                        Authorization : `Bearer ${token}`
                    },
                    params: {
                        meal_item_id: item.meal_item_id,
                    }
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
    function titleCase(str : string) {
        if (!str) return '';

        const newStrArr = str.split(' ');
        const newStr = newStrArr.length > 1 
            ? newStrArr.map((s) => s.charAt(0) + s.slice(1).toLowerCase()).join(' ') 
            :  newStrArr[0].charAt(0) + newStrArr[0].slice(1).toLowerCase();
        return newStr;
    }
    return (
        // DETAILS SECTION
        <div className="flex-col gap-y-2 justify-items-center h-80 w-full">

            {/* HEADER */}
            <div className="flex flex-col gap-y-2 items-center">
                <a 
                    className="text-xl font-bold text-black/70 hover:text-black hover:cursor-pointer"
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
                        householdNum={updatedItem 
                            ? item.household_serving[0] !== '1'
                                ? item.household_serving[0]
                                : ''
                            : item.householdServingFullText[0] !== '1' 
                                ? item.householdServingFullText[0] 
                                : ''}
                        setReturningMacros={setReturningMacros}
                    />
                    <NutrientDetails 
                        isLoggedItem={updatedItem ? true : false}
                        nutrientLabel='Protein'
                        nutrientData={updatedItem ? item.per100_protein : item.foodNutrients.filter((nut : any) => nut.nutrientName === 'Protein')}
                        servingSize={updatedItem ? item.serving_size : item.servingSize}
                        servingType={servingType}
                        servingInput={servingSizeInput}
                        householdNum={updatedItem 
                            ? item.household_serving[0] !== '1'
                                ? item.household_serving[0]
                                : ''
                            : item.householdServingFullText[0] !== '1' 
                                ? item.householdServingFullText[0] 
                                : ''}
                        setReturningMacros={setReturningMacros}
                    />
                    <NutrientDetails 
                        isLoggedItem={updatedItem ? true : false}
                        nutrientLabel='Carbohydrates'
                        nutrientData={updatedItem ? item.per100_carbohydrates : item.foodNutrients.filter((nut : any) => nut.nutrientName === 'Carbohydrate, by difference')}
                        servingSize={updatedItem ? item.serving_size : item.servingSize}
                        servingType={servingType}
                        servingInput={servingSizeInput}
                        householdNum={updatedItem 
                            ? item.household_serving[0] !== '1'
                                ? item.household_serving[0]
                                : ''
                            : item.householdServingFullText[0] !== '1' 
                                ? item.householdServingFullText[0] 
                                : ''}
                        setReturningMacros={setReturningMacros}
                    />
                    <NutrientDetails 
                        isLoggedItem={updatedItem ? true : false}
                        nutrientLabel='Fat'
                        nutrientData={updatedItem ? item.per100_fat  : item.foodNutrients.filter((nut : any) => nut.nutrientName === 'Total lipid (fat)')}
                        servingSize={updatedItem ? item.serving_size : item.servingSize}
                        servingType={servingType}
                        servingInput={servingSizeInput}
                        householdNum={updatedItem 
                            ? item.household_serving[0] !== '1'
                                ? item.household_serving[0]
                                : ''
                            : item.householdServingFullText[0] !== '1' 
                                ? item.householdServingFullText[0] 
                                : ''}
                        setReturningMacros={setReturningMacros}
                    />
                    {item.foodNutrients && item.foodNutrients.filter((nut : any) => nut.nutrientName === 'Total Sugars') ? (
                    <NutrientDetails 
                        isLoggedItem={false}
                        nutrientLabel='Sugar'
                        nutrientData={item.foodNutrients.filter((nut : any) => nut.nutrientName === 'Total Sugars')}
                        servingSize={item.servingSize}
                        servingType={servingType}
                        servingInput={servingSizeInput}
                        householdNum={item.householdServingFullText[0] !== '1' ? item.householdServingFullText[0] : ''}
                        setReturningMacros={setReturningMacros}
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
                                    {/* If updated item, get the second half of serving unit, else get householdServing. Cut of plural by slicing end of string */}
                                    {opt === '1 household' 
                                        ? `1 
                                            ${item.household_serving ? item.household_serving.split(' ')[1].slice(0, -1) 
                                            : item.householdServingFullText.split(' ')[1].slice(0, -1)}` 
                                                : opt
                                        }
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
                                className="px-6 py-3 bg-green-700/80 hover:bg-green-900 hover:cursor-pointer text-sm text-white rounded-xl"
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
                                className="px-6 py-3 bg-green-700/80 hover:bg-green-900 hover:cursor-pointer text-sm text-white rounded-xl"
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