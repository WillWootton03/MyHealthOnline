import { ChevronDown, ChevronUp, Dot, Dumbbell, Plus, Trash, Trash2 } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import ExerciseSet from "./ExerciseSet";
import type { ExerciseItem } from "../pages/Workout";




type ExerciseDetailsProps = ({
    exerciseData: ExerciseItem;
    measurement_pref?: string;
    onDeleteExercise: (id: string) => void;
});

export type ExerciseSet = ({
    id: string;
    weight: number | undefined;
    reps: number | undefined;
    completed: boolean;
});

export default function ExerciseDetails({
    exerciseData: exercise,
    measurement_pref = 'imperial',
    onDeleteExercise
} : ExerciseDetailsProps) {

    const [totalSets, setTotalSets] = useState(1);
    const [completedSets, setCompletedSets] = useState(0);
    const [sets, setSets] = useState<ExerciseSet[]>([
        { id: crypto.randomUUID(), weight: undefined, reps: undefined, completed: false}
    ]);

    const [totalWeight, setTotalWeight] = useState(0);
    const [totalReps, setTotalReps] = useState(0);

    const [isOpen, setIsOpen] = useState(false);

    function addExerciseSet() {
        setTotalSets(prev => prev + 1);
        setSets(prev => {
            const lastSet = prev[prev.length - 1];
            return [
                ...prev,
                {
                    ...lastSet,
                    id: crypto.randomUUID(),
                    completed: false,
                }
            ]
        });
    }

    function updateSet(exercise: ExerciseSet) {
        const indx = sets.findIndex(s => s.id === exercise.id);

        if(indx !== -1) {
            setSets(prev => 
                prev.map((set, i) => 
                    i === indx
                        ? {
                            ...set,
                            weight: exercise.weight,
                            reps: exercise.reps,
                        }
                        : set
                )
            );
        }

    }

    function removeExerciseSet(id: string) {
        setTotalSets(prev => prev - 1);

        const indx = sets.findIndex(s => s.id === id);
        if (indx) {
            setTotalReps(prev => prev - (sets[indx]?.reps ?? 0));
            setTotalWeight(prev => prev - (sets[indx]?.weight ?? 0));
            setSets(prev => prev.filter(s => s.id !== id));
        }
    }

    function onCompletedSet(set: ExerciseSet) {
        if(set.completed) {
            setCompletedSets(prev => prev + 1);
            setTotalWeight((prev) => prev + (set.weight || 0) * (set.reps || 0));
            setTotalReps(prev => prev + (set.reps || 0));
        } else {
            setCompletedSets(prev => prev - 1 < 0 ? 0 : prev - 1);
            setTotalWeight((prev) => prev - (set.weight || 0) * (set.reps || 0));
            setTotalReps(prev => prev - (set.reps || 0));
        }
    }

    return (
        <div className="flex flex-col gap-y-3 px-3 md:px-6 bg-white drop-shadow-md rounded-3xl py-4 w-fit">
            {/* Header */}
            <div className="flex flex-row justify-between">
                <div className="flex gap-x-2">
                    <div className="w-fit bg-blue-400/30 p-2 rounded-3xl hidden md:flex text-blue-500">
                        <Dumbbell size={25} />
                    </div>
                    {/* Exercise Details */}
                    <div className="flex flex-col font-semibold">
                        {exercise.name}
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
                        onClick={() => addExerciseSet()}
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
                        onClick={() => onDeleteExercise(exercise.id)}
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
            {/* All Sets */}
            <div className="flex flex-col gap-y-2">
                {sets.map(set => (
                    <ExerciseSet
                        key={set.id}
                        id={set.id}
                        measurement_pref={'imperial'}
                        weight={set.weight}
                        reps={set.reps}
                        onCompleted={(updatedSet) => onCompletedSet(updatedSet)}
                        updateSet={((set) => updateSet(set))}
                        removeExerciseSet={() => removeExerciseSet(set.id)}
                    />
                ))}
            </div>
        </div>
    )
}