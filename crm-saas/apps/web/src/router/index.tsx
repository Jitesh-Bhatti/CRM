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
import { ProjectsPage } from '../pages/projects/ProjectsPage';
import { ProjectDetailsPage } from '../pages/projects/ProjectDetailsPage';
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
          { path: 'clients/:id', element: <ClientDetailsPage /> }, 
          { path: 'leads', element: <LeadsPage /> },
          
          { path: 'projects', element: <ProjectsPage /> }, 
          // 2. THIS IS THE MISSING LINE! It must go right here:
          { path: 'projects/:id', element: <ProjectDetailsPage /> }, 
        ],
      },
    ],
  },
  // This is the safety net that is catching you right now:
  { path: '*', element: <Navigate to="/" replace /> }
]);