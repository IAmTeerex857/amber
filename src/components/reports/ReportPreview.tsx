import React, { useState } from 'react';
import {
  Calendar,
  User,
  Building2,
  Target,
  BarChart3,
  DollarSign,
  MessageSquare,
  Edit,
  Download,
  Send,
  ArrowLeft,
  Image,
  Video,
  FileText,
  Users,
  TrendingUp,
  Award,
  Clock,
  MapPin,
  ExternalLink,
  Printer
} from 'lucide-react';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  preview?: string;
  caption?: string;
  url?: string;
}

interface EventDetail {
  id: string;
  name: string;
  date: string;
  location: string;
  attendeeCount: number;
  attendeeList?: string;
  description: string;
  budget?: number;
  outcomes: string;
}

interface MonthlyReportData {
  reportingPeriod: {
    month: number;
    year: number;
    startDate: string;
    endDate: string;
  };
  summary: {
    executiveSummary: string;
    keyAchievements: string[];
    challenges: string[];
    nextMonthGoals: string[];
  };
  activities: {
    contentCreation: {
      description: string;
      count: number;
      mediaFiles: MediaFile[];
      links: any[];
    };
    events: {
      description: string;
      eventDetails: EventDetail[];
      totalAttendees: number;
      totalBudget: number;
    };
    communityEngagement: {
      description: string;
      discordActivity: string;
      socialMediaActivity: string;
      partnershipWork: string;
    };
    other: {
      description: string;
      customActivities: string[];
    };
  };
  impact: {
    quantitativeMetrics: {
      newCommunityMembers: number;
      socialMediaReach: number;
      contentEngagement: number;
      eventsHosted: number;
    };
    qualitativeImpact: string;
    testimonials: string[];
  };
  expenses: {
    totalAmount: number;
    breakdown: Array<{
      category: string;
      amount: number;
      description: string;
      receipts: MediaFile[];
    }>;
  };
  feedback: {
    challengesFaced: string;
    supportNeeded: string;
    suggestions: string;
  };
}

interface ReportPreviewProps {
  reportData: MonthlyReportData;
  authorName?: string;
  authorEmail?: string;
  organizationName?: string;
  onEdit?: (section: string) => void;
  onSubmit?: () => void;
  onBack?: () => void;
  onExport?: (format: 'pdf' | 'docx') => void;
  isSubmitting?: boolean;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({
  reportData,
  authorName = "Ambassador Name",
  authorEmail = "ambassador@email.com",
  organizationName = "Stellar Development Foundation",
  onEdit,
  onSubmit,
  onBack,
  onExport,
  isSubmitting = false
}) => {
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getFileIcon = (type: 'image' | 'video' | 'document') => {
    switch (type) {
      case 'image': return Image;
      case 'video': return Video;
      case 'document': return FileText;
      default: return FileText;
    }
  };

  const totalEvents = reportData.activities.events.eventDetails.length;
  const totalAttendees = reportData.activities.events.eventDetails.reduce(
    (sum, event) => sum + event.attendeeCount, 0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Edit
              </button>
            )}
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Report Preview</h1>
              <p className="text-sm text-gray-600">Review your monthly report before submission</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.print()}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </button>
            {onExport && (
              <button
                onClick={() => onExport('pdf')}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </button>
            )}
            {onSubmit && (
              <button
                onClick={() => setShowSubmitConfirm(true)}
                disabled={isSubmitting}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="max-w-4xl mx-auto py-8 px-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden print:shadow-none print:border-none">
          
          {/* Report Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Monthly Ambassador Report</h1>
                <p className="text-blue-100 mt-2">
                  {monthNames[reportData.reportingPeriod.month]} {reportData.reportingPeriod.year}
                </p>
              </div>
              <div className="text-right">
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <Calendar className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">Reporting Period</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ambassador Info */}
          <div className="p-8 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <User className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Ambassador</p>
                  <p className="text-gray-900">{authorName}</p>
                  <p className="text-sm text-gray-600">{authorEmail}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Building2 className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Organization</p>
                  <p className="text-gray-900">{organizationName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Generated</p>
                  <p className="text-gray-900">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Overview */}
          <div className="p-8 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Key Metrics</h2>
              {onEdit && (
                <button
                  onClick={() => onEdit('impact')}
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">New Members</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reportData.impact.quantitativeMetrics.newCommunityMembers.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Social Reach</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reportData.impact.quantitativeMetrics.socialMediaReach.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Target className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Content Created</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reportData.activities.contentCreation.count}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Events Hosted</p>
                    <p className="text-2xl font-bold text-gray-900">{totalEvents}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Executive Summary</h2>
              {onEdit && (
                <button
                  onClick={() => onEdit('summary')}
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
              )}
            </div>
            
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {reportData.summary.executiveSummary}
              </p>
            </div>

            {reportData.summary.keyAchievements.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Key Achievements</h3>
                <ul className="space-y-2">
                  {reportData.summary.keyAchievements.map((achievement, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Award className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Activities */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Activities</h2>
              {onEdit && (
                <button
                  onClick={() => onEdit('activities')}
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
              )}
            </div>

            {/* Content Creation */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Content Creation</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 mb-4">{reportData.activities.contentCreation.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Total pieces: {reportData.activities.contentCreation.count}</span>
                  <span>Media files: {reportData.activities.contentCreation.mediaFiles.length}</span>
                </div>
              </div>
            </div>

            {/* Events */}
            {totalEvents > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Events Organized</h3>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 mb-4">{reportData.activities.events.description}</p>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <span>Total events: {totalEvents}</span>
                    <span>Total attendees: {totalAttendees}</span>
                    <span>Total budget: {formatCurrency(reportData.activities.events.totalBudget)}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reportData.activities.events.eventDetails.map((event) => (
                    <div key={event.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">{event.name}</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>{event.attendeeCount} attendees</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mt-3 text-sm">{event.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Community Engagement */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Community Engagement</h3>
              <div className="space-y-4">
                {reportData.activities.communityEngagement.discordActivity && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Discord Activity</h4>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">
                      {reportData.activities.communityEngagement.discordActivity}
                    </p>
                  </div>
                )}
                {reportData.activities.communityEngagement.socialMediaActivity && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Social Media Activity</h4>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">
                      {reportData.activities.communityEngagement.socialMediaActivity}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Impact */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Impact Assessment</h2>
              {onEdit && (
                <button
                  onClick={() => onEdit('impact')}
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
              )}
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {reportData.impact.qualitativeImpact}
              </p>
            </div>
          </div>

          {/* Expenses */}
          {reportData.expenses.breakdown.length > 0 && (
            <div className="p-8 border-b border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Expenses</h2>
                {onEdit && (
                  <button
                    onClick={() => onEdit('expenses')}
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-gray-900">Total Expenses</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(reportData.expenses.breakdown.reduce((sum, expense) => sum + expense.amount, 0))}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {reportData.expenses.breakdown.map((expense, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{expense.category}</h4>
                      <span className="font-semibold text-gray-900">{formatCurrency(expense.amount)}</span>
                    </div>
                    <p className="text-gray-700 text-sm">{expense.description}</p>
                    {expense.receipts.length > 0 && (
                      <div className="mt-3 flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {expense.receipts.length} receipt(s) attached
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feedback */}
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Feedback & Support</h2>
              {onEdit && (
                <button
                  onClick={() => onEdit('feedback')}
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reportData.feedback.challengesFaced && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Challenges Faced</h4>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">
                    {reportData.feedback.challengesFaced}
                  </p>
                </div>
              )}
              {reportData.feedback.supportNeeded && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Support Needed</h4>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">
                    {reportData.feedback.supportNeeded}
                  </p>
                </div>
              )}
              {reportData.feedback.suggestions && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Suggestions</h4>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">
                    {reportData.feedback.suggestions}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Monthly Report</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to submit this monthly report? Once submitted, it will be sent to your organization and automatically synced to Airtable for processing.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSubmitConfirm(false);
                  onSubmit?.();
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportPreview;
