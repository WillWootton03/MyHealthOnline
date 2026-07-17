import WorkoutPageNav from "../components/WorkoutPageNav";
import ExerciseDetails from "../components/ExerciseDetails";
import ExerciseSet from "../components/ExerciseSet";
import { useEffect, useState } from "react";
import AddExerciseModal, { type SnipExerciseData } from "../components/AddExerciseModal";

export type ExerciseItem = {
    id: string;
    exercise_id: number;
    name: string;
    category: string;
    totalWeight?: number;
    totalReps?: number;
    totalTime?: string;
}

type ExerciseData = {
    exercises: ExerciseItem[];
    startTime: Date;
}

export default function WorkoutPage() {
    const [loggedExercises, setLoggedExercises] = useState<ExerciseItem[]>([]);

    const [displayNewExercise, setDisplayNewExercise] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const storedWorkout = localStorage.getItem('workout');
    const currentWorkout = storedWorkout ? JSON.parse(storedWorkout) : null;

    useEffect(() => {
        if(currentWorkout) {
            setLoggedExercises(currentWorkout);
        } else {
            localStorage.setItem('workout', JSON.stringify(loggedExercises));
        }
    }, [])

    function newExercises(exercises: SnipExerciseData[]) {
        // Iterate through all items preset in the new data
        exercises.forEach(exercise => {
            setLoggedExercises(prev => {
                if(!prev) return [];
                return [
                    ...prev,
                    {
                        id: crypto.randomUUID(),
                        exercise_id: exercise.id,
                        name: exercise.name,
                        category: exercise.category
                    }
                ]
            });

            // Must push before adding to local storage. Dont stringify state since it may be out of sync
            currentWorkout.push(     
                {
                    id: crypto.randomUUID(),
                    exercise_id: exercise.id,
                    name: exercise.name,
                    category: exercise.category
                }
            )
            localStorage.setItem('workout', JSON.stringify(currentWorkout));
        });    
        setDisplayNewExercise(false);
    }


    function showNewExerciseModal(e: React.MouseEvent) {
        e.stopPropagation();
        setDisplayNewExercise(true); 
    }



    function deleteExercise(id: string) {
        setLoggedExercises(prev => prev.filter(exercise => exercise.id !== id));
        localStorage.setItem('workout', JSON.stringify(loggedExercises));
    }

    return (
        <div className="min-h-screen w-full flex flex-col gap-y-5 relative overflow-hidden page-bg-light">
            {/* Main workout page displayed if not adding exercise */}
            {!displayNewExercise ? (
            <>
                <div className="flex px-5 2xl:px-80 xl:px-60 md:px-10">
                    <WorkoutPageNav 
                        />
                </div>
                    <div className="flex flex-col gap-y-3 items-center">
                        {loggedExercises.length > 0 ? ( 
                            loggedExercises.map(exercise => (
                                        <ExerciseDetails 
                                            exerciseData={exercise}
                                            onDeleteExercise={(val) => deleteExercise(val)}
                                        />
                                    ))
                        ) : <></> }
                        <div className="flex flex-col md:flex-row gap-x-2 gap-y-2">
                            <button 
                                className="bg-color-primary text-lg w-40 font-semibold text-white rounded-lg"
                                disabled={loading}
                                onClick={(e) => showNewExerciseModal(e)}
                            >
                                Add Exercise
                            </button>
                            <button className="bg-red-500 w-40 text-lg font-semibold text-white rounded-lg">
                                Cancel Workout
                            </button>
                        </div>
                    </div>
                </>
            ) : 
            <AddExerciseModal 
                    setDisplayNewExercise={(val: boolean) => setDisplayNewExercise(val)}
                    setPLoading={(val: boolean) => setLoading(val)}
                    addExercises={(val) => newExercises(val)}
                /> 
            }
        </div>
    );
}