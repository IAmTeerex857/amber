import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';

// Per-route icon colors for the sidebar
const iconColorMap: Record<string, string> = {
  dashboard: 'text-blue-600',
  campaigns: 'text-sky-600',
  'my-tasks': 'text-purple-600',
  chapters: 'text-yellow-600',
  ambassadors: 'text-green-600',
  communities: 'text-pink-600',
  funding: 'text-orange-600',
  leaderboard: 'text-indigo-600',
  rewards: 'text-amber-600',
  payments: 'text-emerald-600',
  profile: 'text-teal-600',

  'ambassador-onboarding': 'text-green-600',
  'fund-distribution': 'text-orange-600', 
  'funding-dashboard': 'text-cyan-600',
  'rewards-management': 'text-amber-600',
  // Organization Request icons
  'organization-requests': 'text-violet-600',
  'membership-requests': 'text-violet-600',
  'request-organization': 'text-blue-600',
  'request-status': 'text-blue-600',
  'pending-requests': 'text-yellow-600',
  // Monthly Reporting System icons
  'reports': 'text-indigo-600',
  'monthly-reports': 'text-indigo-600',
  'report-history': 'text-gray-600',
  'report-dashboard': 'text-purple-600',
  'cumulative-reports': 'text-blue-700',
  'reports-analytics': 'text-cyan-600',
  'report-review': 'text-orange-600',
};

interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

interface SidebarProps {
  navigation: NavigationItem[];
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  navigation, 
  sidebarOpen, 
  setSidebarOpen 
}) => {
  const location = useLocation();

  return (
    <div className={`
      fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
    `}>
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 flex items-center justify-center">
            <img 
              src="/Amber Icon purple.svg" 
              alt="Amber Logo" 
              className="h-8 w-8"
            />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Amber</h1>
        </div>
        
        <button
          className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                ${isActive
                  ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <Icon className={`h-5 w-5 ${iconColorMap[item.id] ?? (isActive ? 'text-blue-600' : 'text-gray-500')}`} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Help section removed as requested */}
    </div>
  );
};

export default Sidebar;