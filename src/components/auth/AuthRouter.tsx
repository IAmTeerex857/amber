import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AuthForm from './AuthForm';
import OrganizationRequestForm from './OrganizationRequestForm';
import PendingApprovalScreen from './PendingApprovalScreen';
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

  // Organization request flow for presidents and ambassadors
  if (user.role === 'president' || user.role === 'ambassador') {
    // If user doesn't have organization access yet
    if (!user.organizationId) {
      // Check organization request status
      const requestStatus = user.organizationRequestStatus || 'none';
      
      switch (requestStatus) {
        case 'none':
        case 'rejected':
          // Show organization request form
          return (
            <OrganizationRequestForm 
              onSuccess={() => {
                // Request submitted successfully - AuthContext state will update automatically
                // No need to reload, React will re-render when user state changes
              }}
            />
          );
          
        case 'pending':
        case 'under_review':
          // Show pending approval screen
          return (
            <PendingApprovalScreen 
              onEditRequest={() => {
                // Allow editing request (would need to implement this)
                console.log('Edit request functionality');
              }}
              onWithdrawRequest={() => {
                // Allow withdrawing request (would need to implement this)
                console.log('Withdraw request functionality');
              }}
            />
          );
          
        case 'approved':
          // Request approved, but user not yet onboarded - proceed to onboarding
          if (!user.isOnboarded) {
            if (user.role === 'president') {
              return <AmbassadorRegistration />; // Presidents use similar onboarding
            } else if (user.role === 'ambassador') {
              return <AmbassadorRegistration />;
            }
          }
          break;
          
        default:
          // Fallback to request form
          return (
            <OrganizationRequestForm 
              onSuccess={() => {
                // Request submitted successfully - AuthContext state will update automatically
              }}
            />
          );
      }
    }
  }

  // Standard onboarding flow for users with organization access
  if (!user.isOnboarded) {
    if (user.role === 'organization') {
      return <OrganizationOnboarding />;
    } else if (user.role === 'president') {
      return <AmbassadorRegistration />; // Presidents use similar onboarding to ambassadors for now
    } else if (user.role === 'ambassador') {
      return <AmbassadorRegistration />;
    }
  }

  // User is authenticated, has organization access (if needed), and is onboarded - show main app
  return <>{children}</>;
};

export default AuthRouter;
