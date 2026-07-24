import { Outlet } from "react-router";
import { WorkoutsProvider } from "./context/WorkoutsContext";
import { useParams } from "react-router";

export function WorkoutLayout() {
    const { log_id } = useParams();
    return (
        <WorkoutsProvider log_id={log_id ?? ''}>
            <Outlet />
        </WorkoutsProvider>
    );
}