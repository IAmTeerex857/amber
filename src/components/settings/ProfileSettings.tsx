import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Upload, CheckCircle2 } from 'lucide-react';

const ProfileSettings: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Settings</h2>
        <p className="text-gray-600">Update your personal information and profile details</p>
      </div>

      <div className="space-y-8">
        {/* Profile Photo */}
        <div className="border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Profile Photo</h3>
          <div className="flex items-start space-x-6">
            <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                <Upload className="h-4 w-4" />
                <span>Upload new photo</span>
              </button>
              <p className="text-sm text-gray-500 mt-2">
                JPG, GIF or PNG. 1MB max.
              </p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                defaultValue={user?.name || ''}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  defaultValue={user?.email || ''}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm pr-10"
                  placeholder="Enter your email"
                />
                <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                placeholder="Enter your location"
              />
            </div>
          </div>
        </div>

        {/* Role Information */}
        <div className="border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Role Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Role</label>
              <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                <span className="capitalize text-gray-900">{user?.role}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
              <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                <span className="text-gray-900">
                  {user?.organizationId ? 'Connected' : 'No organization'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio/Description */}
        <div className="border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Bio</h3>
          <textarea
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            rows={4}
            placeholder="Tell us about yourself..."
          />
          <p className="text-sm text-gray-500 mt-2">
            Brief description for your profile. Maximum 500 characters.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
