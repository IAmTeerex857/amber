import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Calendar,
  Upload,
  FileText,
  Image,
  Video,
  Link as LinkIcon,
  Users,
  DollarSign,
  Save,
  Send,
  Eye,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Target,
  Award,
  MessageSquare,
  Search,
  Filter,
  Download,
  Edit3,
  XCircle,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

// Types
interface MediaFile {
  id: string;
  file: File;
  type: 'image' | 'video' | 'document';
  preview?: string;
  caption?: string;
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

interface LinkAttachment {
  id: string;
  url: string;
  title: string;
  description: string;
  type: 'social_post' | 'article' | 'video' | 'other';
  platform?: string;
  metrics?: {
    views?: number;
    likes?: number;
    shares?: number;
    comments?: number;
  };
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
      links: LinkAttachment[];
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
      id: string;
      description: string;
      amount: number;
      category: string;
      date: string;
      receipt?: File;
    }>;
  };
  feedback: {
    challengesFaced: string;
    supportNeeded: string;
    suggestions: string;
  };
}

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

const AmbassadorReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'history' | 'new'>('history');
  const [currentStep, setCurrentStep] = useState(1);
  const [reports, setReports] = useState<MonthlyReport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const steps = [
    { id: 1, name: 'Period & Summary', icon: Calendar },
    { id: 2, name: 'Activities', icon: Target },
    { id: 3, name: 'Impact & Metrics', icon: BarChart3 },
    { id: 4, name: 'Expenses', icon: DollarSign },
    { id: 5, name: 'Feedback', icon: MessageSquare },
    { id: 6, name: 'Review', icon: Eye }
  ];

  // Default report data structure
  const defaultReportData: MonthlyReportData = {
    reportingPeriod: {
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      startDate: '',
      endDate: ''
    },
    summary: {
      executiveSummary: '',
      keyAchievements: [],
      challenges: [],
      nextMonthGoals: []
    },
    activities: {
      contentCreation: {
        description: '',
        count: 0,
        mediaFiles: [],
        links: []
      },
      events: {
        description: '',
        eventDetails: [],
        totalAttendees: 0,
        totalBudget: 0
      },
      communityEngagement: {
        description: '',
        discordActivity: '',
        socialMediaActivity: '',
        partnershipWork: ''
      },
      other: {
        description: '',
        customActivities: []
      }
    },
    impact: {
      quantitativeMetrics: {
        newCommunityMembers: 0,
        socialMediaReach: 0,
        contentEngagement: 0,
        eventsHosted: 0
      },
      qualitativeImpact: '',
      testimonials: []
    },
    expenses: {
      totalAmount: 0,
      breakdown: []
    },
    feedback: {
      challengesFaced: '',
      supportNeeded: '',
      suggestions: ''
    }
  };

  const [reportData, setReportData] = useState<MonthlyReportData>(defaultReportData);

  // Load reports data
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
              executiveSummary: 'January was a strong month with significant community growth.',
              keyAchievements: ['Launched new content series', 'Organized successful meetup']
            },
            metrics: {
              contentCreated: 15,
              eventsHosted: 2,
              newMembers: 127,
              socialReach: 45000,
              totalExpenses: 750
            },
            feedback: {
              reviewerComments: 'Excellent work! Great engagement metrics.',
              rating: 4.8
            }
          },
          {
            id: 'report-2024-02',
            reportingPeriod: { month: 1, year: 2024 },
            status: 'submitted',
            submittedAt: '2024-03-01T09:30:00Z',
            lastModified: '2024-03-01T09:30:00Z',
            summary: {
              executiveSummary: 'February focused on community partnerships and content quality.',
              keyAchievements: ['Partnership with local university', 'High-quality video series']
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
              executiveSummary: 'March activities in progress...',
              keyAchievements: []
            },
            metrics: {
              contentCreated: 8,
              eventsHosted: 0,
              newMembers: 45,
              socialReach: 22000,
              totalExpenses: 320
            }
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
      case 'approved': return 'bg-green-100 text-green-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'revision_requested': return 'bg-orange-100 text-orange-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'submitted': return <Clock className="h-4 w-4" />;
      case 'under_review': return <Eye className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'revision_requested': return <AlertCircle className="h-4 w-4" />;
      case 'draft': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.summary.executiveSummary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         monthNames[report.reportingPeriod.month].toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Report saved as draft:', reportData);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Report submitted:', reportData);
      // Reset form and go back to history
      setReportData(defaultReportData);
      setCurrentStep(1);
      setActiveView('history');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reporting Period</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                  <select
                    value={reportData.reportingPeriod.month}
                    onChange={(e) => setReportData(prev => ({
                      ...prev,
                      reportingPeriod: { ...prev.reportingPeriod, month: Number(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {monthNames.map((month, index) => (
                      <option key={index} value={index}>{month}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <select
                    value={reportData.reportingPeriod.year}
                    onChange={(e) => setReportData(prev => ({
                      ...prev,
                      reportingPeriod: { ...prev.reportingPeriod, year: Number(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[2023, 2024, 2025].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Executive Summary</h3>
              <textarea
                value={reportData.summary.executiveSummary}
                onChange={(e) => setReportData(prev => ({
                  ...prev,
                  summary: { ...prev.summary, executiveSummary: e.target.value }
                }))}
                placeholder="Provide a high-level overview of your activities and achievements this month..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Achievements</h3>
              <div className="space-y-3">
                {reportData.summary.keyAchievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={achievement}
                      onChange={(e) => {
                        const newAchievements = [...reportData.summary.keyAchievements];
                        newAchievements[index] = e.target.value;
                        setReportData(prev => ({
                          ...prev,
                          summary: { ...prev.summary, keyAchievements: newAchievements }
                        }));
                      }}
                      placeholder="Enter a key achievement..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => {
                        const newAchievements = reportData.summary.keyAchievements.filter((_, i) => i !== index);
                        setReportData(prev => ({
                          ...prev,
                          summary: { ...prev.summary, keyAchievements: newAchievements }
                        }));
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setReportData(prev => ({
                    ...prev,
                    summary: { ...prev.summary, keyAchievements: [...prev.summary.keyAchievements, ''] }
                  }))}
                  className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Achievement
                </button>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Creation</h3>
              <div className="space-y-4">
                <textarea
                  value={reportData.activities.contentCreation.description}
                  onChange={(e) => setReportData(prev => ({
                    ...prev,
                    activities: {
                      ...prev.activities,
                      contentCreation: { ...prev.activities.contentCreation, description: e.target.value }
                    }
                  }))}
                  placeholder="Describe your content creation activities this month..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Content Pieces</label>
                  <input
                    type="number"
                    value={reportData.activities.contentCreation.count}
                    onChange={(e) => setReportData(prev => ({
                      ...prev,
                      activities: {
                        ...prev.activities,
                        contentCreation: { ...prev.activities.contentCreation, count: Number(e.target.value) }
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Events & Meetups</h3>
              <textarea
                value={reportData.activities.events.description}
                onChange={(e) => setReportData(prev => ({
                  ...prev,
                  activities: {
                    ...prev.activities,
                    events: { ...prev.activities.events, description: e.target.value }
                  }
                }))}
                placeholder="Describe events and meetups you organized..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Engagement</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discord Activity</label>
                  <textarea
                    value={reportData.activities.communityEngagement.discordActivity}
                    onChange={(e) => setReportData(prev => ({
                      ...prev,
                      activities: {
                        ...prev.activities,
                        communityEngagement: { ...prev.activities.communityEngagement, discordActivity: e.target.value }
                      }
                    }))}
                    placeholder="Describe your Discord engagement..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Social Media Activity</label>
                  <textarea
                    value={reportData.activities.communityEngagement.socialMediaActivity}
                    onChange={(e) => setReportData(prev => ({
                      ...prev,
                      activities: {
                        ...prev.activities,
                        communityEngagement: { ...prev.activities.communityEngagement, socialMediaActivity: e.target.value }
                      }
                    }))}
                    placeholder="Describe your social media engagement..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quantitative Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Community Members</label>
                  <input
                    type="number"
                    value={reportData.impact.quantitativeMetrics.newCommunityMembers}
                    onChange={(e) => setReportData(prev => ({
                      ...prev,
                      impact: {
                        ...prev.impact,
                        quantitativeMetrics: { ...prev.impact.quantitativeMetrics, newCommunityMembers: Number(e.target.value) }
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Social Media Reach</label>
                  <input
                    type="number"
                    value={reportData.impact.quantitativeMetrics.socialMediaReach}
                    onChange={(e) => setReportData(prev => ({
                      ...prev,
                      impact: {
                        ...prev.impact,
                        quantitativeMetrics: { ...prev.impact.quantitativeMetrics, socialMediaReach: Number(e.target.value) }
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content Engagement</label>
                  <input
                    type="number"
                    value={reportData.impact.quantitativeMetrics.contentEngagement}
                    onChange={(e) => setReportData(prev => ({
                      ...prev,
                      impact: {
                        ...prev.impact,
                        quantitativeMetrics: { ...prev.impact.quantitativeMetrics, contentEngagement: Number(e.target.value) }
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Events Hosted</label>
                  <input
                    type="number"
                    value={reportData.impact.quantitativeMetrics.eventsHosted}
                    onChange={(e) => setReportData(prev => ({
                      ...prev,
                      impact: {
                        ...prev.impact,
                        quantitativeMetrics: { ...prev.impact.quantitativeMetrics, eventsHosted: Number(e.target.value) }
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Qualitative Impact</h3>
              <textarea
                value={reportData.impact.qualitativeImpact}
                onChange={(e) => setReportData(prev => ({
                  ...prev,
                  impact: { ...prev.impact, qualitativeImpact: e.target.value }
                }))}
                placeholder="Describe the qualitative impact of your work..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Testimonials & Feedback</h3>
              <div className="space-y-3">
                {reportData.impact.testimonials.map((testimonial, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={testimonial}
                      onChange={(e) => {
                        const newTestimonials = [...reportData.impact.testimonials];
                        newTestimonials[index] = e.target.value;
                        setReportData(prev => ({
                          ...prev,
                          impact: { ...prev.impact, testimonials: newTestimonials }
                        }));
                      }}
                      placeholder="Enter a testimonial or feedback..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => {
                        const newTestimonials = reportData.impact.testimonials.filter((_, i) => i !== index);
                        setReportData(prev => ({
                          ...prev,
                          impact: { ...prev.impact, testimonials: newTestimonials }
                        }));
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setReportData(prev => ({
                    ...prev,
                    impact: { ...prev.impact, testimonials: [...prev.impact.testimonials, ''] }
                  }))}
                  className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Testimonial
                </button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
              <div className="space-y-4">
                {reportData.expenses.breakdown.map((expense, index) => (
                  <div key={expense.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <input
                        type="text"
                        value={expense.description}
                        onChange={(e) => {
                          const newBreakdown = [...reportData.expenses.breakdown];
                          newBreakdown[index] = { ...expense, description: e.target.value };
                          setReportData(prev => ({
                            ...prev,
                            expenses: { ...prev.expenses, breakdown: newBreakdown }
                          }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                      <input
                        type="number"
                        step="0.01"
                        value={expense.amount}
                        onChange={(e) => {
                          const newBreakdown = [...reportData.expenses.breakdown];
                          newBreakdown[index] = { ...expense, amount: Number(e.target.value) };
                          const newTotal = newBreakdown.reduce((sum, exp) => sum + exp.amount, 0);
                          setReportData(prev => ({
                            ...prev,
                            expenses: { breakdown: newBreakdown, totalAmount: newTotal }
                          }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={expense.category}
                        onChange={(e) => {
                          const newBreakdown = [...reportData.expenses.breakdown];
                          newBreakdown[index] = { ...expense, category: e.target.value };
                          setReportData(prev => ({
                            ...prev,
                            expenses: { ...prev.expenses, breakdown: newBreakdown }
                          }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select category</option>
                        <option value="events">Events</option>
                        <option value="marketing">Marketing</option>
                        <option value="travel">Travel</option>
                        <option value="materials">Materials</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          const newBreakdown = reportData.expenses.breakdown.filter((_, i) => i !== index);
                          const newTotal = newBreakdown.reduce((sum, exp) => sum + exp.amount, 0);
                          setReportData(prev => ({
                            ...prev,
                            expenses: { breakdown: newBreakdown, totalAmount: newTotal }
                          }));
                        }}
                        className="w-full p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4 mx-auto" />
                      </button>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={() => {
                    const newExpense = {
                      id: `expense-${Date.now()}`,
                      description: '',
                      amount: 0,
                      category: '',
                      date: new Date().toISOString().split('T')[0]
                    };
                    setReportData(prev => ({
                      ...prev,
                      expenses: {
                        ...prev.expenses,
                        breakdown: [...prev.expenses.breakdown, newExpense]
                      }
                    }));
                  }}
                  className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </button>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total Expenses:</span>
                  <span className="text-xl font-bold text-blue-600">${reportData.expenses.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Challenges Faced</h3>
              <textarea
                value={reportData.feedback.challengesFaced}
                onChange={(e) => setReportData(prev => ({
                  ...prev,
                  feedback: { ...prev.feedback, challengesFaced: e.target.value }
                }))}
                placeholder="Describe any challenges you encountered this month..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Support Needed</h3>
              <textarea
                value={reportData.feedback.supportNeeded}
                onChange={(e) => setReportData(prev => ({
                  ...prev,
                  feedback: { ...prev.feedback, supportNeeded: e.target.value }
                }))}
                placeholder="What support or resources would help you succeed?"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggestions & Ideas</h3>
              <textarea
                value={reportData.feedback.suggestions}
                onChange={(e) => setReportData(prev => ({
                  ...prev,
                  feedback: { ...prev.feedback, suggestions: e.target.value }
                }))}
                placeholder="Share any suggestions or ideas for improvement..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Your Report</h3>
              <p className="text-gray-600">Please review all sections before submitting</p>
            </div>

            {/* Report Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{reportData.activities.contentCreation.count}</p>
                <p className="text-sm text-gray-600">Content Created</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{reportData.impact.quantitativeMetrics.newCommunityMembers}</p>
                <p className="text-sm text-gray-600">New Members</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">{reportData.impact.quantitativeMetrics.eventsHosted}</p>
                <p className="text-sm text-gray-600">Events Hosted</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <DollarSign className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-600">${reportData.expenses.totalAmount}</p>
                <p className="text-sm text-gray-600">Total Expenses</p>
              </div>
            </div>

            {/* Executive Summary Preview */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Executive Summary</h4>
              <p className="text-gray-700">
                {reportData.summary.executiveSummary || 'No executive summary provided.'}
              </p>
            </div>

            {/* Key Achievements Preview */}
            {reportData.summary.keyAchievements.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Key Achievements</h4>
                <ul className="list-disc list-inside space-y-1">
                  {reportData.summary.keyAchievements.filter(achievement => achievement.trim()).map((achievement, index) => (
                    <li key={index} className="text-gray-700">{achievement}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Reporting Period */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Reporting Period</h4>
              <p className="text-gray-700">
                {monthNames[reportData.reportingPeriod.month]} {reportData.reportingPeriod.year}
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Step {currentStep}</h3>
            <p className="text-gray-600">Form content for step {currentStep} will be implemented here.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Reports</h1>
          <p className="text-gray-600">Manage your monthly ambassador reports</p>
        </div>
        <button
          onClick={() => {
            if (activeView === 'new') {
              setActiveView('history');
              setCurrentStep(1);
              setReportData(defaultReportData);
            } else {
              setActiveView('new');
            }
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {activeView === 'new' ? (
            <>
              <Eye className="h-4 w-4 mr-2" />
              View Reports
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              New Report
            </>
          )}
        </button>
      </div>

      {/* View Toggle Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'history', name: 'Report History', icon: FileText },
            { id: 'new', name: 'Create New Report', icon: Plus }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`
                  flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeView === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      {activeView === 'history' ? (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading your reports...</p>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filters.' 
                    : 'Get started by creating your first monthly report.'}
                </p>
                <button
                  onClick={() => setActiveView('new')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Report
                </button>
              </div>
            ) : (
              filteredReports.map((report) => (
                <div key={report.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {monthNames[report.reportingPeriod.month]} {report.reportingPeriod.year}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {getStatusIcon(report.status)}
                          <span className="ml-1 capitalize">{report.status.replace('_', ' ')}</span>
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-4 line-clamp-2">
                        {report.summary.executiveSummary}
                      </p>
                      
                      {/* Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-lg font-semibold text-gray-900">{report.metrics.contentCreated}</p>
                          <p className="text-xs text-gray-600">Content</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-lg font-semibold text-gray-900">{report.metrics.eventsHosted}</p>
                          <p className="text-xs text-gray-600">Events</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-lg font-semibold text-gray-900">{report.metrics.newMembers}</p>
                          <p className="text-xs text-gray-600">New Members</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-lg font-semibold text-gray-900">{(report.metrics.socialReach / 1000).toFixed(0)}K</p>
                          <p className="text-xs text-gray-600">Reach</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-lg font-semibold text-gray-900">${report.metrics.totalExpenses}</p>
                          <p className="text-xs text-gray-600">Expenses</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Last modified: {new Date(report.lastModified).toLocaleDateString()}</span>
                        {report.feedback?.rating && (
                          <span className="flex items-center">
                            <Award className="h-4 w-4 mr-1 text-yellow-500" />
                            {report.feedback.rating}/5
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="View report"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      {report.status === 'draft' && (
                        <button
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="Edit report"
                        >
                          <Edit3 className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                        title="Download report"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Fixed Progress Steps */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-center space-x-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <React.Fragment key={step.id}>
                    <div className="flex items-center space-x-3">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors
                        ${isActive ? 'bg-blue-600 border-blue-600 text-white' :
                          isCompleted ? 'bg-green-600 border-green-600 text-white' :
                          'border-gray-300 text-gray-400'
                        }
                      `}>
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                      <div className="hidden md:block">
                        <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                          {step.name}
                        </p>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-12 h-0.5 ${isCompleted ? 'bg-green-600' : 'bg-gray-300'}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            {renderStepContent()}

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <div className="flex space-x-3">
                {currentStep > 1 && (
                  <button
                    onClick={prevStep}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Draft'}
                </button>

                {currentStep === steps.length ? (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmbassadorReportsPage;
