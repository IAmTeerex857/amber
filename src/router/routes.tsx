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
import ChapterManagement from '../components/ChapterManagement';
import PresidentOnboarding from '../components/PresidentOnboarding';
import FundingDashboard from '../components/FundingDashboard';
import PresidentDashboard from '../components/PresidentDashboard';
import AmbassadorOnboardingSystem from '../components/AmbassadorOnboardingSystem';
import Communities from '../components/Communities';
import AmbassadorProfile from '../components/AmbassadorProfile';

import AmbassadorTaskLogging from '../components/AmbassadorTaskLogging';
import PresidentFundDistribution from '../components/PresidentFundDistribution';

// Import Organization Request components
import OrganizationRequestForm from '../components/auth/OrganizationRequestForm';
import PendingApprovalScreen from '../components/auth/PendingApprovalScreen';
import OrganizationRequestsPanel from '../components/management/OrganizationRequestsPanel';

// Import Monthly Reporting System components
import AmbassadorReportsPage from '../components/reports/AmbassadorReportsPage';
import ReportPreview from '../components/reports/ReportPreview';
import PresidentReportDashboard from '../components/reports/PresidentReportDashboard';
import CumulativeReportView from '../components/reports/CumulativeReportView';

// Route guard component
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('organization' | 'president' | 'ambassador')[];
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
    } else if (user.role === 'president') {
      return <AmbassadorRegistration />; // Presidents use similar onboarding
    } else if (user.role === 'ambassador') {
      return <AmbassadorRegistration />;
    }
  }

  return <>{children}</>;
};

// Dashboard component that renders based on user role
const RoleDashboard: React.FC = () => {
  const { user } = useAuth();
  
  if (user?.role === 'ambassador') {
    return <AmbassadorDashboard />;
  } else if (user?.role === 'president') {
    return <PresidentDashboard />; // Presidents get their own dashboard
  } else {
    return <Dashboard />; // Organizations
  }
};

// Profile component that renders based on user role
const RoleProfile: React.FC = () => {
  const { user } = useAuth();
  
  if (user?.role === 'ambassador') {
    return <AmbassadorProfile />; // Enhanced profile for ambassadors
  } else {
    return <ProfilePage />; // Standard profile for orgs/presidents
  }
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

// Report Preview wrapper that loads data from route params
const ReportPreviewWrapper: React.FC = () => {
  // Mock report data - in real implementation, load from useParams and API
  const mockReportData = {
    reportingPeriod: {
      month: 2,
      year: 2024,
      startDate: '2024-03-01',
      endDate: '2024-03-31'
    },
    summary: {
      executiveSummary: 'March was a productive month with strong engagement across all initiatives.',
      keyAchievements: ['Completed major project', 'Increased engagement by 25%'],
      challenges: ['Weather delays'],
      nextMonthGoals: ['Launch new campaign']
    },
    activities: {
      contentCreation: {
        description: 'Created engaging content across platforms',
        count: 15,
        mediaFiles: [],
        links: []
      },
      events: {
        description: 'Hosted community events',
        eventDetails: [],
        totalAttendees: 150,
        totalBudget: 500
      },
      communityEngagement: {
        description: 'Active community participation',
        discordActivity: 'Daily engagement in channels',
        socialMediaActivity: 'Regular posting and interaction',
        partnershipWork: 'Collaborated with partners'
      },
      other: {
        description: 'Additional activities',
        customActivities: []
      }
    },
    impact: {
      quantitativeMetrics: {
        newCommunityMembers: 50,
        socialMediaReach: 10000,
        contentEngagement: 850,
        eventsHosted: 2
      },
      qualitativeImpact: 'Strong positive community response',
      testimonials: []
    },
    expenses: {
      totalAmount: 500,
      breakdown: []
    },
    feedback: {
      challengesFaced: 'Some weather-related delays',
      supportNeeded: 'Additional resources for events',
      suggestions: 'Consider indoor backup venues'
    }
  };

  return (
    <ReportPreview 
      reportData={mockReportData}
      authorName="Ambassador Name"
      authorEmail="ambassador@email.com"
      organizationName="Stellar Development Foundation"
    />
  );
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
      <ProtectedRoute allowedRoles={['organization', 'president']}>
        <CampaignsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/chapters',
    element: (
      <ProtectedRoute allowedRoles={['organization']}>
        <ChapterManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: '/president-onboarding',
    element: (
      <ProtectedRoute allowedRoles={['organization']}>
        <PresidentOnboarding />
      </ProtectedRoute>
    ),
  },
  {
    path: '/funding-dashboard',
    element: (
      <ProtectedRoute allowedRoles={['organization']}>
        <FundingDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/ambassador-onboarding',
    element: (
      <ProtectedRoute allowedRoles={['president']}>
        <AmbassadorOnboardingSystem />
      </ProtectedRoute>
    ),
  },
  {
    path: '/fund-distribution',
    element: (
      <ProtectedRoute allowedRoles={['president']}>
        <PresidentFundDistribution />
      </ProtectedRoute>
    ),
  },
  {
    path: '/communities',
    element: (
      <ProtectedRoute allowedRoles={['organization', 'president', 'ambassador']}>
        <Communities />
      </ProtectedRoute>
    ),
  },

  {
    path: '/task-logging',
    element: (
      <ProtectedRoute allowedRoles={['ambassador']}>
        <AmbassadorTaskLogging />
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
        <RoleProfile />
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
  // Organization Request Routes
  {
    path: '/request-organization',
    element: (
      <ProtectedRoute allowedRoles={['president', 'ambassador']} requireOnboarded={false}>
        <OrganizationRequestForm />
      </ProtectedRoute>
    ),
  },
  {
    path: '/request-status',
    element: (
      <ProtectedRoute allowedRoles={['president', 'ambassador']} requireOnboarded={false}>
        <PendingApprovalScreen />
      </ProtectedRoute>
    ),
  },
  {
    path: '/organization-requests',
    element: (
      <ProtectedRoute allowedRoles={['organization']}>
        <OrganizationRequestsPanel />
      </ProtectedRoute>
    ),
  },
  {
    path: '/membership-requests',
    element: (
      <ProtectedRoute allowedRoles={['organization']}>
        <OrganizationRequestsPanel />
      </ProtectedRoute>
    ),
  },
  // Monthly Reporting System Routes
  {
    path: '/reports',
    element: (
      <ProtectedRoute allowedRoles={['ambassador']}>
        <AmbassadorReportsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/reports/edit/:reportId',
    element: (
      <ProtectedRoute allowedRoles={['ambassador']}>
        <AmbassadorReportsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/reports/preview/:reportId',
    element: (
      <ProtectedRoute allowedRoles={['ambassador']}>
        <ReportPreviewWrapper />
      </ProtectedRoute>
    ),
  },

  {
    path: '/reports/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['president']}>
        <PresidentReportDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/reports/review',
    element: (
      <ProtectedRoute allowedRoles={['president']}>
        <PresidentReportDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/reports/cumulative',
    element: (
      <ProtectedRoute allowedRoles={['president']}>
        <CumulativeReportView />
      </ProtectedRoute>
    ),
  },
  {
    path: '/reports/cumulative/:reportId',
    element: (
      <ProtectedRoute allowedRoles={['president', 'organization']}>
        <CumulativeReportView />
      </ProtectedRoute>
    ),
  },
  {
    path: '/reports/view/:reportId',
    element: (
      <ProtectedRoute allowedRoles={['president', 'ambassador']}>
        <ReportPreviewWrapper />
      </ProtectedRoute>
    ),
  },
  {
    path: '/monthly-reports',
    element: (
      <ProtectedRoute allowedRoles={['ambassador']}>
        <AmbassadorReportsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/submit-report',
    element: (
      <ProtectedRoute allowedRoles={['ambassador']}>
        <AmbassadorReportsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/report-dashboard',
    element: (
      <ProtectedRoute allowedRoles={['president']}>
        <PresidentReportDashboard />
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
