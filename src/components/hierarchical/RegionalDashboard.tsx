import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  MapPin,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  User,
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
  ArrowDownLeft,
  Star,
  MessageSquare,
  Phone
} from 'lucide-react';

interface AmbassadorData {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  joinedDate: string;
  totalRewards: number;
  tasksCompleted: number;
  completionRate: number;
  rank: number;
  status: 'active' | 'inactive' | 'new' | 'top_performer';
  lastActive: string;
  specialties: string[];
}

interface RegionalMetrics {
  regionName: string;
  regionType: 'state' | 'province' | 'city' | 'district';
  parentCountry: string;
  totalAmbassadors: number;
  activeAmbassadors: number;
  totalRewards: number;
  monthlyRewards: number;
  avgCompletionRate: number;
  monthlyGrowth: number;
  topAmbassadors: AmbassadorData[];
  recentActivities: RegionalActivity[];
}

interface RegionalActivity {
  id: string;
  type: 'ambassador_joined' | 'task_completed' | 'milestone' | 'payout' | 'issue';
  ambassador: string;
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

const RegionalDashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedRegion, setSelectedRegion] = useState<string>('lagos'); // Default region
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedView, setSelectedView] = useState<'overview' | 'ambassadors' | 'analytics'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock regional data - would come from props or API based on user's region
  const regionalMetrics: RegionalMetrics = {
    regionName: 'Lagos State',
    regionType: 'state',
    parentCountry: 'Nigeria',
    totalAmbassadors: 567,
    activeAmbassadors: 445,
    totalRewards: 1850000,
    monthlyRewards: 285000,
    avgCompletionRate: 92.1,
    monthlyGrowth: 32.4,
    topAmbassadors: [
      {
        id: '1',
        name: 'Adebayo Johnson',
        avatar: '/api/placeholder/40/40',
        email: 'adebayo@example.com',
        phone: '+234 901 234 5678',
        joinedDate: '2023-08-15',
        totalRewards: 45750,
        tasksCompleted: 127,
        completionRate: 96.8,
        rank: 1,
        status: 'top_performer',
        lastActive: '2024-01-15T11:45:00Z',
        specialties: ['Social Media', 'Content Creation', 'Community']
      },
      {
        id: '2',
        name: 'Funmi Okafor',
        avatar: '/api/placeholder/40/40',
        email: 'funmi@example.com',
        phone: '+234 902 345 6789',
        joinedDate: '2023-09-02',
        totalRewards: 42300,
        tasksCompleted: 118,
        completionRate: 94.2,
        rank: 2,
        status: 'active',
        lastActive: '2024-01-15T10:30:00Z',
        specialties: ['Photography', 'Events', 'Brand Advocacy']
      },
      {
        id: '3',
        name: 'Kemi Adewale',
        avatar: '/api/placeholder/40/40',
        email: 'kemi@example.com',
        phone: '+234 903 456 7890',
        joinedDate: '2023-07-20',
        totalRewards: 38950,
        tasksCompleted: 103,
        completionRate: 89.5,
        rank: 3,
        status: 'active',
        lastActive: '2024-01-15T09:15:00Z',
        specialties: ['Influencer Marketing', 'Digital Content']
      },
      {
        id: '4',
        name: 'Tunde Bakare',
        avatar: '/api/placeholder/40/40',
        email: 'tunde@example.com',
        phone: '+234 904 567 8901',
        joinedDate: '2023-11-10',
        totalRewards: 15200,
        tasksCompleted: 34,
        completionRate: 85.0,
        rank: 47,
        status: 'new',
        lastActive: '2024-01-15T08:45:00Z',
        specialties: ['Campus Outreach', 'Student Engagement']
      }
    ],
    recentActivities: [
      {
        id: '1',
        type: 'milestone',
        ambassador: 'Adebayo Johnson',
        message: 'Completed 125th task and reached top performer status',
        timestamp: '2024-01-15T11:45:00Z',
        severity: 'low'
      },
      {
        id: '2',
        type: 'ambassador_joined',
        ambassador: 'New Ambassadors',
        message: '8 new ambassadors joined this week',
        timestamp: '2024-01-15T10:30:00Z',
        severity: 'low'
      },
      {
        id: '3',
        type: 'payout',
        ambassador: 'Monthly Payouts',
        message: '₦285K in rewards distributed to 445 ambassadors',
        timestamp: '2024-01-15T09:00:00Z',
        severity: 'low'
      },
      {
        id: '4',
        type: 'task_completed',
        ambassador: 'Funmi Okafor',
        message: 'Completed social media campaign with 98% engagement rate',
        timestamp: '2024-01-14T16:20:00Z',
        severity: 'low'
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'top_performer': return 'bg-yellow-100 text-yellow-800';
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-red-100 text-red-800';
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
      case 'ambassador_joined': return UserPlus;
      case 'task_completed': return CheckCircle;
      case 'payout': return DollarSign;
      case 'issue': return AlertTriangle;
      default: return Activity;
    }
  };

  const filteredAmbassadors = regionalMetrics.topAmbassadors.filter(ambassador =>
    ambassador.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ambassador.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <MapPin className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{regionalMetrics.regionName}</h1>
            <p className="text-gray-600 mt-1">{regionalMetrics.parentCountry} • Regional Management Dashboard</p>
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
            <span>Recruit Ambassadors</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Regional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Ambassadors</p>
              <p className="text-3xl font-bold text-gray-900">{regionalMetrics.totalAmbassadors}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-green-600 font-medium">{regionalMetrics.activeAmbassadors}</span>
            <span className="text-gray-500 ml-1">active this month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Rewards</p>
              <p className="text-3xl font-bold text-gray-900">₦{(regionalMetrics.totalRewards / 1000000).toFixed(1)}M</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-purple-600 font-medium">₦{(regionalMetrics.monthlyRewards / 1000).toFixed(0)}K</span>
            <span className="text-gray-500 ml-1">this month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-3xl font-bold text-gray-900">{regionalMetrics.avgCompletionRate}%</p>
            </div>
            <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">+4.2%</span>
            <span className="text-gray-500 ml-1">vs last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Growth</p>
              <p className="text-3xl font-bold text-gray-900">{regionalMetrics.monthlyGrowth}%</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">Above target</span>
            <span className="text-gray-500 ml-1">(25% goal)</span>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'overview', label: 'Ambassador Overview', icon: Users },
            { id: 'ambassadors', label: 'Manage Ambassadors', icon: User },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
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
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Ambassadors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {regionalMetrics.topAmbassadors.slice(0, 4).map((ambassador) => (
                <div key={ambassador.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="relative">
                    <img 
                      src={ambassador.avatar} 
                      alt={ambassador.name}
                      className="w-12 h-12 rounded-full"
                    />
                    {ambassador.status === 'top_performer' && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Star className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{ambassador.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ambassador.status)}`}>
                        #{ambassador.rank}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {ambassador.tasksCompleted} tasks • {ambassador.completionRate}% completion
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {ambassador.specialties.slice(0, 2).map((specialty) => (
                        <span key={specialty} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₦{ambassador.totalRewards.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">total rewards</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedView === 'ambassadors' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Ambassador Management</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Search ambassadors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="h-4 w-4" />
                  <span>Add Ambassador</span>
                </button>
              </div>
            </div>
            
            <div className="overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ambassador</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rewards</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAmbassadors.map((ambassador) => (
                    <tr key={ambassador.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={ambassador.avatar} 
                            alt={ambassador.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{ambassador.name}</p>
                            <p className="text-sm text-gray-500">Joined {new Date(ambassador.joinedDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ambassador.status)}`}>
                          {ambassador.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{ambassador.tasksCompleted} tasks</p>
                          <p className="text-sm text-gray-500">{ambassador.completionRate}% completion</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-medium text-gray-900">₦{ambassador.totalRewards.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Rank #{ambassador.rank}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                            <MessageSquare className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                            <Phone className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Settings className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedView === 'analytics' && (
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Regional analytics dashboard</p>
              <p className="text-sm text-gray-500 mt-1">Ambassador performance trends and insights</p>
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
          {regionalMetrics.recentActivities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon className="h-4 w-4 text-blue-600" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{activity.ambassador}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(activity.severity)}`}>
                      {activity.type.replace('_', ' ')}
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

export default RegionalDashboard;
