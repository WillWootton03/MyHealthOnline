import { createBrowserRouter } from 'react-router';
import Login  from './pages/Login';
import Dashboard from './pages/Dashboard';
import SignUp from './pages/SignUp';
import Layout from './Layout';
import Landing from './pages/Landing.tsx';
import VerifyEmail from './pages/VerifyEmail.tsx';
import UserSettings from './pages/UserSettings.tsx';
import WorkoutPage from './pages/Workout.tsx';

export const router = createBrowserRouter([
    { path: '/', Component: Landing},
    {
        path: '/app',
        Component: Layout,
        children: [
            { index: true, Component: Dashboard },
            { path: 'verifyEmail', Component: VerifyEmail},
            { path: 'dashboard', Component : Dashboard},
            { path: 'settings', Component : UserSettings},
            { path: 'workout', Component: WorkoutPage},
        ]
    },
    { path: '/login', Component: Login },
    { path: '/signUp', Component: SignUp},
]);