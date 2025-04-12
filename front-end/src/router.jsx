import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import HomePage from './Pages/HomePage';
import AboutPage from './Pages/AboutPage';
import FindSetPage from './Pages/FindSetPage';
import LoginPage from './Pages/LoginPage';
import MyPage from './Pages/MyPage';
import RegisterPage from './Pages/RegisterPage';
import ErrorPage from './Pages/ErrorPage';
import NotFoundPage from './Pages/NotFoundPage';
import ManageUserPage from './Pages/ManageUserPage'
import { confirmUser } from './utilities';


const router = createBrowserRouter([
    {
        path:'/',
        element: <App />,
        loader: confirmUser,
        children: [

            {
                index: true,
                element: <HomePage />,
            },
            {
                path: '/AboutPage',
                element: <AboutPage />,
            },
            {
                path: '/FindSetPage',
                element: <FindSetPage />
            },
            {
                path: '/LoginPage',
                element: <LoginPage />
            },
            {
                path: '/MyPage',
                element: <MyPage />
            },
            {
                path: '/ManageUSerPage',
                element: <ManageUserPage />
            },
            {
                path: "*",
                element: <NotFoundPage />,
            },
        ],
        errorElement: <ErrorPage />,
    }
]);

export default router