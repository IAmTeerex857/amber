import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Users,
  User,
  TrendingUp,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Download,
  Star,
  Calendar,
  Target,
  DollarSign,
  BarChart3,
  Filter,
  Search,
  RefreshCw,
  Send,
  MessageSquare,
  Award,
  Zap,
  Globe,
  Mail,
  Bell,
  MoreHorizontal,
  ChevronRight,
  TrendingDown,
  Brain
} from 'lucide-react';

interface Ambassador {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  region: string;
  joinedDate: string;
  totalReports: number;
  reportingStreak: number;
  averageRating: number;
  status: 'active' | 'inactive' | 'on_leave';
}

interface AmbassadorReport {
  id: string;
  ambassadorId: string;
  ambassadorName: string;
  ambassadorEmail: string;
  reportingPeriod: { month: number; year: number };
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'revision_requested';
  submittedAt: string;
  reviewedAt?: string;
  lastModified: string;
  priority: 'high' | 'medium' | 'low';
  metrics: {
    contentCreated: number;
    eventsHosted: number;
    newMembers: number;
    socialReach: number;
    totalExpenses: number;
    engagementRate: number;
  };
  summary: {
    executiveSummary: string;
    keyAchievements: string[];
    challengesFaced: string;
  };
  reviewNotes?: string;
  rating?: number;
}

interface RegionalMetrics {
  totalAmbassadors: number;
  activeAmbassadors: number;
  pendingReports: number;
  approvedReports: number;
  totalContentCreated: number;
  totalEventsHosted: number;
  totalNewMembers: number;
  totalSocialReach: number;
  totalExpenses: number;
  averageRating: number;
  reportingCompliance: number; // percentage
}

interface PresidentReportDashboardProps {
  regionId?: string;
  onViewReport?: (reportId: string) => void;
  onReviewReport?: (reportId: string) => void;
  onGenerateCumulative?: () => void;
}

const PresidentReportDashboard: React.FC<PresidentReportDashboardProps> = ({
  regionId,
  onViewReport,
  onReviewReport,
  onGenerateCumulative
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'ai-reports'>('overview');
  const [reports, setReports] = useState<AmbassadorReport[]>([]);
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [metrics, setMetrics] = useState<RegionalMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Mock data - replace with actual API calls
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock ambassadors
        const mockAmbassadors: Ambassador[] = [
          {
            id: 'amb-001',
            name: 'Alex Johnson',
            email: 'alex.johnson@email.com',
            avatar: '/api/placeholder/40/40',
            region: 'North America',
            joinedDate: '2023-08-15',
            totalReports: 8,
            reportingStreak: 6,
            averageRating: 4.8,
            status: 'active'
          },
          {
            id: 'amb-002',
            name: 'Maria Garcia',
            email: 'maria.garcia@email.com',
            avatar: '/api/placeholder/40/40',
            region: 'North America',
            joinedDate: '2023-09-01',
            totalReports: 7,
            reportingStreak: 7,
            averageRating: 4.9,
            status: 'active'
          },
          {
            id: 'amb-003',
            name: 'David Kim',
            email: 'david.kim@email.com',
            avatar: '/api/placeholder/40/40',
            region: 'North America',
            joinedDate: '2023-10-10',
            totalReports: 5,
            reportingStreak: 3,
            averageRating: 4.2,
            status: 'active'
          }
        ];

        // Mock reports
        const mockReports: AmbassadorReport[] = [
          {
            id: 'report-001',
            ambassadorId: 'amb-001',
            ambassadorName: 'Alex Johnson',
            ambassadorEmail: 'alex.johnson@email.com',
            reportingPeriod: { month: 2, year: 2024 },
            status: 'submitted',
            submittedAt: '2024-03-01T10:00:00Z',
            lastModified: '2024-03-01T10:00:00Z',
            priority: 'high',
            metrics: {
              contentCreated: 15,
              eventsHosted: 2,
              newMembers: 127,
              socialReach: 45000,
              totalExpenses: 750,
              engagementRate: 12.5
            },
            summary: {
              executiveSummary: 'March was a productive month with strong content performance and successful event execution.',
              keyAchievements: ['Viral TikTok video', 'Successful partnership event', 'New content series launch'],
              challengesFaced: 'Weather affected outdoor events'
            }
          },
          {
            id: 'report-002',
            ambassadorId: 'amb-002',
            ambassadorName: 'Maria Garcia',
            ambassadorEmail: 'maria.garcia@email.com',
            reportingPeriod: { month: 2, year: 2024 },
            status: 'under_review',
            submittedAt: '2024-02-28T14:30:00Z',
            lastModified: '2024-02-28T14:30:00Z',
            priority: 'medium',
            metrics: {
              contentCreated: 12,
              eventsHosted: 1,
              newMembers: 89,
              socialReach: 38000,
              totalExpenses: 620,
              engagementRate: 15.2
            },
            summary: {
              executiveSummary: 'Focused on Spanish-speaking community outreach with excellent engagement results.',
              keyAchievements: ['Spanish language content series', 'Community partnership', 'High engagement rates'],
              challengesFaced: 'Translation challenges for technical content'
            }
          },
          {
            id: 'report-003',
            ambassadorId: 'amb-003',
            ambassadorName: 'David Kim',
            ambassadorEmail: 'david.kim@email.com',
            reportingPeriod: { month: 2, year: 2024 },
            status: 'submitted',
            submittedAt: '2024-03-02T09:15:00Z',
            lastModified: '2024-03-02T09:15:00Z',
            priority: 'low',
            metrics: {
              contentCreated: 8,
              eventsHosted: 1,
              newMembers: 45,
              socialReach: 22000,
              totalExpenses: 380,
              engagementRate: 8.9
            },
            summary: {
              executiveSummary: 'Steady progress with focus on developer community engagement.',
              keyAchievements: ['Developer workshop', 'Technical blog posts', 'GitHub contributions'],
              challengesFaced: 'Limited time due to other commitments'
            }
          }
        ];

        // Mock regional metrics
        const mockMetrics: RegionalMetrics = {
          totalAmbassadors: 3,
          activeAmbassadors: 3,
          pendingReports: 2,
          approvedReports: 1,
          totalContentCreated: 35,
          totalEventsHosted: 4,
          totalNewMembers: 261,
          totalSocialReach: 105000,
          totalExpenses: 1750,
          averageRating: 4.6,
          reportingCompliance: 100
        };

        setAmbassadors(mockAmbassadors);
        setReports(mockReports);
        setMetrics(mockMetrics);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [regionId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'text-blue-600 bg-blue-100';
      case 'under_review': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'revision_requested': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleBulkAction = (action: 'approve' | 'review' | 'export') => {
    console.log(`Bulk ${action} for reports:`, selectedReports);
    setSelectedReports([]);
    setShowBulkActions(false);
  };

  const pendingReports = reports.filter(r => ['submitted', 'under_review'].includes(r.status));
  const urgentReports = pendingReports.filter(r => r.priority === 'high');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">
            Review and manage ambassador reports for {user?.chapterId || 'your region'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {urgentReports.length > 0 && (
            <div className="flex items-center space-x-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-red-700">
                {urgentReports.length} urgent report{urgentReports.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
          <button
            onClick={() => window.location.reload()}
            className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          {onGenerateCumulative && (
            <button
              onClick={onGenerateCumulative}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Zap className="h-4 w-4 mr-2" />
              Generate AI Summary
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: BarChart3 },
            { id: 'reports', name: 'Reports', icon: FileText },
            { id: 'ai-reports', name: 'AI Cumulative Reports', icon: Brain }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="h-5 w-5 mr-2" />
                {tab.name}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && metrics && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900">{metrics.activeAmbassadors}</p>
                  <p className="text-gray-600">Active Ambassadors</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900">{metrics.pendingReports}</p>
                  <p className="text-gray-600">Pending Reports</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900">{metrics.totalContentCreated}</p>
                  <p className="text-gray-600">Content Pieces</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-semibold text-gray-900">
                    {(metrics.totalSocialReach / 1000).toFixed(0)}K
                  </p>
                  <p className="text-gray-600">Social Reach</p>
                </div>
              </div>
            </div>
          </div>

          {/* Regional Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Reporting Compliance</span>
                  <span className="font-semibold text-green-600">{metrics.reportingCompliance}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${metrics.reportingCompliance}%` }}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Average Rating</span>
                  <span className="font-semibold text-yellow-600">{metrics.averageRating}/5 ⭐</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Events Hosted</span>
                  <span className="font-semibold text-blue-600">{metrics.totalEventsHosted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">New Members Added</span>
                  <span className="font-semibold text-purple-600">{metrics.totalNewMembers}</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Report Activity</h3>
              <div className="space-y-4">
                {reports.slice(0, 3).map((report) => (
                  <div key={report.id} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <FileText className="h-4 w-4 text-gray-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {report.ambassadorName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {monthNames[report.reportingPeriod.month]} report submitted
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
            <div className="flex items-start space-x-4">
              <Zap className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">📈 Performance Trends</h4>
                    <p className="text-sm text-gray-600">
                      Content creation is up 23% this month. Maria Garcia leads in engagement rates.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">🎯 Recommendations</h4>
                    <p className="text-sm text-gray-600">
                      Consider organizing more collaborative events. Ambassadors show higher performance when working together.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Filters and Search */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search ambassadors or reports..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Reports</option>
                <option value="submitted">Recent Submissions</option>
                <option value="this-month">This Month</option>
              </select>

            </div>
          </div>



          {/* Ambassador Reports List */}
          <div className="space-y-6">
            {ambassadors.map((ambassador) => {
              const ambassadorReports = reports.filter(r => r.ambassadorId === ambassador.id);
              
              return (
                <div key={ambassador.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  {/* Ambassador Header */}
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold text-gray-900">{ambassador.name}</h3>
                            <div className={`w-2 h-2 rounded-full ${
                              ambassador.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                            }`}></div>
                          </div>
                          <p className="text-sm text-gray-600">{ambassador.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-xl font-bold text-gray-900">{ambassador.totalReports}</p>
                          <p className="text-xs text-gray-500">Total Reports</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center space-x-1">
                            <span className="text-xl font-bold text-gray-900">{ambassador.averageRating}</span>
                            <Star className="h-5 w-5 text-yellow-500 fill-current" />
                          </div>
                          <p className="text-xs text-gray-500">Avg Rating</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Report Submissions */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Monthly Submissions</h4>
                      <span className="text-sm text-gray-500">
                        {ambassadorReports.length} report{ambassadorReports.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    {ambassadorReports.length > 0 ? (
                      <div className="space-y-3">
                        {ambassadorReports.slice(0, 3).map((report) => (
                          <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span className="font-medium text-gray-900">
                                  {monthNames[report.reportingPeriod.month]} {report.reportingPeriod.year}
                                </span>
                              </div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                report.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                                report.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                                report.status === 'approved' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {report.status.replace('_', ' ')}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-6">
                              {/* Quick Metrics */}
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>{report.metrics.contentCreated} content</span>
                                <span>{report.metrics.eventsHosted} events</span>
                                <span>{report.metrics.newMembers} members</span>
                                <span>${report.metrics.totalExpenses}</span>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => onViewReport?.(report.id)}
                                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                  <Eye className="h-4 w-4 inline mr-1" />
                                  View
                                </button>
                                <button className="text-gray-400 hover:text-gray-600">
                                  <MoreHorizontal className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {ambassadorReports.length > 3 && (
                          <button className="w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium py-2">
                            View all {ambassadorReports.length} reports →
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No reports submitted yet</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Cumulative Reports Tab */}
      {activeTab === 'ai-reports' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">AI-Generated Cumulative Reports</h3>
                <p className="text-gray-600">Automatically generated regional summaries from all ambassador submissions</p>
              </div>
            </div>
          </div>

          {/* Available AI Reports */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                id: 'march-2024',
                period: 'March 2024',
                region: 'North America',
                confidence: '92%',
                status: 'ready',
                generatedAt: '2024-04-01',
                ambassadorReports: 3,
                highlights: ['Exceptional content performance', 'Strong community growth', 'Above-average engagement']
              },
              {
                id: 'feb-2024',
                period: 'February 2024',
                region: 'North America',
                confidence: '88%',
                status: 'ready',
                generatedAt: '2024-03-01',
                ambassadorReports: 3,
                highlights: ['Solid event execution', 'Content creation growth', 'New partnership initiatives']
              }
            ].map((report) => (
              <div key={report.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{report.period}</h4>
                    <p className="text-sm text-gray-600">{report.region}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      AI Confidence: {report.confidence}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <FileText className="h-4 w-4 mr-2" />
                    Based on {report.ambassadorReports} ambassador reports
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Generated {new Date(report.generatedAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Key Highlights:</h5>
                  <ul className="space-y-1">
                    {report.highlights.map((highlight, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start">
                        <span className="w-1 h-1 bg-purple-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <button 
                    onClick={() => window.location.href = `/reports/cumulative/${report.id}`}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    <Eye className="h-4 w-4 inline mr-2" />
                    View Report
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    <Download className="h-4 w-4 inline mr-2" />
                    Export
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    <Send className="h-4 w-4 inline mr-2" />
                    Send to Org
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Generate New Report */}
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="font-semibold text-gray-900 mb-2">Generate New AI Report</h4>
            <p className="text-gray-600 mb-4">
              Create a new cumulative report from recent ambassador submissions
            </p>
            <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
              <Zap className="h-4 w-4 inline mr-2" />
              Generate Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PresidentReportDashboard;
