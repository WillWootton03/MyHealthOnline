import { useEffect, useState } from "react";
import { calculateMacroNutrients } from "@shared/functions/calorie_calcs";

type nutrientDetailsModalProps = {
    isLoggedItem: boolean;
    nutrientLabel: string;
    nutrientData: any;
    servingSize: any;
    servingType: any;
    servingInput: string;
    household?: string;
}

type MacroData = {
    type: string,
    serving: string;
    amount: number;
}

export default function NutrientDetails({
    isLoggedItem,
    nutrientLabel,
    nutrientData,
    servingSize,
    servingType,
    servingInput,
    household,
} : nutrientDetailsModalProps) {

    // State used for UI updates
    const [nutrientVal, setNutrientVal] = useState(0);

    const nutData = isLoggedItem ? nutrientData : nutrientData[0]?.value;
    // Value set 
    let val = 0;

    useEffect(() => {
        val = calculateMacroNutrients(nutData, servingType, Number(servingInput), servingSize, household);
        setNutrientVal(val);
        
    }, [servingInput, servingType])

    return (
        <div className="flex gap-x-2 py-2 px-4 transition-all">   
            <div className="text-md text-black font-bold">{nutrientLabel}</div>
            <div className="text-md text-black/80"><span className="font-semibold transition-all">{nutrientVal}</span> 
            </div>
        </div>
    );
}