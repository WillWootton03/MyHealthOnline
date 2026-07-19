import axios from "axios";
import { useEffect, useState } from "react";
import SearchExercise from "./SearchExercise";
import { Search, X } from "lucide-react";

import { type SnipExerciseData } from "../context/WorkoutsContext";


type AddExerciseModalProps = {
    setPLoading: (arg0: boolean) => void;
    setDisplayNewExercise: (arg0: boolean) => void;
    addExercises: (arg0: SnipExerciseData[]) => void;
}

export const ExerciseCategories = ['Legs', 'Cardio' , 'Arms' , 'Back' , 'Chest' , 'Shoulders' , 'Abs' , 'Calves'] as const;
export type ExerciseCategory = typeof ExerciseCategories[number];
export type ExerciseCategoryGroup = Record<ExerciseCategory, SnipExerciseData[]>;

export default function AddExerciseModal({
    setPLoading,
    setDisplayNewExercise,
    addExercises
} : AddExerciseModalProps ) {

    const [searchCategory, setSearchCategory] = useState<ExerciseCategory>('Legs');

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState('');

    const [selectedExercises, setSelectedExercises] = useState<SnipExerciseData[]>([]);
    const [searchExercises, setSearchExercises] = useState<ExerciseCategoryGroup>({
        "Legs": [],
        "Cardio": [],
        "Arms": [],
        "Back": [],
        "Chest": [],
        "Shoulders": [],
        "Abs": [],
        "Calves": []
    });

    useEffect(() => {
        const run = async() =>{
            getExerciseData();
        }
        run();
    }, [])  

    const addExercisesHandler = (selectedExercises : SnipExerciseData[]) => {
        addExercises(selectedExercises);
        setDisplayNewExercise(false);
    }

    const getExerciseData = async() => {
        setPLoading(true);
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Attempt to read loaded exercise data
        let stored = sessionStorage.getItem('short_exercises');
        if(stored) {
            setSearchExercises(JSON.parse(stored));
            setPLoading(false);
            setLoading(false);
            return;
        }

        const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_ROUTE}/exercises/short`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const ret: ExerciseCategoryGroup = {        
            "Legs": [],
            "Cardio": [],
            "Arms": [],
            "Back": [],
            "Chest": [],
            "Shoulders": [],
            "Abs": [],
            "Calves": []
        };

        data.data.forEach((exercise: SnipExerciseData) => {
            ret[exercise.category as ExerciseCategory].push(exercise);
        });

        ExerciseCategories.forEach((category) => {
            ret[category].sort((a, b) => a.name.localeCompare(b.name));
            console.log(ret[category]);
        }) 

        sessionStorage.setItem('short_exercises', JSON.stringify(ret));
        setSearchExercises(ret)
        setPLoading(false);
        setLoading(false);
    }

    // Provides a list of filtered exercises for search without editing retrieved exercises from backend
    const filteredExercises = searchExercises[searchCategory ?? 'Legs'].filter(exercise => exercise.name.toLowerCase().includes(search));

    // Adds and removes items from selected depending on how many selected in SearchExercise
    const updateSelectedExercises = (selected: boolean, i_exercise: SnipExerciseData) => {
        if(selected){
            setSelectedExercises((prev) => [...prev, i_exercise]);
        } else {
            setSelectedExercises((prev) => prev.filter(exercise => exercise.id !== i_exercise.id))
        }
    }

    return (
            <div className="px-1 md:px-10 lg:px-40 xl:px-60 2xl:px-80 py-4 z-10">
                <div className="flex flex-col z-10 px-1 py-5 md:px-5 shadow-md items-center bg-white relative">
                    <button 
                        onClick={() => setDisplayNewExercise(false)}
                        className="absolute top-1 right-2 bg-red-400/80 p-1 rounded-xl text-white hover:text-red-500 "
                    >
                        <X />
                    </button>
                    {/* Used for pagination against 800 exercises */}
                    {searchCategory === null ? (
                        <>
                            <div className="">
                                <select
                                    value={searchCategory === null ? 'None' : searchCategory}
                                    onChange={(e) => setSearchCategory(e.target.value as ExerciseCategory)} 
                                >
                                    {ExerciseCategories.map(category => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center">
                            <span className="font-bold tracking-wider py-2 text-xl text-blue-600/60">Available Exercises</span>
                            <div className="flex flex-col gap-y-2 md:flex-row md:gap-x-4 items-center py-2 w-full">
                                <div className="bg-gray-200 rounded py-1 md:w-full flex gap-x-2 border-2 border-transparent focus-within:border-blue-300 items-center">
                                    <Search size={18} className="text-gray-500/70" />
                                <select
                                    value={searchCategory === null ? 'None' : searchCategory}
                                    onChange={(e) => setSearchCategory(e.target.value as ExerciseCategory)} 
                                >
                                    {ExerciseCategories.map(category => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                <input 
                                    type="text"
                                    placeholder={`Search`}
                                    className="outline-none shadow-none border-color-transparent"    
                                    onChange={(e) => setSearch(e.target.value.toLowerCase())}
                                />
                                </div>

                                <div className="flex gap-x-2">
                                    <button 
                                        className={`${selectedExercises.length > 0 ? 'bg-blue-400/70 hover:bg-blue-500/70 ' : 'bg-gray-400 cursor-default'} 
                                                    rounded-xl py-2 px-4 text-white font-semibold `}
                                        disabled={selectedExercises.length <= 0}
                                        onClick={() => addExercisesHandler(selectedExercises)}
                                        >
                                        Add
                                    </button>
                                    <button 
                                        className={`${selectedExercises.length > 1 ? 'bg-green-500/70 hover:bg-green-600/70' : 'bg-gray-400 cursor-default'}  
                                                        rounded-xl py-2 px-4 text-white font-semibold`}
                                        disabled={selectedExercises.length <= 1}
                                        /* TODO : Add superset functionality */
                                        onClick={() => addExercisesHandler(selectedExercises)}
                                    >
                                        Superset
                                    </button>
                                </div>
                            
                            </div>
                            <div className="flex flex-col md:grid md:grid-cols-2 pt-2 pb-2">
                            {filteredExercises
                                    .map(exercise =>  (
                                        <SearchExercise
                                            key={exercise.id}
                                            id={exercise.id} 
                                            name={exercise.name}
                                            category={exercise.category}
                                            thumbnail={exercise.thumbnail}
                                            selectedExercise={(isSelected: boolean, val: SnipExerciseData) => updateSelectedExercises(isSelected, val)}
                                        />
                                    ))
                                }
                            </div>
                    </div>
                    )}
                </div>
            </div>
    );
}