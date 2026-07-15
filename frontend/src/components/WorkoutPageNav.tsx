import { Clock, Plus } from "lucide-react";
import { useEffect, useState } from "react";

type WorkoutPageNavProps = ({
    workoutTitle?: string,
    date?: string,
});

export default function WorkoutPageNav({
    workoutTitle = "Today's Workout",
    date = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    }),
} : WorkoutPageNavProps) {

    const [setsDone, setSetsDone] = useState(0);
    const [totalSets, setTotalSets] = useState(0);

    const [totalSeconds, setTotalSeconds] = useState(0);

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
            <div className="flex flex-row justify-between px-4 py-5 bg-white h-fit w-full md:rounded-xl">
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
                <div className="flex flex-row gap-x-8">
                    <div className="flex-col flex">
                        <div className="test-sm md:text-md text-black/50">
                            Sets Done
                        </div>
                        <div className="text-md md:text-xl font-semibold text-end text-black/40">
                                <span className="text-black">{setsDone}</span>/{totalSets}
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <Clock color="#595959" size={20} />
                        {hours ? `${String(hours).padStart(2, '0')}:` : ''}{`${String(minutes).padStart(1, '0')}:`}{String(seconds).padStart(2, '0')} 
                    </div>
                </div>
            </div>
    )
}