
type TimerEntry = {
    id: string;
    label: string;
    duration: number;
    completed: boolean;
}   

function CircleProgress({ value, max, size = 240} : {value : number, max : number, size?: number}) {
    const radius = (size - 20) / 20;
    const circumference = 2 * Math.PI * radius;
    const progress = max === 0 ? 0 : (value / max) * circumference;
    const strokeDashOffset = circumference - progress;

    return (
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)'}}>
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#daeeff"
                strokeWidth={10}
            />
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="url(#blueGrad)"
                strokeWidth={10}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashOffset}
                style={{ transition: 'stroke-dashoffset 0.5s ease'}}
            />
            <defs>
                <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#2b8fd4" />
                </linearGradient>
            </defs>
        </svg>
    );
}

export default function Workout() {

    return (
        <>
            
        </>
    );
};