"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function PasswordInput({ className = "", ...props }: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    const toggleVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="relative w-full">
            <input
                type={showPassword ? "text" : "password"}
                className={`pr-11 ${className}`}
                {...props}
            />
            <button
                type="button"
                onClick={toggleVisibility}
                className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
        </div>
    );
}
