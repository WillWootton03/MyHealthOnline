import { Check, Minus, Plus, Timer, Trash2 } from "lucide-react";
import {  useEffect, useState } from "react";
import type { ExerciseSet } from "./ExerciseDetails";


type holding = ({
    value?: number;
    on: boolean;
})

type ExerciseSetProps =({
    id: string;
    measurement_pref: string;
    weight?: number,
    reps?: number,
    onCompleted: (set : {
        id: string;
        weight: number;
        reps: number;
        completed: boolean;
    }) => void;
    removeExerciseSet: (id: string) => void;
    updateSet: (set: ExerciseSet) => void;
});

export default function ExerciseSet({
    id,
    measurement_pref,
    weight: i_weight,
    reps: i_reps,
    onCompleted,
    removeExerciseSet,
    updateSet
} : ExerciseSetProps) {
    const [weight, setWeight] = useState(i_weight || 0);
    const [reps, setReps] = useState(i_reps || 0);
    const [timer, setTimer] = useState("");

    const [holdingWeight, setHoldingWeight] = useState<holding>({value: 0, on: false});
    const [holdingReps, setHoldingReps] = useState<holding>({value: 0, on: false});

    const [isCompleted, setIsCompleted] = useState(false);

    const [totSeconds, setTotSeconds] = useState(60);
    const [pct, setPct] = useState(0);

    useEffect(() => {
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

    function onCompletedSet() {
        const c_completed = !isCompleted;
        const [mins, secs] = timer.split(":");
        setTotSeconds(() => (Number(mins) || 2 )* 60 + (Number(secs) || 0));
        setIsCompleted(c_completed);
        setPct(0);
    } 

    function incInputs(val: number, type: String){
        setIsCompleted(false);
        setPct(0);
        if(type === 'weight'){
            setWeight((prev) => (prev + val < 0) ? 0 : prev + val);
        } else if (type === 'reps') {
            setReps((prev) => (prev + val < 0) ? 0 : prev + val);
        }
    }

    function setInputs(val:number, type: string){
        setIsCompleted(false);
        setPct(0);
        if(type === 'weight'){
            setWeight(() => val < 0 ? 0 : val);
        } else if (type === 'reps') {
            setReps(() => val < 0 ? 0 : val);
        }
    }

    useEffect(() => {
        updateSet({ id, weight, reps, completed: isCompleted })
    }, [weight, reps])

    useEffect(() => {
        onCompleted({
            id: id,
            weight: weight,
            reps: reps,
            completed: isCompleted,
        });
        if(!isCompleted) return;

            let secondsElapsed = 0;
            const interval = setInterval(() => {
                if(secondsElapsed < totSeconds) {
                    secondsElapsed += 1;
                    setPct(((secondsElapsed / totSeconds) * 100));
                }
            }, 1000)
            return () => clearInterval(interval)
    }, [isCompleted]);
    
    function timerHandle(val: string) {
        // Replace all non-digits
        val = val.replace(/\D/g, "");

        setTimer(val.slice(0, -2) + ":" + val.slice(-2)); 
    }   

    return (
    <div className={`border rounded-xl px-1 md:px-10 py-5 gap-y-3 light-bg-color flex flex-col ${isCompleted ? 'border-blue-300' : 'border-transparent'}`}>
        <div className="flex flex-row gap-x-2 xl:gap-x-20 justify-center">
            {/* Weight Section */}
            <div className="flex flex-row sm:gap-x-15 md:gap-x-20 items-center">
                <button 
                    className="border rounded-2xl border-gray-400/60 hover:border-blue-400/60"
                    onClick={() => incInputs(-2.5, 'weight')}
                    onMouseDown={() => setHoldingWeight({on: true, value: -2.5})}
                    onMouseUp={() => setHoldingWeight({on: false})}
                    onMouseLeave={() => setHoldingWeight({on: false})}
                >
                    <Minus size={25} strokeWidth={3.5} className="text-gray-400/60 hover:text-gray-500 hover:bg-blue-300/50 rounded-2xl p-1" />
                </button>
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
                <div className="flex flex-row gap-x-3 md:gap-x-20 items-center">
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
                    className="w-15 text-center text-black"
                    value={timer}
                    placeholder="2:00"
                    onChange={(e) => timerHandle(e.target.value)}
                >
                </input>
                </div>
                <div className="flex gap-x-2 items-center">
                    <button className={`flex border rounded-full p-3 items-center transition-colors duration-150 
                            ${isCompleted 
                                ? 'bg-blue-500 text-white' 
                                : 'border-gray-300/50 bg-white/70 hover:text-blue-400 hover:border-blue-400'}`}
                        onClick={() => onCompletedSet()}                
                    >
                        <Check strokeWidth={2.4} size={20} />
                    </button>
                    <button 
                        onClick={() => removeExerciseSet(id)}
                        className="text-gray-400 hover:bg-red-500/20 hover:text-red-700 rounded-2xl p-2  h-fit"
                    >
                        <Trash2 size={18} />
                    </button>
            </div>
        </div>
            {/* Timer Progress Bar */}
            <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${pct}%`}}
                />
            </div>
        </div>
    );
}