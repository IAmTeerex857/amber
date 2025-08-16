import React, { useState } from 'react';
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  MessageSquare,
  Heart,
  Share,
  Image as ImageIcon,
  Search
} from 'lucide-react';

interface ContentSubmission {
  id: string;
  ambassador: {
    name: string;
    avatar: string;
    tier: string;
  };
  task: {
    title: string;
    campaign: string;
    points: number;
  };
  submission: {
    type: 'url' | 'media';
    url?: string;
    mediaUrl?: string;
    description: string;
    submittedAt: string;
  };
  aiAnalysis: {
    sentiment: 'positive' | 'neutral' | 'negative';
    engagementScore: number;
    brandMentions: string[];
    hashtags: string[];
    safetyFlags: string[];
    metrics: {
      likes: number;
      comments: number;
      shares: number;
      views?: number;
    };
  };
  status: 'pending' | 'approved' | 'rejected';
  reviewNotes?: string;
}

const ContentReview: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('pending');


  // Mock data
  const submissions: ContentSubmission[] = [
    {
      id: '1',
      ambassador: {
        name: 'Sam Johnson',
        avatar: 'SJ',
        tier: 'Silver'
      },
      task: {
        title: 'Create TikTok Unboxing Video',
        campaign: 'Q4 Product Launch',
        points: 500
      },
      submission: {
        type: 'url',
        url: 'https://tiktok.com/@sam/video/123',
        description: 'Unboxing the new winter collection! Love the quality and design. #GreepPayLife #WinterCollection',
        submittedAt: '2024-08-02T10:30:00Z'
      },
      aiAnalysis: {
        sentiment: 'positive',
        engagementScore: 87,
        brandMentions: ['GreepPay'],
        hashtags: ['#GreepPayLife', '#WinterCollection'],
        safetyFlags: [],
        metrics: {
          likes: 1240,
          comments: 89,
          shares: 156,
          views: 12400
        }
      },
      status: 'pending'
    },
    {
      id: '2',
      ambassador: {
        name: 'Isabella Rodriguez',
        avatar: 'IR',
        tier: 'Gold'
      },
      task: {
        title: 'Instagram Story Feature',
        campaign: 'Daily Usage Campaign',
        points: 200
      },
      submission: {
        type: 'media',
        mediaUrl: '/api/media/story-screenshot.jpg',
        description: 'Posted Instagram story showing daily GreepPay usage at coffee shop',
        submittedAt: '2024-08-02T09:15:00Z'
      },
      aiAnalysis: {
        sentiment: 'positive',
        engagementScore: 92,
        brandMentions: ['GreepPay'],
        hashtags: ['#GreepPayDaily'],
        safetyFlags: [],
        metrics: {
          likes: 89,
          comments: 12,
          shares: 23
        }
      },
      status: 'pending'
    }
  ];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getEngagementColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleApprove = (submissionId: string, notes?: string) => {
    console.log('Approving submission:', submissionId, notes);
    // Update submission status
  };

  const handleReject = (submissionId: string, notes: string) => {
    console.log('Rejecting submission:', submissionId, notes);
    // Update submission status
  };

  const filteredSubmissions = submissions.filter(sub => 
    activeFilter === 'all' || sub.status === activeFilter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Review</h1>
          <p className="mt-1 text-gray-600">Review and approve ambassador content submissions</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search submissions..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'pending', name: 'Pending Review', count: 12 },
          { id: 'approved', name: 'Approved', count: 45 },
          { id: 'rejected', name: 'Rejected', count: 3 },
          { id: 'all', name: 'All', count: 60 }
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`
              flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all
              ${activeFilter === filter.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            {filter.name}
            <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded-full">
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      {/* Submissions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSubmissions.map((submission) => (
          <div key={submission.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    {submission.ambassador.avatar}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{submission.ambassador.name}</div>
                    <div className="text-sm text-gray-500">{submission.ambassador.tier} Tier</div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  submission.status === 'approved' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {submission.status}
                </span>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-1">{submission.task.title}</h3>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{submission.task.campaign}</span>
                  <span>{submission.task.points} points</span>
                </div>
              </div>
            </div>

            {/* Content Preview */}
            <div className="p-4">
              <div className="mb-4">
                {submission.submission.type === 'url' ? (
                  <div className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                    <ExternalLink className="h-4 w-4" />
                    <a href={submission.submission.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium">
                      View Content
                    </a>
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                    <span className="ml-2 text-sm text-gray-600">Media Upload</span>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                {submission.submission.description}
              </p>

              {/* AI Analysis */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">AI Analysis</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(submission.aiAnalysis.sentiment)}`}>
                    {submission.aiAnalysis.sentiment}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Engagement Score</span>
                  <span className={`font-medium ${getEngagementColor(submission.aiAnalysis.engagementScore)}`}>
                    {submission.aiAnalysis.engagementScore}/100
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <Heart className="h-3 w-3 text-red-500" />
                    <span>{submission.aiAnalysis.metrics.likes.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-3 w-3 text-blue-500" />
                    <span>{submission.aiAnalysis.metrics.comments}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Share className="h-3 w-3 text-green-500" />
                    <span>{submission.aiAnalysis.metrics.shares}</span>
                  </div>
                  {submission.aiAnalysis.metrics.views && (
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3 text-purple-500" />
                      <span>{submission.aiAnalysis.metrics.views.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Hashtags */}
                {submission.aiAnalysis.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {submission.aiAnalysis.hashtags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            {submission.status === 'pending' && (
              <div className="p-4 border-t border-gray-200 flex space-x-2">
                <button
                  onClick={() => handleReject(submission.id, 'Needs revision')}
                  className="flex-1 flex items-center justify-center px-3 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(submission.id)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredSubmissions.length === 0 && (
        <div className="text-center py-12">
          <Eye className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions to review</h3>
          <p className="text-gray-600">
            {activeFilter === 'pending' 
              ? 'All caught up! No pending submissions at the moment.'
              : `No ${activeFilter} submissions found.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ContentReview;
