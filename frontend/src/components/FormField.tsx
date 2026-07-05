import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

type FieldVariant = "text" | "number" | "select" | 'height' | 'weight';

interface FormFieldProps {
    id: string;
    label: string;
    value: string;
    type: string;
    onChange: (value: string) => void;
    placeholder: string;
    min?: string;
    max?: string;
    required?: boolean;
    variant?: FieldVariant;
    options?: { label: string, value: string | number}[];
}

export default function FormField ({ 
    id,
    label,
    value,
    type,
    min = '0',
    max = '1000',
    onChange,
    placeholder = "",
    variant = 'text',
    required = false,
    options,
 } : FormFieldProps) {
    const [focused, setFocused] = useState(false);

    return (
        <div>
            <label 
                htmlFor={id}
                className="block text-sm font-medium text-black/55 mb-1 tracking-widest uppercase"
            >
                {label}
            </label>
            {variant === 'text' && (
            <input 
                id={id}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={placeholder}
                required={required}
                className="w-full px-4 py-3 text-sm bg-gray-100 text-black placeholder-black/25 rounded-lg outline-none transition-all duration-150"
                style={{
                    border: focused ? "1.5px solid #32a5f1" : "1.5px solid transparent",
                    boxShadow: focused ? "0 0 0 3px rgba(124, 77, 186, 0.12" : "none",
                }}
            />
        )}
        {variant === 'select' && (
            <select 
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                required={required}
                className="w-full px-4 py-3 text-sm bg-gray-100 text-black rounded-lg outline-none transition-all duration-150"
            >
                {options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        )}
        { variant === 'number' && (
            <input
                id={id}
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                required={required}
                className="w-full px-4 py-3 text-sm bg-gray-100 text-black rounded-lg outline-none transition-all duration-150"
                min={min}
                max={max}
            />
        )}
    </div>
    );
}