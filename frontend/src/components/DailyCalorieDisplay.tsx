import axios from "axios";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import FoodSearch from "./FoodSearch";
import LoggedFoodItem from "./LoggedFoodItem";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { formatDate } from "@shared/functions/formatting";


type DailyCalorieDisplayProps = {
    children? : ReactNode;
};

export type MealItem = {
    meal_item_id: string;
    fdc_id: string;
    brand_owner?: string;
    food_name: string;
    household_serving: string;
    serving_unit: string;
    serving_size: number;
    serving_amount: number;
    calories: number;
    protein: number;
    fat: number;
    carbohydrates: number;
    per100_calories?: number,
    per100_protein?: number,
    per100_fat?: number,
    per100_carbohydrates?: number, 
}

export type MealData = {
    meal_type : string;
    meal_id : string;
    items: Record<MealItem['meal_item_id'], MealItem>;
}

export default function DailyCalorieDisplay({ children } : DailyCalorieDisplayProps) {

    const [loading, setLoading] = useState(false);

    const [mealData, setMealData] = useState<MealData[] | null>(null)

    const [openMealType, setOpenMealType] = useState<String | null>(null);
    const [log_id, setLog_Id] = useState('');

    const [dailyGoal, setDailyGoal] = useState(-1);
    const [calsConsumed, setCalsConsumed] = useState(0);

    // Formats date to be useful for neon and SQL query : format {YYYY-MM-DD}
    const [date, setDate] = useState(new Date());

    const navigate = useNavigate();

    const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

    const getDayLogId = async () => {
        const token = localStorage.getItem('token');
        try {
            console.log('Attempting to get days log_id by user_id and date');

            // date needs to be in formatted string form to perform query
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_ROUTE}/daily_logs?date=${formatDate(date)}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            return res.data.data.log_id;
        } catch (err: any) {
            console.error(`Frontend could not get log_id : ${err.response?.data?.message}`);
        }
    }

    const getDayLogData = async (logId : string) => {
        const token = localStorage.getItem('token');
        try {
            console.log(`Attempting to retrieve calorie data for ${logId}`);

            const res = await axios.get(`${import.meta.env.VITE_API_BASE_ROUTE}/daily_logs/${logId}/food_data`, 
                {
                    headers : {
                            Authorization: `Bearer ${token}`
                        }
                },
            );
            // Set meal data to all retrieved meals and meal_types and ids 
            setMealData(res?.data?.data ?? []);
        } catch (err: any) {
            console.error(`Frontend could not get day eating data : ${err.response?.data?.message}`);
        }
    }

    // Handles intiial load of page to get init calories from backend
    const getDayCalories = async (log_id: string) => {
        const token = localStorage.getItem('token');
        try {
            console.log(`Attempting to retrieve day logs calories for ${log_id}`);

            const res = await axios.get(`${import.meta.env.VITE_API_BASE_ROUTE}/daily_logs/${log_id}/day_calories` ,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            let total_calories = res.data.data.total_calories;
            if (!total_calories) total_calories = 0;
            setCalsConsumed(total_calories);

        } catch (err: any) {
            console.error(`Frontend could not get cals consumed : ${err.response?.data?.message}`);
        }
    }

    const getDailyGoal = async () => {
        const token = localStorage.getItem('token');
        try {
            console.log(`Attempting to retrieve user daily calories`);

            const res = await axios.get(`${import.meta.env.VITE_API_BASE_ROUTE}/users/daily_calories`,
                {
                    headers: {
                        Authorization : `Bearer ${token}`
                    }
                }
            );
            setDailyGoal(res.data.data.daily_cals);
        }catch (err: any) {
            console.error(`Frontend could not get day calories : ${err.response?.data?.message}`);
        }
            
    }

    // When adding an item, add item is axios handled in food search, adding to
    // meal data and setting new calories handled based on initial values for MealData and calsConsumed
    const addMealItem = async(mealType: string, item: MealItem, meal_id: string, newLog_id: string) => {
        setMealData(prev => {
            if(!prev) {
                return [{
                    meal_id,
                    meal_type: mealType,
                    items: {
                        [item.meal_item_id] : item
                    },
                }];
            }
            let found = false; 
            const updated = prev.map(meal => {
                if (meal.meal_type === mealType) {
                    found = true;
                    return {           
                        ...meal,
                        items: {
                            ...meal.items, 
                            [item.meal_item_id]: item
                        },
                    };
                }
                return meal;
            });
            
            if(!found) {
                updated.push({
                    meal_id,
                    meal_type: mealType,
                    items: {[item.meal_item_id] : item}
                });
            }
            return updated;
        });

        // If there was a new log created set and get the data for it, else do not
        if(newLog_id !== '') {
            const newLog_id = await getDayLogId();
            setLog_Id(newLog_id);
        }
        setCalsConsumed(calsConsumed + item.calories);
    };
    
    const removeMealItem = async(item: MealItem) => {
        setMealData((prev) => {
            if (!prev) return null
            return prev.map(meal => {
                const { [item.meal_item_id]: _, ...remainingItems } = meal.items;     // destructure meal.items and put the item sharing meal_item_id to a removed object
                return { 
                    ...meal,
                    items: remainingItems,      // Set items to be the copied meal.items data without the removed object
                };
        });
    });
    };

    const removeLoggedItem = async (meal_item: MealItem) => {
        const token = localStorage.getItem('token')
        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_ROUTE}/meal_items/${meal_item.meal_item_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }
            );
        // Remove the meal item from the fontend mealData state
        removeMealItem(meal_item);
        // Set cals consumed to reflect deleted item
        setCalsConsumed(calsConsumed - meal_item.calories);
        } catch (err: any) {
            console.error(`Frontend could not delete meal item : ${err.response?.data?.message}`);
        }
    };

    const updateLoggedItem = async (meal_item: MealItem) => {
        let calorieDiff = 0;
        setMealData((prev) => {
            if(!prev) return null;
            return prev.map(meal => {      
                if(meal.items[meal_item.meal_item_id]) {
                    calorieDiff =  meal_item.calories - meal.items[meal_item.meal_item_id].calories;
                    return {
                        ...meal,
                        items: {
                            ...meal.items,
                            [meal_item.meal_item_id] : meal_item,
                        }
                    }
                }
                return meal;
            });
        });
        // Update cals consumed based on prev and new calorieDiff got from updating item\
        setCalsConsumed(calsConsumed + calorieDiff);
    };

    // Set current daily log date to next day
    const nextDate = async () => {
        setDate((prev : Date) => {
            const nextDay = new Date(prev);
            nextDay.setDate(nextDay.getDate() + 1);
            return nextDay;
        });
    }

    // Set current daily log date to prev day
    const prevDate = async () => {
        setDate((prev : Date) => {
            const prevDay = new Date(prev);
            prevDay.setDate(prevDay.getDate() - 1);
            return prevDay;
        })
    }



    useEffect(() => {
        const run = async () => {
            setLoading(true);
            setMealData([]);
            setCalsConsumed(0);

            const res = await getDayLogId();

            if (res !== undefined) {
                setLog_Id(res);

                await getDayCalories(res);
                await getDayLogData(res);
            } else {
                setLog_Id('');
            }

            await getDailyGoal();
            setLoading(false);
            setOpenMealType('');
        }

        run();
    }, [date]);

    const pct = useMemo(() => {
        return dailyGoal
            ? Math.min(Math.floor((calsConsumed / dailyGoal) * 100), 100)
            : 0;
    }, [calsConsumed, dailyGoal]);

    const remaining = dailyGoal - calsConsumed;


    return(
        <section className="bg-white/75 backdrop-blur-sm rounded-2xl border border-white/80 shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden">
            {loading ? (
                <div className="flex flex-col gap-y-4 items-center py-80">
                    <div>
                        <svg
                            className="animate-spin w-16 h-16 text-blue-500"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <circle
                                className="opacity-10"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="2"
                            />
                            <path
                                className="opacity-70"
                                fill="currentColor"
                                d="M12 2a10 10 0 0 1 10 10h-3a7 7 0 0 0-7-7V2z"
                            />
                        </svg>
                    </div>
                    <div 
                        className="text-3xl font-bold"
                    >
                        Loading...
                    </div>
                </div>
            ) :  (
        <>
            {/* Date Selector */}
            <div className="flex flex-row justify-between px-3 py-3">
                <button 
                    className="hover: px-2 py-2 hover:bg-blue-50 rounded-2xl"
                    onClick={prevDate}
                >
                    <ChevronLeft />
                </button>
                <div className="font-semibold text-xl text-black/80">
                    {formatDate(date)}
                </div>
                <button 
                    className="hover: px-2 py-2 hover:bg-blue-50 rounded-2xl"
                    onClick={nextDate}
                >
                    <ChevronRight /> 
                </button>
            </div>
            {/* HEADER */}
            <div className="px-6 pt-5 pb-4 border-b light-bg-color">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-black">
                        Calories
                    </h2>

                </div>

                {/* Summary Row */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                        { label : "Goal", value: dailyGoal?.toLocaleString(), unit: 'kcal', color: "#65a5e0"},
                        { label: "Consumed", value: calsConsumed?.toLocaleString(), unit: 'kcal', color: (calsConsumed > dailyGoal) ? "#e05252" : "#1a1a14"},
                        { label: "Remaining", value: (dailyGoal - calsConsumed), unit: 'kcal', color: remaining < 0 ? "#e05252" : "#2a9d5c" },
                    ].map(s => (
                        <div key={s.label} className="light-bg-color rounded-xl px-3 py-3 text-center">
                            <div className="text-[10px] text-black/40 uppercase tracking-wide mb-1">{s.label}</div>
                            <div className="text-lg font-semibold" style={{ color: s.color}}>{s.value}</div>
                            <div className="text-[10px] text-black/35">{s.unit}</div>
                        </div>
                    ))}
                </div>

                {/* Progress Bar */}
                <div className="h-2.5 light-bg-color rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                            width: `${pct}%`,
                            background: pct >= 100 ? "#e05252" : "linear-gradient(to right, #4d7cba, #1e5fa8)",
                        }}
                    />
                </div>
                <div className="flex justify-between mt-1.5">
                    <span className="text-[10px] text-black/35">0 kcal</span>   
                    <span className="text-[10px] text-black/35">{Math.round(pct)}% of daily goal</span>
                    <span className="text-[10px] text-black/35">{dailyGoal.toLocaleString()} kcal</span>
                </div>
            </div>
            {/* Begin Workout Button */}
            <div className="w-full py-3 px-3">
                <button 
                    className="px-3 py-2 rounded-xl bg-color-primary text-white font-semibold hover:"
                    onClick={() => navigate(`workout/${log_id}`)}
                >
                    Start Workout
                </button>
            </div>
            <div className="px-6 py-4 light-bg-color border-b border-[#eaf1fb]">
                {/* Display all meal items based on meal_type */}
                <div className="flex flex-col gap-y-6">
                    {/* Map all meal types and save mealType as a value */}
                    {mealTypes.map((mealType : string) => 
                    <div
                        className="flex flex-col gap-y-4"
                    >
                        <div 
                            className="flex flex-row justify-between items-center"
                            key={mealType}
                        >
                            <h2 className="font-bold tracking-wider ">
                                {mealType}
                            </h2>
                            {/* Add Food or Cancel ADding food buttons */}
                            <button 
                                className={`px-3 py-2 rounded-xl text-white font-semibold hover:
                                    ${
                                        openMealType === mealType ? 'bg-red-700 hover:bg-red-800' : 'bg-color-primary hover-bg-color-primary' 
                                    }   
                                `}
                                onClick={() => setOpenMealType(openMealType === mealType ? null : mealType)}
                            >
                                {openMealType === mealType ? 'Cancel' : 'Add Food' }
                            </button>
                        </div>
                        {/* Add all logged food items to site with proper meal type */}
                        <div className="w-full h-fit">
                            {(() => {
                                const meal = mealData?.find(meal => meal.meal_type === mealType.toLowerCase());
                                return Object.values(meal?.items ?? {}).map(item => {
                                    if (!item) return null;
                                    return (
                                        <LoggedFoodItem 
                                            meal_item={item}
                                            log_id={log_id}
                                            date={date}
                                            meal_id={meal?.meal_id }
                                            meal_type={mealType}
                                            calsConsumed={calsConsumed}
                                            setCalsConsumed={setCalsConsumed}
                                            removeLoggedItem={removeLoggedItem}
                                            updateLoggedItem={updateLoggedItem}
                                        />
                                    );
                                    });
                            })()}
                        </div>
                        {/* Use food search for specific meal type */}
                        {openMealType === mealType && (
                            <FoodSearch 
                                meal_id={mealData?.find(m => m.meal_type === mealType.toLowerCase())?.meal_id}
                                date={date}
                                log_id={log_id}
                                meal_type={mealType}
                                calsConsumed={calsConsumed}
                                setCalsConsumed={setCalsConsumed}
                                onAddMealItem={addMealItem}
                            />
                        )}
                    </div>
                    )}
                </div>
            </div>/
        </>
            )}
        </section>
    )
}
