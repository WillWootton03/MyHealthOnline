import { pluralCheck } from "./formatting";
/*
    calculateMacroNutrients: based on serving type and input, calculate a given macronutrient based on serving size and input
    **
    nutrient_val : the value given from the nutrients count, per gram or calorie dependant
    serving_unit : determines which calculation to use based on value from USDA database
    serving_input : number base on user input for how many servings to add
    serving_size : given from USDA database, in grams based on household serving size
    household_num : ex. 3 crackers, 1 egg, 2 slices of toast, etc. Takes first val so 3, 1, 2, etc.

    () => return nutrient details, which returns val based on inputs for serving given or -1 if failed operation
*/
export function calculateMacroNutrients(nutrient_val: number, serving_unit: string, serving_input: number, serving_size?: number, household?: string) :
number {
    // verify main inputs are valid and type of inputs is all correct if given
    // serving input need to verify number is not 0, since 0 serving input is valid, but in JS 0 is a falsey value
    if((!nutrient_val || !serving_unit || (!serving_input && serving_input !== 0)) || 
        (typeof nutrient_val !== 'number' || typeof serving_unit !== 'string' || typeof serving_input !== 'number' 
        || (serving_size && typeof serving_size !== 'number') || (household && typeof household !== 'string'))
        || serving_input < 0
    ) {
        return -1
    }

    let val = 0;
    // Verify serving unit is a single version of the household item non-plural version
    if(serving_unit == `1 ${pluralCheck(household?.split(' ')?.at(1) ?? '')}`) {
        val = Math.round((((nutrient_val * (serving_size ?? 1)) / 100 ) * serving_input) / (Number(household?.split(' ')?.at(0)) ?? 1));
    }
    // Verfiy serving is greater than 1, and serving_unit is same as household unit measurement type
    else if (Number(serving_unit.at(0)) > 1 && serving_unit.split(' ')?.at(1) == household?.split(' ')?.at(1)) {
        val = Math.round(((nutrient_val * (serving_size ?? 1)) / 100) * serving_input);
    }
    else if(serving_unit === '1 g') {
        val = Math.round((nutrient_val / 100) * serving_input);
    }
    else if(serving_unit === '100 g') {
        val = Math.round(nutrient_val * serving_input);
    } 
    // invalid option selected return -1
    else {
        return -1
    }

    // Verify val is a valid number and greater than 0s
    const nutrient_details = Number.isNaN(val) ? -1 : val < 0 ? 0 : val;
    return nutrient_details;
}