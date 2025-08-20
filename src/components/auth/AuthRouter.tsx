import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AuthForm from './AuthForm';
import OrganizationOnboarding from '../OrganizationOnboarding';
import AmbassadorRegistration from '../AmbassadorRegistration';

interface AuthRouterProps {
  children: React.ReactNode;
}

const AuthRouter: React.FC<AuthRouterProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show auth form
  if (!user) {
    return <AuthForm />;
  }

  // If user is authenticated but not onboarded, show appropriate onboarding
  if (!user.isOnboarded) {
    if (user.role === 'organization') {
      return <OrganizationOnboarding />;
    } else if (user.role === 'president') {
      return <AmbassadorRegistration />; // Presidents use similar onboarding to ambassadors for now
    } else if (user.role === 'ambassador') {
      return <AmbassadorRegistration />;
    }
  }

  // User is authenticated and onboarded, show main app
  return <>{children}</>;
};

export default AuthRouter;
