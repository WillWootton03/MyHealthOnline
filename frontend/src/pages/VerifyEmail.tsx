import { useEffect } from "react"
import { useUser } from "../context/UsersContext";
import { useNavigate } from "react-router";

export default function VerifyEmail() {
    const { verifyEmail } = useUser();

    useEffect(() => {
        verifyEmail();
    }, []);

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden page-bg-light">
            <p>Verified Email</p>
            <a href="/app">Head to Dashboard</a>
        </div>

    )
}