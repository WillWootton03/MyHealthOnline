import WorkoutPageNav from "../components/WorkoutPageNav";
import WebBackground from "../components/WebBackground";
import ExerciseDetails from "../components/ExerciseDetails";
import { useState } from "react";
import axios from "axios";

type ExerciseDetails = {
    id: string;
    title: string;
    totalWeight?: number;
    totalReps?: number;
    totalTime?: string;
}

export default function WorkoutPage() {
    const [exercises, setExercises] = useState<ExerciseDetails[]>([]);

    const [displayNewExercise, setDisplayNewExercise] = useState(false);

    function newExercise(exercise: ExerciseDetails) {
        setExercises(prev => [
            ...prev,
            exercise,
        ]);
    }  

    async function showNewExerciseModal (e: React.MouseEvent) {
        e.stopPropagation();
        setDisplayNewExercise(true);

        const res = await axios.get(`${import.meta.env.VITE_API_BASE_ROUTE}/exercises`)
    }

    function deleteExercise(id: string) {
        setExercises(prev => prev.filter(exercise => exercise.id !== id));
    }

    return (
        <div className="min-h-screen w-full flex flex-col gap-y-5 relative overflow-hidden page-bg-light">
            <div className="flex px-5 2xl:px-80 xl:px-60 md:px-10">
                <WorkoutPageNav 
                    />
            </div>
            <section className="px-5 2xl:px-80 xl:px-60 md:px-10">
                {exercises.map(exercise => (
                    <ExerciseDetails 
                        onDeleteExercise={(id) => deleteExercise(id)}
                    />
                ))}
            </section>
                <div className="flex flex-col px-5 md:px-70 xl:px-140 gap-y-3">
                    <button 
                        className="bg-color-primary text-lg font-semibold text-white rounded-lg"
                        onClick={(e) => showNewExerciseModal(e)}
                    >
                        Add Exercise
                    </button>
                    <button className="bg-red-500 text-lg font-semibold text-white rounded-lg">
                        Cancel Workout
                    </button>
                </div>
        </div>
    );
}