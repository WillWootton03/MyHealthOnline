import { getTimeDifferenceInSeconds } from '@shared/functions/formatting';
import axios from 'axios';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';


const API_BASE_URL = import.meta.env.VITE_API_BASE_ROUTE;

export type ExerciseSetType = ({
    id: string;
    weight: number | undefined;
    reps: number | undefined;
    completed: boolean;
    restTime: number;       // in total seconds
});

export type SnipExerciseData = {
    id: number;
    name: string;
    category: string;
    thumbnail: string;
};

export type Workout = {
    id: string;
    log_id: string;
    title: string;
    startTime: Date;
    exercises: ExerciseItem[];
};

export type ExerciseItem = {
    id: string;
    exercise_id: number;
    name: string;
    category: string;
    sets: ExerciseSetType[];
    totalWeight?: number;
    totalReps?: number;
    totalSets?: number;
};

interface WorkoutsContextType {
    workout: Workout | undefined;
    setWorkout: React.Dispatch<React.SetStateAction<Workout | undefined>>;

    addExercises : (exercise: SnipExerciseData[]) => void;
    updateExercise : (exerciseId: string, updatedExercise: Partial<ExerciseItem>) => void;
    removeExercise : (exerciseId: string) => void;

    addExerciseSet : (exerciseId: string) => void;
    updateExerciseSet : (exerciseId: string, updateSet: ExerciseSetType) => void;
    removeExerciseSet : (exerciseId: string, setId: string) => void;

    cancelWorkout : () => void;
    submitWorkout : () => void;
}

const WorkoutsContext = createContext<WorkoutsContextType | null>(null);

export function WorkoutsProvider({
    children,
    log_id,
} : {
    children: ReactNode, log_id: string;
}) {

    const [workout, setWorkout] = useState<Workout | undefined>(undefined);
    const [loaded, setLoaded] = useState(false);

    const navigate = useNavigate();

    function addExercises(exercises: SnipExerciseData[]) {
        // Iterate through all items preset in the new data
        setWorkout(prev => {
            if(!prev) return prev;
            return {
                ...prev,
                exercises: 
                    [
                        ...prev.exercises,
                        ...exercises.map(exercise => ({
                                                id:crypto.randomUUID(),
                                                exercise_id: exercise.id,
                                                name: exercise.name,
                                                category: exercise.category,
                                                sets: [ {      
                                                    id: crypto.randomUUID(),  
                                                    weight: 0,
                                                    reps: 0,
                                                    restTime: 120,
                                                    completed: false,
                                                }, ],
                                            }))
                    ]
                
            };
        });
    }

    function updateExercise(exercise_id : string, updatedExercise : Partial<ExerciseItem>) {
        setWorkout(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                exercises: 
                    prev.exercises.map(exercise => 
                        exercise.id === exercise_id
                            ? { ...exercise, ...updatedExercise}
                            : exercise
                    )
            }
        });
    }

    function removeExercise(exerciseId: string) {
        setWorkout(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                exercises: prev.exercises.filter(exercise => exercise.id !== exerciseId)
            }
        });
    }
    

    const addExerciseSet = (exerciseId: string) => {
        setWorkout(prev => {
            if (!prev) return prev;

            return {
                ...prev,
                exercises: prev.exercises.map(exercise => {
                if (exercise.id !== exerciseId) return exercise;

                const newId = crypto.randomUUID();
                const newSet = exercise.sets.length > 0
                    ? 
                    {
                        ...exercise.sets[exercise.sets.length - 1],
                        id: newId,
                        completed: false,
                    } 
                    :
                    {
                        id: newId,
                        weight: 0,
                        reps: 0,
                        restTime: 120,
                        completed: false,
                    };

                return {
                    ...exercise,
                    sets: [...exercise.sets, newSet],
                };
            })
            }
        });
    };

    function updateExerciseSet(exerciseId: string, updateSet: ExerciseSetType) {
        setWorkout(prev => {
            if (!prev) return prev;

            return {
                ...prev,
                exercises: prev.exercises.map((exercise: ExerciseItem) => 
                    exerciseId === exercise.id
                        ?
                        {
                            ...exercise,
                            sets: exercise.sets.map((set : ExerciseSetType) => 
                                // Get set based on updated set id and update weight and reps
                                set.id === updateSet.id 
                                    ? 
                                        updateSet
                                    : 
                                    set
                            )  
                        }
                        :
                        exercise
                )
            }
        });
    };

    function removeExerciseSet(exerciseId: string, setId: string) {
        setWorkout(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                exercises: prev.exercises.map((exercise: ExerciseItem) => 
                        exercise.id === exerciseId 
                            ?
                                {
                                    ...exercise,
                                    sets: exercise.sets.filter(s => s.id !== setId)
                                }
                            : 
                            exercise
                )
            }
        });
    };
    
    function cancelWorkout() {
        localStorage.removeItem('workout');
        navigate('');
    }

    async function submitWorkout() {
        const token = localStorage.getItem('token');
        localStorage.removeItem('workout');
        navigate('');
        await axios.post(`${import.meta.env.VITE_API_BASE_ROUTE}/workouts`, 
            {
                workout: workout,
            },
            {
                headers : {
                    "Authorization" : `Bearer ${token}`
                },
            }
        );
    }

    // Loads workout data from localStorage if available
    useEffect(() => {
        const stored = localStorage.getItem('workout');

        if(stored) {
            setWorkout(JSON.parse(stored));
        } else {
            setWorkout({
                id: crypto.randomUUID(),
                log_id: log_id,
                title: "Today's Workout",
                startTime: new Date(),
                exercises: []
            })
        }

        setLoaded(true);
    }, [])

    
    // Automatically saves workout data if anything in workout changes
    useEffect(() => {
        if (loaded) localStorage.setItem('workout', JSON.stringify(workout));
    }, [workout, loaded]);

    return (
        <WorkoutsContext.Provider
            value={{
                workout,
                setWorkout,
                addExercises,
                updateExercise,
                removeExercise,
                addExerciseSet,
                updateExerciseSet,
                removeExerciseSet,
                cancelWorkout,
                submitWorkout,
            }}
        >
            {children}
        </WorkoutsContext.Provider>
    )
}

export const useWorkout = () => {
    const context = useContext(WorkoutsContext);

    if (!context) { throw new Error('useWorkouts must be used within a WorkoutsProvider'); }

    return context;
}