// Verify item or measurment values that are plural are properly handled when switched to single measurements
export function pluralCheck(str: string) {
    // verify there is an input for string
    if (!str || typeof str !== 'string') return '';

    if(str.at(-1) === ",") str = str.slice(0,-1); 

    // Checks when an item or measurments base val ends in o or O, EX: Potatoes becomes Potato | Tomatoes becomes Tomato
    // Checks when an item or measurements base val ends in x or X, EX: Boxes becomes Box
    if (/o/i.test(str.at(-3) ?? '') || /x/i.test(str.at(-3) ?? '')) return str.slice(0, -2);

    // Checks wether an item or measurements base val ends in ch or sh EX: Sanwiches becomes Sandwich | Radishes becomes Radish
    // Checks wether an item or measurements base val ends in ss EX: Busses becomes Bus | Glasses becomes Glass
    if (/ch/i.test(str.slice(-4, -2) ?? '') || /sh/i.test(str.slice(-4, -2) ?? '') || /ss/i.test(str.slice(-4, -2) ?? ''))  {
        return str.slice(0, -2);
    }

    // Checks wether an item or measurment base val ends in f EX: Loaves becomes Loaf | Calves becomes calf
    if (/ves/i.test(str.slice(-3)) ?? '') return str.slice(0, -3) + 'f'; 

    // Base test for all items ending in simply s when plural
    if(/s/i.test(str.at(-1) ?? '')) {
        return str.slice(0, -1);
    }

    return str;
};

// Creates a new string changing making it title care
export function titleCase(str: string) { 
    if (!str || typeof str !== 'string') return '';

    const newStrArr = str.split(' ');
    const newStr = newStrArr.length > 1 
        ? newStrArr.map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join(' ') 
        :  newStrArr[0].charAt(0).toUpperCase() + newStrArr[0].slice(1).toLowerCase();
    return newStr;
};

// Returns an object representing feet and inches given a string EX. 5'11 => feet: 5, inches: 11
export function getFeetInchesFromString(str : string) : {feet : number, inches : number} {
    const [ feet, inches ] = str.split(`'`);
    return {
        feet : Number.isNaN(Number(feet)) ? -1 : Number(feet),
        inches : Number.isNaN(Number(feet)) ? -1 :  Number(inches)
    }
};

// Formats a date object to output date as a string in the following style YYYY-MM-DD
export function formatDate(date : Date) : string {
    const [y, m, d] = date.toLocaleDateString('en-CA').split('-');
    return `${m}-${d}-${y}`
} 