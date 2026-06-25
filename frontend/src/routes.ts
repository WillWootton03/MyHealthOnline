import { createBrowserRouter } from 'react-router';
import Login  from './pages/Login';
import Dashboard from './pages/Dashboard';
import SignUp from './pages/SignUp';

export const router = createBrowserRouter([
    { path: '/', Component: Login},
    {
        path: '/app',
        children: [
            { index: true, Component: Dashboard },
        ]
    },
    { path: '/login', Component: Login },
    { path: 'signUp', Component: SignUp}
]);