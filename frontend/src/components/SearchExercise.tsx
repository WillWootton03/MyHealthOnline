import { Check, CircleQuestionMark } from "lucide-react";
import { useState } from "react";
import type { SnipExerciseData } from "../context/WorkoutsContext";

type SearchExerciseProps = {
    id: string;
    name: string;
    category: string;
    thumbnail: string;
    selectedExercise: (arg0: boolean, arg1: SnipExerciseData) => void;
}

export default function SearchExercise({
    id,
    name,
    category,
    thumbnail,
    selectedExercise,
} : SearchExerciseProps) {

    const [isSelected, setIsSelected] = useState(false); 

    function SelectWorkout() {
        const nextSelected = !isSelected;
        selectedExercise(
            nextSelected, 
            {
                id,
                name,
                category,
                thumbnail
            }
        );
        setIsSelected(nextSelected);
    }

    return(
        <div   
            key={id}
            onClick={() => SelectWorkout()} 
            className={`flex justify-between  rounded-xl p-1 border-2 h-23 ${isSelected ? 'border-blue-700' : 'border-transparent hover:border-blue-600/70'}`}    
        >
            <div className="flex gap-x-1 md:gap-x-5">
                {thumbnail ? (
                    <img
                        src={thumbnail}
                        className="block w-35 h-20 rounded"
                    />
                ) : (
                    <div className="w-35 h-20 rounded border border-gray-500/40 text-6xl text-center flex items-center justify-center text-gray-600">
                        {name.at(0)}
                    </div>
                )}

                <div className="flex flex-col justify-center">
                    <div className="text-lg font-semibold">   
                        {name}
                    </div>
                    <div className="text-black/60">
                        {category}
                    </div>
                </div>
            </div>
            {/* Show Details Modal Button */}
            <button 
                className={` transition-all duration-250 ${isSelected ? 'text-blue-700' : 'text-black/50 hover:text-blue-500/80'}`}
            >
                {isSelected ? (
                    <Check />

                ) : (
                    <CircleQuestionMark />
                )}

            </button>

        </div>
    )   
}