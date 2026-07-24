import { titleCase } from "@shared/functions/formatting";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { ExerciseData } from "../context/WorkoutsContext"

type SearchExerciseDetailsModalProps = {
    exercise: ExerciseData | null;
    setShowDetails : React.Dispatch<React.SetStateAction<boolean>>;
    addExercise :(selectedExercises: ExerciseData[]) => void;
}

type MuscleData = {
    id: number;
    name: string;
    name_en: string;
    is_front: boolean;
    image_url_main: string;    
}

export default function SearchExerciseDetailsModal({
    exercise,
    setShowDetails,
    addExercise,
} : SearchExerciseDetailsModalProps) {
    

    const [muscleNames, setMuscleNames] = useState<string[] | null>(null);

    useEffect(() => {
        console.log(exercise);
        // Name en is traditional muscles name, some muslces don't have so if empty string use scientific name
        setMuscleNames(exercise?.muscles.map((muscle : MuscleData) => muscle.name_en || muscle.name) ?? null);
    }, []);

    const handleAddButton = () => {
        if (!exercise) return;
        addExercise([exercise]);
        setShowDetails(false);
    }

    // If exercise null return nothing
    return exercise ? (
        <div 
            className="w-9/10 md:w-1/2 h-3/4 rounded-lg page-bg-light border border-black/10 shadow-lg relative flex flex-col justify-between items-center py-2 px-3 md:px-0" 
            onClick={(e) => e.stopPropagation()}
        >
            {/* Close Menu Button */}
            <button
                onClick={() => setShowDetails(false)}
                className="absolute top-2 right-2 p-1 bg-red-500/60 rounded-lg text-white hover:bg-red-500 hover:text-red-900"
            >
                <X />
            </button>
            {/*  Main Modal */}
            <div className="flex flex-col gap-y-4 px-2 md:px-10 py-4 overflow-auto">
                {/* Modal Header */}
                <div className="flex flex-col gap-y-1 items-center">
                    <h1 className="text-lg font-bold tracking-wider text-black">
                        {titleCase(exercise.name)}
                    </h1>
                    <h2 className="text-md font-semibold text-center text-black/60">    
                        Muslces : {((muscleNames?.length ?? 0 ) <= 1) ? muscleNames?.at(1) : muscleNames?.join(' : ')  }
                    </h2>
                </div>
                {/*
                # TODO : Thumbnail Section 
                # Might need an image for main background for images to go on top of to properly display muscle imgs
                {exercise.muscles?.filter((muscle : MuscleData) => muscle.image_url_main).length > 0 ? (
                    <div className="flex flex-row gap-x-4">
                        {exercise.muscles.map((muscle: MuscleData) => (
                            <img
                                src={`${muscle.image_url_main}`}
                            >
                            </img>
                        )
                        )}
                    </div>
                ) : (<></>)}
                */}
                {/* Equipment */}
                <p className="text-center font-medium text-black/50">
                    Equipment : {exercise.equipment.map(equipment => titleCase(equipment))}
                </p>
                {/* Description */}
                <p className="text-center font-semibold text-black/70 ">
                    {exercise.description.slice(3, -5) }
                </p>
            </div>  
            <button 
                onClick={handleAddButton}
                className="bg-blue-500/30 hover:bg-blue-500 hover:text-white px-4 py-1 rounded-lg text-blue-600 font-bold tracking-wider transition-colors duration-100"
            >
                Add
            </button>
        </div>
    ) : (<></>)
}