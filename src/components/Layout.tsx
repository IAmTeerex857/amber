import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  Users, 
  Settings, 
  BarChart2, 
  Target, 
  Trophy,
  User,
  Building2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';

// Navigation configuration based on user role
const getNavigationForRole = (role: 'organization' | 'ambassador') => {
  if (role === 'ambassador') {
    return [
      { id: 'dashboard', name: 'Dashboard', icon: BarChart2, path: '/dashboard' },
      { id: 'my-tasks', name: 'My Tasks', icon: Target, path: '/my-tasks' },
      { id: 'leaderboard', name: 'Leaderboard', icon: Users, path: '/leaderboard' },
      { id: 'payments', name: 'Payments', icon: Trophy, path: '/payments' },
      { id: 'profile', name: 'Profile', icon: User, path: '/profile' },
      { id: 'settings', name: 'Settings', icon: Settings, path: '/settings' },
    ];
  }
  
  // Organization navigation
  return [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart2, path: '/dashboard' },
    { id: 'campaigns', name: 'Campaigns', icon: Target, path: '/campaigns' },
    { id: 'leaderboard', name: 'Leaderboard', icon: Users, path: '/leaderboard' },
    // Payment & Rewards System
    { id: 'rewards-management', name: 'Rewards Management', icon: Trophy, path: '/rewards-management' },
    // Unified Organization Management
    { id: 'organization-management', name: 'Organization Management', icon: Building2, path: '/organization-management' },
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
