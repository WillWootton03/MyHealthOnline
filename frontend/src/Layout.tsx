import { Outlet } from "react-router";
import Navbar from './Navbar';
import { UsersProvider } from "./context/UsersContext";

export default function Layout() {
    return (
        <>
            <UsersProvider>
                <Navbar />
                <Outlet />
            </UsersProvider>
        </>
    );
}