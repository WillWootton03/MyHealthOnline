
export function feetToCm(feet: number, inches: number) : number {
    return Math.round((feet * 30.48) + (inches * 2.54));
};

export function cmToFeetString(meters: number) : string {
    const total_inches : number =  meters / 2.54;
    const feet : number = Math.floor(total_inches / 12);
    const inches = Math.round(total_inches - (feet * 12));

    return `${feet}'${inches}`;
};

export function lbsToKg(lbs : number) : number {
    return Math.round(lbs * 0.453592);
};

export function kgToLbs(kg : number) : number {
    return Math.round(kg * 2.20462);
};