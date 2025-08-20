import React, { useState } from 'react';
import {
  Users, MessageCircle, Calendar, DollarSign,
  TrendingUp, Heart, MessageSquare, Plus,
  Search, Filter, ChevronDown, Clock,
  MapPin, ThumbsUp, Eye, Send, Vote
} from 'lucide-react';
import UnifiedComments from './UnifiedComments';
import { useAuth } from '../contexts/AuthContext';

interface Poll {
  id: string;
  title: string;
  description: string;
  options: { id: string; text: string; votes: number }[];
  totalVotes: number;
  createdBy: string;
  createdDate: string;
  expiryDate: string;
  status: 'active' | 'closed';
}

interface CommunityPost {
  id: string;
  type: 'discussion' | 'suggestion' | 'announcement' | 'event';
  title: string;
  content: string;
  author: string;
  authorRole: 'president' | 'ambassador' | 'organization';
  chapterName?: string;
  createdDate: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

const Communities: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'discussions' | 'polls' | 'events'>('discussions');

  // Mock data
  const communityPosts: CommunityPost[] = [
    {
      id: 'post-1',
      type: 'discussion',
      title: 'Best Practices for Social Media Campaigns',
      content: 'What strategies have worked best for your recent campaigns? Looking for tips on engagement rates...',
      author: 'Sarah Wilson',
      authorRole: 'ambassador',
      chapterName: 'United States Chapter',
      createdDate: '2024-01-20T14:30:00Z',
      likes: 12,
      comments: 8,
      isLiked: false
    },
    {
      id: 'post-2',
      type: 'announcement',
      title: 'Q1 Global Ambassador Meetup Planning',
      content: 'We\'re organizing a virtual meetup for all ambassadors. Please share your availability and topic suggestions.',
      author: 'John Smith',
      authorRole: 'president',
      chapterName: 'United States Chapter',
      createdDate: '2024-01-19T16:45:00Z',
      likes: 25,
      comments: 15,
      isLiked: true
    },
    {
      id: 'post-3',
      type: 'suggestion',
      title: 'New Task Category: Community Building',
      content: 'Suggesting we add community building tasks to help grow local ambassador networks...',
      author: 'Emma Rodriguez',
      authorRole: 'ambassador',
      chapterName: 'Canada Chapter',
      createdDate: '2024-01-18T10:20:00Z',
      likes: 8,
      comments: 4,
      isLiked: false
    }
  ];

  const activePolls: Poll[] = [
    {
      id: 'poll-1',
      title: 'Preferred Social Media Platforms for Campaigns',
      description: 'Which platforms should we prioritize for our upcoming campaigns?',
      options: [
        { id: 'opt-1', text: 'Instagram', votes: 25 },
        { id: 'opt-2', text: 'TikTok', votes: 18 },
        { id: 'opt-3', text: 'Twitter', votes: 12 },
        { id: 'opt-4', text: 'LinkedIn', votes: 8 }
      ],
      totalVotes: 63,
      createdBy: 'John Smith',
      createdDate: '2024-01-15',
      expiryDate: '2024-01-25',
      status: 'active'
    },
    {
      id: 'poll-2', 
      title: 'Best Time for Monthly Chapter Meetings',
      description: 'Help us find the optimal time for our monthly virtual meetings',
      options: [
        { id: 'opt-1', text: 'Weekday Evening (7-9 PM)', votes: 32 },
        { id: 'opt-2', text: 'Saturday Morning (10 AM - 12 PM)', votes: 28 },
        { id: 'opt-3', text: 'Sunday Afternoon (2-4 PM)', votes: 15 },
        { id: 'opt-4', text: 'Weekday Lunch (12-1 PM)', votes: 9 }
      ],
      totalVotes: 84,
      createdBy: 'Emma Rodriguez',
      createdDate: '2024-01-12',
      expiryDate: '2024-01-22',
      status: 'active'
    }
  ];

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'discussion':
        return 'bg-blue-100 text-blue-800';
      case 'suggestion':
        return 'bg-purple-100 text-purple-800';
      case 'announcement':
        return 'bg-green-100 text-green-800';
      case 'event':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'president':
        return '👑';
      case 'ambassador':
        return '🚀';
      case 'organization':
        return '🏢';
      default:
        return '👤';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Communities</h1>
          <p className="text-gray-600 mt-1">Connect, collaborate, and share with your chapter network</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>New Post</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Discussions</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{communityPosts.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <MessageCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Polls</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{activePolls.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Vote className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Chapter Members</p>
              <p className="text-2xl font-bold text-green-600 mt-1">47</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 py-4">
            <button
              onClick={() => setActiveTab('discussions')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'discussions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Discussions ({communityPosts.length})
            </button>
            <button
              onClick={() => setActiveTab('polls')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'polls'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Polls ({activePolls.length})
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'events'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Events & Announcements
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'discussions' && (
            <div className="space-y-4">
              {communityPosts.map((post) => (
                <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getRoleIcon(post.authorRole)}</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900">{post.author}</h4>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPostTypeColor(post.type)}`}>
                            {post.type}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          {post.chapterName && (
                            <>
                              <MapPin className="h-3 w-3" />
                              <span>{post.chapterName}</span>
                              <span>•</span>
                            </>
                          )}
                          <span>{formatTimeAgo(post.createdDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-gray-700 mb-4">{post.content}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button className={`flex items-center space-x-1 text-sm ${post.isLiked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}>
                        <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-500">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-500">
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'polls' && (
            <div className="space-y-6">
              {activePolls.map((poll) => (
                <div key={poll.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{poll.title}</h3>
                      <p className="text-gray-600 mt-1">{poll.description}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(poll.status)}`}>
                      {poll.status}
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    {poll.options.map((option) => {
                      const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
                      return (
                        <div key={option.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">{option.text}</span>
                            <span className="text-sm text-gray-500">{option.votes} votes ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Created by {poll.createdBy} • {poll.totalVotes} total votes</span>
                    <span>Expires {new Date(poll.expiryDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-4">
              <div className="bg-orange-50 rounded-lg p-6 text-center">
                <Calendar className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Events & Announcements</h3>
                <p className="text-gray-600 mb-4">Stay updated with chapter events and important announcements</p>
                <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                  Create Event
                </button>
              </div>
              
              {communityPosts.filter(post => post.type === 'announcement' || post.type === 'event').map((post) => (
                <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">{getRoleIcon(post.authorRole)}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">{post.author}</h4>
                      <p className="text-sm text-gray-500">{post.chapterName} • {formatTimeAgo(post.createdDate)}</p>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-gray-700">{post.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Communities;
