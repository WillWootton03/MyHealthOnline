import { ChevronDown, ChevronUp, Dot, Dumbbell, Plus, Trash, Trash2 } from "lucide-react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import ExerciseSet from "./ExerciseSet";
import { useWorkout, type ExerciseItem, type ExerciseSetType } from "../context/WorkoutsContext";
import { titleCase } from "@shared/functions/formatting";


type ExerciseDetailsProps = ({
    exerciseData: ExerciseItem;
    measurement_pref?: string;
    onDeleteExercise: (id: string) => void;
});

export default function ExerciseDetails({
    exerciseData,
    measurement_pref = 'imperial',
    onDeleteExercise
} : ExerciseDetailsProps) {
    const { workout, addExerciseSet, removeExerciseSet, updateExercise, } = useWorkout();
;
    const [sets, setSets] = useState<ExerciseSetType[]>(exerciseData.sets);
    const [totalSets, setTotalSets] = useState(exerciseData.sets.length);
    const [completedSets, setCompletedSets] = useState(exerciseData.sets.reduce((total : number, set : ExerciseSetType) => total + (set.completed ? 1 : 0), 0));

    const [totalWeight, setTotalWeight] = useState(workout?.exercises.find(exercise => exercise.id === exerciseData.id)?.totalWeight ?? 0);
    const [totalReps, setTotalReps] = useState(workout?.exercises.find(exercise => exercise.id === exerciseData.id)?.totalReps ?? 0);


    useEffect(() => {
        setSets(() => {
            return workout?.exercises.find((exercise) =>
                exercise.id === exerciseData.id)?.sets ?? [];
            });

            setTotalSets(exerciseData.sets.length);
            setCompletedSets(exerciseData.sets.reduce((total : number, set : ExerciseSetType) => total + (set.completed ? 1 : 0), 0));
            console.log(workout?.exercises.find(exercise => exercise.id === exerciseData.id)?.totalWeight ?? 0);
            setTotalWeight(workout?.exercises.find(exercise => exercise.id === exerciseData.id)?.totalWeight ?? 0);

    }, [workout, exerciseData.id]);
    
    const [isOpen, setIsOpen] = useState(false);

    function addSetHandler() {
        addExerciseSet(exerciseData.id);
    }

    function deleteSetHandler(exerciseId: string, setItemId: string) {
        removeExerciseSet(exerciseId, setItemId);
    }

    function onCompletedSet(set: ExerciseSetType) {
        let newWeight = 0;
        let newReps = 0;
        let newSets = 0;

        if(set.completed) {
            newSets = 1;
            newWeight = (set.weight || 0) * (set.reps || 0);
            newReps = (set.reps || 0);

        } else {
            newSets = -1;
            newWeight = -((set.weight || 0) * (set.reps || 0));
            newReps = -(set.reps || 0);
        }

        const updatedWeight = totalWeight + newWeight;
        const updatedReps = totalReps + newReps;
        const updatedSets =  + newSets < 0 ? 0 :  + newSets;

        // Calls update exercise to update its totals
        updateExercise(exerciseData.id, {totalWeight: updatedWeight, totalReps: updatedReps, totalSets: updatedSets })

        setTotalWeight(updatedWeight);
        setTotalReps(updatedReps);
    }

    return (
        <div className="flex flex-col gap-y-3 px-6 md:px-6 bg-white drop-shadow-md rounded-3xl py-4 w-full">
            {/* Header */}
            <div className="flex flex-row justify-between">
                <div className="flex gap-x-2">
                    <div className="w-fit bg-blue-400/30 p-2 rounded-3xl hidden md:flex text-blue-500">
                        <Dumbbell size={25} />
                    </div>
                    {/* Exercise Details */}
                    <div className="flex flex-col font-semibold">
                        {titleCase(exerciseData.name)}
                        <div className="text-sm text-black/40 flex">
                            {completedSets}/{totalSets} sets
                            <span className={`${totalWeight > 0 ? 'inline-flex' : 'hidden'} text-blue-500 text-sm`}> 
                                <Dot size={20} /> 
                                {totalWeight} {measurement_pref == 'imperial' ? 'lbs' : 'kg'} of total volume
                            </span>
                        </div>
                    </div>
                </div>
                {/* Exercise Tools */}
                <div className="flex flex-row pl-3 gap-x-2 items-center">
                    <button 
                        onClick={() => addSetHandler()}
                        className="flex gap-x-2 bg-blue-500/30 py-2 px-4 md:px-4 rounded-xl text-blue-500 font-semibold items-center hover:bg-blue-500 hover:text-white"
                    >
                        <Plus strokeWidth={2.2} />
                        Add Set
                    </button>
                    <button
                        className="hover:bg-blue-400/30 rounded-4xl p-2 text-gray-400 "
                        onClick={() => setIsOpen((prev) => !prev)}
                    >
                        {isOpen 
                            ? <ChevronUp size={18}/>
                            : <ChevronDown size={18} />
                        }
                    </button>
                    <button
                        className="text-gray-400 hover:bg-red-500/20 hover:text-red-700 rounded-2xl p-2 "
                        onClick={() => onDeleteExercise(exerciseData.id)}
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
            {/* All Sets */}
            <div className="flex flex-col gap-y-2">
                {sets.map(set => (
                    <ExerciseSet
                        exerciseId={exerciseData.id}
                        key={set.id}
                        setItem={set}
                        measurement_pref={'imperial'}
                        onCompleted={(updatedSet) => onCompletedSet(updatedSet)}
                        onDeleteSet={(exerciseId, setItemId) => deleteSetHandler(exerciseId, setItemId)}
                    />
                ))}
            </div>
        </div>
    )
}