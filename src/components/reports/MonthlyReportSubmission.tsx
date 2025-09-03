import React, { useState } from 'react';
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
  MessageSquare
} from 'lucide-react';

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
  attendeeList?: string; // CSV or newline-separated list
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

interface MonthlyReportSubmissionProps {
  onSave?: (report: MonthlyReportData) => void;
  onSubmit?: (report: MonthlyReportData) => void;
  onPreview?: (report: MonthlyReportData) => void;
  existingReport?: Partial<MonthlyReportData>;
}

const MonthlyReportSubmission: React.FC<MonthlyReportSubmissionProps> = ({
  onSave,
  onSubmit,
  onPreview,
  existingReport
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
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

  const [reportData, setReportData] = useState<MonthlyReportData>({
    ...defaultReportData,
    ...existingReport
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const steps = [
    { id: 1, name: 'Period & Summary', icon: Calendar },
    { id: 2, name: 'Activities', icon: Target },
    { id: 3, name: 'Impact & Metrics', icon: BarChart3 },
    { id: 4, name: 'Expenses', icon: DollarSign },
    { id: 5, name: 'Feedback', icon: MessageSquare },
    { id: 6, name: 'Review', icon: Eye }
  ];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const addKeyAchievement = () => {
    setReportData(prev => ({
      ...prev,
      summary: {
        ...prev.summary,
        keyAchievements: [...prev.summary.keyAchievements, '']
      }
    }));
  };

  const updateKeyAchievement = (index: number, value: string) => {
    setReportData(prev => ({
      ...prev,
      summary: {
        ...prev.summary,
        keyAchievements: prev.summary.keyAchievements.map((achievement, i) => 
          i === index ? value : achievement
        )
      }
    }));
  };

  const removeKeyAchievement = (index: number) => {
    setReportData(prev => ({
      ...prev,
      summary: {
        ...prev.summary,
        keyAchievements: prev.summary.keyAchievements.filter((_, i) => i !== index)
      }
    }));
  };

  const addEvent = () => {
    const newEvent: EventDetail = {
      id: `event-${Date.now()}`,
      name: '',
      date: '',
      location: '',
      attendeeCount: 0,
      description: '',
      outcomes: ''
    };
    setReportData(prev => ({
      ...prev,
      activities: {
        ...prev.activities,
        events: {
          ...prev.activities.events,
          eventDetails: [...prev.activities.events.eventDetails, newEvent]
        }
      }
    }));
  };

  const updateEvent = (eventId: string, updates: Partial<EventDetail>) => {
    setReportData(prev => ({
      ...prev,
      activities: {
        ...prev.activities,
        events: {
          ...prev.activities.events,
          eventDetails: prev.activities.events.eventDetails.map(event =>
            event.id === eventId ? { ...event, ...updates } : event
          )
        }
      }
    }));
  };

  const removeEvent = (eventId: string) => {
    setReportData(prev => ({
      ...prev,
      activities: {
        ...prev.activities,
        events: {
          ...prev.activities.events,
          eventDetails: prev.activities.events.eventDetails.filter(event => event.id !== eventId)
        }
      }
    }));
  };

  const addExpense = () => {
    const newExpense = {
      category: '',
      amount: 0,
      description: '',
      receipts: []
    };
    setReportData(prev => ({
      ...prev,
      expenses: {
        ...prev.expenses,
        breakdown: [...prev.expenses.breakdown, newExpense]
      }
    }));
  };

  const updateExpense = (index: number, updates: any) => {
    setReportData(prev => ({
      ...prev,
      expenses: {
        ...prev.expenses,
        breakdown: prev.expenses.breakdown.map((expense, i) =>
          i === index ? { ...expense, ...updates } : expense
        )
      }
    }));
  };

  const removeExpense = (index: number) => {
    setReportData(prev => ({
      ...prev,
      expenses: {
        ...prev.expenses,
        breakdown: prev.expenses.breakdown.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave?.(reportData);
    } catch (error) {
      console.error('Failed to save report:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      onSubmit?.(reportData);
    } catch (error) {
      console.error('Failed to submit report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    onPreview?.(reportData);
  };

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
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Executive Summary</h3>
              <textarea
                rows={6}
                value={reportData.summary.executiveSummary}
                onChange={(e) => setReportData(prev => ({
                  ...prev,
                  summary: { ...prev.summary, executiveSummary: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Provide a high-level overview of your activities and achievements this month..."
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Achievements</h3>
              <div className="space-y-3">
                {reportData.summary.keyAchievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={achievement}
                      onChange={(e) => updateKeyAchievement(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe a key achievement..."
                    />
                    <button
                      onClick={() => removeKeyAchievement(index)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addKeyAchievement}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Achievement</span>
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
                  rows={4}
                  value={reportData.activities.contentCreation.description}
                  onChange={(e) => setReportData(prev => ({
                    ...prev,
                    activities: {
                      ...prev.activities,
                      contentCreation: {
                        ...prev.activities.contentCreation,
                        description: e.target.value
                      }
                    }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your content creation activities this month..."
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content Pieces Created</label>
                  <input
                    type="number"
                    value={reportData.activities.contentCreation.count}
                    onChange={(e) => setReportData(prev => ({
                      ...prev,
                      activities: {
                        ...prev.activities,
                        contentCreation: {
                          ...prev.activities.contentCreation,
                          count: Number(e.target.value)
                        }
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Events Organized</h3>
              <div className="space-y-4">
                <textarea
                  rows={3}
                  value={reportData.activities.events.description}
                  onChange={(e) => setReportData(prev => ({
                    ...prev,
                    activities: {
                      ...prev.activities,
                      events: {
                        ...prev.activities.events,
                        description: e.target.value
                      }
                    }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Overview of events you organized this month..."
                />
                
                <div className="space-y-4">
                  {reportData.activities.events.eventDetails.map((event) => (
                    <div key={event.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={event.name}
                          onChange={(e) => updateEvent(event.id, { name: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Event name"
                        />
                        <input
                          type="date"
                          value={event.date}
                          onChange={(e) => updateEvent(event.id, { date: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          value={event.location}
                          onChange={(e) => updateEvent(event.id, { location: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Location"
                        />
                        <input
                          type="number"
                          value={event.attendeeCount}
                          onChange={(e) => updateEvent(event.id, { attendeeCount: Number(e.target.value) })}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Attendee count"
                        />
                      </div>
                      <div className="mt-4">
                        <textarea
                          rows={3}
                          value={event.description}
                          onChange={(e) => updateEvent(event.id, { description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Event description and outcomes"
                        />
                      </div>
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={() => removeEvent(event.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addEvent}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Event</span>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Engagement</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discord Activity</label>
                  <textarea
                    rows={3}
                    value={reportData.activities.communityEngagement.discordActivity}
                    onChange={(e) => setReportData(prev => ({
                      ...prev,
                      activities: {
                        ...prev.activities,
                        communityEngagement: {
                          ...prev.activities.communityEngagement,
                          discordActivity: e.target.value
                        }
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your Discord community engagement activities..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Social Media Activity</label>
                  <textarea
                    rows={3}
                    value={reportData.activities.communityEngagement.socialMediaActivity}
                    onChange={(e) => setReportData(prev => ({
                      ...prev,
                      activities: {
                        ...prev.activities,
                        communityEngagement: {
                          ...prev.activities.communityEngagement,
                          socialMediaActivity: e.target.value
                        }
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your social media engagement activities..."
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
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
                        quantitativeMetrics: {
                          ...prev.impact.quantitativeMetrics,
                          newCommunityMembers: Number(e.target.value)
                        }
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
                        quantitativeMetrics: {
                          ...prev.impact.quantitativeMetrics,
                          socialMediaReach: Number(e.target.value)
                        }
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
                        quantitativeMetrics: {
                          ...prev.impact.quantitativeMetrics,
                          contentEngagement: Number(e.target.value)
                        }
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
                        quantitativeMetrics: {
                          ...prev.impact.quantitativeMetrics,
                          eventsHosted: Number(e.target.value)
                        }
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
                rows={6}
                value={reportData.impact.qualitativeImpact}
                onChange={(e) => setReportData(prev => ({
                  ...prev,
                  impact: {
                    ...prev.impact,
                    qualitativeImpact: e.target.value
                  }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the qualitative impact of your work this month..."
              />
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
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        value={expense.category}
                        onChange={(e) => updateExpense(index, { category: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Expense category"
                      />
                      <input
                        type="number"
                        value={expense.amount}
                        onChange={(e) => updateExpense(index, { amount: Number(e.target.value) })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Amount"
                      />
                      <div className="flex items-center space-x-2">
                        <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                          <Upload className="h-4 w-4" />
                          <span>Upload Receipt</span>
                        </button>
                        <button
                          onClick={() => removeExpense(index)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <textarea
                        rows={2}
                        value={expense.description}
                        onChange={(e) => updateExpense(index, { description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Expense description"
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={addExpense}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Expense</span>
                </button>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback & Support</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Challenges Faced</label>
                  <textarea
                    rows={4}
                    value={reportData.feedback.challengesFaced}
                    onChange={(e) => setReportData(prev => ({
                      ...prev,
                      feedback: {
                        ...prev.feedback,
                        challengesFaced: e.target.value
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe any challenges you faced this month..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Support Needed</label>
                  <textarea
                    rows={4}
                    value={reportData.feedback.supportNeeded}
                    onChange={(e) => setReportData(prev => ({
                      ...prev,
                      feedback: {
                        ...prev.feedback,
                        supportNeeded: e.target.value
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="What support do you need from the organization?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Suggestions & Ideas</label>
                  <textarea
                    rows={4}
                    value={reportData.feedback.suggestions}
                    onChange={(e) => setReportData(prev => ({
                      ...prev,
                      feedback: {
                        ...prev.feedback,
                        suggestions: e.target.value
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Share any suggestions or ideas for improvement..."
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Summary</h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Reporting Period</h4>
                    <p className="text-gray-600">
                      {monthNames[reportData.reportingPeriod.month]} {reportData.reportingPeriod.year}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Content Created</h4>
                    <p className="text-gray-600">{reportData.activities.contentCreation.count} pieces</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Events Hosted</h4>
                    <p className="text-gray-600">{reportData.activities.events.eventDetails.length} events</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Total Expenses</h4>
                    <p className="text-gray-600">${reportData.expenses.breakdown.reduce((total, expense) => total + expense.amount, 0)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800">Ready to Submit</h4>
                  <p className="text-blue-700 text-sm mt-1">
                    Once submitted, this report will be sent to your organization and automatically synced to Airtable for processing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Monthly Report Submission</h1>
          <p className="text-gray-600 mt-2">
            Submit your comprehensive monthly ambassador report
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
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
                  <div className="ml-3 hidden md:block">
                    <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                      {step.name}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden md:block w-16 h-0.5 mx-4 ${isCompleted ? 'bg-green-600' : 'bg-gray-300'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
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
                <div className="flex space-x-2">
                  <button
                    onClick={handlePreview}
                    className="flex items-center px-4 py-2 border border-blue-300 rounded-lg text-blue-700 hover:bg-blue-50"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
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
    </div>
  );
};

export default MonthlyReportSubmission;
