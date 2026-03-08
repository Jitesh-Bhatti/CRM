import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { ClientsPage } from '../pages/clients/ClientsPage';

// 1. Import the new Leads page
import { ClientDetailsPage } from '../pages/clients/ClientDetailsPage'; 
import { LeadsPage } from '../pages/leads/LeadsPage';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'clients', element: <ClientsPage /> },
          // 2. Add the dynamic route here! The :id is a URL parameter
          { path: 'clients/:id', element: <ClientDetailsPage /> }, 
          { path: 'leads', element: <LeadsPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> }
]);