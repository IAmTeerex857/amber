import React, { useState } from 'react';
import { Menu, Bell, Search, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
// OrganizationSwitcher import removed as requested

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const { user, logout, organizations } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Debug logging to understand why Organization Switcher isn't showing
  console.log('Header rendered with:', { 
    user, 
    orgCount: organizations?.length || 0,
    hasMultipleOrgs: organizations && organizations.length > 1,
    currentOrgId: user?.organizationId 
  });

  return (
    <div className="fixed top-0 right-0 left-0 lg:left-64 z-20 flex-shrink-0 flex h-16 bg-white shadow">
      <div className="flex-1 px-4 flex justify-between sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Search bar positioned to the left */}
        <div className="flex-grow-0 ml-8 sm:ml-12 my-auto">
          <div className="relative w-64 sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-1.5 border border-gray-200 rounded-full focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all text-sm bg-gray-50"
            />
          </div>
        </div>
        
        {/* Large flex spacer between search and right side content */}
        <div className="flex-1"></div>

        {/* Header actions */}
        <div className="flex items-center space-x-3">
          {/* Organization Switcher temporarily removed */}
          
          {/* Prominently show current organization if any */}
          {user?.organizationId && organizations?.length > 0 && (
            <div className="hidden md:flex items-center mr-4 px-3 py-1 bg-blue-50 rounded-md border border-blue-100">
              <div className="mr-2 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-xs font-medium text-blue-700">
                  {organizations.find(org => org.id === user.organizationId)?.name?.charAt(0) || 'O'}
                </span>
              </div>
              <span className="text-sm text-blue-700 font-medium truncate max-w-[120px]">
                {organizations.find(org => org.id === user.organizationId)?.name || 'Organization'}
              </span>
            </div>
          )}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          
          {/* Profile dropdown */}
          <div className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-3 pl-3 border-l border-gray-200 focus:outline-none">
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-gray-900 capitalize">{user?.name}</p>
                <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
              </div>
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </button>

            {dropdownOpen && (
              <div 
                className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-20"
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button
                  onClick={() => {
                    window.location.hash = 'profile';
                    setDropdownOpen(false);
                  }}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => {
                    window.location.hash = 'settings';
                    setDropdownOpen(false);
                  }}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;