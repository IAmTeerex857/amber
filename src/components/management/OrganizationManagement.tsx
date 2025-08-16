import React, { useState } from 'react';
import {
  BarChart2, Globe, Flag, MapPin, UserCog, Users, TrendingUp,
  Building2, Crown, Shield, Search, Plus, RefreshCw, Download, Filter
} from 'lucide-react';

type ManagementTab = 'overview' | 'global' | 'countries' | 'regions' | 'roles' | 'analytics';

const OrganizationManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ManagementTab>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Building2 },
    { id: 'global', name: 'Global Admin', icon: Globe },
    { id: 'countries', name: 'Countries', icon: Flag },
    { id: 'regions', name: 'Regions', icon: MapPin },
    { id: 'roles', name: 'Role Management', icon: UserCog },
    { id: 'analytics', name: 'Analytics', icon: BarChart2 }
  ];

  // Mock data
  const globalMetrics = {
    totalCountries: 24,
    totalAmbassadors: 12847,
    totalRewards: '$28.8M',
    avgCompletionRate: 87.3,
    monthlyGrowth: 2.1
  };

  const countries = [
    { id: '1', name: 'United States', flag: '🇺🇸', status: 'active', head: 'Sarah Johnson', regions: 12, ambassadors: 2847, rewards: '$8.9M', growth: 15.6, completion: 91.2 },
    { id: '2', name: 'Nigeria', flag: '🇳🇬', status: 'growing', head: 'Adebayo Okafor', regions: 8, ambassadors: 1934, rewards: '$5.2M', growth: 28.9, completion: 89.7 },
    { id: '3', name: 'India', flag: '🇮🇳', status: 'active', head: 'Raj Patel', regions: 15, ambassadors: 1756, rewards: '$4.8M', growth: 18.3, completion: 85.4 },
    { id: '4', name: 'Brazil', flag: '🇧🇷', status: 'attention', head: 'Carlos Santos', regions: 6, ambassadors: 1245, rewards: '$3.2M', growth: -2.1, completion: 79.8 }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Global Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Countries</p>
              <p className="text-2xl font-bold text-gray-900">{globalMetrics.totalCountries}</p>
              <p className="text-xs text-green-600">+2 this quarter</p>
            </div>
            <Globe className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Ambassadors</p>
              <p className="text-2xl font-bold text-gray-900">{globalMetrics.totalAmbassadors.toLocaleString()}</p>
              <p className="text-xs text-green-600">9,234 active this month</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Rewards</p>
              <p className="text-2xl font-bold text-gray-900">{globalMetrics.totalRewards}</p>
              <p className="text-xs text-purple-600">$4250K this month</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{globalMetrics.avgCompletionRate}%</p>
              <p className="text-xs text-green-600">+2.1% vs last month</p>
            </div>
            <BarChart2 className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Growth</p>
              <p className="text-2xl font-bold text-gray-900">{globalMetrics.monthlyGrowth}%</p>
              <p className="text-xs text-blue-600">Above target (25% goal)</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Management Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <Plus className="h-5 w-5 text-blue-600 mr-3" />
            <span className="text-sm font-medium">Add New Country</span>
          </button>
          <button className="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <UserCog className="h-5 w-5 text-green-600 mr-3" />
            <span className="text-sm font-medium">Bulk Role Assignment</span>
          </button>
          <button className="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <BarChart2 className="h-5 w-5 text-purple-600 mr-3" />
            <span className="text-sm font-medium">Generate Report</span>
          </button>
          <button className="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <Shield className="h-5 w-5 text-orange-600 mr-3" />
            <span className="text-sm font-medium">Security Audit</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderCountries = () => (
    <div className="space-y-6">
      {/* Country Performance */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Country Performance</h3>
          <div className="flex space-x-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
              <Download className="h-4 w-4 mr-2 inline" />
              Export
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2 inline" />
              Add Country
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country Head</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ambassadors</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rewards</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {countries.map((country) => (
                <tr key={country.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{country.flag}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{country.name}</div>
                        <div className="text-sm text-gray-500">{country.regions} regions</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{country.head}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{country.ambassadors.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{country.rewards}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm ${country.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {country.growth > 0 ? '+' : ''}{country.growth}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{country.completion}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      country.status === 'active' ? 'bg-green-100 text-green-800' :
                      country.status === 'growing' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {country.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'countries':
        return renderCountries();
      case 'global':
      case 'regions':
      case 'roles':
      case 'analytics':
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="text-gray-400 mb-4">
              <BarChart2 className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {tabs.find(tab => tab.id === activeTab)?.name} Coming Soon
            </h3>
            <p className="text-gray-500">This section is being integrated into the unified management interface.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Organization Management</h1>
            <p className="text-gray-600 mt-1">Unified management hub for global operations, roles, and analytics</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
            <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ManagementTab)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default OrganizationManagement;
