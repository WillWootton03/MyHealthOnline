import { useEffect, useState } from "react";

type nutrientDetailsModalProps = {
    isLoggedItem: boolean;
    nutrientLabel: string;
    nutrientData: any;
    servingSize: any;
    servingType: any;
    servingInput: string;
    householdNum?: string;
    setReturningMacros: (macros : any) => void;
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
    householdNum,
    setReturningMacros,
} : nutrientDetailsModalProps) {

    const [nutDetails, setNutDetails] = useState(0);

    const nutData = isLoggedItem ? nutrientData : nutrientData[0]?.value;

    const calculateNutrientPerServing = () => {
        let val = 0;
        if (servingType === '1 g') {
            val = Math.round((nutData / 100) * Number(servingInput));
        }  else if (servingType === '100 g') {
            val = Math.round((nutData) * Number(servingInput));
        }
        else if (servingType === '1 household') {
            val = Math.round((((nutData * servingSize) / 100) * Number(servingInput)) / Number(householdNum));
        
        }
        else {
            // gets the value per 100 grams for calorie, then multiplies by serving size.
            // gets per seving size * 100 then divides by 100 returning per serving size calories
            val = Math.round((((nutData * servingSize) / 100) * Number(servingInput)));
        }

        setNutDetails(Number.isNaN(val) ? -1 : val < 0 ? 0 : val);


        // Add to returning macros that was passed, including the nutrient type and data to be parsed in backend
        setReturningMacros((prev : MacroData[]) => {
            // If a macro of the same type was found ex. calories, protein etc. update that value to the current serving type and val
            let found = false;

            // Create a mapping of the current returning macros and if found matching macro type, update serving and amount
            const updated = prev.map(macro => {
                if(macro.type === nutrientLabel.toLowerCase()) {
                    found = true;
                    return {
                        ...macro,
                        serving: servingType,
                        amount: val,
                    };
                }
                return macro;
            });
            // If no macro saved at that type, push new MacroData into retuningMacros
            if (!found) {
                updated.push({
                    type: nutrientLabel.toLowerCase(),
                    serving: servingType,
                    amount: val,
                })
            }
            return updated;
        });
    }

    useEffect(() => {
        calculateNutrientPerServing();
    }, [servingInput, servingType])

    return (
        <div className="flex gap-x-2 py-2 px-4 transition-all">   
            <div className="text-md text-black font-bold">{nutrientLabel}</div>
            <div className="text-md text-black/80"><span className="font-semibold transition-all">{nutDetails}</span> 
            </div>
        </div>
    );
}