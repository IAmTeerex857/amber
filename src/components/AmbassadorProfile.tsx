import React, { useState } from 'react';
import {
  User, MapPin, Crown, Calendar, Target, 
  DollarSign, Star, Trophy, Settings, 
  ChevronRight, AlertTriangle, CheckCircle,
  MessageCircle, Plus, Edit3, Mail, Phone
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ChapterInfo {
  id: string;
  name: string;
  country: string;
  region: string;
  presidentName: string;
  presidentEmail: string;
  memberCount: number;
  joinedDate: string;
  status: 'active' | 'pending' | 'none';
}

interface AmbassadorStats {
  totalTasks: number;
  completedTasks: number;
  totalEarned: number;
  currentRank: number;
  rating: number;
  joinDate: string;
  lastActive: string;
}

interface FundRequest {
  id: string;
  title: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  category: string;
}

const AmbassadorProfile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'chapter' | 'requests' | 'settings'>('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Mock data for demonstration
  const chapterInfo: ChapterInfo = {
    id: 'chapter-usa',
    name: 'United States Chapter',
    country: 'USA',
    region: 'North America',
    presidentName: 'John Smith',
    presidentEmail: 'john@email.com',
    memberCount: 12,
    joinedDate: '2024-01-15',
    status: 'active'
  };

  const ambassadorStats: AmbassadorStats = {
    totalTasks: 15,
    completedTasks: 12,
    totalEarned: 680,
    currentRank: 3,
    rating: 4.8,
    joinDate: '2024-01-15',
    lastActive: '2024-01-20T14:30:00Z'
  };

  const fundRequests: FundRequest[] = [
    {
      id: 'req-1',
      title: 'Conference Attendance',
      amount: 250,
      status: 'pending',
      requestDate: '2024-01-20',
      category: 'education'
    },
    {
      id: 'req-2',
      title: 'Equipment Upgrade',
      amount: 150,
      status: 'approved',
      requestDate: '2024-01-18',
      category: 'equipment'
    }
  ];

  const [profileData, setProfileData] = useState({
    name: user?.name || 'Ambassador Name',
    email: user?.email || 'ambassador@email.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    bio: 'Passionate about community building and brand advocacy. Experienced in social media marketing and event coordination.',
    skills: ['Social Media', 'Content Creation', 'Event Planning', 'Community Management']
  });

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{profileData.name}</h1>
              <p className="text-blue-100 mb-1">{profileData.email}</p>
              <div className="flex items-center space-x-4 text-sm">
                <span>🏆 Rank #{ambassadorStats.currentRank}</span>
                <span>⭐ {ambassadorStats.rating} rating</span>
                <span>💰 ${ambassadorStats.totalEarned} earned</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center space-x-2"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed Tasks</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{ambassadorStats.completedTasks}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Target className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-gray-600">of {ambassadorStats.totalTasks} assigned</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Earned</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">${ambassadorStats.totalEarned}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-gray-600">This month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Rank</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">#{ambassadorStats.currentRank}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Trophy className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-gray-600">In chapter</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rating</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{ambassadorStats.rating}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Star className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-gray-600">Average score</span>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 py-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('chapter')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'chapter'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              My Chapter
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'requests'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Fund Requests ({fundRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-900">{profileData.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-900">{profileData.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-900">{profileData.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-900">
                        Joined {new Date(ambassadorStats.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Bio</h4>
                    <p className="text-gray-700 text-sm">{profileData.bio}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Task Completed</p>
                        <p className="text-xs text-gray-500">Social media campaign - 2h ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <MessageCircle className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Community Post</p>
                        <p className="text-xs text-gray-500">Shared feedback in discussions - 5h ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                      <DollarSign className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Payment Received</p>
                        <p className="text-xs text-gray-500">$50 for campaign completion - 1d ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chapter' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Chapter Information</h3>
              
              {chapterInfo.status === 'active' ? (
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <MapPin className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{chapterInfo.name}</h4>
                        <p className="text-gray-600">{chapterInfo.region}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(chapterInfo.status)} flex items-center space-x-1`}>
                      {getStatusIcon(chapterInfo.status)}
                      <span>Active Member</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Chapter President</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Crown className="h-4 w-4 text-yellow-600" />
                        <span className="font-medium text-gray-900">{chapterInfo.presidentName}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Total Members</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">{chapterInfo.memberCount}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Joined Date</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {new Date(chapterInfo.joinedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      Contact your chapter president for support and questions
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>Contact President</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                  <AlertTriangle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No Chapter Assignment</h4>
                  <p className="text-gray-600 mb-4">
                    You haven't been assigned to a chapter yet. Contact your organization administrator 
                    to get assigned to a chapter in your region.
                  </p>
                  <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                    Request Assignment
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Fund Requests</h3>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>New Request</span>
                </button>
              </div>

              {fundRequests.length > 0 ? (
                <div className="space-y-4">
                  {fundRequests.map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{request.title}</h4>
                          <p className="text-sm text-gray-500">Category: {request.category}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-bold text-green-600">${request.amount}</span>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)} flex items-center space-x-1`}>
                            {getStatusIcon(request.status)}
                            <span className="capitalize">{request.status}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Submitted {new Date(request.requestDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No Fund Requests</h4>
                  <p className="text-gray-600 mb-4">
                    You haven't submitted any fund requests yet. Request funding for equipment, 
                    education, or other ambassador activities.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Profile Settings</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={4}
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {profileData.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center space-x-2">
                          <span>{skill}</span>
                          <button 
                            onClick={() => {
                              const newSkills = profileData.skills.filter((_, i) => i !== index);
                              setProfileData({ ...profileData, skills: newSkills });
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <button className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 flex items-center space-x-1">
                      <Plus className="h-3 w-3" />
                      <span>Add Skill</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-6 border-t border-gray-200">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Save Changes
                </button>
                <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AmbassadorProfile;
