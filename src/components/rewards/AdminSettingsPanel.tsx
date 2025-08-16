import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Settings,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Edit3,
  DollarSign,
  Bitcoin,
  Gift,
  Globe,
  MapPin,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Target,
  Percent
} from 'lucide-react';

interface ConversionRate {
  id: string;
  fromCurrency: 'points';
  toCurrency: 'usd' | 'xlm' | 'gift_card' | 'voucher';
  rate: number;
  minAmount: number;
  maxAmount?: number;
  dailyLimit?: number;
  monthlyLimit?: number;
  fees: number;
  bonusThreshold?: number;
  bonusRate?: number;
  isActive: boolean;
  region?: string;
  lastUpdated: string;
  updatedBy: string;
}

interface SystemSettings {
  globalPointsPoolLimit: number;
  maxDailyConversions: number;
  defaultProcessingTime: string;
  autoApprovalThreshold: number;
  requireAdminApproval: boolean;
  enableBonusRewards: boolean;
  maintenanceMode: boolean;
}

const AdminSettingsPanel: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'rates' | 'limits' | 'system' | 'security'>('rates');
  const [isEditing, setIsEditing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock conversion rates data
  const [conversionRates, setConversionRates] = useState<ConversionRate[]>([
    {
      id: '1',
      fromCurrency: 'points',
      toCurrency: 'usd',
      rate: 100,
      minAmount: 1000,
      maxAmount: 50000,
      dailyLimit: 100000,
      monthlyLimit: 500000,
      fees: 2.5,
      bonusThreshold: 5000,
      bonusRate: 5,
      isActive: true,
      region: 'Global',
      lastUpdated: '2024-01-15T10:00:00Z',
      updatedBy: 'Admin User'
    },
    {
      id: '2',
      fromCurrency: 'points',
      toCurrency: 'xlm',
      rate: 25,
      minAmount: 500,
      maxAmount: 25000,
      dailyLimit: 50000,
      monthlyLimit: 250000,
      fees: 1.0,
      bonusThreshold: 2500,
      bonusRate: 10,
      isActive: true,
      region: 'Global',
      lastUpdated: '2024-01-15T10:00:00Z',
      updatedBy: 'Admin User'
    },
    {
      id: '3',
      fromCurrency: 'points',
      toCurrency: 'gift_card',
      rate: 100,
      minAmount: 1000,
      maxAmount: 10000,
      dailyLimit: 25000,
      fees: 0,
      isActive: true,
      region: 'US',
      lastUpdated: '2024-01-15T10:00:00Z',
      updatedBy: 'Country Head US'
    }
  ]);

  // Mock system settings
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    globalPointsPoolLimit: 10000000,
    maxDailyConversions: 1000,
    defaultProcessingTime: '24 hours',
    autoApprovalThreshold: 1000,
    requireAdminApproval: true,
    enableBonusRewards: true,
    maintenanceMode: false
  });

  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case 'usd': return <DollarSign className="h-4 w-4" />;
      case 'xlm': return <Bitcoin className="h-4 w-4" />;
      case 'gift_card': return <Gift className="h-4 w-4" />;
      case 'voucher': return <Gift className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  const getCurrencyColor = (currency: string) => {
    switch (currency) {
      case 'usd': return 'bg-green-100 text-green-800';
      case 'xlm': return 'bg-blue-100 text-blue-800';
      case 'gift_card': return 'bg-purple-100 text-purple-800';
      case 'voucher': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSaveRates = () => {
    // Save logic here
    setIsEditing(false);
    console.log('Conversion rates saved');
  };

  const handleResetRates = () => {
    // Reset logic here
    setIsEditing(false);
    console.log('Conversion rates reset');
  };

  const renderRatesTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Conversion Rates</h3>
          <p className="text-gray-600">Manage point conversion rates and rules</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Rate</span>
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit3 className="h-4 w-4" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Rates'}</span>
          </button>
        </div>
      </div>

      {/* Rates Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Currency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Limits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fees & Bonus
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Region
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {conversionRates.map((rate) => (
                <tr key={rate.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${getCurrencyColor(rate.toCurrency)}`}>
                        {getCurrencyIcon(rate.toCurrency)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {rate.toCurrency.toUpperCase()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {rate.toCurrency === 'usd' ? 'US Dollar' :
                           rate.toCurrency === 'xlm' ? 'Stellar Lumens' :
                           rate.toCurrency === 'gift_card' ? 'Gift Cards' : 'Vouchers'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing ? (
                      <input
                        type="number"
                        defaultValue={rate.rate}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      <div className="text-sm text-gray-900">
                        {rate.rate} points = 1 {rate.toCurrency.toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="text-gray-900">
                        Min: {rate.minAmount.toLocaleString()}
                      </div>
                      {rate.maxAmount && (
                        <div className="text-gray-500">
                          Max: {rate.maxAmount.toLocaleString()}
                        </div>
                      )}
                      {rate.dailyLimit && (
                        <div className="text-gray-500">
                          Daily: {rate.dailyLimit.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="text-gray-900">
                        Fee: {rate.fees}%
                      </div>
                      {rate.bonusRate && (
                        <div className="text-green-600">
                          Bonus: {rate.bonusRate}%
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      {rate.region === 'Global' ? (
                        <Globe className="h-4 w-4 text-blue-500" />
                      ) : (
                        <MapPin className="h-4 w-4 text-green-500" />
                      )}
                      <span className="text-sm text-gray-900">{rate.region}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      rate.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {rate.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-500">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-500">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleResetRates}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleSaveRates}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </div>
      )}
    </div>
  );

  const renderLimitsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Limits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Daily Limits */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Daily Limits</h4>
            </div>
            
            <div className="space-y-4">
              {conversionRates.map((rate) => (
                <div key={rate.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getCurrencyIcon(rate.toCurrency)}
                    <span className="text-sm font-medium text-gray-900">
                      {rate.toCurrency.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {rate.dailyLimit?.toLocaleString() || 'No limit'}
                    </div>
                    <div className="text-xs text-gray-500">points/day</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Limits */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h4 className="font-semibold text-gray-900">Monthly Limits</h4>
            </div>
            
            <div className="space-y-4">
              {conversionRates.map((rate) => (
                <div key={rate.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getCurrencyIcon(rate.toCurrency)}
                    <span className="text-sm font-medium text-gray-900">
                      {rate.toCurrency.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {rate.monthlyLimit?.toLocaleString() || 'No limit'}
                    </div>
                    <div className="text-xs text-gray-500">points/month</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* User Limits */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="h-5 w-5 text-purple-600" />
          <h4 className="font-semibold text-gray-900">User Conversion Limits</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Daily Conversions per User
            </label>
            <input
              type="number"
              defaultValue={systemSettings.maxDailyConversions}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Auto-Approval Threshold
            </label>
            <input
              type="number"
              defaultValue={systemSettings.autoApprovalThreshold}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Global Points Pool Limit
            </label>
            <input
              type="number"
              defaultValue={systemSettings.globalPointsPoolLimit}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
        
        {/* General Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h4 className="font-semibold text-gray-900 mb-4">General Configuration</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Processing Time
              </label>
              <select
                defaultValue={systemSettings.defaultProcessingTime}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Instant">Instant</option>
                <option value="1 hour">1 hour</option>
                <option value="24 hours">24 hours</option>
                <option value="2-3 business days">2-3 business days</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Daily System Conversions
              </label>
              <input
                type="number"
                defaultValue={systemSettings.maxDailyConversions}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Toggle Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Feature Controls</h4>
          
          <div className="space-y-4">
            {[
              {
                key: 'requireAdminApproval',
                label: 'Require Admin Approval',
                description: 'All conversions above threshold require manual approval',
                value: systemSettings.requireAdminApproval
              },
              {
                key: 'enableBonusRewards',
                label: 'Enable Bonus Rewards',
                description: 'Allow bonus percentage for large conversions',
                value: systemSettings.enableBonusRewards
              },
              {
                key: 'maintenanceMode',
                label: 'Maintenance Mode',
                description: 'Temporarily disable all conversions',
                value: systemSettings.maintenanceMode,
                warning: true
              }
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h5 className="font-medium text-gray-900">{setting.label}</h5>
                    {setting.warning && (
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={setting.value}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-5 w-5 text-green-600" />
            <h4 className="font-semibold text-gray-900">Fraud Prevention</h4>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suspicious Activity Threshold
                </label>
                <input
                  type="number"
                  placeholder="10000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Points converted in 24h to trigger review</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Conversion Velocity
                </label>
                <input
                  type="number"
                  placeholder="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Max conversions per hour per user</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800">Security Notice</p>
                  <p className="text-yellow-700 mt-1">
                    These settings help prevent fraudulent activity. Lowering thresholds may increase false positives.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (user?.role !== 'organization') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
          <p className="text-gray-600">Only organization administrators can access conversion settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Settings</h1>
        <p className="text-gray-600">Configure conversion rates, limits, and system settings</p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'rates', label: 'Conversion Rates', icon: Percent },
            { id: 'limits', label: 'Limits & Quotas', icon: Target },
            { id: 'system', label: 'System Settings', icon: Settings },
            { id: 'security', label: 'Security', icon: Shield }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className={`mr-2 h-5 w-5 ${
                  activeTab === tab.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                }`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'rates' && renderRatesTab()}
      {activeTab === 'limits' && renderLimitsTab()}
      {activeTab === 'system' && renderSystemTab()}
      {activeTab === 'security' && renderSecurityTab()}
    </div>
  );
};

export default AdminSettingsPanel;
