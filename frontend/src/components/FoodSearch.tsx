import React, { useState, useEffect, type Dispatch, type SetStateAction, useRef } from "react"
import axios from "axios";
import { AnimatePresence, motion } from "motion/react";

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
    const [pendingItem, setPendingItem] = useState<any>(null);
    const [currItem, setCurrItem] = useState<any | null>(null);
    const [searchPageNumber, setSearchPageNumber] = useState(1);

    const [foodSearchName, setFoodSearchName] = useState('');
    
    const [foodItems, setFoodItems] = useState<Array<any>>([]);

    const [animatedItems, setAnimatedItems] = useState<Set<number>>(new Set());
    const animationQueue = useRef<number[]>([]);
    const isAnimating = useRef(false);
    // Used to create a queue for animated items when appearing on screen
    const queueAnimation = (id: number) => {
        if (animationQueue.current.includes(id)) return;

        animationQueue.current.push(id);

        if (!isAnimating.current){
            processQueue();
        }
    };

    const processQueue = () => {
        const id = animationQueue.current.shift();
        
        // if there are no items in queue nothin happens
        if(!id) {
            isAnimating.current = false;
            return
        }

        isAnimating.current = true;

        // add to animated items to prevent from animating again
        setAnimatedItems(prev => {
            const next = new Set(prev);
            next.add(id);
            return next;
        });

        setTimeout(processQueue, 80);
    };

    // Toggles nutrition details based on item selected
    const ShowFoodItemDetails = (item : any) => {
        if(currItem?.fdcId === item.fdcId) {
            setShowDetailsModal(false);
            setCurrItem(null);
            return;
        }

        if(currItem) {
            setPendingItem(item);
            setShowDetailsModal(false);
        } else {
            setCurrItem(item);
            setShowDetailsModal(true);
        }
    };

    useEffect(() => {
        if(!showDetailsModal && pendingItem) {
            const timer = setTimeout(() => {
                setCurrItem(pendingItem);
                setPendingItem(null);
                setShowDetailsModal(true);
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [showDetailsModal, pendingItem])


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
            <motion.div
                initial={{ opacity: 0, y:-20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity:0, y: -20 }}
                transition={{ duration: 0.2}}
            >
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
                            className="flex-2 sm:flex-1 h-full  px-2 py-2 rounded-xl font-bold button-primary
                                        active:scale-[0.99] disabled:opacity-60 items-center justify-center shadow-md border-b border-black/20"
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
            {/* Animates the expanding section for all food search items */}  
            <div
                className="divide-y divide-[#eaf1fb] overflow-hidden"
            >
                {foodItems.length === 0 ? (
                    <></>
                ) : (
                    // Container for all elements used to animate each item
                    <AnimatePresence>
                        {foodItems.map((item : any,) => {
                            const hasAnimated = animatedItems.has(item.fdcId);
                            return (
                                <React.Fragment key={item.fdcId}>
                                    <motion.div 
                                        initial={false}
                                        animate={ hasAnimated ? { opacity: 1, y: 0 } : {opacity: 0, y: -10}}
                                        transition={{ duration: 0.3 }}
                                        onViewportEnter={() => queueAnimation(item.fdcId)}
                                        viewport={{ once: true}}
                                    >
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
                                                    className={`px-6 py-3 ${(showDetailsModal && currItem === item) ? 'button-danger' :'button-primary' }
                                                        text-sm  rounded-xl shadow-md border-b border-black/20`}
                                                    onClick={() => ShowFoodItemDetails(item)}
                                                >
                                                        {(showDetailsModal && currItem === item) ? 'Close' : 'Details' }
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                    <AnimatePresence mode="wait">
                                        {(showDetailsModal && currItem === item) && (
                                            <motion.div 
                                                key={item.id}
                                                initial={{ opacity: 0, y: -20 }}
                                                animate={{ opacity: 1, y: 0 }} 
                                                exit={{ opacity:0, y: -20 }}  
                                                transition={{ duration: 0.4 }}
                                                className="flex-col gap-y-2 p-2 justify-items-center h-fit w-full border border-gray-200 mt-2 rounded-xl shadow-md"
                                            >
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
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </React.Fragment>
                            )
                            })}
                    </AnimatePresence>
                )}
            </div>
            {(foodItems.length !== 0) && (
                <div className="flex justify-center gap-x-3 py-2 mb-2">
                    <button 
                        className="text-color-primary px-1 py-2 rounded-xl text-white hover:bg-[#f5fbff] hover-text-color-primary hover:"
                        onClick={() => setSearchPageNumber(searchPageNumber + 1)}
                    >
                        See More
                    </button>
                </div>
            )}
            </motion.div>
    )
}