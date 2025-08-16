import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  MapPin,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Flag,
  Building2,
  Target,
  Award,
  Activity,
  BarChart3,
  PieChart,
  Eye,
  Settings,
  RefreshCw,
  Download,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  UserPlus,
  Zap,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';

interface RegionData {
  id: string;
  name: string;
  type: 'state' | 'province' | 'region' | 'city';
  totalAmbassadors: number;
  activeAmbassadors: number;
  totalRewards: number;
  monthlyGrowth: number;
  completionRate: number;
  regionalManager: string;
  lastActivity: string;
  status: 'active' | 'growing' | 'attention' | 'new';
}

interface CountryMetrics {
  countryName: string;
  countryFlag: string;
  totalAmbassadors: number;
  activeAmbassadors: number;
  totalRewards: number;
  monthlyRewards: number;
  avgCompletionRate: number;
  totalRegions: number;
  topRegions: RegionData[];
  recentActivities: CountryActivity[];
  monthlyGrowth: number;
}

interface CountryActivity {
  id: string;
  type: 'region_milestone' | 'ambassador_joined' | 'payout' | 'issue' | 'campaign';
  region: string;
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

const CountryHeadDashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedCountry, setSelectedCountry] = useState<string>('ng'); // Default to Nigeria
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedView, setSelectedView] = useState<'overview' | 'regions' | 'performance'>('overview');

  // Mock country data - would come from props or API based on user's country
  const countryMetrics: CountryMetrics = {
    countryName: 'Nigeria',
    countryFlag: '🇳🇬',
    totalAmbassadors: 1934,
    activeAmbassadors: 1456,
    totalRewards: 5200000,
    monthlyRewards: 720000,
    avgCompletionRate: 89.7,
    totalRegions: 8,
    monthlyGrowth: 28.9,
    topRegions: [
      {
        id: 'lagos',
        name: 'Lagos',
        type: 'state',
        totalAmbassadors: 567,
        activeAmbassadors: 445,
        totalRewards: 1850000,
        monthlyGrowth: 32.4,
        completionRate: 92.1,
        regionalManager: 'Folake Adebayo',
        lastActivity: '2024-01-15T11:30:00Z',
        status: 'growing'
      },
      {
        id: 'abuja',
        name: 'Abuja (FCT)',
        type: 'region',
        totalAmbassadors: 298,
        activeAmbassadors: 234,
        totalRewards: 1050000,
        monthlyGrowth: 18.7,
        completionRate: 88.9,
        regionalManager: 'Ibrahim Yusuf',
        lastActivity: '2024-01-15T10:15:00Z',
        status: 'active'
      },
      {
        id: 'kano',
        name: 'Kano',
        type: 'state',
        totalAmbassadors: 234,
        activeAmbassadors: 167,
        totalRewards: 780000,
        monthlyGrowth: 24.1,
        completionRate: 85.3,
        regionalManager: 'Amina Hassan',
        lastActivity: '2024-01-15T09:45:00Z',
        status: 'active'
      },
      {
        id: 'port-harcourt',
        name: 'Port Harcourt',
        type: 'city',
        totalAmbassadors: 189,
        activeAmbassadors: 142,
        totalRewards: 620000,
        monthlyGrowth: -3.2,
        completionRate: 76.8,
        regionalManager: 'Chioma Okafor',
        lastActivity: '2024-01-14T14:20:00Z',
        status: 'attention'
      }
    ],
    recentActivities: [
      {
        id: '1',
        type: 'region_milestone',
        region: 'Lagos',
        message: 'Lagos region reached 500+ active ambassadors',
        timestamp: '2024-01-15T11:30:00Z',
        severity: 'low'
      },
      {
        id: '2',
        type: 'ambassador_joined',
        region: 'Kano',
        message: '25 new ambassadors onboarded this week',
        timestamp: '2024-01-15T10:45:00Z',
        severity: 'low'
      },
      {
        id: '3',
        type: 'issue',
        region: 'Port Harcourt',
        message: 'Completion rate dropped below 80%',
        timestamp: '2024-01-14T14:20:00Z',
        severity: 'high'
      },
      {
        id: '4',
        type: 'payout',
        region: 'Abuja',
        message: 'Monthly payout of ₦45M processed',
        timestamp: '2024-01-15T08:30:00Z',
        severity: 'low'
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'growing': return 'bg-blue-100 text-blue-800';
      case 'attention': return 'bg-yellow-100 text-yellow-800';
      case 'new': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'region_milestone': return Target;
      case 'ambassador_joined': return UserPlus;
      case 'payout': return DollarSign;
      case 'issue': return AlertTriangle;
      case 'campaign': return Zap;
      default: return Activity;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{countryMetrics.countryFlag}</div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{countryMetrics.countryName} Dashboard</h1>
            <p className="text-gray-600 mt-1">Country-level ambassador management and oversight</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Add Region</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Country Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Regions</p>
              <p className="text-3xl font-bold text-gray-900">{countryMetrics.totalRegions}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-blue-600 font-medium">8 active regions</span>
            <span className="text-gray-500 ml-1">managed</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Ambassadors</p>
              <p className="text-3xl font-bold text-gray-900">{countryMetrics.totalAmbassadors.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-green-600 font-medium">{countryMetrics.activeAmbassadors.toLocaleString()}</span>
            <span className="text-gray-500 ml-1">active this month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Rewards</p>
              <p className="text-3xl font-bold text-gray-900">₦{(countryMetrics.totalRewards / 1000000).toFixed(1)}M</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-purple-600 font-medium">₦{(countryMetrics.monthlyRewards / 1000).toFixed(0)}K</span>
            <span className="text-gray-500 ml-1">this month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Completion Rate</p>
              <p className="text-3xl font-bold text-gray-900">{countryMetrics.avgCompletionRate}%</p>
            </div>
            <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">{countryMetrics.monthlyGrowth}%</span>
            <span className="text-gray-500 ml-1">growth this month</span>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'overview', label: 'Regional Overview', icon: MapPin },
            { id: 'regions', label: 'Manage Regions', icon: Building2 },
            { id: 'performance', label: 'Performance', icon: BarChart3 }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedView(id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                selectedView === id
                  ? 'bg-blue-100 text-blue-600 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {selectedView === 'overview' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Regional Performance</h3>
            <div className="space-y-3">
              {countryMetrics.topRegions.map((region) => (
                <div key={region.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{region.name}</h4>
                      <span className="text-xs text-gray-500 capitalize">({region.type})</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(region.status)}`}>
                        {region.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Regional Manager: {region.regionalManager}
                    </p>
                  </div>

                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <p className="font-medium text-gray-900">{region.totalAmbassadors}</p>
                      <p className="text-gray-500">ambassadors</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900">₦{(region.totalRewards / 1000000).toFixed(1)}M</p>
                      <p className="text-gray-500">rewards</p>
                    </div>
                    <div className="text-center">
                      <div className={`flex items-center space-x-1 ${
                        region.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {region.monthlyGrowth >= 0 ? 
                          <ArrowUpRight className="h-3 w-3" /> : 
                          <ArrowDownLeft className="h-3 w-3" />
                        }
                        <span className="font-medium">{Math.abs(region.monthlyGrowth)}%</span>
                      </div>
                      <p className="text-gray-500">growth</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900">{region.completionRate}%</p>
                      <p className="text-gray-500">completion</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedView === 'regions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Region Management</h3>
              <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4" />
                <span>Add New Region</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {countryMetrics.topRegions.map((region) => (
                <div key={region.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{region.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(region.status)}`}>
                      {region.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ambassadors:</span>
                      <span className="font-medium">{region.totalAmbassadors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Manager:</span>
                      <span className="font-medium">{region.regionalManager}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completion:</span>
                      <span className="font-medium">{region.completionRate}%</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                      Manage
                    </button>
                    <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedView === 'performance' && (
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Country performance analytics</p>
              <p className="text-sm text-gray-500 mt-1">Regional performance comparison</p>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Regional Activities</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View all</button>
        </div>
        
        <div className="space-y-3">
          {countryMetrics.recentActivities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon className="h-4 w-4 text-blue-600" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{activity.region}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(activity.severity)}`}>
                      {activity.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{activity.message}</p>
                </div>
                
                <div className="text-right text-sm text-gray-500">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CountryHeadDashboard;
