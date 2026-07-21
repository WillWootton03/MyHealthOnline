import { useState, useEffect, type Dispatch, type SetStateAction } from "react"
import axios from "axios";

import FoodItemDetailsModal from "./FoodItemDetails";
import type { MealItem } from "./DailyCalorieDisplay";

type FoodSearchProps = {
    meal_id: string | undefined;
    date: Date;
    log_id: string;
    meal_type: string;
    calsConsumed: number;
    setCalsConsumed: Dispatch<SetStateAction<number>>;
    onAddMealItem: (mealType: string, item: MealItem, meal_id: string, new_log_id: string) => void;
}

export default function FoodSearch({
    meal_id,
    date,
    log_id,
    meal_type,
    calsConsumed,
    setCalsConsumed,
    onAddMealItem,
} : FoodSearchProps) {
    const [searching, setSearching] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [currItem, setCurrItem] = useState<any | null>(null);
    const [searchPageNumber, setSearchPageNumber] = useState(1);

    const [foodSearchName, setFoodSearchName] = useState('');
    
    const [foodItems, setFoodItems] = useState<Array<any>>([]);

    // Toggles nutrition details based on item selected
    const ShowFoodItemDetails = async (item : any) => {
        if (showDetailsModal && item === currItem){
            setCurrItem(null);
            setShowDetailsModal(false);
        } else {
            setCurrItem(item);
            setShowDetailsModal(true);
        }
    }


    // Queries the USDA foods database for all branded foods matching or semi-matching items description with foodSearchName
    const foodSearch = async (e? : React.SyntheticEvent<HTMLFormElement>) => {
        e?.preventDefault();
        if(e !== undefined) setSearchPageNumber(1);
        const token = localStorage.getItem('token');
        // EDGE CASE when opening food_search would automatically search API, this prevents automatic search on open
        if(!foodSearchName) return;
        
        try {
            setSearching(true);
            console.log(`Searching for food item from public data ${foodSearchName}`);
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_ROUTE}/foods/get_all`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        food_name: foodSearchName,
                        page_number: searchPageNumber,
                    }
                }
            );
            const newItems = res.data.data;

            if(searchPageNumber === 1) {
                setFoodItems(newItems)
            } else {
                setFoodItems(prev => [...prev, ...newItems])
            }

            setSearching(false);
        } catch (err : any) {
            console.error(`Frontend could not get daily eating data : ${err.response?.data?.message}`);
            setSearching(false);
        }
    }

    useEffect(() => {
        setSearching(true);
        foodSearch();
        setSearching(false)
    }, [searchPageNumber]);

    return (
        <div className="px-1 py-4 light-bg-color border-b border-[#eaf1fb]">
                <form 
                    className="w-full gap-2 flex items-center justify-between"
                    onSubmit={foodSearch}
                >
                    <input
                        type="text"
                        value={foodSearchName}
                        onChange={(e) => setFoodSearchName(e.target.value)}

                        className="flex-8 px-3 py-2.5 text-md bg-white border border-[#d5e4f5] rounded-lg outline-none focus:border-[#4d7cba] transition-colors
                                    text-black placeholder-black/25"
                    />
                    <button 
                        className="flex-2 sm:flex-1 h-full bg-color-primary px-2 py-2 rounded-xl text-white font-bold hover-bg-color-primary hover:cursor-pointer
                                    active:scale-[0.99] transition-all duration-150 disabled:opacity-60 items-center justify-center shadow-md border-b border-black/20"
                        disabled={searching}
                        type="submit"
                    >
                        {searching ? (
                            <>
                                <span className="sm:hidden">...</span>
                                <span className="hidden sm:inline">Searching</span>
                            </>
                        ) : (
                            "Search"
                        )}
                    </button>
                </form>

        {/* Food Search Return */}  
        <div className="divide-y divide-[#eaf1fb]">
            {foodItems.length === 0 ? (
                <></>
            ) : (
                foodItems.map((item : any) => (
                    <div>
                        <div key={item.fdcId} className="px-6 py-5 flex items-center justify-between group">
                            <div className="flex items-center gap-3 justify-between">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#4d7cba] shrink-0" />
                                <div>
                                    <div className="text-md font-medium text-black">
                                        {(item.brandName === 'N/A' || !item.brandName) ? item.brandOwner : item.brandName} {item.description}
                                    </div>
                                    <div className="text-sm text-black/35 mt-0.5">{item.foodCategory.split(',')[0]}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button 
                                    className={`px-6 py-3 text-white ${(showDetailsModal && currItem === item) ? 'bg-red-500/60 hover:bg-red-600 hover:text-red-800' :'bg-color-primary hover-bg-color-primary' }
                                        text-sm  rounded-xl shadow-md border-b border-black/20`}
                                    onClick={() => ShowFoodItemDetails(item)}
                                >
                                        {(showDetailsModal && currItem === item) ? 'Close' : 'Details' }
                                </button>
                            </div>
                        </div>
                        {(showDetailsModal && currItem === item) && (
                            <FoodItemDetailsModal
                                updatedItem={false}
                                date={date}
                                item={item}
                                meal_id={meal_id}
                                log_id={log_id}
                                meal_type={meal_type}
                                calsConsumed={calsConsumed}
                                setCalsConsumed={setCalsConsumed}
                                onAddMealItem={onAddMealItem}
                            />
                        )}
                    </div>
                ))
            )}
        </div>
        {(foodItems.length !== 0) && (
            <div className="flex justify-center gap-x-3 py-2 mb-2">
                <button 
                    className="text-color-primary px-1 py-2 rounded-xl text-white hover:bg-[#f5fbff] hover-text-color-primary hover:cursor-pointer"
                    onClick={() => setSearchPageNumber(searchPageNumber + 1)}
                >
                    See More
                </button>
            </div>
        )}
    </div>
    )
}