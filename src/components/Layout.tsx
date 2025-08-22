import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  Users, 
  Settings, 
  BarChart2, 
  Target, 
  Trophy,
  User,
  Building2,
  Crown,
  MessageCircle,
  Wallet,
  UserPlus,
  FileText,
  DollarSign,
  CreditCard,
  Calendar,
  Shield,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';

// Navigation configuration based on user role
const getNavigationForRole = (role: 'organization' | 'president' | 'ambassador') => {
  if (role === 'ambassador') {
    return [
      { id: 'dashboard', name: 'Dashboard', icon: BarChart2, path: '/dashboard' },
      { id: 'my-tasks', name: 'My Tasks', icon: FileText, path: '/task-logging' },
      { id: 'fund-requests', name: 'Fund Requests', icon: DollarSign, path: '/fund-requests' },
      { id: 'communities', name: 'Communities', icon: MessageCircle, path: '/communities' },
      { id: 'leaderboard', name: 'Leaderboard', icon: Users, path: '/leaderboard' },
      { id: 'payments', name: 'Payments', icon: CreditCard, path: '/payments' },
      { id: 'profile', name: 'Profile', icon: User, path: '/profile' },
      { id: 'settings', name: 'Settings', icon: Settings, path: '/settings' }
    ];
  }

  if (role === 'president') {
    return [
      { id: 'dashboard', name: 'Dashboard', icon: BarChart2, path: '/dashboard' },
      { id: 'campaigns', name: 'Campaigns', icon: Target, path: '/campaigns' },
      { id: 'ambassador-onboarding', name: 'Ambassadors', icon: UserPlus, path: '/ambassador-onboarding' },
      { id: 'fund-distribution', name: 'Fund Distribution', icon: DollarSign, path: '/fund-distribution' },
      { id: 'communities', name: 'Communities', icon: MessageCircle, path: '/communities' },
      { id: 'leaderboard', name: 'Leaderboard', icon: Users, path: '/leaderboard' },
      { id: 'profile', name: 'Profile', icon: User, path: '/profile' },
      { id: 'settings', name: 'Settings', icon: Settings, path: '/settings' },
    ];
  }
  
  // Organization navigation
  return [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart2, path: '/dashboard' },
    { id: 'campaigns', name: 'Campaigns', icon: Target, path: '/campaigns' },
    { id: 'chapters', name: 'Chapter Management', icon: Crown, path: '/chapters' },
    { id: 'funding-dashboard', name: 'Funding Dashboard', icon: TrendingUp, path: '/funding-dashboard' },
    { id: 'leaderboard', name: 'Leaderboard', icon: Users, path: '/leaderboard' },
    { id: 'rewards-management', name: 'Rewards Management', icon: Trophy, path: '/rewards-management' },
    { id: 'profile', name: 'Profile', icon: User, path: '/profile' },
    { id: 'settings', name: 'Settings', icon: Settings, path: '/settings' },
  ];
};

const Layout: React.FC = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get navigation items based on user role
  const navigation = user ? getNavigationForRole(user.role) : [];

  return (
    <div className="relative min-h-screen flex bg-gray-100 overflow-hidden">
      <Sidebar 
        navigation={navigation}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1 w-full overflow-x-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto pt-16">
          <div className="py-6 min-h-[calc(100vh-4rem)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
