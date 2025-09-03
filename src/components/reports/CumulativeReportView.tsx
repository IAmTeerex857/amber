import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Calendar,
  DollarSign,
  Globe,
  Award,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Download,
  Send,
  Mail,
  Edit3,
  RefreshCw,
  Zap,
  Eye,
  Clock,
  Star,
  ArrowUp,
  ArrowDown,
  FileText,
  Lightbulb,
  Flag
} from 'lucide-react';

interface RegionalMetrics {
  totalAmbassadors: number;
  activeAmbassadors: number;
  reportingCompliance: number;
  totalContentCreated: number;
  totalEventsHosted: number;
  totalNewMembers: number;
  totalSocialReach: number;
  totalExpenses: number;
  averageEngagementRate: number;
  averageRating: number;
}

interface MonthComparison {
  current: RegionalMetrics;
  previous: RegionalMetrics;
  percentageChanges: {
    [K in keyof RegionalMetrics]: number;
  };
}

interface AIInsight {
  id: string;
  type: 'success' | 'concern' | 'opportunity' | 'recommendation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'performance' | 'engagement' | 'content' | 'events' | 'growth' | 'efficiency';
  data?: any;
}

interface TopPerformer {
  name: string;
  metric: string;
  value: number;
  improvement: number;
  category: 'content' | 'engagement' | 'events' | 'growth';
}

interface Challenge {
  ambassador: string;
  issue: string;
  supportNeeded: string;
  priority: 'high' | 'medium' | 'low';
}

interface CumulativeReportData {
  id: string;
  reportingPeriod: {
    month: number;
    year: number;
    startDate: string;
    endDate: string;
  };
  region: string;
  generatedAt: string;
  generatedBy: 'ai' | 'manual';
  status: 'draft' | 'ready' | 'sent';
  aiConfidence: number; // 0-100
  metrics: MonthComparison;
  executiveSummary: string;
  keyHighlights: string[];
  challengesAndConcerns: Challenge[];
  topPerformers: TopPerformer[];
  aiInsights: AIInsight[];
  recommendations: {
    immediate: string[];
    longTerm: string[];
    resourceRequests: string[];
  };
  upcomingGoals: string[];
  sentTo?: string[];
  sentAt?: string;
}

interface CumulativeReportViewProps {
  reportId?: string;
  onEdit?: () => void;
  onSend?: () => void;
  onExport?: (format: 'pdf' | 'docx') => void;
  onRegenerateAI?: () => void;
}

const CumulativeReportView: React.FC<CumulativeReportViewProps> = ({
  reportId,
  onEdit,
  onSend,
  onExport,
  onRegenerateAI
}) => {
  const { user } = useAuth();
  const [reportData, setReportData] = useState<CumulativeReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [emailMessage, setEmailMessage] = useState('');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Mock data - replace with actual API call
  useEffect(() => {
    const loadReportData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        const mockReportData: CumulativeReportData = {
          id: 'cumulative-2024-03',
          reportingPeriod: {
            month: 2, // March (0-indexed)
            year: 2024,
            startDate: '2024-03-01',
            endDate: '2024-03-31'
          },
          region: 'North America',
          generatedAt: '2024-04-01T10:00:00Z',
          generatedBy: 'ai',
          status: 'ready',
          aiConfidence: 92,
          metrics: {
            current: {
              totalAmbassadors: 3,
              activeAmbassadors: 3,
              reportingCompliance: 100,
              totalContentCreated: 35,
              totalEventsHosted: 4,
              totalNewMembers: 261,
              totalSocialReach: 105000,
              totalExpenses: 1750,
              averageEngagementRate: 12.2,
              averageRating: 4.6
            },
            previous: {
              totalAmbassadors: 3,
              activeAmbassadors: 3,
              reportingCompliance: 100,
              totalContentCreated: 28,
              totalEventsHosted: 3,
              totalNewMembers: 198,
              totalSocialReach: 89000,
              totalExpenses: 1450,
              averageEngagementRate: 10.8,
              averageRating: 4.4
            },
            percentageChanges: {
              totalAmbassadors: 0,
              activeAmbassadors: 0,
              reportingCompliance: 0,
              totalContentCreated: 25,
              totalEventsHosted: 33,
              totalNewMembers: 32,
              totalSocialReach: 18,
              totalExpenses: 21,
              averageEngagementRate: 13,
              averageRating: 5
            }
          },
          executiveSummary: "March 2024 demonstrated exceptional performance across all key metrics for the North America region. Our ambassador team of 3 active members achieved 100% reporting compliance while delivering outstanding results in content creation (+25%), community growth (+32%), and engagement (+13%). The team successfully hosted 4 community events, significantly above the regional average, and maintained high-quality standards with an average rating of 4.6/5. Notable achievements include Maria Garcia's breakthrough in Spanish-speaking community engagement and Alex Johnson's viral content series that drove substantial reach expansion. The region continues to set the benchmark for ambassador program excellence.",
          keyHighlights: [
            "Achieved 100% reporting compliance for the 6th consecutive month",
            "25% increase in content creation output with maintained quality standards",
            "32% growth in new community members, exceeding quarterly targets",
            "18% expansion in social media reach, breaking previous records",
            "Successful cross-cultural outreach with Spanish-language content series",
            "4 community events hosted with 89% average satisfaction rating"
          ],
          challengesAndConcerns: [
            {
              ambassador: "David Kim",
              issue: "Limited availability due to external commitments",
              supportNeeded: "Flexible scheduling and task prioritization guidance",
              priority: "medium"
            }
          ],
          topPerformers: [
            {
              name: "Maria Garcia",
              metric: "Engagement Rate",
              value: 15.2,
              improvement: 23,
              category: "engagement"
            },
            {
              name: "Alex Johnson",
              metric: "Social Reach",
              value: 45000,
              improvement: 28,
              category: "content"
            },
            {
              name: "David Kim",
              metric: "Technical Content",
              value: 8,
              improvement: 12,
              category: "content"
            }
          ],
          aiInsights: [
            {
              id: "insight-1",
              type: "success",
              title: "Cross-Cultural Content Strategy Success",
              description: "Maria Garcia's Spanish-language content series achieved 23% higher engagement rates than English content, indicating strong potential for localized content strategies.",
              impact: "high",
              category: "engagement"
            },
            {
              id: "insight-2",
              type: "opportunity",
              title: "Collaborative Event Impact",
              description: "Events with multiple ambassador participation showed 40% higher attendance and 35% better satisfaction scores compared to single-host events.",
              impact: "medium",
              category: "events"
            },
            {
              id: "insight-3",
              type: "recommendation",
              title: "Technical Content Expansion",
              description: "Developer-focused content by David Kim generates lower reach but 3x higher conversion rates. Recommend increasing technical content allocation.",
              impact: "medium",
              category: "content"
            }
          ],
          recommendations: {
            immediate: [
              "Expand Spanish-language content production to capitalize on engagement success",
              "Implement collaborative event planning for Q2 to leverage team synergies",
              "Provide flexible scheduling framework for ambassadors with external commitments"
            ],
            longTerm: [
              "Develop comprehensive multilingual content strategy for diverse communities",
              "Establish ambassador mentorship program to maintain performance standards",
              "Create specialized tracks for technical and general audience content"
            ],
            resourceRequests: [
              "Translation services for high-performing content localization",
              "Event planning tools and collaborative platforms",
              "Time management and productivity training resources"
            ]
          },
          upcomingGoals: [
            "Achieve 40% growth in Spanish-speaking community engagement",
            "Host 6 collaborative events across Q2",
            "Maintain 100% reporting compliance while expanding team capacity",
            "Launch technical content creator development program"
          ]
        };

        setReportData(mockReportData);
      } catch (error) {
        console.error('Failed to load cumulative report:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReportData();
  }, [reportId]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'concern': return AlertTriangle;
      case 'opportunity': return Lightbulb;
      case 'recommendation': return Target;
      default: return Brain;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'concern': return 'text-red-600 bg-red-50 border-red-200';
      case 'opportunity': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'recommendation': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return ArrowUp;
    if (change < 0) return ArrowDown;
    return ArrowUp;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const handleSendReport = async () => {
    try {
      // Simulate sending report
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (reportData) {
        const updatedReport = {
          ...reportData,
          status: 'sent' as const,
          sentTo: selectedRecipients,
          sentAt: new Date().toISOString()
        };
        setReportData(updatedReport);
      }
      
      setShowSendModal(false);
      onSend?.();
    } catch (error) {
      console.error('Failed to send report:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Generating AI report...</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Report Not Found</h3>
        <p className="text-gray-600">Unable to load the cumulative report.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Brain className="h-8 w-8 text-purple-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">AI-Generated Cumulative Report</h1>
              <p className="text-sm text-gray-600">
                {monthNames[reportData.reportingPeriod.month]} {reportData.reportingPeriod.year} • {reportData.region}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                reportData.status === 'sent' ? 'bg-green-100 text-green-800' :
                reportData.status === 'ready' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {reportData.status.toUpperCase()}
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-600">
                <Zap className="h-3 w-3" />
                <span>AI Confidence: {reportData.aiConfidence}%</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {onRegenerateAI && (
              <button
                onClick={onRegenerateAI}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate AI
              </button>
            )}
            {onExport && (
              <button
                onClick={() => onExport('pdf')}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </button>
            )}
            {reportData.status !== 'sent' && (
              <button
                onClick={() => setShowSendModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Send to Organization
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="max-w-6xl mx-auto py-8 px-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          
          {/* AI Banner */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <Brain className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">AI-Powered Regional Analysis</h2>
                <p className="text-purple-100 mt-1">
                  Automatically generated from {reportData.metrics.current.totalAmbassadors} ambassador reports • 
                  Generated on {new Date(reportData.generatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="p-8 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Regional Performance Overview</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { key: 'totalContentCreated', label: 'Content Created', icon: FileText, color: 'blue' },
                { key: 'totalEventsHosted', label: 'Events Hosted', icon: Calendar, color: 'green' },
                { key: 'totalNewMembers', label: 'New Members', icon: Users, color: 'purple' },
                { key: 'totalSocialReach', label: 'Social Reach', icon: Globe, color: 'orange' }
              ].map((metric) => {
                const current = reportData.metrics.current[metric.key as keyof RegionalMetrics] as number;
                const change = reportData.metrics.percentageChanges[metric.key as keyof RegionalMetrics];
                const TrendIcon = getTrendIcon(change);
                const Icon = metric.icon;
                
                return (
                  <div key={metric.key} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`h-6 w-6 text-${metric.color}-600`} />
                      <div className={`flex items-center space-x-1 ${getTrendColor(change)}`}>
                        <TrendIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">{Math.abs(change)}%</span>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {metric.key === 'totalSocialReach' ? formatNumber(current) : current}
                    </p>
                    <p className="text-sm text-gray-600">{metric.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Executive Summary */}
          <div className="p-8 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Executive Summary</h3>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {reportData.executiveSummary}
              </p>
            </div>
          </div>

          {/* Key Highlights */}
          <div className="p-8 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportData.keyHighlights.map((highlight, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performers */}
          <div className="p-8 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reportData.topPerformers.map((performer, index) => (
                <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <Award className="h-6 w-6 text-yellow-600" />
                    <h4 className="font-semibold text-gray-900">{performer.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{performer.metric}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">
                      {performer.metric.includes('Reach') ? formatNumber(performer.value) : performer.value}
                    </span>
                    <span className="text-sm text-green-600 font-medium">
                      +{performer.improvement}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="p-8 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Generated Insights</h3>
            <div className="space-y-4">
              {reportData.aiInsights.map((insight) => {
                const Icon = getInsightIcon(insight.type);
                return (
                  <div key={insight.id} className={`border rounded-lg p-4 ${getInsightColor(insight.type)}`}>
                    <div className="flex items-start space-x-3">
                      <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold">{insight.title}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            insight.impact === 'high' ? 'bg-red-100 text-red-800' :
                            insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {insight.impact.toUpperCase()} IMPACT
                          </span>
                        </div>
                        <p className="text-sm">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommendations */}
          <div className="p-8 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-red-600" />
                  Immediate Actions
                </h4>
                <ul className="space-y-2">
                  {reportData.recommendations.immediate.map((rec, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Target className="h-4 w-4 mr-2 text-blue-600" />
                  Long-term Strategy
                </h4>
                <ul className="space-y-2">
                  {reportData.recommendations.longTerm.map((rec, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                  Resource Requests
                </h4>
                <ul className="space-y-2">
                  {reportData.recommendations.resourceRequests.map((req, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Challenges */}
          {reportData.challengesAndConcerns.length > 0 && (
            <div className="p-8 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Challenges & Support Needed</h3>
              <div className="space-y-4">
                {reportData.challengesAndConcerns.map((challenge, index) => (
                  <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{challenge.ambassador}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            challenge.priority === 'high' ? 'bg-red-100 text-red-800' :
                            challenge.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {challenge.priority.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{challenge.issue}</p>
                        <p className="text-sm font-medium text-gray-900">Support needed: {challenge.supportNeeded}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Month Goals */}
          <div className="p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Month Priorities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportData.upcomingGoals.map((goal, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Flag className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{goal}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Report Footer */}
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Generated by Amber AI on {new Date(reportData.generatedAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>Confidence Score: {reportData.aiConfidence}%</span>
              {reportData.sentAt && (
                <>
                  <span>•</span>
                  <span>Sent on {new Date(reportData.sentAt).toLocaleDateString()}</span>
                </>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Report ID: {reportData.id}
            </div>
          </div>
        </div>
      </div>

      {/* Send Report Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Cumulative Report</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                <div className="space-y-2">
                  {[
                    'organization@stellar.org',
                    'global-team@stellar.org',
                    'regional-leads@stellar.org'
                  ].map((email) => (
                    <label key={email} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedRecipients.includes(email)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRecipients([...selectedRecipients, email]);
                          } else {
                            setSelectedRecipients(selectedRecipients.filter(r => r !== email));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{email}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Message</label>
                <textarea
                  rows={3}
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Optional message to include with the report..."
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowSendModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendReport}
                disabled={selectedRecipients.length === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Send Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CumulativeReportView;
