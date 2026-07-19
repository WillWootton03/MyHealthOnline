import WorkoutPageNav from "../components/WorkoutPageNav";
import ExerciseDetails from "../components/ExerciseDetails";
import { useState } from "react";
import AddExerciseModal from "../components/AddExerciseModal";
import { useWorkout  } from "../context/WorkoutsContext";
import { Plus, X } from "lucide-react";


export default function WorkoutPage() {
    const { workout, removeExercise, addExercises, cancelWorkout, submitWorkout } = useWorkout();

    const [displayNewExercise, setDisplayNewExercise] = useState(false);
    const [loading, setLoading] = useState(false);



    function showNewExerciseModal(e: React.MouseEvent) {
        e.stopPropagation();
        setDisplayNewExercise(true); 
    }


    return (
            <div className="min-h-screen w-full flex flex-col gap-y-5  page-bg-light">
                {/* Main workout page displayed if not adding exercise */}
                {!displayNewExercise ? (
                <>
                    <div className="flex px-5 2xl:px-80 xl:px-60 md:px-10">
                        <WorkoutPageNav 
                            completeWorkout={() => submitWorkout()}
                            />
                    </div>
                        <div className="flex flex-col gap-y-3 px-5 md:px-20 xl:px-60 2xl:px-100 items-center">
                            {(workout?.exercises.length ?? 0) > 0 ? ( 
                                workout?.exercises.map(exercise => (
                                            <ExerciseDetails 
                                                key={exercise.id}
                                                exerciseData={exercise}
                                                onDeleteExercise={(val) => removeExercise(val)}
                                            />
                                        ))
                            ) : <></> }
                            <div className="flex flex-col md:flex-row gap-x-2 gap-y-2">
                                <button 
                                    className="bg-blue-500/40 text-blue-500/80 text-lg w-50 py-1 font-semibold hover:bg-blue-500 
                                        hover:text-white rounded-lg flex items-center justify-center gap-x-1"
                                    disabled={loading}
                                    onClick={(e) => showNewExerciseModal(e)}
                                >
                                    <Plus />
                                    Add Exercise
                                </button>
                                <button 
                                    onClick={() => cancelWorkout()} 
                                    className="bg-red-500/60 text-red-500/80 w-50 text-lg font-semibold hover:text-white 
                                                    hover:bg-red-500 rounded-lg flex items-center justify-center gap-x-1"
                                >
                                    <X />
                                    Cancel Workout
                                </button>
                            </div>
                        </div>
                    </>
                ) : 
                <AddExerciseModal 
                        setDisplayNewExercise={(val: boolean) => setDisplayNewExercise(val)}
                        setPLoading={(val: boolean) => setLoading(val)}
                        addExercises={(val) => addExercises(val)}
                    /> 
                }
            </div>
    );
}