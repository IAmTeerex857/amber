import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AuthRouter from './components/auth/AuthRouter';
import Layout from './components/Layout';
import { routes } from './router/routes';

// Create router with all defined routes
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthRouter>
        <Layout />
      </AuthRouter>
    ),
    children: routes,
  },
]);

// Main App component with React Router and authentication
function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;