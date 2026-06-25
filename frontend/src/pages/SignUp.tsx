import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Heart } from 'lucide-react';
import { useNavigate } from "react-router";

import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formError, setFormError] = useState("");

  
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

      if (password !== verifyPassword) {
        setFormError('Passwords do not match');
        return;
      }

      setFormError("");

      try {
        setLoading(true);
        console.log('Attempting Sign Up');
        await axios.post(
          `${import.meta.env.VITE_API_BASE_ROUTE}/users`, 
          {
            email: email,
            name: name,
            password: password,
          }
        );

        console.log(`Frontend rerouting user to login after successful Sign Up`);
        // Redirect to Dashboard
        navigate('/login');
      } catch(err : any) {
        console.error(`Frontend Could Not Process Login : ${err.response?.data?.message}`);
        setLoading(false);
      }
  };

  return (
      <div
          className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#eaf6fd]"
      >
        {/* Card */}
        <div className="relative z-10 w-full max-w-sm mx-4 bg-white/80 backdrop-blur-md rounded-2xl border border-white/60 shadow[0_8px_40px_rgba(0,0,0,0.08)
                        px-8 py-10 drop-shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-11 h-11 rounded-full bg-[#6faaf7] flex items-center justify-center mb-4">
              <Heart className="w-5 h-5 text-white fill='white" />
            </div>
            {/* AppTitle */}
            <h1 className="text-black text-2xl font-medium"
                style={{ fontFamily: "'Raleway', serif"}}
            >
            My Health Online
            </h1>
            <p className="text-black/45 text-sm mt-1">Sign Up to start your journey</p>
          </div>

          {/* Form To Sign Up */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div>
                <label 
                    htmlFor="name"
                    className="block text-sm font-medium text-black/55 mb-1 tracking-widest uppercase"
                >
                    Full Name
                </label>
                <input 
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="John Doe"
                    required
                    className="w-full px-4 py-3 text-sm bg-gray-100 text-black placeholder-black/25 rounded-lg outline-none transition-all duration-150"
                    style={{
                        border: focusedField === 'name' ? "1.5px solid #32a5f1" : "1.5px solid transparent",
                        boxShadow: focusedField === 'name' ? "0 0 0 3px rgba(124, 77, 186, 0.12" : "none",
                    }}
                />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-black/55 mb-1.5 tracking-wide uppercase"
              >
                Email
              </label>
              <input
                id='email'
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="example@example.com" 
                required
                className="w-full px-4 py-3 text-sm bg-gray-100 text-black placeholder-black/25 rounded-lg outline-none transition-all duration-150" 
                style={{
                  border: focusedField === 'email' ? "1.5px solid #32a5f1" : "1.5px solid transparent",
                  boxShadow: focusedField === 'email' ? "0 0 0 3px rgba(124, 77, 186, 0.12" : "none",
                }}
              />
            </div> 

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-black/55 tracking-wide uppercase hover:pointer-none"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-4 pr-11 text-sm bg-gray-50 text-black placeholder-black/25 rounded-lg outline-none transition-all duration-150"
                  style={{
                    border: "1.5px solid",
                    borderColor: focusedField === 'password' ? "32a5f1" : "transparent",
                    boxShadow: focusedField === 'email' ? "0 0 0 3px rgba(124, 77, 186, 0.12" : "none",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/35 hover:text-black/60 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Verify Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="verifyPassword"
                  className="block text-xs font-medium text-black/55 tracking-wide uppercase hover:pointer-none"
                >
                  Verify Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="verifyPassword"
                  type={showPassword ? "text" : "password"}
                  value={verifyPassword}
                  onChange={(e) => setVerifyPassword(e.target.value)}
                  onFocus={() => setFocusedField('verifyPassword')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-4 pr-11 text-sm bg-gray-50 text-black placeholder-black/25 rounded-lg outline-none transition-all duration-150"
                  style={{
                    border: "1.5px solid",
                    borderColor: verifyPassword.length > 0 && verifyPassword !== password ? 'red' : focusedField === 'verifyPassword' ? '#32a5f1' : 'transparent',
                    boxShadow: focusedField === 'verifyPassword' ? "0 0 0 3px rgba(124, 77, 186, 0.12" : "none",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/35 hover:text-black/60 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Form Errors */}
            <div className="relative flex flex-col items-center">
              {formError && (
                <div className="absoulte bottom-full mb-2 px-3 py-2 text-sm text-white bg-red-500/80 rounded-md shadow-md whitespace-nowrap transition-all duration-150">
                  {formError}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1 py-3.5 bg-[#54a6bb] text-white text-sm font-medium rounded-lg hover:bg-[#0d4c64] active:scale-[0.99] transition-all duration-150
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
            </div>
          </form>

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
        </div>
      </div>
  );
}