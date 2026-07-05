import { useEffect, useState } from "react"
import { useUser } from "../context/UsersContext";
import { useNavigate } from "react-router";

export default function VerifyEmail() {
    const { verifyEmail } = useUser();
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const verify = async () => {
            try {
                setLoading(true);
                await verifyEmail();
                setLoading(false);
                navigate('/app')
            } catch(err) {
                console.error('An error occured when verifying email')
            }
        }

        verify();
    }, []);

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden page-bg-light">
            {/* Card */}
            <div className="relative z-10 w-full max-w-sm mx-4 bg-white/80 backdrop-blur-md rounded-2xl border border-white/60 shadow[0_8px_40px_rgba(0,0,0,0.08)
                            px-8 py-10 drop-shadow-2xl justify-items-center">
                {loading && (
                    <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill='none'>
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth='3' />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        <h1 className="items-center text-black/70 font-bold text-">
                        Verifiyng Email
                        </h1>
                    </>
                )}
            </div>
        </div>

    )
}