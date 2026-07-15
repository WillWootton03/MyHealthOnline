import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Heart } from 'lucide-react';
import { Form, useNavigate } from "react-router";
import BodyDetails from "../components/BodyDetails";

import axios from 'axios';
import FormField from "../components/FormField";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);


  
  const navigate = useNavigate();

  const signInRedirect = async () => {
    navigate('/login');
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Should never display, however good for a fallback just in case
      if(!email || !password || !name) {
        setFormError('Please fill out all required fields');
        return;
      }

      // Form error if passwords are not the same
      if (password !== verifyPassword) {
        setFormError('Passwords do not match');
        return;
      }

      setFormError("");

      try {
        setLoading(true);
        console.log('Attempting Sign Up');
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_ROUTE}/users`, 
          {
            email: email,
            name: name,
            password: password,
          }
        );

        // res.data returns success and data, so token is stored in data.data
        const token = res.data.data.token;

        // Save token in browser storage
        localStorage.setItem('token', token);

        setLoading(false);
        setIsSignedIn(true);
        
      } catch (err : any) {
        console.error(`Frontend Could Not Process Login : ${err.response?.data?.message}`);
        setLoading(false);
      }
  };

  return (
      <div
          className="min-h-screen w-full flex items-center justify-center relative overflow-hidden page-bg-light"
      >
        {/* Card */}
        <div className="relative z-10 w-full max-w-sm mx-4 bg-white/80 backdrop-blur-md rounded-2xl border border-white/60 shadow[0_8px_40px_rgba(0,0,0,0.08)]
                        px-8 py-10 drop-shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-11 h-11 rounded-full bg-color-primary flex items-center justify-center mb-4">
              <Heart className="w-5 h-5 text-white fill='white" />
            </div>
            {/* AppTitle */}
            <h1 className="text-black text-2xl font-medium">
            My Health Online
            </h1>
            <p className="text-black/45 text-sm mt-1">Sign Up to start your journey</p>
          </div>

          <div className="overflow-hidden">

            <div
              className={
                `flex w-[200%] transition-transform duration-500 ease-in-out ${isSignedIn ? "-translate-x-1/2" : "translate-x-0"}`
              }
            >

          {/* Form To Sign Up */}
          <div className="w-1/2">

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Name */}
                <FormField 
                  id="name"
                  label="Full Name"
                  type="text"
                  value={name}
                  onChange={setName}
                  placeholder="John Doe"
                  required
                />

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
                    type={"text"}
                    variant="password"
                    label="Password"
                    value={password}
                    onChange={setPassword}
                    placeholder="••••••••"
                    required
                />

                {/* Verify Password */}
                <FormField
                    id="verifyPassword"
                    type="text"
                    variant="password"
                    label="Verify Password"
                    value={verifyPassword}
                    onChange={setVerifyPassword}
                    placeholder="••••••••"
                    required
                />

                  {/* Form Errors */}
                  {formError && (
                    <div className="relative flex flex-col items-center">
                      <div className="absoulte bottom-full mb-2 px-3 py-2 text-sm text-white bg-red-500/80 rounded-md shadow-md whitespace-nowrap transition-all duration-150">
                        {formError}
                      </div>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-1 py-3.5 bg-color-primary text-white text-sm font-medium rounded-lg hover-bg-color-primary active:scale-[0.99] transition-all duration-150
                              disabled:opacity-60 flex items-center justify-center gap-2 hover:cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth='3' />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Signing Up...
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </button>
              </form>
          </div>

          {isSignedIn ? (
          <div className="w-1/2">
            <BodyDetails />
          </div>
          ) : 
            <>
            </>
          }
        </div>
      </div>

          
          {!isSignedIn && (
          <p className="mt-6 text-center text-sm text-black/40">
              Already have an account?{" "}
            <button
              type="button"
              className="text-[#4d89ba] font-medium hover:text-[#294963] transition-colors hover:cursor-pointer"
              onClick={signInRedirect}
            >
              Sign In
            </button>
          </p>
          )}
        </div>
      </div>
  );
}