import { ChevronDown, Heart, User, Settings, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useUser } from "./context/UsersContext";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const { user, fetchUser, logoutUser } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  fetchUser();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return() => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="bg-[#f1f7ff] backdrop-blur-sm border-b border-[#7a9dbd] sticky top-0 z-20">
      <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* Page Navigation */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#2d557a] flex items-center justify-center">
            <Heart className="w-3.5 h-3.5 text-white" fill="white" />
          </div>
          <a
            className="text-black text-lg font-medium"
            style={{ fontFamily: "'Raleway', serif"}}
            href="/app"
          >
            My Health Online
          </a>
        </div>

        {/* User Menu Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover-light-bg-color transition-colors" >
              <div className="w-7 h-7 rounded-full bg-color-primary flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  {
                    !user?.name 
                    ? ':)' 
                    : user?.name.split(' ').length  > 1 
                    ? user?.name.split(' ')[1].charAt(0) 
                    : user?.name.charAt(0).toUpperCase()
                  }
                </span>
              </div>
              <span className="text-sm text-black/70 hidden sm:block font-medium">
              {
                !user?.name
                ? 'User'
                // Sets first name to title case by using toUpperCase on the first char of first name, if first name length > 11 char slice off end to prevent weird UI
                : `${user?.name.split(' ')[0].charAt(0).toUpperCase()}${user?.name.split(' ')[0].length <= 10 
                                                                        ? `${user?.name.split(' ')[0].slice(1)}` 
                                                                        : `${user?.name.split(' ')[0].slice(1, 10)}...`}`
              }
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-white/35 transition-transform duration-150 ${menuOpen ? "rotate-180" : ""}`} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-[#d5e4f5] shadow-[0_8px_24px_rgba(0,0,0,0.10) overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-[#eaf1fb]">
                  <div className="text-sm font-semibold text-black">{
                        // Verifies user.name
                        !user?.name 
                          ? "User" 
                          // Splices user.name if name too long, else puts the whole name
                          : user?.name.length <= 30 
                            ? user?.name 
                            : `${user?.name.slice(0, 30)}...` 
                      }
                  </div>
                  <div className="text-xs text-black/40 mt-0.5">
                    {
                      // Verifies user.email
                      !user?.email
                        ? "user@email.com"
                        : user?.email.length <= 50
                          ? user?.email
                          : `${user?.email.slice(0, 50)}`
                    }
                  </div>
                </div>
                <div className="py-1">
                  <button 
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-black/70 hover:bg-[#f0f5ff] hover:text-black transition-colors text-left">
                    <User className="w-4 h-4 text-color-primary" />
                      Profile
                  </button>
                  <button 
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-black/70 hover:bg-[#f0f5ff] hover:text-black transition-colors text-left">
                    <Settings className="w-4 h-4 text-color-primary" />
                      Settings
                  </button>
                </div>
                <div className="border-t border-[#eaf1fb] py-1">
                  <button
                    onClick={logoutUser}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-color-primary hover:bg-[#fda7a7]/20
                               hover-text-color-primary transistion-colors text-left"
                    >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
  </div>
  );
}