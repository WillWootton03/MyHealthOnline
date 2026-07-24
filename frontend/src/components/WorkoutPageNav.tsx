import { getTimeDifferenceInSeconds } from "@shared/functions/formatting";
import { Check, Clock, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useWorkout } from "../context/WorkoutsContext";

type WorkoutPageNavProps = ({
    workoutTitle?: string,
    date?: string,
    completeWorkout: () => void;
});

export default function WorkoutPageNav({
    workoutTitle = "Today's Workout",
    date = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    }),
    completeWorkout
} : WorkoutPageNavProps) {
    const { workout, totalSets, completedSets } = useWorkout();

    const [totalSeconds, setTotalSeconds] = useState(0);

    useEffect(() => {
        if (!workout?.startTime) return;
        
        setTotalSeconds(getTimeDifferenceInSeconds(new Date(), new Date(workout?.startTime)));
    }, [workout?.startTime])


    useEffect(() => {
        const interval = setInterval(() => {
            setTotalSeconds((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;


    return (
            <div className="flex flex-row justify-between px-1 md:px-4 py-5 bg-white h-fit w-full md:rounded-xl">
                {/* Workout Title and Description */}
                <div className="flex flex-col">
                    <div className="text-md font-bold md:text-xl"
                    >
                        {workoutTitle}
                    </div>
                    <div className="text-sm md:text-md text-black/50">
                        {date}
                    </div>
                </div>
                {/* Workout Progress */}
                <div className="flex flex-col md:flex-row gap-y-2 gap-x-8">
                    <button 
                        className="flex items-center gap-x-1 md:gap-x-2 px-3 py-1 text-sm md:text-lg bg-green-500/40 rounded-xl text-green-700/80 font-semibold hover:bg-green-600 hover:text-white"
                        onClick={() => completeWorkout()}
                    >
                        <Check strokeWidth={2.5} width={22} />
                        Complete Workout
                    </button>
                    <div className="flex flex-row md:gap-x-8 justify-between">
                        <div className="flex-col flex">
                            <div className="test-sm md:text-md text-black/50">
                                Sets Done
                            </div>
                            <div className="text-md md:text-xl font-semibold text-end text-black/40">
                                    <span className="text-black">{completedSets ?? 0}</span>/{totalSets ?? 0}
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-center w-8">
                            <Clock color="#595959" size={20} />
                            {hours ? `${String(hours).padStart(2, '0')}:` : ''}{`${String(minutes).padStart(1, '0')}:`}{String(seconds).padStart(2, '0')} 
                        </div>
                    </div>
                </div>
            </div>
    )
}