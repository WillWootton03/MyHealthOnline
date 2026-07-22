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

export type ExerciseData = {
    id: string;
    name: string;
    description: string;
    muscles: [];
    secondary_muscles: [];
    category: string;
    equipment: string[];
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
    exercise_id: string;
    name: string;
    category: string;
    sets: ExerciseSetType[];
    totalWeight?: number;
    totalReps?: number;
    totalSets?: number;
};

export const ExerciseCategories = ['Legs', 'Cardio' , 'Arms' , 'Back' , 'Chest' , 'Shoulders' , 'Abs' , 'Calves'] as const;
export type ExerciseCategory = typeof ExerciseCategories[number];
export type ExerciseCategoryGroup = Record<ExerciseCategory, ExerciseData[]>;

interface WorkoutsContextType {
    workout: Workout | undefined;

    totalSets : number;
    completedSets: number;
    setCompletedSets: React.Dispatch<React.SetStateAction<number>>;

    searchExercises : ExerciseCategoryGroup;
    setSearchExercises : React.Dispatch<React.SetStateAction<ExerciseCategoryGroup>>;

    setWorkout: React.Dispatch<React.SetStateAction<Workout | undefined>>;

    addExercises : (exercise: ExerciseData[]) => void;
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

    const [totalSets, setTotalSets] = useState(0);
    const [completedSets, setCompletedSets] = useState(0);

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



    const navigate = useNavigate();

    function addExercises(exercises: ExerciseData[]) {

        setTotalSets(prev => prev + exercises.length);
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
                                                exercise_id: String(exercise.id),
                                                name: exercise.name,
                                                description: exercise.description,
                                                muscles : exercise.muscles,
                                                secondary_muscles: exercise.secondary_muscles,
                                                category: exercise.category,
                                                equipment: exercise.equipment,
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

    // Called when a set is completed to update totals
    function updateExercise(exercise_id : string, updatedExercise : Partial<ExerciseItem>) {

        console.log(updatedExercise);
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

        const removeEx = workout?.exercises.find(exercise => exercise.id === exerciseId);
        // Removes sets from totals when removing an exercise
        setTotalSets(prev => prev - (removeEx?.sets.length ?? 0));
        setCompletedSets(prev => prev - (removeEx?.sets.filter(set => set.completed === true).length ?? 0));

        setWorkout(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                exercises: prev.exercises.filter(exercise => exercise.id !== exerciseId)
            }
        });
    }
    

    const addExerciseSet = (exerciseId: string) => {
        setTotalSets(prev => prev + 1);

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
        // Completed Sets is incremented only if updateSet is now truw
        // If it is toggled off, check if it was previously completed, if so subtract 1 from completed set
        // If completed set was previously false do not subtract 1 from completed set
        setCompletedSets(prev => prev + (updateSet.completed === true 
                                            ? 1 
                                                : (workout?.exercises.find(exercise => exercise.id === exerciseId)?.sets.find(set => set.id === updateSet.id)?.completed) 
                                                    ? -1 
                                                        : 0
        ));

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
        
        setTotalSets(totSets => totSets - 1);
        // Find exercise and set in exercise mathcing ids. If set is completed subtract 1 from completed sets total, else do not subtract
        setCompletedSets(compSets => compSets - ((workout?.exercises
            .find(exercise => exercise.id === exerciseId)?.sets
                .find(set => set.id === setId)?.completed) ? 1 : 0))

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

    async function getExerciseData() {
        const token = localStorage.getItem('token');
        
        // Attempt to read loaded exercise data
        let stored = sessionStorage.getItem('short_exercises');
        if(stored) {
            setSearchExercises(JSON.parse(stored));
            return;
        }

        const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_ROUTE}/exercises/short`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const response = await axios.get(`${import.meta.env.VITE_API_BASE_ROUTE}/exercises/custom`,
            {
                headers : {
                    'Authorization' : `Bearer ${token}`
                }
            }
        );
        const custom_exercises = response.data.data;


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

        data.data.forEach((exercise: ExerciseData) => {
            ret[exercise.category as ExerciseCategory].push({ 
                ...exercise,
                id: String(exercise.id)
             });
        });

        custom_exercises.forEach((exercise : any) => {
            ret[exercise.category as ExerciseCategory].push({
                id: exercise.custom_exercise_id,
                ...exercise
            });
        });

        ExerciseCategories.forEach((category) => {
            ret[category].sort((a, b) => a.name.localeCompare(b.name));
        }) 

        sessionStorage.setItem('short_exercises', JSON.stringify(ret));
        setSearchExercises(ret);
    }


    // Loads workout data from localStorage if available
    useEffect(() => {
        const stored = localStorage.getItem('workout');
        getExerciseData();

        if(stored) {
            const foundWorkout = JSON.parse(stored);

            // Gets total of all lengths for each exercises sets and adds to total using reduce
            setTotalSets(foundWorkout.exercises.reduce((total : number, exercise : ExerciseItem) => total + exercise.sets.length, 0));
            setCompletedSets(foundWorkout.exercises.reduce((total: number, exercise: ExerciseItem) => total + exercise.sets.filter(set => set.completed).length, 0));
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

    useEffect(() => {
        if(loaded) sessionStorage.setItem('short_exercises', JSON.stringify(searchExercises));
    }, [searchExercises, loaded]);
    
    // Automatically saves workout data if anything in workout changes
    useEffect(() => {
        if (loaded) localStorage.setItem('workout', JSON.stringify(workout));
    }, [workout, loaded]);

    return (
        <WorkoutsContext.Provider
            value={{
                workout,
                searchExercises,
                totalSets,
                completedSets,
                setCompletedSets,
                setSearchExercises,
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