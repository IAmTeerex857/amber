import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Globe,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  MapPin,
  Flag,
  Building2,
  Target,
  Award,
  Activity,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  Settings,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Zap
} from 'lucide-react';

interface CountryData {
  id: string;
  name: string;
  flag: string;
  totalAmbassadors: number;
  activeAmbassadors: number;
  totalRewards: number;
  monthlyGrowth: number;
  completionRate: number;
  countryHead: string;
  regions: number;
  status: 'active' | 'growing' | 'attention' | 'new';
  lastActivity: string;
}

interface GlobalMetrics {
  totalCountries: number;
  totalAmbassadors: number;
  activeAmbassadors: number;
  totalRewards: number;
  monthlyRewards: number;
  avgCompletionRate: number;
  topCountries: CountryData[];
  recentActivities: Activity[];
}

interface Activity {
  id: string;
  type: 'country_added' | 'milestone' | 'payout' | 'issue' | 'growth';
  country: string;
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

const GlobalAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedView, setSelectedView] = useState<'overview' | 'performance' | 'analytics'>('overview');

  // Mock global metrics data
  const globalMetrics: GlobalMetrics = {
    totalCountries: 24,
    totalAmbassadors: 12847,
    activeAmbassadors: 9234,
    totalRewards: 28750000,
    monthlyRewards: 4250000,
    avgCompletionRate: 87.3,
    topCountries: [
      {
        id: 'us',
        name: 'United States',
        flag: '🇺🇸',
        totalAmbassadors: 2847,
        activeAmbassadors: 2134,
        totalRewards: 8950000,
        monthlyGrowth: 15.6,
        completionRate: 91.2,
        countryHead: 'Sarah Johnson',
        regions: 12,
        status: 'active',
        lastActivity: '2024-01-15T10:30:00Z'
      },
      {
        id: 'ng',
        name: 'Nigeria',
        flag: '🇳🇬',
        totalAmbassadors: 1934,
        activeAmbassadors: 1456,
        totalRewards: 5200000,
        monthlyGrowth: 28.9,
        completionRate: 89.7,
        countryHead: 'Adebayo Okafor',
        regions: 8,
        status: 'growing',
        lastActivity: '2024-01-15T09:45:00Z'
      },
      {
        id: 'in',
        name: 'India',
        flag: '🇮🇳',
        totalAmbassadors: 1756,
        activeAmbassadors: 1234,
        totalRewards: 4850000,
        monthlyGrowth: 18.3,
        completionRate: 85.4,
        countryHead: 'Raj Patel',
        regions: 15,
        status: 'active',
        lastActivity: '2024-01-15T11:20:00Z'
      },
      {
        id: 'br',
        name: 'Brazil',
        flag: '🇧🇷',
        totalAmbassadors: 1245,
        activeAmbassadors: 892,
        totalRewards: 3200000,
        monthlyGrowth: -2.1,
        completionRate: 79.8,
        countryHead: 'Carlos Santos',
        regions: 6,
        status: 'attention',
        lastActivity: '2024-01-14T16:30:00Z'
      }
    ],
    recentActivities: [
      {
        id: '1',
        type: 'milestone',
        country: 'Nigeria',
        message: 'Reached 2000 active ambassadors milestone',
        timestamp: '2024-01-15T10:30:00Z',
        severity: 'low'
      },
      {
        id: '2',
        type: 'payout',
        country: 'United States',
        message: 'Monthly payout of $125,000 processed',
        timestamp: '2024-01-15T09:15:00Z',
        severity: 'low'
      },
      {
        id: '3',
        type: 'issue',
        country: 'Brazil',
        message: 'Ambassador completion rate dropped below 80%',
        timestamp: '2024-01-14T16:45:00Z',
        severity: 'high'
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
      case 'milestone': return Target;
      case 'payout': return DollarSign;
      case 'issue': return AlertTriangle;
      case 'growth': return TrendingUp;
      case 'country_added': return Flag;
      default: return Activity;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Global Administration</h1>
          <p className="text-gray-600 mt-1">Worldwide ambassador program oversight and management</p>
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
          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Global Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Countries</p>
              <p className="text-3xl font-bold text-gray-900">{globalMetrics.totalCountries}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">+2 countries</span>
            <span className="text-gray-500 ml-1">this quarter</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Ambassadors</p>
              <p className="text-3xl font-bold text-gray-900">{globalMetrics.totalAmbassadors.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-green-600 font-medium">{globalMetrics.activeAmbassadors.toLocaleString()}</span>
            <span className="text-gray-500 ml-1">active this month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Rewards</p>
              <p className="text-3xl font-bold text-gray-900">${(globalMetrics.totalRewards / 1000000).toFixed(1)}M</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-purple-600 font-medium">${(globalMetrics.monthlyRewards / 1000).toFixed(0)}K</span>
            <span className="text-gray-500 ml-1">this month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Completion Rate</p>
              <p className="text-3xl font-bold text-gray-900">{globalMetrics.avgCompletionRate}%</p>
            </div>
            <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">+2.1%</span>
            <span className="text-gray-500 ml-1">vs last month</span>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'overview', label: 'Country Overview', icon: Globe },
            { id: 'performance', label: 'Performance', icon: BarChart3 },
            { id: 'analytics', label: 'Analytics', icon: PieChart }
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
            <h3 className="text-lg font-semibold text-gray-900">Country Performance</h3>
            <div className="space-y-3">
              {globalMetrics.topCountries.map((country) => (
                <div key={country.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="text-2xl">{country.flag}</div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{country.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(country.status)}`}>
                        {country.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Country Head: {country.countryHead} • {country.regions} regions
                    </p>
                  </div>

                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <p className="font-medium text-gray-900">{country.totalAmbassadors.toLocaleString()}</p>
                      <p className="text-gray-500">ambassadors</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900">${(country.totalRewards / 1000000).toFixed(1)}M</p>
                      <p className="text-gray-500">rewards</p>
                    </div>
                    <div className="text-center">
                      <div className={`flex items-center space-x-1 ${
                        country.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {country.monthlyGrowth >= 0 ? 
                          <ArrowUpRight className="h-3 w-3" /> : 
                          <ArrowDownLeft className="h-3 w-3" />
                        }
                        <span className="font-medium">{Math.abs(country.monthlyGrowth)}%</span>
                      </div>
                      <p className="text-gray-500">growth</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900">{country.completionRate}%</p>
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

        {selectedView === 'performance' && (
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Performance analytics chart</p>
              <p className="text-sm text-gray-500 mt-1">Detailed performance visualization</p>
            </div>
          </div>
        )}

        {selectedView === 'analytics' && (
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Analytics dashboard</p>
              <p className="text-sm text-gray-500 mt-1">Advanced analytics and insights</p>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Global Activities</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View all</button>
        </div>
        
        <div className="space-y-3">
          {globalMetrics.recentActivities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon className="h-4 w-4 text-blue-600" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{activity.country}</span>
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

export default GlobalAdminDashboard;
