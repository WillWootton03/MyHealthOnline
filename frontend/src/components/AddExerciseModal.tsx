import axios from "axios";
import { useDebugValue, useEffect, useState, type EventHandler } from "react";
import SearchExercise from "./SearchExercise";
import { Search, X } from "lucide-react";

import { type ExerciseCategory, type ExerciseData, ExerciseCategories, useWorkout } from "../context/WorkoutsContext";


type AddExerciseModalProps = {
    setDisplayNewExercise: (arg0: boolean) => void;
    addExercises: (arg0: ExerciseData[]) => void;
}



export default function AddExerciseModal({
    setDisplayNewExercise,
    addExercises
} : AddExerciseModalProps ) {


    const { searchExercises, setSearchExercises} = useWorkout();

    const [searchCategory, setSearchCategory] = useState<ExerciseCategory>('Legs');

    const [loading, setLoading] = useState(false);

    const [displayNewCustomExercise, setDisplayNewCustomExercise] = useState(false);

    const [search, setSearch] = useState('');

    const [selectedExercises, setSelectedExercises] = useState<ExerciseData[]>([]);

    const [customExerciseName, setCustomExerciseName] = useState('');
    const [customExerciseCategory, setCustomExerciseCategory ] = useState('Legs');
    const [customExerciseDescription, setCustomExerciseDescription] = useState('');



    const addExercisesHandler = (selectedExercises : ExerciseData[]) => {
        addExercises(selectedExercises);
        setDisplayNewExercise(false);
    }

    

    const handleSubmitNewCustomExercise = async(e : React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const custom_exercise = {
            name: customExerciseName,
            description: customExerciseDescription,
            category: customExerciseCategory
        }
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_ROUTE}/workouts/custom_exercise`, 
            { custom_exercise },
            {
                headers: {
                    'Authorization' : `Bearer ${token}`
                }
            }
        );
        

        const saved_exercise = res.data.data;
        // Category needs to be set to base category for creating multiple exercises in one menu
        setCustomExerciseCategory('Legs');
        setCustomExerciseName('');
        setCustomExerciseDescription('');

        setSearchExercises(prev => ({
            ...prev,
            Legs: [
                ...prev.Legs,
                saved_exercise
            ].sort((a,b) => a.name.localeCompare(b.name))
        }));
    }




    const [filteredExercises, setFilteredExercises] = useState<ExerciseData[]>([]);
    // Provides a list of filtered exercises for search without editing retrieved exercises from backend

    useEffect(() => {
        setFilteredExercises(searchExercises[searchCategory ?? 'Legs'].filter(exercise => exercise.name.toLowerCase().includes(search)));
    }, [search, searchExercises, searchCategory]);


    // Adds and removes items from selected depending on how many selected in SearchExercise
    const updateSelectedExercises = (selected: boolean, i_exercise: ExerciseData) => {
        if(selected){
            setSelectedExercises((prev) => [...prev, i_exercise]);
        } else {
            setSelectedExercises((prev) => prev.filter(exercise => exercise.id !== i_exercise.id))
        }
    }

    return (
            <div className="px-1 md:px-10 lg:px-40 xl:px-60 2xl:px-80 py-4 flex min-h-[80vh] items-center justify-center">
                {displayNewCustomExercise ? 
                (
                    <div className="bg-white items-center justify-center w-full text-center relative drop-shadow-lg rounded-lg border border-black/10">
                        <button 
                            onClick={() => setDisplayNewCustomExercise(false)}
                            className="absolute top-2 right-2 bg-red-400/80 p-1 rounded-xl text-white hover:text-red-500 "
                        >
                        <X />
                    </button>
                        <form 
                            onSubmit={(e) => handleSubmitNewCustomExercise(e)}
                            className="flex flex-col gap-y-4 py-2 px-2 justify-between items-center"
                        >
                            <div className="flex gap-x-4 items-center">
                                <select
                                    value={searchCategory === null ? 'None' : searchCategory}
                                    onChange={(e) => setCustomExerciseCategory(e.target.value as ExerciseCategory)}
                                >
                                    {ExerciseCategories.map(category => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                <input 
                                    type="text"
                                    onChange={(e) => setCustomExerciseName(e.target.value)}
                                    value={customExerciseName}
                                    className="px-4 py-2 font-semibold outline-transparent focus:outline-blue-400/60"
                                    placeholder="Exercise Name"
                                />
                            </div>
                            <textarea 
                                onChange={(e) => setCustomExerciseDescription(e.target.value)}
                                value={customExerciseDescription}
                                className="px-4 py-2 outline-transparent focus:outline-blue-400/60 w-full text-center"
                                placeholder="Exercise Description"
                            />
                            <button 
                                type="submit"
                                className="px-4 py-1 bg-green-600/60 text-white font-semibold text-lg hover:bg-green-600 hover:text-green-800 rounded-lg"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                ) : 
                (
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
                                <button 
                                    onClick={() => setDisplayNewCustomExercise(prev => !prev)}
                                    className="px-4 py-2 rounded-lg bg-purple-600/50 font-semibold text-white hover:bg-purple-600 hover:text-purple-900 transition-colors duration-100"
                                >
                                    New
                                </button>
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
                                            description={exercise.description}
                                            muscles={exercise.muscles}
                                            secondary_muscles={exercise.secondary_muscles}
                                            category={exercise.category}
                                            equipment={exercise.equipment}
                                            thumbnail={exercise.thumbnail}
                                            selectedExercise={(isSelected: boolean, val: ExerciseData) => updateSelectedExercises(isSelected, val)}
                                        />
                                    ))
                                }
                            </div>
                    </div>
                    )}
                </div>
                )}
            </div>
    );
}