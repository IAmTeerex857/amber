import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Edit3,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  FileText,
  AlertCircle,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  RefreshCw,
  Archive,
  BarChart3
} from 'lucide-react';

interface MonthlyReport {
  id: string;
  reportingPeriod: {
    month: number;
    year: number;
  };
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'revision_requested';
  submittedAt?: string;
  reviewedAt?: string;
  reviewer?: string;
  lastModified: string;
  summary: {
    executiveSummary: string;
    keyAchievements: string[];
  };
  metrics: {
    contentCreated: number;
    eventsHosted: number;
    newMembers: number;
    socialReach: number;
    totalExpenses: number;
  };
  feedback?: {
    reviewerComments?: string;
    rating?: number;
  };
  exportUrl?: string;
}

interface ReportHistoryProps {
  onViewReport?: (reportId: string) => void;
  onEditReport?: (reportId: string) => void;
  onNewReport?: () => void;
}

const ReportHistory: React.FC<ReportHistoryProps> = ({
  onViewReport,
  onEditReport,
  onNewReport
}) => {
  const { user } = useAuth();
  const [reports, setReports] = useState<MonthlyReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<number>(new Date().getFullYear());
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'status'>('newest');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Mock data - replace with actual API call
  useEffect(() => {
    const loadReports = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockReports: MonthlyReport[] = [
          {
            id: 'report-2024-01',
            reportingPeriod: { month: 0, year: 2024 },
            status: 'approved',
            submittedAt: '2024-02-01T10:00:00Z',
            reviewedAt: '2024-02-03T14:30:00Z',
            reviewer: 'Sarah Johnson',
            lastModified: '2024-02-01T10:00:00Z',
            summary: {
              executiveSummary: 'January was a strong month with significant community growth and successful content campaigns.',
              keyAchievements: ['Launched new content series', 'Organized successful meetup', 'Increased social media following by 25%']
            },
            metrics: {
              contentCreated: 15,
              eventsHosted: 2,
              newMembers: 127,
              socialReach: 45000,
              totalExpenses: 750
            },
            feedback: {
              reviewerComments: 'Excellent work this month. The content quality was outstanding.',
              rating: 5
            },
            exportUrl: '/reports/january-2024.pdf'
          },
          {
            id: 'report-2024-02',
            reportingPeriod: { month: 1, year: 2024 },
            status: 'under_review',
            submittedAt: '2024-03-01T09:15:00Z',
            lastModified: '2024-03-01T09:15:00Z',
            summary: {
              executiveSummary: 'February focused on community engagement and partnership development.',
              keyAchievements: ['Secured 3 new partnerships', 'Hosted virtual conference', 'Achieved 90% engagement rate']
            },
            metrics: {
              contentCreated: 12,
              eventsHosted: 1,
              newMembers: 89,
              socialReach: 38000,
              totalExpenses: 620
            }
          },
          {
            id: 'report-2024-03',
            reportingPeriod: { month: 2, year: 2024 },
            status: 'draft',
            lastModified: '2024-03-25T16:45:00Z',
            summary: {
              executiveSummary: 'March activities included...',
              keyAchievements: ['Started new initiative']
            },
            metrics: {
              contentCreated: 8,
              eventsHosted: 1,
              newMembers: 0,
              socialReach: 0,
              totalExpenses: 0
            }
          },
          {
            id: 'report-2023-12',
            reportingPeriod: { month: 11, year: 2023 },
            status: 'approved',
            submittedAt: '2024-01-02T11:30:00Z',
            reviewedAt: '2024-01-05T10:15:00Z',
            reviewer: 'Michael Chen',
            lastModified: '2024-01-02T11:30:00Z',
            summary: {
              executiveSummary: 'December wrapped up the year with strong performance across all metrics.',
              keyAchievements: ['Year-end summary completed', 'Holiday campaign success', 'Community milestone reached']
            },
            metrics: {
              contentCreated: 20,
              eventsHosted: 3,
              newMembers: 156,
              socialReach: 52000,
              totalExpenses: 890
            },
            feedback: {
              reviewerComments: 'Great year-end performance. Looking forward to continued success.',
              rating: 4
            },
            exportUrl: '/reports/december-2023.pdf'
          }
        ];
        
        setReports(mockReports);
      } catch (error) {
        console.error('Failed to load reports:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-gray-600 bg-gray-100';
      case 'submitted': return 'text-blue-600 bg-blue-100';
      case 'under_review': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'revision_requested': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return Edit3;
      case 'submitted': return Clock;
      case 'under_review': return RefreshCw;
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      case 'revision_requested': return AlertCircle;
      default: return FileText;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredReports = reports
    .filter(report => {
      const matchesSearch = searchTerm === '' || 
        report.summary.executiveSummary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        monthNames[report.reportingPeriod.month].toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
      const matchesYear = report.reportingPeriod.year === yearFilter;
      
      return matchesSearch && matchesStatus && matchesYear;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.reportingPeriod.year - a.reportingPeriod.year || 
                 b.reportingPeriod.month - a.reportingPeriod.month;
        case 'oldest':
          return a.reportingPeriod.year - b.reportingPeriod.year || 
                 a.reportingPeriod.month - b.reportingPeriod.month;
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  // Calculate summary statistics
  const stats = {
    total: reports.length,
    approved: reports.filter(r => r.status === 'approved').length,
    pending: reports.filter(r => ['submitted', 'under_review'].includes(r.status)).length,
    drafts: reports.filter(r => r.status === 'draft').length,
    totalContent: reports.reduce((sum, r) => sum + r.metrics.contentCreated, 0),
    totalEvents: reports.reduce((sum, r) => sum + r.metrics.eventsHosted, 0),
    totalNewMembers: reports.reduce((sum, r) => sum + r.metrics.newMembers, 0),
    averageRating: reports
      .filter(r => r.feedback?.rating)
      .reduce((sum, r) => sum + (r.feedback?.rating || 0), 0) / 
      reports.filter(r => r.feedback?.rating).length || 0
  };

  const availableYears = [...new Set(reports.map(r => r.reportingPeriod.year))].sort((a, b) => b - a);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading report history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Report History</h1>
          <p className="text-gray-600 mt-1">Track your monthly ambassador reports and their status</p>
        </div>
        {onNewReport && (
          <button
            onClick={onNewReport}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </button>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              <p className="text-gray-600">Total Reports</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{stats.approved}</p>
              <p className="text-gray-600">Approved</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
              <p className="text-gray-600">Pending Review</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">
                {stats.averageRating ? stats.averageRating.toFixed(1) : '—'}
              </p>
              <p className="text-gray-600">Avg Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search reports..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Year Filter */}
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="status">By Status</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredReports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-600">No reports match your current filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredReports.map((report) => {
              const StatusIcon = getStatusIcon(report.status);
              
              return (
                <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {monthNames[report.reportingPeriod.month]} {report.reportingPeriod.year}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {report.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-4 line-clamp-2">
                        {report.summary.executiveSummary}
                      </p>
                      
                      {/* Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                        <div className="text-center">
                          <p className="text-lg font-semibold text-gray-900">{report.metrics.contentCreated}</p>
                          <p className="text-xs text-gray-600">Content</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-gray-900">{report.metrics.eventsHosted}</p>
                          <p className="text-xs text-gray-600">Events</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-gray-900">{report.metrics.newMembers}</p>
                          <p className="text-xs text-gray-600">New Members</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-gray-900">
                            {report.metrics.socialReach > 0 ? `${(report.metrics.socialReach / 1000).toFixed(0)}K` : '—'}
                          </p>
                          <p className="text-xs text-gray-600">Reach</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-gray-900">
                            ${report.metrics.totalExpenses}
                          </p>
                          <p className="text-xs text-gray-600">Expenses</p>
                        </div>
                      </div>
                      
                      {/* Dates and Review Info */}
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Modified: {formatDate(report.lastModified)}</span>
                        {report.submittedAt && (
                          <span>Submitted: {formatDate(report.submittedAt)}</span>
                        )}
                        {report.reviewer && (
                          <span>Reviewed by: {report.reviewer}</span>
                        )}
                        {report.feedback?.rating && (
                          <span className="flex items-center">
                            Rating: {report.feedback.rating}/5 ⭐
                          </span>
                        )}
                      </div>
                      
                      {/* Feedback */}
                      {report.feedback?.reviewerComments && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800 font-medium">Reviewer Feedback:</p>
                          <p className="text-sm text-blue-700 mt-1">{report.feedback.reviewerComments}</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      {onViewReport && (
                        <button
                          onClick={() => onViewReport(report.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="View report"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      )}
                      
                      {report.status === 'draft' && onEditReport && (
                        <button
                          onClick={() => onEditReport(report.id)}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="Edit report"
                        >
                          <Edit3 className="h-5 w-5" />
                        </button>
                      )}
                      
                      {report.exportUrl && (
                        <button
                          onClick={() => window.open(report.exportUrl, '_blank')}
                          className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                          title="Download report"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                      )}
                      
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={onNewReport}
            className="flex items-center justify-center p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-300 transition-colors"
          >
            <Plus className="h-5 w-5 text-blue-600 mr-2" />
            <span className="font-medium text-blue-700">Create New Report</span>
          </button>
          <button className="flex items-center justify-center p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-300 transition-colors">
            <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
            <span className="font-medium text-blue-700">View Analytics</span>
          </button>
          <button className="flex items-center justify-center p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-300 transition-colors">
            <Archive className="h-5 w-5 text-blue-600 mr-2" />
            <span className="font-medium text-blue-700">Export All Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportHistory;
