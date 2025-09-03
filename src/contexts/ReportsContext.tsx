import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Interfaces for Monthly Reports
export interface MediaFile {
  id: string;
  file: File;
  type: 'image' | 'video' | 'document';
  preview?: string;
  caption?: string;
  uploadProgress?: number;
  uploadStatus?: 'pending' | 'uploading' | 'completed' | 'error';
  size: number;
  name: string;
  url?: string;
}

export interface EventDetail {
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

export interface MonthlyReportData {
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

export interface MonthlyReport {
  id: string;
  userId: string;
  userName: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'revision_requested';
  reportData: MonthlyReportData;
  submittedAt?: string;
  reviewedAt?: string;
  reviewer?: string;
  lastModified: string;
  version: number;
  feedback?: {
    reviewerComments?: string;
    rating?: number;
  };
  exportUrls?: {
    pdf?: string;
    docx?: string;
    data?: string;
  };
}

// Interfaces for Cumulative Reports
export interface CumulativeReport {
  id: string;
  reportingPeriod: { month: number; year: number };
  region: string;
  generatedAt: string;
  generatedBy: 'ai' | 'manual';
  status: 'draft' | 'ready' | 'sent';
  aiConfidence: number;
  executiveSummary: string;
  keyHighlights: string[];
  metrics: any;
  recommendations: {
    immediate: string[];
    longTerm: string[];
    resourceRequests: string[];
  };
  sentTo?: string[];
  sentAt?: string;
}

// Export Job Tracking
export interface ExportJob {
  id: string;
  reportId: string;
  reportType: 'monthly' | 'cumulative';
  format: 'pdf' | 'docx' | 'xlsx' | 'csv';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  downloadUrl?: string;
  createdAt: string;
  completedAt?: string;
  error?: string;
}

// Notification Interface
export interface ReportNotification {
  id: string;
  type: 'report_submitted' | 'report_approved' | 'report_rejected' | 'review_required' | 'export_ready';
  title: string;
  message: string;
  reportId?: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

interface ReportsContextType {
  // Monthly Reports State
  userReports: MonthlyReport[];
  currentDraft: MonthlyReport | null;
  isLoadingReports: boolean;
  
  // President/Regional Reports (for presidents viewing ambassador reports)
  ambassadorReports: MonthlyReport[];
  pendingReviews: MonthlyReport[];
  isLoadingAmbassadorReports: boolean;
  
  // Cumulative Reports
  cumulativeReports: CumulativeReport[];
  latestCumulativeReport: CumulativeReport | null;
  isGeneratingCumulative: boolean;
  
  // Export Management
  exportJobs: ExportJob[];
  activeExports: ExportJob[];
  
  // Notifications
  notifications: ReportNotification[];
  unreadCount: number;
  
  // Search and Filtering
  searchFilters: {
    searchTerm: string;
    statusFilter: string;
    dateRange: { start: string; end: string } | null;
    reportType: string;
  };
  
  // Monthly Report Actions
  createDraft: (reportData: Partial<MonthlyReportData>) => Promise<MonthlyReport>;
  updateDraft: (reportId: string, updates: Partial<MonthlyReportData>) => Promise<void>;
  saveDraft: (reportId: string) => Promise<void>;
  submitReport: (reportId: string) => Promise<void>;
  getUserReports: (filters?: any) => Promise<MonthlyReport[]>;
  getReportById: (reportId: string) => Promise<MonthlyReport | null>;
  deleteReport: (reportId: string) => Promise<void>;
  
  // Ambassador Report Management (for presidents)
  getAmbassadorReports: (filters?: any) => Promise<MonthlyReport[]>;
  reviewReport: (reportId: string, action: 'approve' | 'reject', feedback?: string, rating?: number) => Promise<void>;
  requestRevision: (reportId: string, feedback: string) => Promise<void>;
  
  // Cumulative Report Actions
  generateCumulativeReport: (period: { month: number; year: number }) => Promise<CumulativeReport>;
  getCumulativeReports: () => Promise<CumulativeReport[]>;
  sendCumulativeReport: (reportId: string, recipients: string[], message?: string) => Promise<void>;
  regenerateAI: (reportId: string) => Promise<CumulativeReport>;
  
  // Export Actions
  exportReport: (reportId: string, options: any) => Promise<ExportJob>;
  getExportJobs: () => Promise<ExportJob[]>;
  downloadExport: (jobId: string) => Promise<string>;
  cancelExport: (jobId: string) => Promise<void>;
  
  // Media Upload Actions
  uploadMediaFile: (file: File, category: string) => Promise<MediaFile>;
  deleteMediaFile: (fileId: string) => Promise<void>;
  updateMediaCaption: (fileId: string, caption: string) => Promise<void>;
  
  // Notification Actions
  getNotifications: () => Promise<ReportNotification[]>;
  markNotificationRead: (notificationId: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  
  // Filter Actions
  updateSearchFilters: (filters: Partial<typeof searchFilters>) => void;
  clearFilters: () => void;
  
  // Utility Actions
  refreshData: () => Promise<void>;
  getReportStats: () => Promise<any>;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
};

interface ReportsProviderProps {
  children: ReactNode;
}

export const ReportsProvider: React.FC<ReportsProviderProps> = ({ children }) => {
  const { user } = useAuth();
  
  // State Management
  const [userReports, setUserReports] = useState<MonthlyReport[]>([]);
  const [currentDraft, setCurrentDraft] = useState<MonthlyReport | null>(null);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  
  const [ambassadorReports, setAmbassadorReports] = useState<MonthlyReport[]>([]);
  const [pendingReviews, setPendingReviews] = useState<MonthlyReport[]>([]);
  const [isLoadingAmbassadorReports, setIsLoadingAmbassadorReports] = useState(false);
  
  const [cumulativeReports, setCumulativeReports] = useState<CumulativeReport[]>([]);
  const [latestCumulativeReport, setLatestCumulativeReport] = useState<CumulativeReport | null>(null);
  const [isGeneratingCumulative, setIsGeneratingCumulative] = useState(false);
  
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([]);
  const [notifications, setNotifications] = useState<ReportNotification[]>([]);
  
  const [searchFilters, setSearchFilters] = useState({
    searchTerm: '',
    statusFilter: 'all',
    dateRange: null as { start: string; end: string } | null,
    reportType: 'all'
  });

  // Load initial data
  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [user]);

  // Monthly Report Actions
  const createDraft = async (reportData: Partial<MonthlyReportData>): Promise<MonthlyReport> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newReport: MonthlyReport = {
        id: `draft-${Date.now()}`,
        userId: user?.id || '',
        userName: user?.name || '',
        status: 'draft',
        reportData: {
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
            contentCreation: { description: '', count: 0, mediaFiles: [], links: [] },
            events: { description: '', eventDetails: [], totalAttendees: 0, totalBudget: 0 },
            communityEngagement: { description: '', discordActivity: '', socialMediaActivity: '', partnershipWork: '' },
            other: { description: '', customActivities: [] }
          },
          impact: {
            quantitativeMetrics: { newCommunityMembers: 0, socialMediaReach: 0, contentEngagement: 0, eventsHosted: 0 },
            qualitativeImpact: '',
            testimonials: []
          },
          expenses: { totalAmount: 0, breakdown: [] },
          feedback: { challengesFaced: '', supportNeeded: '', suggestions: '' },
          ...reportData
        } as MonthlyReportData,
        lastModified: new Date().toISOString(),
        version: 1
      };
      
      setCurrentDraft(newReport);
      setUserReports(prev => [newReport, ...prev]);
      
      return newReport;
    } catch (error) {
      throw new Error('Failed to create draft');
    }
  };

  const updateDraft = async (reportId: string, updates: Partial<MonthlyReportData>): Promise<void> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const updateReport = (report: MonthlyReport) => {
        if (report.id === reportId) {
          return {
            ...report,
            reportData: { ...report.reportData, ...updates },
            lastModified: new Date().toISOString()
          };
        }
        return report;
      };
      
      setUserReports(prev => prev.map(updateReport));
      if (currentDraft?.id === reportId) {
        setCurrentDraft(prev => prev ? updateReport(prev) : null);
      }
    } catch (error) {
      throw new Error('Failed to update draft');
    }
  };

  const submitReport = async (reportId: string): Promise<void> => {
    try {
      setIsLoadingReports(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const updateReport = (report: MonthlyReport) => {
        if (report.id === reportId) {
          return {
            ...report,
            status: 'submitted' as const,
            submittedAt: new Date().toISOString()
          };
        }
        return report;
      };
      
      setUserReports(prev => prev.map(updateReport));
      if (currentDraft?.id === reportId) {
        setCurrentDraft(null);
      }
      
      // Add notification
      const notification: ReportNotification = {
        id: `notif-${Date.now()}`,
        type: 'report_submitted',
        title: 'Report Submitted',
        message: 'Your monthly report has been submitted for review.',
        reportId,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [notification, ...prev]);
      
    } catch (error) {
      throw new Error('Failed to submit report');
    } finally {
      setIsLoadingReports(false);
    }
  };

  const getUserReports = async (filters?: any): Promise<MonthlyReport[]> => {
    try {
      setIsLoadingReports(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data would be replaced with actual API call
      return userReports;
    } catch (error) {
      throw new Error('Failed to fetch user reports');
    } finally {
      setIsLoadingReports(false);
    }
  };

  const getReportById = async (reportId: string): Promise<MonthlyReport | null> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      return userReports.find(report => report.id === reportId) || null;
    } catch (error) {
      throw new Error('Failed to fetch report');
    }
  };

  // Ambassador Report Management (for presidents)
  const getAmbassadorReports = async (filters?: any): Promise<MonthlyReport[]> => {
    try {
      setIsLoadingAmbassadorReports(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - replace with actual API
      const mockReports: MonthlyReport[] = [];
      setAmbassadorReports(mockReports);
      setPendingReviews(mockReports.filter(r => ['submitted', 'under_review'].includes(r.status)));
      
      return mockReports;
    } catch (error) {
      throw new Error('Failed to fetch ambassador reports');
    } finally {
      setIsLoadingAmbassadorReports(false);
    }
  };

  const reviewReport = async (reportId: string, action: 'approve' | 'reject', feedback?: string, rating?: number): Promise<void> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updateReport = (report: MonthlyReport) => {
        if (report.id === reportId) {
          return {
            ...report,
            status: action === 'approve' ? 'approved' as const : 'rejected' as const,
            reviewedAt: new Date().toISOString(),
            reviewer: user?.name,
            feedback: { reviewerComments: feedback, rating }
          };
        }
        return report;
      };
      
      setAmbassadorReports(prev => prev.map(updateReport));
      setPendingReviews(prev => prev.filter(r => r.id !== reportId));
      
    } catch (error) {
      throw new Error('Failed to review report');
    }
  };

  // Cumulative Report Actions
  const generateCumulativeReport = async (period: { month: number; year: number }): Promise<CumulativeReport> => {
    try {
      setIsGeneratingCumulative(true);
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newCumulativeReport: CumulativeReport = {
        id: `cumulative-${period.year}-${period.month}`,
        reportingPeriod: period,
        region: user?.chapterId || 'Unknown Region',
        generatedAt: new Date().toISOString(),
        generatedBy: 'ai',
        status: 'ready',
        aiConfidence: Math.floor(Math.random() * 20) + 80, // 80-100%
        executiveSummary: 'AI-generated summary of regional performance...',
        keyHighlights: [],
        metrics: {},
        recommendations: { immediate: [], longTerm: [], resourceRequests: [] }
      };
      
      setCumulativeReports(prev => [newCumulativeReport, ...prev]);
      setLatestCumulativeReport(newCumulativeReport);
      
      return newCumulativeReport;
    } catch (error) {
      throw new Error('Failed to generate cumulative report');
    } finally {
      setIsGeneratingCumulative(false);
    }
  };

  // Export Actions
  const exportReport = async (reportId: string, options: any): Promise<ExportJob> => {
    try {
      const exportJob: ExportJob = {
        id: `export-${Date.now()}`,
        reportId,
        reportType: options.reportType || 'monthly',
        format: options.format,
        status: 'pending',
        progress: 0,
        createdAt: new Date().toISOString()
      };
      
      setExportJobs(prev => [exportJob, ...prev]);
      
      // Simulate export process
      setTimeout(() => {
        setExportJobs(prev => prev.map(job => 
          job.id === exportJob.id 
            ? { ...job, status: 'processing' as const, progress: 25 }
            : job
        ));
      }, 500);
      
      setTimeout(() => {
        setExportJobs(prev => prev.map(job => 
          job.id === exportJob.id 
            ? { 
                ...job, 
                status: 'completed' as const, 
                progress: 100,
                downloadUrl: `https://example.com/exports/${job.id}.${job.format}`,
                completedAt: new Date().toISOString()
              }
            : job
        ));
      }, 3000);
      
      return exportJob;
    } catch (error) {
      throw new Error('Failed to start export');
    }
  };

  // Media Upload Actions
  const uploadMediaFile = async (file: File, category: string): Promise<MediaFile> => {
    try {
      const mediaFile: MediaFile = {
        id: `media-${Date.now()}`,
        file,
        type: file.type.startsWith('image/') ? 'image' : 
              file.type.startsWith('video/') ? 'video' : 'document',
        size: file.size,
        name: file.name,
        uploadStatus: 'pending'
      };
      
      // Simulate upload process
      mediaFile.uploadStatus = 'uploading';
      for (let progress = 0; progress <= 100; progress += 20) {
        mediaFile.uploadProgress = progress;
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      mediaFile.uploadStatus = 'completed';
      mediaFile.url = `https://example.com/uploads/${mediaFile.id}`;
      
      return mediaFile;
    } catch (error) {
      throw new Error('Failed to upload media file');
    }
  };

  // Notification Actions
  const getNotifications = async (): Promise<ReportNotification[]> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return notifications;
    } catch (error) {
      throw new Error('Failed to fetch notifications');
    }
  };

  const markNotificationRead = async (notificationId: string): Promise<void> => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    ));
  };

  const markAllNotificationsRead = async (): Promise<void> => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  };

  // Filter Actions
  const updateSearchFilters = (filters: Partial<typeof searchFilters>) => {
    setSearchFilters(prev => ({ ...prev, ...filters }));
  };

  const clearFilters = () => {
    setSearchFilters({
      searchTerm: '',
      statusFilter: 'all',
      dateRange: null,
      reportType: 'all'
    });
  };

  // Utility Actions
  const refreshData = async (): Promise<void> => {
    try {
      await Promise.all([
        getUserReports(),
        user?.role === 'president' ? getAmbassadorReports() : Promise.resolve(),
        getNotifications()
      ]);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  };

  const getReportStats = async () => {
    return {
      totalReports: userReports.length,
      submittedThisMonth: userReports.filter(r => 
        new Date(r.lastModified).getMonth() === new Date().getMonth()
      ).length,
      averageRating: userReports
        .filter(r => r.feedback?.rating)
        .reduce((sum, r) => sum + (r.feedback?.rating || 0), 0) / 
        userReports.filter(r => r.feedback?.rating).length || 0
    };
  };

  // Computed values
  const activeExports = exportJobs.filter(job => ['pending', 'processing'].includes(job.status));
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const value: ReportsContextType = {
    // State
    userReports,
    currentDraft,
    isLoadingReports,
    ambassadorReports,
    pendingReviews,
    isLoadingAmbassadorReports,
    cumulativeReports,
    latestCumulativeReport,
    isGeneratingCumulative,
    exportJobs,
    activeExports,
    notifications,
    unreadCount,
    searchFilters,
    
    // Monthly Report Actions
    createDraft,
    updateDraft,
    saveDraft: async (reportId: string) => {
      // Auto-save is handled in updateDraft
    },
    submitReport,
    getUserReports,
    getReportById,
    deleteReport: async (reportId: string) => {
      setUserReports(prev => prev.filter(r => r.id !== reportId));
    },
    
    // Ambassador Report Management
    getAmbassadorReports,
    reviewReport,
    requestRevision: async (reportId: string, feedback: string) => {
      await reviewReport(reportId, 'reject', feedback);
    },
    
    // Cumulative Report Actions
    generateCumulativeReport,
    getCumulativeReports: async () => cumulativeReports,
    sendCumulativeReport: async (reportId: string, recipients: string[], message?: string) => {
      // Simulate sending
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    regenerateAI: generateCumulativeReport,
    
    // Export Actions
    exportReport,
    getExportJobs: async () => exportJobs,
    downloadExport: async (jobId: string) => {
      const job = exportJobs.find(j => j.id === jobId);
      return job?.downloadUrl || '';
    },
    cancelExport: async (jobId: string) => {
      setExportJobs(prev => prev.filter(j => j.id !== jobId));
    },
    
    // Media Actions
    uploadMediaFile,
    deleteMediaFile: async (fileId: string) => {
      // Handle in component state
    },
    updateMediaCaption: async (fileId: string, caption: string) => {
      // Handle in component state
    },
    
    // Notification Actions
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    
    // Filter Actions
    updateSearchFilters,
    clearFilters,
    
    // Utility Actions
    refreshData,
    getReportStats
  };

  return (
    <ReportsContext.Provider value={value}>
      {children}
    </ReportsContext.Provider>
  );
};

export default ReportsContext;
