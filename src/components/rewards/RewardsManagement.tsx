import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Wallet,
  Coins,
  Gift,
  TrendingUp,
  TrendingDown,
  Globe,
  MapPin,
  Users,
  CreditCard,
  Settings,
  Plus,
  ArrowUpRight,
  DollarSign,
  Bitcoin,
  Eye,
  Download,
  Filter,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Edit3,
  Trash2,
  Clock,
  Target,
  PieChart,
  BarChart3
} from 'lucide-react';

interface RewardPool {
  id: string;
  name: string;
  type: 'global' | 'country' | 'regional';
  location: string;
  currency: 'usd' | 'xlm' | 'points' | 'mixed';
  balance: number;
  allocated: number;
  available: number;
  totalDistributed: number;
  monthlyBudget: number;
  status: 'active' | 'inactive' | 'depleted' | 'suspended';
  ambassadorCount: number;
  taskCount: number;
  averageReward: number;
  lastActivity: string;
  createdDate: string;
  managedBy: string;
  autoRefill: boolean;
  refillThreshold: number;
  healthStatus: 'healthy' | 'warning' | 'critical';
}

interface PayoutHistory {
  id: string;
  ambassadorName: string;
  amount: number;
  currency: string;
  type: 'token' | 'fiat' | 'points';
  status: 'completed' | 'pending' | 'failed';
  taskId: string;
  taskName: string;
  country: string;
  walletAddress?: string;
  transactionHash?: string;
  date: string;
}

const RewardsManagement: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'pools' | 'payouts' | 'analytics' | 'settings'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'global' | 'country' | 'regional'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'depleted'>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');

  // Mock data - Enhanced reward pools combining features from both components
  const rewardPools: RewardPool[] = [
    {
      id: '1',
      name: 'Global Stellar Pool',
      type: 'global',
      location: 'Worldwide',
      currency: 'xlm',
      balance: 500000,
      allocated: 450000,
      available: 50000,
      totalDistributed: 350000,
      monthlyBudget: 100000,
      status: 'active',
      ambassadorCount: 245,
      taskCount: 48,
      averageReward: 850,
      lastActivity: '2024-01-15T14:30:00Z',
      createdDate: '2023-06-01T00:00:00Z',
      managedBy: 'Global Admin',
      autoRefill: true,
      refillThreshold: 20000,
      healthStatus: 'healthy'
    },
    {
      id: '2',
      name: 'Nigeria Ambassador Pool',
      type: 'country',
      location: 'Nigeria',
      currency: 'points',
      balance: 250000,
      allocated: 200000,
      available: 50000,
      totalDistributed: 180000,
      monthlyBudget: 40000,
      status: 'active',
      ambassadorCount: 89,
      taskCount: 22,
      averageReward: 2200,
      lastActivity: '2024-01-15T12:15:00Z',
      createdDate: '2023-08-15T00:00:00Z',
      managedBy: 'Country Head NG',
      autoRefill: true,
      refillThreshold: 15000,
      healthStatus: 'warning'
    },
    {
      id: '3',
      name: 'US West Regional Pool',
      type: 'regional',
      location: 'California, Nevada, Oregon',
      currency: 'usd',
      balance: 75000,
      allocated: 65000,
      available: 10000,
      totalDistributed: 45000,
      monthlyBudget: 15000,
      status: 'active',
      ambassadorCount: 34,
      taskCount: 12,
      averageReward: 420,
      lastActivity: '2024-01-15T09:45:00Z',
      createdDate: '2023-09-01T00:00:00Z',
      managedBy: 'Regional Manager West',
      autoRefill: false,
      refillThreshold: 5000,
      healthStatus: 'critical'
    },
    {
      id: '4',
      name: 'EU Mixed Rewards Pool',
      type: 'regional',
      location: 'European Union',
      currency: 'mixed',
      balance: 125000,
      allocated: 100000,
      available: 25000,
      totalDistributed: 85000,
      monthlyBudget: 25000,
      status: 'active',
      ambassadorCount: 67,
      taskCount: 18,
      averageReward: 650,
      lastActivity: '2024-01-15T16:20:00Z',
      createdDate: '2023-07-10T00:00:00Z',
      managedBy: 'Regional Manager EU',
      autoRefill: true,
      refillThreshold: 10000,
      healthStatus: 'healthy'
    },
    {
      id: '5',
      name: 'APAC Emergency Pool',
      type: 'regional',
      location: 'Asia Pacific',
      currency: 'xlm',
      balance: 2500,
      allocated: 50000,
      available: 0,
      totalDistributed: 47500,
      monthlyBudget: 20000,
      status: 'depleted',
      ambassadorCount: 45,
      taskCount: 8,
      averageReward: 580,
      lastActivity: '2024-01-10T08:30:00Z',
      createdDate: '2023-10-01T00:00:00Z',
      managedBy: 'Regional Manager APAC',
      autoRefill: false,
      refillThreshold: 5000,
      healthStatus: 'critical'
    }
  ];

  const payoutHistory: PayoutHistory[] = [
    {
      id: '1',
      ambassadorName: 'John Doe',
      amount: 100,
      currency: 'XLM',
      type: 'token',
      status: 'completed',
      taskId: 'T001',
      taskName: 'Social Media Campaign',
      country: 'United States',
      walletAddress: 'GCKF...X4YK',
      transactionHash: '0x1234...5678',
      date: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      ambassadorName: 'Sarah Johnson',
      amount: 500,
      currency: 'points',
      type: 'points',
      status: 'completed',
      taskId: 'T002',
      taskName: 'Event Organization',
      country: 'Nigeria',
      date: '2024-01-14T15:45:00Z'
    }
  ];

  // Enhanced overview stats combining both pages
  const overviewStats = {
    totalPaidOut: 952500,
    activePools: 4,
    pendingPayouts: 8,
    totalAmbassadors: 245,
    totalBalance: 952500,
    totalDistributed: 707500,
    poolsNeedingAttention: 2,
    monthlyBudget: 200000,
    utilizationRate: 74.5
  };

  // Pool health monitoring from RewardPoolManagement
  const getPoolHealth = (pool: RewardPool) => {
    const utilizationRate = (pool.allocated / pool.balance) * 100;
    
    if (pool.status === 'depleted') return 'critical';
    if (utilizationRate > 90 || pool.available < pool.refillThreshold) return 'warning';
    return 'healthy';
  };

  // Filter pools based on search and filters
  const filteredPools = rewardPools.filter(pool => {
    const matchesSearch = pool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pool.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pool.managedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || pool.type === filterType;
    const matchesStatus = filterStatus === 'all' || pool.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'failed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'token': return Bitcoin;
      case 'fiat': return DollarSign;
      case 'points': return Coins;
      default: return Coins;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Balance</p>
              <p className="text-2xl font-bold text-gray-900">$952.5K</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                Available across pools
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Distributed</p>
              <p className="text-2xl font-bold text-gray-900">$707.5K</p>
              <p className="text-sm text-gray-500 mt-1">{overviewStats.utilizationRate}% utilization</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Pools</p>
              <p className="text-2xl font-bold text-gray-900">{overviewStats.activePools}</p>
              <p className="text-sm text-gray-500 mt-1">Across all regions</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Globe className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pools Need Attention</p>
              <p className="text-2xl font-bold text-gray-900">{overviewStats.poolsNeedingAttention}</p>
              <p className="text-sm text-orange-600 mt-1">Require action</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Pool Health Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Pool Health Overview</h3>
          <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {rewardPools.filter(pool => getPoolHealth(pool) !== 'healthy').map(pool => (
            <div key={pool.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{pool.name}</h4>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  getPoolHealth(pool) === 'critical' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                }`}>
                  {getPoolHealth(pool) === 'critical' ? 'Critical' : 'Warning'}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Available:</span>
                  <span className="font-medium">${pool.available.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Threshold:</span>
                  <span className="font-medium">${pool.refillThreshold.toLocaleString()}</span>
                </div>
                {pool.status === 'depleted' && (
                  <div className="mt-3 p-2 bg-red-50 rounded text-sm text-red-700">
                    Pool is depleted and needs immediate refill
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Plus className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Create Reward Pool</p>
              <p className="text-sm text-gray-500">Set up new country/token pool</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Coins className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Batch Payout</p>
              <p className="text-sm text-gray-500">Process multiple payments</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Settings className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Payout Settings</p>
              <p className="text-sm text-gray-500">Configure rates & rules</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderPools = () => (
    <div className="space-y-6">
      {/* Enhanced Header with Search and Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">Reward Pools</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {filteredPools.length} pools
          </span>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search pools, locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as typeof filterType)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="global">Global</option>
            <option value="country">Country</option>
            <option value="regional">Regional</option>
          </select>
          
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="depleted">Depleted</option>
          </select>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Create Pool</span>
          </button>
        </div>
      </div>

      {/* Enhanced Pool Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPools.map((pool) => {
          const healthStatus = getPoolHealth(pool);
          const utilizationRate = (pool.allocated / pool.balance) * 100;
          const TypeIcon = getTypeIcon(pool.currency);
          
          return (
            <div key={pool.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    healthStatus === 'healthy' ? 'bg-green-100' : 
                    healthStatus === 'warning' ? 'bg-orange-100' : 'bg-red-100'
                  }`}>
                    <TypeIcon className={`h-5 w-5 ${
                      healthStatus === 'healthy' ? 'text-green-600' : 
                      healthStatus === 'warning' ? 'text-orange-600' : 'text-red-600'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{pool.name}</h4>
                    <p className="text-sm text-gray-500 capitalize">{pool.type} pool</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  pool.status === 'active' ? 'bg-green-100 text-green-800' :
                  pool.status === 'depleted' ? 'bg-red-100 text-red-800' :
                  pool.status === 'suspended' ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {pool.status.charAt(0).toUpperCase() + pool.status.slice(1)}
                </span>
              </div>

              <div className="space-y-4">
                {/* Balance and Health */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-600">Available Balance</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      healthStatus === 'healthy' ? 'bg-green-100 text-green-700' :
                      healthStatus === 'warning' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {healthStatus}
                    </span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    ${pool.available.toLocaleString()}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full ${
                        utilizationRate > 90 ? 'bg-red-500' :
                        utilizationRate > 70 ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(utilizationRate, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{utilizationRate.toFixed(1)}% utilized</p>
                </div>

                {/* Pool Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Ambassadors</p>
                    <p className="font-medium">{pool.ambassadorCount}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Tasks</p>
                    <p className="font-medium">{pool.taskCount}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Avg Reward</p>
                    <p className="font-medium">${pool.averageReward}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Dist.</p>
                    <p className="font-medium">${pool.totalDistributed.toLocaleString()}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{pool.location}</span>
                  {pool.autoRefill && (
                    <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                      Auto-refill
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <Eye className="h-4 w-4 inline mr-1" />
                    View
                  </button>
                  <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    <Edit3 className="h-4 w-4 inline mr-1" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Empty State */}
      {filteredPools.length === 0 && (
        <div className="text-center py-12">
          <Wallet className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-sm font-medium text-gray-900">No pools found</h3>
          <p className="mt-2 text-sm text-gray-500">
            {searchTerm || filterType !== 'all' || filterStatus !== 'all' 
              ? 'Try adjusting your search or filters.' 
              : 'Get started by creating your first reward pool.'
            }
          </p>
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pool Performance Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Pool Performance</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg">7d</button>
              <button className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded-lg">30d</button>
              <button className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded-lg">90d</button>
            </div>
          </div>
          
          <div className="space-y-4">
            {rewardPools.slice(0, 3).map((pool, index) => (
              <div key={pool.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`h-3 w-3 rounded-full ${
                    index === 0 ? 'bg-green-500' :
                    index === 1 ? 'bg-blue-500' : 'bg-orange-500'
                  }`} />
                  <span className="text-sm font-medium text-gray-900">{pool.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">${pool.totalDistributed.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{pool.ambassadorCount} ambassadors</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Regional Distribution</h3>
          
          <div className="space-y-4">
            {[
              { region: 'Global', amount: 350000, percentage: 37, color: 'bg-blue-500' },
              { region: 'Nigeria', amount: 180000, percentage: 19, color: 'bg-green-500' },
              { region: 'US West', amount: 45000, percentage: 5, color: 'bg-purple-500' },
              { region: 'EU', amount: 85000, percentage: 9, color: 'bg-orange-500' },
              { region: 'APAC', amount: 47500, percentage: 5, color: 'bg-red-500' }
            ].map((item) => (
              <div key={item.region} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`h-3 w-3 rounded-full ${item.color}`} />
                  <span className="text-sm font-medium text-gray-900">{item.region}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${item.percentage * 2.7}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-16 text-right">${item.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Pool Analytics */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Detailed Pool Analytics</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pool</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distributed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ambassadors</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rewardPools.map((pool) => {
                const healthStatus = getPoolHealth(pool);
                const utilizationRate = (pool.allocated / pool.balance) * 100;
                
                return (
                  <tr key={pool.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{pool.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                        {pool.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${pool.balance.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${pool.totalDistributed.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              utilizationRate > 90 ? 'bg-red-500' :
                              utilizationRate > 70 ? 'bg-orange-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(utilizationRate, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">{utilizationRate.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        healthStatus === 'healthy' ? 'bg-green-100 text-green-800' :
                        healthStatus === 'warning' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {healthStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pool.ambassadorCount}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-900">Monthly Growth</h4>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">+12.5%</p>
          <p className="text-sm text-gray-500">vs previous month</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-900">Avg Pool Efficiency</h4>
            <Target className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">74.5%</p>
          <p className="text-sm text-gray-500">utilization rate</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-900">Critical Pools</h4>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{overviewStats.poolsNeedingAttention}</p>
          <p className="text-sm text-gray-500">need attention</p>
        </div>
      </div>
    </div>
  );

  const renderPayouts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Payout History</h3>
        <div className="flex space-x-2">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ambassador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payoutHistory.map((payout) => (
                <tr key={payout.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{payout.ambassadorName}</div>
                    {payout.walletAddress && (
                      <div className="text-sm text-gray-500">{payout.walletAddress}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {payout.amount} {payout.currency}
                    </div>
                    <div className="text-sm text-gray-500 capitalize">{payout.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payout.taskName}</div>
                    <div className="text-sm text-gray-500">{payout.taskId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payout.country}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payout.status)}`}>
                      {payout.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(payout.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-500">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Rewards Management</h1>
        <p className="text-gray-600">Manage reward pools, payouts, and distribution across your ambassador network</p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'pools', label: 'Reward Pools', icon: Wallet },
            { id: 'payouts', label: 'Payout History', icon: CreditCard },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'settings', label: 'Settings', icon: Settings }
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
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'pools' && renderPools()}
      {activeTab === 'payouts' && renderPayouts()}
      {activeTab === 'analytics' && renderAnalytics()}
      {activeTab === 'settings' && (
        <div className="text-center py-12">
          <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Settings Coming Soon</h3>
          <p className="text-gray-600">Payout settings and configuration options will be available here.</p>
        </div>
      )}
    </div>
  );
};

export default RewardsManagement;
