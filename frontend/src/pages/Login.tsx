import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Heart } from 'lucide-react';
import { useNavigate } from "react-router";

import axios from 'axios';
import WebBackground from "../components/WebBackground";
import FormField from "../components/FormField";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  
  const navigate = useNavigate();

  const signUpRedirect = async () => {
    navigate('/signUp');
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();


      try {
        setLoading(true);
        console.log('Attempting Login');
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_ROUTE}/users/login`, 
          {
            email: email,
            password: password,
          }
        );
        // res.data returns success and data, so token is stored in data.data
        const token = res.data.data.token;

        // Save token in browser storage
        localStorage.setItem('token', token);

        console.log(`Frontend rerouting user to dashboard following successful login`);
        // Redirect to Dashboard
        navigate('/app');
      } catch(err : any) {
        console.error(`Frontend Could Not Process Login : ${err.response?.data?.message}`);
        setLoading(false);
      }
  };


  return (
        <WebBackground>
        {/* Card */}
        <div className="relative z-10 w-full max-w-sm mx-4 bg-white/80 backdrop-blur-md rounded-2xl border border-white/60 shadow[0_8px_40px_rgba(0,0,0,0.08)
                        px-8 py-10 drop-shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-11 h-11 rounded-full bg-[#6faaf7] flex items-center justify-center mb-4">
              <Heart className="w-5 h-5 text-white fill='white" />
            </div>
            {/* AppTitle */}
            <h1 className="text-black text-2xl font-medium">
            My Health Online
            </h1>
            <p className="text-black/45 text-sm mt-1">Sign in to continue</p>
          </div>

          {/* Form To Log In */}
          <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <FormField
                id='email'
                type="email"
                label="Email"
                value={email}
                onChange={setEmail}
                placeholder="example@example.com" 
                required
                />
                {/* Password */}
                <FormField
                    id="password"
                    type="text"
                    variant="logged_password"
                    label="Password"
                    value={password}
                    onChange={setPassword}
                    placeholder="••••••••"
                    required
                />
            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1 py-3.5 bg-[#54a6bb] text-white text-sm font-medium rounded-lg hover:bg-[#0d4c64] active:scale-[0.99] transition-all duration-150
                        disabled:opacity-60 flex items-center justify-center gap-2 hover:"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth='3' />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-black/40">
              Dont&apos;t have an account?{" "}
            <button
              type="button"
              className="text-[#4d89ba] font-medium hover:text-[#294963] transition-colors hover:"
              onClick={signUpRedirect}
            >
              Sign Up
            </button>
          </p>
        </div>
      </WebBackground>
  );
}