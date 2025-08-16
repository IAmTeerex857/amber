import React from 'react';
import { RouteObject } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Import all page components
import Dashboard from '../components/Dashboard';
import AmbassadorDashboard from '../components/AmbassadorDashboard';
import CampaignsPage from '../components/CampaignsPage';
import MyTasks from '../components/MyTasks';
import SettingsPanel from '../components/SettingsPanel';
import ContentReview from '../components/ContentReview';
import AmbassadorRegistration from '../components/AmbassadorRegistration';
import AmbassadorLeaderboard from '../components/AmbassadorLeaderboard';
import TaskAssignment from '../components/TaskAssignment';
import RewardsPage from '../components/RewardsPage';
import ProfilePage from '../components/ProfilePage';
import OrganizationOnboarding from '../components/OrganizationOnboarding';
import AmbassadorPayments from '../components/AmbassadorPayments';

// Import Payment & Rewards System components
import RewardsManagement from '../components/rewards/RewardsManagement';

import CountryRegionDashboards from '../components/rewards/CountryRegionDashboards';

// Import Hierarchical Role Management components
import OrganizationManagement from '../components/management/OrganizationManagement';

// Route guard component
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('organization' | 'ambassador')[];
  requireOnboarded?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
  requireOnboarded = true 
}) => {
  const { user } = useAuth();

  // Check if user has required role
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  // Check onboarding status
  if (requireOnboarded && user && !user.isOnboarded) {
    if (user.role === 'organization') {
      return <OrganizationOnboarding />;
    } else if (user.role === 'ambassador') {
      return <AmbassadorRegistration />;
    }
  }

  return <>{children}</>;
};

// Dashboard component that renders based on user role
const RoleDashboard: React.FC = () => {
  const { user } = useAuth();
  return user?.role === 'ambassador' ? <AmbassadorDashboard /> : <Dashboard />;
};

// Task Assignment with mock campaign (will be replaced with proper routing later)
const TaskAssignmentWrapper: React.FC = () => {
  const mockCampaign = {
    id: 'mock-campaign',
    name: 'Campaign Details',
    description: 'Select a campaign from the campaigns page to view details',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active' as const,
    budget: 5000,
    tasks: [],
    assignedSegments: [],
    okrs: [],
    ambassadors: []
  };
  return <TaskAssignment campaign={mockCampaign} />;
};

// Define all routes
export const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <RoleDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <RoleDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/campaigns',
    element: (
      <ProtectedRoute allowedRoles={['organization']}>
        <CampaignsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/campaigns/:campaignId',
    element: (
      <ProtectedRoute allowedRoles={['organization']}>
        <TaskAssignmentWrapper />
      </ProtectedRoute>
    ),
  },
  {
    path: '/my-tasks',
    element: (
      <ProtectedRoute allowedRoles={['ambassador']}>
        <MyTasks />
      </ProtectedRoute>
    ),
  },
  {
    path: '/leaderboard',
    element: (
      <ProtectedRoute>
        <AmbassadorLeaderboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/rewards',
    element: (
      <ProtectedRoute>
        <RewardsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/payments',
    element: (
      <ProtectedRoute allowedRoles={['ambassador']}>
        <AmbassadorPayments />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <SettingsPanel />
      </ProtectedRoute>
    ),
  },
  {
    path: '/content-review',
    element: (
      <ProtectedRoute allowedRoles={['organization']}>
        <ContentReview />
      </ProtectedRoute>
    ),
  },
  {
    path: '/task-assignment',
    element: (
      <ProtectedRoute allowedRoles={['organization']}>
        <TaskAssignmentWrapper />
      </ProtectedRoute>
    ),
  },
  {
    path: '/onboarding/ambassador',
    element: (
      <ProtectedRoute allowedRoles={['ambassador']} requireOnboarded={false}>
        <AmbassadorRegistration />
      </ProtectedRoute>
    ),
  },
  {
    path: '/onboarding/organization',
    element: (
      <ProtectedRoute allowedRoles={['organization']} requireOnboarded={false}>
        <OrganizationOnboarding />
      </ProtectedRoute>
    ),
  },
  // Payment & Rewards System Routes
  {
    path: '/rewards-management',
    element: (
      <ProtectedRoute allowedRoles={['organization']}>
        <RewardsManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: '/wallet-connection',
    element: (
      <ProtectedRoute allowedRoles={['ambassador']}>
        <AmbassadorPayments />
      </ProtectedRoute>
    ),
  },
  {
    path: '/off-chain-rewards',
    element: (
      <ProtectedRoute allowedRoles={['ambassador']}>
        <AmbassadorPayments />
      </ProtectedRoute>
    ),
  },
  {
    path: '/points-system',
    element: (
      <ProtectedRoute allowedRoles={['ambassador']}>
        <AmbassadorPayments />
      </ProtectedRoute>
    ),
  },
  {
    path: '/reward-pools',
    element: (
      <ProtectedRoute allowedRoles={['organization']}>
        <RewardsManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: '/regional-analytics',
    element: (
      <ProtectedRoute allowedRoles={['organization']}>
        <CountryRegionDashboards />
      </ProtectedRoute>
    ),
  },
  // Unified Organization Management Route
  {
    path: '/organization-management',
    element: (
      <ProtectedRoute allowedRoles={['organization']}>
        <OrganizationManagement />
      </ProtectedRoute>
    ),
  },
  // Legacy route redirects for backward compatibility
  {
    path: '/global-admin',
    element: (
      <ProtectedRoute allowedRoles={['organization']}>
        <OrganizationManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: '/country-head',
    element: (
      <ProtectedRoute allowedRoles={['organization']}>
        <OrganizationManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: '/regional-manager',
    element: (
      <ProtectedRoute allowedRoles={['organization']}>
        <OrganizationManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: '/role-management',
    element: (
      <ProtectedRoute allowedRoles={['organization']}>
        <OrganizationManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: '/regional-analytics',
    element: (
      <ProtectedRoute allowedRoles={['organization']}>
        <OrganizationManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600">The page you're looking for doesn't exist.</p>
        </div>
      </div>
    ),
  },
];

export { ProtectedRoute };
