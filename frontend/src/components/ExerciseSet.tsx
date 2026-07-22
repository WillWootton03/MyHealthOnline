import { Check, Minus, Pause, Play, Plus, Timer, Trash2 } from "lucide-react";
import {  useEffect, useRef, useState } from "react";
import { useWorkout, type ExerciseSetType } from "../context/WorkoutsContext";
import { formatTimer, getTotSeconds } from "@shared/functions/formatting";


type holding = ({
    value?: number;
    on: boolean;
})

type ExerciseSetProps =({
    exerciseId: string;
    measurement_pref: string;
    setItem: ExerciseSetType;
    onCompleted: (set : ExerciseSetType) => void;
    onDeleteSet: (exerciseId : string , setItemId : string) => void;
});

export default function ExerciseSet({
    exerciseId,
    measurement_pref,
    setItem,

    onCompleted,
    onDeleteSet,
} : ExerciseSetProps) {
    const { updateExerciseSet, } = useWorkout();

    const [weight, setWeight] = useState(setItem.weight || 0);
    const [reps, setReps] = useState(setItem.reps || 0);
    const [timer, setTimer] = useState(formatTimer(setItem.restTime) ?? '');
    const [timerSeconds, setTimerSeconds] = useState(setItem.restTime);

    const [holdingWeight, setHoldingWeight] = useState<holding>({value: 0, on: false});
    const [holdingReps, setHoldingReps] = useState<holding>({value: 0, on: false});

    const [isCompleted, setIsCompleted] = useState(setItem.completed);
    const [isSetFinished, setIsSetFinished] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const [totSeconds, setTotSeconds] = useState(setItem.restTime);
    const [pct, setPct] = useState(setItem.completed ? 100 : 0);

    const secondsElapsed = useRef(0);

    const [update, setUpdate] = useState(false);

    useEffect(() => {
        setUpdate(true);
        if(!holdingReps.on === true && !holdingWeight.on === true) return;

        setIsCompleted(false);
        setPct(0);

        let interval : any;
        
        // Delay sets a small delay when holding button so no instant jumps intervals
        const delay = setTimeout(() => {
            interval = setInterval(() => {
                if(holdingReps.on) {
                    setReps((prev) => prev <= 0 ? 0 : prev + (holdingReps.value ? holdingReps.value : 0))
                }
                if(holdingWeight.on){
                    setWeight((prev) => prev <= 0 ? 0 : prev + (holdingWeight.value ? holdingWeight.value : 0))
                }
            }, 100);
        }, 300);

        return () => {
            clearTimeout(delay);
            clearInterval(interval);
        }
    }, [holdingReps, holdingWeight]);

    function onFinishedSet() {
        setUpdate(true);
        const c_finished = !isSetFinished;
        // Makes sure to remove set weight, reps, and set count from totals if unchecking completed
        if (isCompleted) {
            onCompleted({
                id: setItem.id,
                weight: weight,
                reps: reps,
                restTime: totSeconds,
                completed: false,
            });
        } 
        setIsCompleted(false);
        const [mins, secs] = timer.split(":");
        const totalSeconds = (Number(mins) || 0 )* 60 + (Number(secs) || 0)
        setTotSeconds(() => totalSeconds);
        setIsSetFinished(c_finished);
        secondsElapsed.current = 0;
        setPct(0);
        setIsPaused(false);
        setTimerSeconds(totalSeconds);
    } 
    
    function incInputs(val: number, type: String){
        setUpdate(true);
        setIsSetFinished(false);
        setIsCompleted(false);
        setPct(0);
        if(type === 'weight'){
            setWeight((prev) => (prev + val < 0) ? 0 : prev + val);
        } else if (type === 'reps') {
            setReps((prev) => (prev + val < 0) ? 0 : prev + val);
        }
    }

    function setInputs(val:number, type: string){
        setUpdate(true);
        setIsSetFinished(false);
        setIsCompleted(false);
        setPct(0);
        if(type === 'weight'){
            setWeight(val < 0 ? 0 : val);
        } else if (type === 'reps') {
            setReps(() => val < 0 ? 0 : val);
        }

    }

    useEffect(() => {
        // Verifies a variable has been changed. Prevents auto updating completedSets when loading workout data and mounting
        if(!update) {
            return;
        }
        updateExerciseSet(exerciseId, { id: setItem.id , weight, reps, completed: isCompleted, restTime: totSeconds });
    }, [weight, reps, totSeconds, isCompleted])
        
    


    useEffect(() => {
        if(!isSetFinished || isPaused) return;
            const interval = setInterval(() => {
                    if(secondsElapsed.current < totSeconds) {
                        secondsElapsed.current++;
                        setTimerSeconds(prev => prev - 1);
                        setPct(((secondsElapsed.current / totSeconds) * 100));
                    } else {
                            clearInterval(interval);
                            secondsElapsed.current = 0;
                            setIsCompleted(true);
                            onCompleted({
                                id: setItem.id,
                                weight: weight,
                                reps: reps,
                                restTime: totSeconds,
                                completed: true,
                            });
                    }
                }, 1000)
        return () => { 
            clearInterval(interval);
        }
    }, [isSetFinished, totSeconds, isPaused]);

    function timerHandle(val: string) {
        // Replace all non-digits
        val = val.replace(/\D/g, "");

        setTimer(val.slice(0, -2) + ":" + val.slice(-2)); 
        setTotSeconds((Number(val.slice(0, -2)) * 60 ) + Number(val.slice(-2)));
    }   

    return (
    <div className={`border rounded-xl px-1 md:px-10 py-5 gap-y-3 ${isCompleted ? 'light-bg-color' : 'bg-[#f6fbff]' } flex flex-col ${isCompleted ? 'border-blue-300' : 'border-transparent'} transition-all duration-700`}>
        <div className="flex flex-row gap-x-2 xl:gap-x-20 w-full">
            {/* Weight Section */}
            <div className="flex flex-row justify-between flex-1 items-center gap-x-2">
                <button 
                    className="border rounded-2xl border-gray-400/60 hover:border-blue-400/60"
                    onClick={() => incInputs(-2.5, 'weight')}
                    onMouseDown={() => setHoldingWeight({on: true, value: -2.5})}
                    onMouseUp={() => setHoldingWeight({on: false})}
                    onMouseLeave={() => setHoldingWeight({on: false})}
                >
                    <Minus size={25} strokeWidth={3.5} className="text-gray-400/60 hover:text-gray-500 hover:bg-blue-300/50 rounded-2xl p-1" />
                </button>
                {/* Breakdown */}
                <div className="flex flex-col items-center">
                    <input 
                        type="number"
                        value={String(weight)}
                        onChange={(e) => setInputs(Number(e.target.value), 'weight')}
                        placeholder="0"
                        min={0}
                        className="w-20 text-center font-bold text-lg no-spinner"
                    />
                    <div>
                        {measurement_pref === 'metric' ? 'kg' : 'lbs'}
                    </div>
                </div>
                <button
                    onClick={() => incInputs(2.5, 'weight')} 
                    onMouseDown={() => setHoldingWeight({on: true, value: 2.5})}
                    onMouseUp={() => setHoldingWeight({on: false})}
                    onMouseLeave={() => setHoldingWeight({on: false})}
                    className="border rounded-2xl border-gray-400/60 hover:border-blue-400/60"
                >
                    <Plus size={25} strokeWidth={3.5} className="text-gray-400/60 hover:text-gray-500 hover:bg-blue-300/50 rounded-2xl p-1"/>
                </button>
            </div>
            {/* Sets Reps Section */}
                <div className="flex flex-row justify-between flex-1 items-center gap-x-2">
                <button 
                    onClick={() => incInputs(-1, 'reps')}
                    onMouseDown={() => setHoldingReps({on: true, value: -1})}
                    onMouseUp={() => setHoldingReps({on: false})}
                    onMouseLeave={() => setHoldingReps({on: false})}
                    className="border rounded-2xl border-gray-400/60 hover:border-blue-400/60"
                >
                    <Minus size={25} strokeWidth={3.5} className="text-gray-400/60 hover:text-gray-500 hover:bg-blue-300/50 rounded-2xl p-1" />
                </button>
                <div className="flex flex-col items-center">
                    <input 
                        type="number"
                        value={String(reps)}
                        onChange={(e) => setInputs(Number(e.target.value), 'reps')}
                        placeholder="0"
                        min={0}
                        className="w-20 text-center font-bold text-lg  no-spinner"
                    />
                    <div>
                        reps
                    </div>
                </div>
                <button 
                    onClick={() => setReps((prev) => prev + 1)}                    
                    onMouseDown={() => setHoldingReps({on: true, value: 1})}
                    onMouseUp={() => setHoldingReps({on: false})}
                    onMouseLeave={() => setHoldingReps({on: false})}
                    className="border rounded-2xl border-gray-400/60 hover:border-blue-400/60"
                >
                    <Plus size={25} strokeWidth={3.5} className="text-gray-400/60 hover:text-gray-500 hover:bg-blue-300/50 rounded-2xl p-1"/>
                </button>
            </div>
        </div>  
        <div className="flex justify-between">
            <div className="flex gap-x-2 text-gray-500/60 items-center">
                <Timer size={20} />
                <p>
                    Rest
                </p>
                <input 
                    type="text"
                    disabled={isSetFinished}
                    className={`w-15 text-center text-black ${isSetFinished ? 'hidden' : 'flex'}`}
                    value={timer}
                    placeholder="2:00"
                    onChange={(e) => timerHandle(e.target.value)}
                >
                </input>
                <div className={`${isSetFinished ? 'flex' : 'hidden'} w-15 px-4 text-center text-black/70`}>
                    {isCompleted ? timer : formatTimer(timerSeconds)}
                </div>
                </div>
                <div className="flex gap-x-2 items-center">
                    <button className={`flex border rounded-full p-3 items-center transition-colors duration-150 
                            ${isSetFinished 
                                ? 'bg-blue-500 text-white' 
                                : 'border-gray-300/50 bg-white/70 hover:text-blue-400 hover:border-blue-400'}`}
                        onClick={() => onFinishedSet()}                
                    >
                        <Check strokeWidth={2.4} size={20} />
                    </button>
                    {isSetFinished ? (
                        <button 
                            onClick={() => setIsPaused(prev => !prev)}
                            className="border border-transparent rounded-full p-2 bg-white text-black/80 hover:text-green-500 hover:border-green-500"
                        >
                            {isPaused ? (
                                <Play />
                            ) : (
                                <Pause strokeWidth={1.2} />
                            )}

                        </button>
                    ) : <></> }
                    <button 
                        onClick={() => onDeleteSet(exerciseId, setItem.id)}
                        className="text-gray-400 hover:bg-red-500/20 hover:text-red-700 rounded-2xl p-2  h-fit"
                    >
                        <Trash2 size={18} />
                    </button>
            </div>
        </div>
            {/* Timer Progress Bar */}
            <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
                <div className={`h-full ${isCompleted ? 'bg-green-600' : 'bg-blue-500'} rounded-full transition-all duration-1000 ease-linear`}
                    style={{ width: `${pct}%`}}
                />
            </div>
        </div>
    );
}