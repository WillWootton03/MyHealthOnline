// Calculates BMR (basal metabolic rate) based on gender, height, weight, and age
export function getBMR(height: number, weight: number, age: number, gender: string) : number {
    let g = (gender === 'male' ? 5 : -161) + ((weight * 10) + (height * 6.25) - (5 * age));
    return g
};

// Calculates TDEE (total daily energy expenditure), this is based on daily activity level and bmr and gives a relative estimation of calories needed to consume each day to keep current weight
export function getTDEE(bmr : number, activity_level : number) : number {
    switch(activity_level) {
        case 1:
            bmr *= 1.2;
            break;
        case 2:
            bmr *= 1.375;
            break;
        case 3:
            bmr *= 1.55;
            break;
        case 4:
            bmr *= 1.725;
            break;
        case 5:
            bmr *= 1.9;
            break;
    }
    return Math.round(bmr);
}

// Calculates calories needed to go from 1 weight to another based on timeframe given in days
// CALCULATION : 1 pound = 3500 calories
// CALCULATION : 1 kg = 7700 calories
export function getCalorieChange(currWeight: number, goalWeight: number, timeFrame: number, measurement: string) : number {
    const weightToGoal = goalWeight - currWeight;
    const totCals = weightToGoal * (measurement === 'imperial' ? 3500 : 7700);
    return totCals / timeFrame;
}
