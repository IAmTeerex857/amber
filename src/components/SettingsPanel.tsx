import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Monitor,
  Save,
  RotateCcw,
  Mail,
  Upload,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Smartphone
} from 'lucide-react';

const SettingsPanel: React.FC = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  
  // Notifications state
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false
  });
  
  // Security state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Payment settings state (for organizations)
  const [paymentSettings, setPaymentSettings] = useState({
    currency: 'USD',
    paymentMethod: 'stripe' as 'stripe' | 'paystack' | 'paypal',
    minPayoutThreshold: 50,
    pointsToCurrencyRate: 100
  });

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    ...(user?.role === 'organization' ? [{ id: 'payments', label: 'Payments', icon: CreditCard }] : []),
    { id: 'system', label: 'System', icon: Monitor }
  ];

  const handleSave = () => {
    try {
      if (activeSection === 'payments') {
        localStorage.setItem('amber_payment_settings', JSON.stringify(paymentSettings));
      }
      console.log('Settings saved for section:', activeSection);
    } catch (e) {
      console.warn('Failed to save settings', e);
    }
  };

  const handleReset = () => {
    console.log('Settings reset for section:', activeSection);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection();
      case 'notifications':
        return renderNotificationsSection();
      case 'security':
        return renderSecuritySection();
      case 'payments':
        return renderPaymentsSection();
      case 'system':
        return renderSystemSection();
      default:
        return renderProfileSection();
    }
  };

  const renderProfileSection = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <User className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
            <p className="text-sm text-gray-500">Manage your personal information</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-900">
            {user?.role || 'Ambassador'}
          </div>
          <div className="text-xs text-gray-500">Account Type</div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Profile Picture */}
        <div className="border border-gray-200 rounded-xl p-5">
          <h4 className="font-semibold text-gray-900 mb-4">Profile Picture</h4>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <User className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <button className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload New Photo
                </button>
                <button className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium">
                  Remove
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF. Max size 2MB.</p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="border border-gray-200 rounded-xl p-5">
          <h4 className="font-semibold text-gray-900 mb-4">Personal Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Full Name</label>
              <input
                type="text"
                defaultValue={user?.name || ''}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  defaultValue={user?.email || ''}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
      <div className="space-y-6">
        <div className="border border-gray-200 rounded-xl p-5">
          <h4 className="font-semibold text-gray-900 mb-4">Notification Channels</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Email</label>
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-white rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-3 text-sm text-gray-600">Receive notifications via email</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Push Notifications</label>
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-white rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-3 text-sm text-gray-600">Receive push notifications</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">SMS</label>
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={notifications.sms}
                  onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-white rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-3 text-sm text-gray-600">Receive SMS notifications</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySection = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
      <div className="space-y-6">
        <div className="border border-gray-200 rounded-xl p-5">
          <h4 className="font-semibold text-gray-900 mb-4">Password</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Current Password</label>
              <div className="relative">
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  placeholder="Enter your current password"
                />
                <EyeOff className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">New Password</label>
              <div className="relative">
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  placeholder="Enter your new password"
                />
                <EyeOff className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Confirm New Password</label>
              <div className="relative">
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  placeholder="Confirm your new password"
                />
                <EyeOff className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentsSection = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Settings</h3>
      <div className="space-y-6">
        <div className="border border-gray-200 rounded-xl p-5">
          <h4 className="font-semibold text-gray-900 mb-4">Payment Method</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Currency</label>
              <select
                value={paymentSettings.currency}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, currency: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
              <select
                value={paymentSettings.paymentMethod}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, paymentMethod: e.target.value as 'stripe' | 'paystack' | 'paypal' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              >
                <option value="stripe">Stripe</option>
                <option value="paystack">Paystack</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Minimum Payout Threshold</label>
              <input
                type="number"
                value={paymentSettings.minPayoutThreshold}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, minPayoutThreshold: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Points to Currency Rate</label>
              <input
                type="number"
                value={paymentSettings.pointsToCurrencyRate}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, pointsToCurrencyRate: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemSection = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
      <div className="space-y-6">
        <div className="border border-gray-200 rounded-xl p-5">
          <h4 className="font-semibold text-gray-900 mb-4">System Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">System Version</label>
              <input
                type="text"
                value="1.0.0"
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">System Status</label>
              <input
                type="text"
                value="Online"
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8">
            {sections.map((section) => {
              const IconComponent = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeSection === section.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}

        {/* Save Actions */}
        <div className="mt-8 flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div>
            <p className="text-sm text-gray-500">
              Changes are saved automatically
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleReset}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </button>
            <button 
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;