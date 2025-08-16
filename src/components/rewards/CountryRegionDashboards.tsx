import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Globe,
  MapPin,
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Award,
  BarChart3,
  PieChart,
  Map,
  Flag,
  Building2,
  Activity,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  ArrowUpRight,
  ArrowDownLeft,
  Zap
} from 'lucide-react';

interface RegionMetrics {
  id: string;
  name: string;
  type: 'global' | 'country' | 'region' | 'city';
  parentId?: string;
  totalAmbassadors: number;
  activeAmbassadors: number;
  totalRewards: number;
  monthlyRewards: number;
  averageReward: number;
  completionRate: number;
  topPerformers: Ambassador[];
  rewardDistribution: RewardBreakdown[];
  growthRate: number;
  lastUpdated: string;
}

interface Ambassador {
  id: string;
  name: string;
  avatar: string;
  totalRewards: number;
  tasksCompleted: number;
  rank: number;
}

interface RewardBreakdown {
  type: string;
  amount: number;
  percentage: number;
  color: string;
}

const CountryRegionDashboards: React.FC = () => {
  const { user } = useAuth();
  const [selectedView, setSelectedView] = useState<'global' | 'country' | 'region'>('global');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Mock data
  const globalMetrics: RegionMetrics = {
    id: 'global',
    name: 'Global',
    type: 'global',
    totalAmbassadors: 1247,
    activeAmbassadors: 892,
    totalRewards: 2850000,
    monthlyRewards: 425000,
    averageReward: 185.50,
    completionRate: 87.3,
    topPerformers: [
      { id: '1', name: 'Sarah Johnson', avatar: '/api/placeholder/32/32', totalRewards: 15750, tasksCompleted: 89, rank: 1 },
      { id: '2', name: 'Michael Chen', avatar: '/api/placeholder/32/32', totalRewards: 14200, tasksCompleted: 76, rank: 2 },
      { id: '3', name: 'Elena Rodriguez', avatar: '/api/placeholder/32/32', totalRewards: 13890, tasksCompleted: 82, rank: 3 }
    ],
    rewardDistribution: [
      { type: 'Task Completion', amount: 1850000, percentage: 64.9, color: 'bg-blue-500' },
      { type: 'Bonuses', amount: 570000, percentage: 20.0, color: 'bg-green-500' },
      { type: 'Referrals', amount: 285000, percentage: 10.0, color: 'bg-purple-500' },
      { type: 'Special Events', amount: 145000, percentage: 5.1, color: 'bg-orange-500' }
    ],
    growthRate: 12.8,
    lastUpdated: '2024-01-15T10:30:00Z'
  };

  const countryMetrics: RegionMetrics[] = [
    {
      id: 'us',
      name: 'United States',
      type: 'country',
      totalAmbassadors: 342,
      activeAmbassadors: 256,
      totalRewards: 890000,
      monthlyRewards: 125000,
      averageReward: 245.75,
      completionRate: 91.2,
      topPerformers: [],
      rewardDistribution: [],
      growthRate: 15.6,
      lastUpdated: '2024-01-15T10:30:00Z'
    },
    {
      id: 'ng',
      name: 'Nigeria',
      type: 'country',
      totalAmbassadors: 289,
      activeAmbassadors: 198,
      totalRewards: 675000,
      monthlyRewards: 89000,
      averageReward: 165.20,
      completionRate: 84.7,
      topPerformers: [],
      rewardDistribution: [],
      growthRate: 22.3,
      lastUpdated: '2024-01-15T10:30:00Z'
    },
    {
      id: 'in',
      name: 'India',
      type: 'country',
      totalAmbassadors: 245,
      activeAmbassadors: 167,
      totalRewards: 520000,
      monthlyRewards: 72000,
      averageReward: 142.85,
      completionRate: 79.8,
      topPerformers: [],
      rewardDistribution: [],
      growthRate: 18.9,
      lastUpdated: '2024-01-15T10:30:00Z'
    }
  ];

  const regionMetrics: RegionMetrics[] = [
    {
      id: 'lagos',
      name: 'Lagos',
      type: 'region',
      parentId: 'ng',
      totalAmbassadors: 89,
      activeAmbassadors: 67,
      totalRewards: 245000,
      monthlyRewards: 35000,
      averageReward: 175.50,
      completionRate: 86.2,
      topPerformers: [],
      rewardDistribution: [],
      growthRate: 28.5,
      lastUpdated: '2024-01-15T10:30:00Z'
    },
    {
      id: 'california',
      name: 'California',
      type: 'region',
      parentId: 'us',
      totalAmbassadors: 125,
      activeAmbassadors: 98,
      totalRewards: 385000,
      monthlyRewards: 52000,
      averageReward: 285.75,
      completionRate: 92.8,
      topPerformers: [],
      rewardDistribution: [],
      growthRate: 14.2,
      lastUpdated: '2024-01-15T10:30:00Z'
    }
  ];

  const getMetricsData = () => {
    switch (selectedView) {
      case 'global':
        return [globalMetrics];
      case 'country':
        return selectedCountry === 'all' ? countryMetrics : countryMetrics.filter(c => c.id === selectedCountry);
      case 'region':
        return selectedRegion === 'all' ? regionMetrics : regionMetrics.filter(r => r.id === selectedRegion);
      default:
        return [globalMetrics];
    }
  };

  const renderMetricCard = (metric: RegionMetrics) => (
    <div key={metric.id} className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
            {metric.type === 'global' ? <Globe className="h-5 w-5 text-blue-600" /> :
             metric.type === 'country' ? <Flag className="h-5 w-5 text-blue-600" /> :
             <MapPin className="h-5 w-5 text-blue-600" />}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{metric.name}</h3>
            <p className="text-sm text-gray-600 capitalize">{metric.type} metrics</p>
          </div>
        </div>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm ${
          metric.growthRate >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {metric.growthRate >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          <span>{Math.abs(metric.growthRate)}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{metric.totalAmbassadors}</p>
          <p className="text-sm text-gray-600">Total Ambassadors</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{metric.activeAmbassadors}</p>
          <p className="text-sm text-gray-600">Active</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">${metric.totalRewards.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Total Rewards</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">{metric.completionRate}%</p>
          <p className="text-sm text-gray-600">Completion Rate</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Monthly Rewards</span>
          <span className="text-lg font-semibold text-gray-900">${metric.monthlyRewards.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Average Reward</span>
          <span className="text-lg font-semibold text-gray-900">${metric.averageReward}</span>
        </div>
      </div>

      <div className="flex space-x-2 mt-6">
        <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <Eye className="h-4 w-4 inline mr-1" />
          View Details
        </button>
        <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <BarChart3 className="h-4 w-4 inline mr-1" />
          Analytics
        </button>
      </div>
    </div>
  );

  const metricsData = getMetricsData();

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Regional Dashboards</h1>
          <p className="text-gray-600 mt-1">Monitor rewards and performance across regions</p>
        </div>
        <div className="flex items-center space-x-2">
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

      {/* View Selection & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">View Level</label>
              <div className="flex space-x-2">
                {[
                  { id: 'global', label: 'Global', icon: Globe },
                  { id: 'country', label: 'Country', icon: Flag },
                  { id: 'region', label: 'Region', icon: MapPin }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedView(id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      selectedView === id
                        ? 'bg-blue-100 text-blue-600 border border-blue-200'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {selectedView === 'country' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Countries</option>
                  <option value="us">United States</option>
                  <option value="ng">Nigeria</option>
                  <option value="in">India</option>
                </select>
              </div>
            )}

            {selectedView === 'region' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Regions</option>
                  <option value="lagos">Lagos, Nigeria</option>
                  <option value="california">California, US</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
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
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {metricsData.map(renderMetricCard)}
      </div>

      {/* Global Overview (only for global view) */}
      {selectedView === 'global' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reward Distribution */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <PieChart className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Reward Distribution</h3>
            </div>
            
            <div className="space-y-4">
              {globalMetrics.rewardDistribution.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{item.type}</span>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-900">${item.amount.toLocaleString()}</span>
                      <span className="text-sm text-gray-500 ml-2">{item.percentage}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Award className="h-5 w-5 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
            </div>
            
            <div className="space-y-4">
              {globalMetrics.topPerformers.map((performer, index) => (
                <div key={performer.id} className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {performer.rank}
                  </div>
                  <img 
                    src={performer.avatar} 
                    alt={performer.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{performer.name}</p>
                    <p className="text-xs text-gray-500">{performer.tasksCompleted} tasks completed</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${performer.totalRewards.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">total rewards</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Performance Chart Placeholder */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date(globalMetrics.lastUpdated).toLocaleString()}
          </div>
        </div>

        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Performance trends chart</p>
            <p className="text-sm text-gray-500 mt-1">Visualization coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryRegionDashboards;
