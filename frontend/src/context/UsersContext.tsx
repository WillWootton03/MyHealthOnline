import axios from "axios";
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useNavigate } from "react-router";

const API_BASE_URL = import.meta.env.VITE_API_BASE_ROUTE;

export type User = {
    user_id: string;
    name: string;
    email: string;
    password_hash: string;
    height: number;
    weight: number;
    age: number;
    gender: string;
    activity_level: number;
    tdee: number;
};

export type FoodData = {
    name: string;
    calories: number;
    macros: {};
    ingredients: {};
};

export type MealData = {
    name: string;
    foods: [];
    totalCalories: number;
};

export type WorkoutData = {
    id: string;
    excersizes: [];
    length: string;
}

export type ExcersizeData = {
    id: string;
    name: string;
    bodyType: string;
    sets: number;
    reps: number;
    weight: number;
}

type UsersContextType = {
    user: User | null;
    mealData: {};
    workoutData: {};
    fetchUser: () => Promise<void>;
    logoutUser: () => Promise<void>;
};

const UsersContext = createContext<UsersContextType | null>(null);

export function UsersProvider({
    children
} : {
    children: ReactNode;
}) {
    const [mealData, setMealData] = useState<MealData[]>([]);
    const [workoutData, setWorkoutData] = useState<WorkoutData[]>([]);
    const [user, setUser] = useState<User | null>(null); 

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const fetchUser = async () => {
        const token = localStorage.getItem('token');

        if(!token){
            navigate('/');
        }

        try{
            const res = await axios.get(`${API_BASE_URL}/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Data.Data gets the actual object of user res.data contains the success message as well
            setUser(res.data.data)
        } catch (err) {
            if (axios.isAxiosError(err)) { console.error(`Axios Error: ${err}`); }
            else { console.error(`Normal Error: ${error}`); }
        }
    };

    const logoutUser = async () => {
        localStorage.removeItem('token');
        navigate('/');
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UsersContext.Provider
            value={{
                user,
                mealData,
                workoutData,
                fetchUser,
                logoutUser,
            }}
        >
            {children}
        </UsersContext.Provider>
    );
}

export const useUser = () => {
    const context = useContext(UsersContext);

    if(!context) { throw new Error('useUsers must be used within a UsersProvider'); }

    return context; 
}