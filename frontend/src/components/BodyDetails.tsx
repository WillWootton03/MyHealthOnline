import { useEffect, useState } from "react";
import axios from "axios";
import FormField from "./FormField";
import { Form, useNavigate } from "react-router";
import { getCalorieChange } from "@shared/functions/body_calcs";
import { feetToCm, lbsToKg, cmToFeetString, kgToLbs} from "@shared/functions/int_conversions";

export default function BodyDetails () {
    const [feet, setFeet] = useState("5");
    const [inches, setInches] = useState('5');
    const [weight, setWeight] = useState("200");
    const [weightGoal, setWeightGoal] = useState("200");
    const [timeFrame, setTimeFrame] = useState("8");
    const [age, setAge] = useState("21");
    const [gender, setGender] = useState('male');
    const [activity_level, setActivity_Level] = useState("1");

    const [cm, setCm] = useState('170');
    const [kg, setKg] = useState('62');

    const [imperialMeasurement, setImperialMeasurement] = useState(true);

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] =  useState(false);
    const [formError, setFormError] = useState<string | null>(null);



    const navigate = useNavigate();

    const getBodyDetails = async() => {
        setLoading(true);

        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_ROUTE}/users/body_details`, 
                {
                    headers: {
                        'Authorization' : `Bearer ${token}`
                    }
                }
            );

            const data = res.data.data;


            let f = '';
            let i = '';
            if(data.measurement_pref == 'imperial') {
                [f, i] = data.height.split("'");
                setFeet(f === '-1' ? '5' : f);
                setInches(i === '-1' ? '6' : i);
                setWeight(String(data.weight) === '-1' ? '200' : String(data.weight));
                // Set metric data when loading
                setCm(String(feetToCm(Number(f), Number(i))));
                setKg(String(lbsToKg(data.weight)))
            } else {
                setCm(String(data.height));
                setKg(String(data.weight))
                // Set Feet, inches and weight to be proper data when loading
                const fString = cmToFeetString(data.height);
                [f, i] = fString.split("'");
                setFeet(f);
                setInches(i);
                setWeight(String(kgToLbs(data.weight)));
            }
            // Should not be used to calculate if above since react state doesn't update in time to operate
            setImperialMeasurement(data.measurement_pref == 'imperial' ? true : false);
            // If values have not been set make sure to set valid values
            setAge(String(data.age) === '-1' ? '21' : String(data.age));
            setGender(String(data.gender) === 'none' ? 'male' : String(data.gender));
            setActivity_Level(String(data.activity_level) === '-1' ? '1' : String(data.activity_level));
            setWeightGoal(String(data.weight_goal));
            setTimeFrame(String(Math.round(data.time_frame) / 30));

            setLoading(false);
        } catch(err) {
            setLoading(false);
        }
    }

    const switchMeasurement = () => {
        if(imperialMeasurement) {
            setKg(String(lbsToKg(Number(weight))));
            setCm(String(feetToCm(Number(feet), Number(inches))));
            setWeightGoal(prev => String(lbsToKg(Number(prev))));
        } else {
            setWeight(String(kgToLbs(Number(kg))));
            const [f, i] = cmToFeetString(Number(cm)).split("'");
            // Used if user inputs 12 for inches to add one to feet
            if (Number(i) >= Number('12')) {
                setInches('0');
                setFeet(String(Number(f + 1)));
            }
            setFeet(f);
            setInches(i);
            setWeightGoal(prev => String(kgToLbs(Number(prev))));
        }
        setImperialMeasurement(prev => !prev);
    }

    useEffect(() => {
        getBodyDetails();
    }, [])

    const setBodyDetails = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);

        const token = localStorage.getItem('token');

        let mHeight = '';
        let kgWeight = -1;

        if(imperialMeasurement) {
            mHeight = `${feet}'${inches}`
            kgWeight = Number(weight) || 200;
        } else {
            mHeight = cm;
            kgWeight = Number(kg);
        }

        const numActivity_level = Number(activity_level || '1');

        try {
            await axios.put(
                `${import.meta.env.VITE_API_BASE_ROUTE}/users/body_details`,
                {
                    height: mHeight,
                    weight: kgWeight,
                    age: age !== '' ? Number(age) : 21,
                    gender: gender !== '' ? gender : 'male',
                    activity_level: numActivity_level,
                    measurement_pref: imperialMeasurement ? 'imperial' : 'metric',
                    calorie_change: (getCalorieChange(Number(weight), Number(weightGoal), Number(timeFrame) * 30, imperialMeasurement ? 'imperial' : 'metric')),
                    timeFrame: Number(timeFrame) * 30,      // To get value in days
                    weight_goal: Number(weightGoal)
                },{
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                },
            );

            setSubmitting(false);
            navigate('/app');
        } catch (err : any) {
        console.error(`Frontend Could Not Process Set Body Details : ${err.response?.data?.message}`);
        setSubmitting(false);
      }
    }

    return (
        <div className="w-fit bg-white/80 backdrop-blur-md rounded-2xl border border-white/60 shadow[0_8px_40px_rgba(0,0,0,0.08)
            px-8 py-10 drop-shadow-2xl">
            <form onSubmit={setBodyDetails} className="space-y-4">
                <div className="flex w-full justify-between items-center pb-3">
                    <div className="text-md font-semibold">
                        Measurement
                    </div>
                    <button 
                        type="button"
                        className="px-8 mt-1 py-3.5 bg-color-primary text-white text-sm font-medium rounded-lg hover-bg-color-primary active:scale-[0.99] 
                        transition-all duration-150 disabled:opacity-60 flex items-center justify-center gap-2 hover:"
                        onClick={switchMeasurement}  
                        >
                        {imperialMeasurement ? 'Imperial' : 'Metric'}
                    </button>
                </div>  
            
                {imperialMeasurement ? (
                    <>
                        <div className="flex gap-2 justify-between">
                            <FormField
                                id='feet'
                                label='Feet'
                                type="number"
                                variant="number"
                                value={feet}
                                onChange={setFeet}
                                min='0'
                                max='8'
                                placeholder="5"
                                required
                            />
                            <FormField
                                id='inches'
                                label='Inches'
                                type="number"
                                variant="number"
                                value={inches}
                                onChange={setInches}
                                min="0"
                                max='12'
                                placeholder="10"
                                required
                            />
                        </div>
                </>
            ) : (
                <>
                    <FormField
                        id='cm'
                        label='Centimeters'
                        type="number"
                        variant="number"
                        value={String(Math.round(Number(cm)))}
                        onChange={setCm}
                        min='0'
                        max='300'
                        placeholder="170"
                        required
                    />
                </>
            )
            }
            {/* Weight */}
                <FormField
                    id='weight'
                    label='Weight'
                    type="number"
                    variant="number"
                    value={imperialMeasurement ? String(Math.round(Number(weight)))  :  String(Math.round(Number(kg)))}
                    onChange={imperialMeasurement ? setWeight : setKg}
                    min="0"
                    max="900"
                    placeholder="62"
                    required
                />
                {/* Weight Goals */}
                <FormField 
                    id='weight_goal'
                    label='Weight Goal'
                    type="number"
                    variant="number"
                    value={String(Math.round(Number(weightGoal)))}
                    onChange={setWeightGoal}
                    min="0"
                    max={`${imperialMeasurement ? '2000' : '900'}`}
                    placeholder={`${imperialMeasurement ? '200' : '62'}`}
                    required
                />                        
                {/* TimeFrame to Lose  */}
                <FormField 
                    id='time_frame'
                    label='Time Frame'
                    type="dateDuration"
                    variant="dateDuration"
                    value={String(timeFrame)}
                    onChange={setTimeFrame}
                    min="0"
                    max="120"
                    placeholder="6"
                    required
                />
                {/* Age */}
                <FormField
                    id='age'
                    label='Age'
                    type="number"
                    variant="number"
                    value={age}
                    onChange={setAge}
                    min="0"
                    max="110"
                    placeholder="21"
                    required
                />

                {/* Gender */}
                <FormField
                    id='gender'
                    label='gender'
                    type="text"
                    variant="select"
                    options={[
                        { label: "Male", value: "male"},
                        { label: "Female", value: "female" },
                    ]}
                    value={gender}
                    onChange={setGender}
                    placeholder="male"
                    required
                />

                {/* Activity Level */}
                    <FormField
                        id='activity_level'
                        label='Activity Level'
                        type="text"
                        variant="select"
                        options={[
                            { label: "Sedentary (No Excersize. Little movement)", value: "1"},
                            { label: "Light Active (Excersize 1-3 days/week)", value: "2"},
                            { label: "Moderately Active (Excersize 3-5 days/week)", value: "3"},
                            { label: "Very Active (Excersize 6-7 days/week)", value: "4"},
                            { label: "Extremely Active (Very Heavy Excersize)", value: "5"},
                        ]}
                        value={activity_level}
                        onChange={setActivity_Level}
                        placeholder="Sedentary (No Excersize. Little movement)"
                        required
                    />
                <div className="flex flex-row gap-x-3">
                    {/* Cancel */}
                        <button
                            type="button"
                            onClick={() => navigate('/app')}
                            className="w-full button-traditional-danger rounded-xl flex-1"
                        >
                            Cancel
                        </button>
                    {/* Submit */}
                        <button
                        type="submit"
                        disabled={submitting}
                        className="w-full mt-1 py-3.5 button-traditional text-sm font-medium rounded-lg 
                        disabled:opacity-60 flex items-center justify-center flex-2"
                        >
                        {submitting ? (
                            <>
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth='3' />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Submiting Details...
                            </>
                        ) : (
                            "Submit"
                        )}
                        </button>
                    </div>
            </form>
        </div>
    );
}
