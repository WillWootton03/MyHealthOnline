import { Outlet } from "react-router";
import Navbar from './Navbar';
import { UsersProvider } from "./context/UsersContext";

export default function Layout() {
    return (
        <div className="min-h-screen w-full flex flex-col items-stretch  relative page-bg-light">
            <UsersProvider>
                <Navbar />
                <Outlet />
            </UsersProvider>
        </div>
    );
}