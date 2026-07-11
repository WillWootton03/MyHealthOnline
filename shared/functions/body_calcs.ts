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