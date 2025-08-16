import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Monitor,
  Save,
  RotateCcw
} from 'lucide-react';

const SettingsLayout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const sections = [
    { id: 'profile', label: 'Profile', icon: User, path: '/settings/profile' },
    { id: 'notifications', label: 'Notifications', icon: Bell, path: '/settings/notifications' },
    { id: 'security', label: 'Security', icon: Shield, path: '/settings/security' },
    ...(user?.role === 'organization' 
      ? [{ id: 'payments', label: 'Payments', icon: CreditCard, path: '/settings/payments' }] 
      : []
    ),
    { id: 'system', label: 'System', icon: Monitor, path: '/settings/system' }
  ];

  const activeSection = sections.find(section => 
    location.pathname.startsWith(section.path)
  )?.id || 'profile';

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-1/4">
          <nav className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = location.pathname.startsWith(section.path);
              
              return (
                <Link
                  key={section.id}
                  to={section.path}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className="font-medium">{section.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Content Area */}
            <div className="p-6">
              <Outlet />
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => console.log('Settings reset for section:', activeSection)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </button>
              <button
                onClick={() => {
                  console.log('Settings saved for section:', activeSection);
                  // Add save logic here based on active section
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
