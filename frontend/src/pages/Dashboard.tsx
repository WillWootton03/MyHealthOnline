import axios from "axios";
import { useEffect, useState } from "react";
import { type User } from '../context/UsersContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_ROUTE;

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');

      if(!token) return;
      try {
        const res = await axios.get(`${API_BASE_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Data.Data gets the actual object of user res.data contains the success message as well
        setUser(res.data.data);

      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error(`Axios Error:  ${err}`);
        } else {
          console.error(`Normal Error ${err}`);
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#eaf6fd]">
      <div className="relative z-10 w-full max-w-sm mx-4 bg-white/80 backdrop-blur-md rounded-2xl border border-white/60 shadow[0_8px_40px_rgba(0,0,0,0.08)
                      px-8 py-10 drop-shadow-2xl">
        <div>
          <p>{user?.email}</p>
        </div>
      </div>
    </div>
  );
}