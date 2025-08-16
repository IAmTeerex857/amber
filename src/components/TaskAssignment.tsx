import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Target, 
  CheckCircle, 
  AlertCircle, 
  Award, 
  User, 
  ChevronDown, 
  Filter,
  MoreHorizontal, 
  ArrowRight, 
  ArrowLeft,
  MessageCircle,
  Clock,
  Search,
  FileText,
  GraduationCap,
  Star,
  Building2
} from 'lucide-react';

// The following interfaces are kept as they are correctly defined and used.
export interface Ambassador {
  id: string;
  name: string;
  email: string;
  type: 'student' | 'influencer' | 'business';
  location: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  points: number;
  completedTasks: number;
  successRate: number;
  socialMedia: {
    platform: string;
    followers: number;
  }[];
  status: 'regular' | 'guest' | 'disabled';
  avatar?: string;
  joinedDate: string;
  lastActive: string;
  role: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type?: 'social_post' | 'video_content' | 'blog_post' | 'referral' | 'event';
  platform?: string;
  points: number;
  priority: 'low' | 'medium' | 'high';
  deadline: string;
  assignedSegments: string[];
  proofType: 'url' | 'media' | 'auto';
  okrId: string;
  status?: 'to_do' | 'in_progress' | 'in_review' | 'done';
  assignedCount?: number;
  completedCount?: number;
  approvedCount?: number;
  tags?: string[];
  dueDate?: string; // Added dueDate as it's used in the JSX
}

export interface KeyResult {
  id: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
}

export interface OKR {
  id: string;
  objective: string;
  keyResults: KeyResult[];
  // The JSX seems to use 'title', 'target', 'current', and 'progress'
  // I will add them here for consistency with the JSX implementation.
  title?: string;
  target?: number;
  current?: number;
  progress?: number;
}

export interface Campaign {
  id?: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status?: 'active' | 'draft' | 'completed' | 'upcoming' | 'ended' | 'recurring';
  budget?: number;
  okrs: OKR[];
  tasks: Task[];
  assignedSegments: string[];
  recurrence?: boolean;
  ambassadors: Ambassador[];
  // The JSX seems to use 'goals' which is not in the original interface.
  // I will add it here.
  goals?: {
    id: number;
    title: string;
    description: string;
    status: 'in-progress' | 'completed' | 'pending';
    icon: JSX.Element;
  }[];
}

interface TaskAssignmentProps {
  campaign: Campaign;
  onClose?: () => void;
}

const TaskAssignment: React.FC<TaskAssignmentProps> = ({ campaign }) => { 
  // No need for 'onClose' prop to be used inside the component's logic for this example.
  const [selectedTask, setSelectedTask] = useState<any>(null);
  type TabType = 'overview' | 'tasks' | 'ambassadors';
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedAmbassadors, setSelectedAmbassadors] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'regular' | 'guest' | 'disabled'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'student' | 'influencer' | 'business'>('all');
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [assignmentSettings, setAssignmentSettings] = useState({
    sendNotification: true,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    reminderDays: 3,
    allowDecline: true,
    autoReminder: true
  });
  const [showAmbassadorMenu, setShowAmbassadorMenu] = useState<string | null>(null);
  
  // These commented-out variables were not used and can be safely removed or kept as comments.
  // const [selectedOKR] = useState<OKR | null>(campaign.okrs[0] || null);
  // const [taskStatusFilter] = useState<'all' | 'to_do' | 'in_progress' | 'in_review' | 'done'>('all');
  // const [showTaskMenu, setShowTaskMenu] = useState<string | null>(null);
  // The functions below are kept as they were correctly defined.
  const taskStats = {
    total: campaign.tasks.length,
    todo: campaign.tasks.filter(t => t.status === 'to_do').length,
    inProgress: campaign.tasks.filter(t => t.status === 'in_progress').length,
    inReview: campaign.tasks.filter(t => t.status === 'in_review').length,
    completed: campaign.tasks.filter(t => t.status === 'done').length
  };

  const filteredAmbassadors = campaign.ambassadors.filter(ambassador => {
    if (statusFilter !== 'all' && ambassador.status !== statusFilter) return false;
    if (typeFilter !== 'all' && ambassador.type !== typeFilter) return false;
    if (searchQuery && !ambassador.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleAmbassadorSelect = (ambId: string) => {
    setSelectedAmbassadors(prev =>
      prev.includes(ambId)
        ? prev.filter(id => id !== ambId)
        : [...prev, ambId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAmbassadors.length === campaign.ambassadors.length) {
      setSelectedAmbassadors([]);
    } else {
      setSelectedAmbassadors(campaign.ambassadors.map(a => a.id));
    }
  };

  const handleAssignTask = () => {
    if (!selectedTask || selectedAmbassadors.length === 0) return;

    // Simulate task assignment
    console.log('Assigning task:', selectedTask.id, 'to ambs:', selectedAmbassadors);
    console.log('Settings:', assignmentSettings);

    // Show success message
    // Note: Replaced alert with a simple console log to prevent issues in the collaborative environment
    console.log(`Task "${selectedTask.title}" assigned to ${selectedAmbassadors.length} ambs!`);

    // Reset
    setShowAssignmentModal(false);
    setSelectedAmbassadors([]);
    setSelectedTask(null);
  };

  const getTypeIcon = (type: 'student' | 'influencer' | 'business' | string) => {
    switch(type) {
      case 'student': return <GraduationCap size={14} className="mr-1" />;
      case 'influencer': return <Star size={14} className="mr-1" />;
      case 'business': return <Building2 size={14} className="mr-1" />;
      default: return <User size={14} className="mr-1" />;
    }
  };

  const getTierColor = (tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | string): string => {
    switch(tier) {
      case 'Bronze': return 'text-amber-600';
      case 'Silver': return 'text-gray-400';
      case 'Gold': return 'text-yellow-500';
      case 'Platinum': return 'text-blue-400';
      default: return 'text-gray-500';
    }
  };

  const getStatusColor = (status: 'regular' | 'guest' | 'disabled'): string => {
    switch (status) {
      case 'regular': return 'bg-green-100 text-green-800';
      case 'guest': return 'bg-blue-100 text-blue-800';
      case 'disabled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded-xl shadow">
      {/* Header section */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Ambassadors
          </h1>
          <p className="text-gray-500 mt-1">Manage ambs and assign them to tasks</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search ambs..."
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Users size={16} />
            Invite Ambassadors
          </button>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'tasks' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Tasks
          </button>
          <button
            onClick={() => setActiveTab('ambassadors')}
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'ambassadors' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Ambassadors
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Campaign Overview Header */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{campaign.name}</h2>
                <p className="text-gray-600 mt-2">{campaign.description}</p>
                <div className="flex items-center mt-4 space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                    campaign.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {campaign.status ? campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1) : 'Draft'}
                  </span>
                  <span className="text-sm text-gray-500">Budget: ${campaign.budget?.toLocaleString() || '0'}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">
                  {Math.floor((campaign.tasks.filter(t => t.status === 'done').length / campaign.tasks.length) * 100)}%
                </div>
                <div className="text-sm text-gray-500">Campaign Progress</div>
              </div>
            </div>
          </div>

          {/* OKRs and Goals Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Campaign OKRs */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Campaign OKRs</h3>
                  <p className="text-sm text-gray-500 mt-1">Objectives and Key Results</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Target className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {campaign.okrs?.filter((okr: any) => okr.progress >= 100).length || 1} of {campaign.okrs?.length || 3}
                      </div>
                      <div className="text-gray-500">Complete</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {(campaign.okrs || [
                  { 
                    id: 1, 
                    title: 'Increase brand awareness', 
                    description: 'Expand reach across social media platforms',
                    target: 100000, 
                    current: 75000, 
                    progress: 75,
                    unit: 'impressions',
                    status: 'on_track'
                  },
                  { 
                    id: 2, 
                    title: 'Generate user-generated content', 
                    description: 'Encourage ambassador content creation',
                    target: 500, 
                    current: 320, 
                    progress: 64,
                    unit: 'posts',
                    status: 'at_risk'
                  },
                  { 
                    id: 3, 
                    title: 'Drive website traffic', 
                    description: 'Increase qualified visitor conversions',
                    target: 50000, 
                    current: 42000, 
                    progress: 84,
                    unit: 'visitors',
                    status: 'on_track'
                  }
                ]).map((okr) => (
                  <div key={okr.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{okr.title}</h4>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            (okr as any).status === 'on_track' ? 'bg-green-100 text-green-700' :
                            (okr as any).status === 'at_risk' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {(okr as any).status === 'on_track' ? 'On Track' : 
                             (okr as any).status === 'at_risk' ? 'At Risk' : 'Behind'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{(okr as any).description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-gray-900">{okr.progress}%</div>
                        <div className="text-xs text-gray-500">Complete</div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full transition-all duration-500 ${
                            (okr.progress ?? 0) >= 80 ? 'bg-green-500' :
                            (okr.progress ?? 0) >= 60 ? 'bg-blue-500' :
                            (okr.progress ?? 0) >= 40 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${okr.progress}%` }} 
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-600">
                          <span className="font-medium text-gray-900">{okr.current?.toLocaleString()}</span> / {okr.target?.toLocaleString()} {(okr as any).unit}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <span className="text-xs">
                          {(okr.target ?? 0) - (okr.current ?? 0) > 0 ? `${((okr.target ?? 0) - (okr.current ?? 0)).toLocaleString()} remaining` : 'Goal achieved!'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">Overall Campaign Progress</div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View All OKRs
                  </button>
                </div>
              </div>
            </div>

            {/* Campaign Goals */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Campaign Goals</h3>
                <span className="text-sm text-gray-500">Q4 2024</span>
              </div>
              <div className="space-y-4">
                {(campaign.goals || [
                  { id: 1, title: 'Social Media Engagement', description: 'Achieve 25% increase in social media engagement across all platforms', status: 'in-progress', icon: <MessageCircle className="h-5 w-5 text-blue-500" /> },
                  { id: 2, title: 'Content Creation', description: 'Generate 100 pieces of user-generated content', status: 'completed', icon: <FileText className="h-5 w-5 text-green-500" /> },
                  { id: 3, title: 'Brand Partnerships', description: 'Establish partnerships with 3 micro-influencers', status: 'pending', icon: <Users className="h-5 w-5 text-yellow-500" /> }
                ]).map((goal) => (
                  <div key={goal.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {goal.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{goal.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                        goal.status === 'completed' ? 'bg-green-100 text-green-800' :
                        goal.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {goal.status === 'completed' ? 'Completed' :
                         goal.status === 'in-progress' ? 'In Progress' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Top Performing Ambassadors - From orphaned code */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <h3 className="text-lg font-medium">Top Performing Ambassadors</h3>
                <div className="ml-2 text-gray-400 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex justify-between mb-4">
              <div className="text-sm text-gray-500">Ambassador</div>
              <div className="text-sm text-gray-500">Points earned</div>
            </div>
            <div className="space-y-4">
              {campaign.ambassadors.slice(0, 5).map((ambassador, index) => {
                const points = [850, 720, 680, 540, 320][index];
                const maxPoints = 850;
                const widthPercentage = Math.round((points / maxPoints) * 100);
                const rank = index + 1;
                return (
                  <div key={`top-${ambassador.id}`} className="flex items-center">
                    <div className="flex-shrink-0 mr-3 flex items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 ${
                        rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                        rank === 2 ? 'bg-gray-100 text-gray-800' :
                        rank === 3 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {rank}
                      </div>
                      {ambassador.avatar ? (
                        <img src={ambassador.avatar} alt={ambassador.name} className="h-8 w-8 rounded-full" />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium text-xs">
                          {ambassador.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">{ambassador.name}</div>
                        <div className="text-sm text-gray-500 font-medium">{points} pts</div>
                      </div>
                      <div className="mt-1 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${
                          rank === 1 ? 'bg-yellow-500' :
                          rank === 2 ? 'bg-gray-400' :
                          rank === 3 ? 'bg-orange-500' :
                          'bg-blue-500'
                        }`} style={{ width: `${widthPercentage}%` }}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tasks Tab Content */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          {!selectedTask ? (
            /* Task List View */
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Campaign Tasks</h3>
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {/* Task List Items */}
                  {[
                    {
                      id: 1,
                      title: 'Send email and follow-up on docs',
                      description: 'Follow up with clients regarding signed documentation',
                      status: 'In-Progress',
                      statusColor: 'bg-yellow-100 text-yellow-800',
                      assignee: { name: 'Jane McWorthy', initials: 'JM', color: 'bg-blue-500' },
                      dueDate: '24 Feb, 2023',
                      priority: 'High',
                      priorityColor: 'bg-red-100 text-red-800',
                      progress: 33
                    },
                    {
                      id: 2,
                      title: 'Create social media content',
                      description: 'Design and schedule social media posts for Q1 campaign',
                      status: 'Completed',
                      statusColor: 'bg-green-100 text-green-800',
                      assignee: { name: 'Sarah Johnson', initials: 'SJ', color: 'bg-purple-500' },
                      dueDate: '20 Feb, 2023',
                      priority: 'Medium',
                      priorityColor: 'bg-yellow-100 text-yellow-800',
                      progress: 100
                    },
                    {
                      id: 3,
                      title: 'Product demo video',
                      description: 'Record and edit product demonstration video',
                      status: 'Not Started',
                      statusColor: 'bg-gray-100 text-gray-800',
                      assignee: { name: 'Michael Chen', initials: 'MC', color: 'bg-green-500' },
                      dueDate: '28 Feb, 2023',
                      priority: 'Low',
                      priorityColor: 'bg-blue-100 text-blue-800',
                      progress: 0
                    }
                  ].map((task) => (
                    <div 
                      key={task.id}
                      className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${task.statusColor}`}>
                              {task.status}
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${task.priorityColor}`}>
                              {task.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                              <div className={`w-6 h-6 ${task.assignee.color} rounded-full flex items-center justify-center text-white text-xs font-medium`}>
                                {task.assignee.initials}
                              </div>
                              <span className="text-sm text-gray-700">{task.assignee.name}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>{task.dueDate}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">Progress:</span>
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                  style={{ width: `${task.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-900">{task.progress}%</span>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Task Detail Modal View */
            <div className="bg-white rounded-lg shadow-lg">
              {/* Back Button */}
              <div className="px-6 py-3 border-b border-gray-200">
                <button 
                  onClick={() => setSelectedTask(null)}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Tasks
                </button>
              </div>
              
              {/* Task Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-xl font-semibold text-gray-900">{selectedTask.title}</h2>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedTask.statusColor}`}>
                      {selectedTask.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">1/3</span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-gray-600">{selectedTask.description}</p>
              </div>

              {/* Task Details Grid */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Assigned to</label>
                    <div className="mt-1 flex items-center space-x-2">
                      <div className={`w-6 h-6 ${selectedTask.assignee.color} rounded-full flex items-center justify-center text-white text-xs font-medium`}>
                        {selectedTask.assignee.initials}
                      </div>
                      <span className="text-sm text-gray-900">{selectedTask.assignee.name}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Due date</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedTask.dueDate}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Label</label>
                    <span className="mt-1 inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      Internal
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Priority</label>
                    <span className={`mt-1 inline-flex items-center px-2 py-1 rounded text-xs font-medium ${selectedTask.priorityColor}`}>
                      {selectedTask.priority}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Comments</h4>
                <div className="space-y-4">
                  {/* Comment 1 */}
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      CM
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">Christina Miller</span>
                        <span className="text-xs text-gray-500">8 min ago</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-700">
                        This is a testing comment. I will find champion. Maybe soon? Or maybe never? Who knows
                      </p>
                    </div>
                  </div>

                  {/* Comment 2 */}
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      MM
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">Michael Mitchell</span>
                        <span className="text-xs text-gray-500">8 min ago</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-700">
                        No wonder they say that you need to be able to leave in time. The clearest examples of this are Lam and Alonso
                      </p>
                    </div>
                  </div>

                  {/* Add Comment */}
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium">
                      You
                    </div>
                    <div className="flex-1">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Add a comment"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button className="absolute right-2 top-2 text-blue-600 hover:text-blue-700">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Footer */}
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">Progress:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-32">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${selectedTask.progress}%` }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{selectedTask.progress}%</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                      Mark Complete
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Update Status
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ambassadors Tab Content */}
      {activeTab === 'ambassadors' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Campaign Ambassadors</h3>
                <button className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
              </div>
            </div>
            
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>Ambassador</span>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tasks Completed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>Points Earned</span>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>Status</span>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    {
                      name: 'Sarah Johnson',
                      avatar: 'SJ',
                      color: 'bg-blue-500',
                      tier: 'Gold',
                      tierColor: 'text-yellow-500',
                      tasksCompleted: 24,
                      pointsEarned: 3250,
                      status: 'Active',
                      statusColor: 'bg-green-100 text-green-800'
                    },
                    {
                      name: 'Marcus Chen',
                      avatar: 'MC',
                      color: 'bg-purple-500',
                      tier: 'Silver',
                      tierColor: 'text-gray-400',
                      tasksCompleted: 18,
                      pointsEarned: 2150,
                      status: 'Active',
                      statusColor: 'bg-green-100 text-green-800'
                    },
                    {
                      name: 'Emily Rodriguez',
                      avatar: 'ER',
                      color: 'bg-pink-500',
                      tier: 'Platinum',
                      tierColor: 'text-blue-400',
                      tasksCompleted: 31,
                      pointsEarned: 4580,
                      status: 'Active',
                      statusColor: 'bg-green-100 text-green-800'
                    },
                    {
                      name: 'David Kim',
                      avatar: 'DK',
                      color: 'bg-green-500',
                      tier: 'Bronze',
                      tierColor: 'text-amber-600',
                      tasksCompleted: 12,
                      pointsEarned: 1340,
                      status: 'Active',
                      statusColor: 'bg-green-100 text-green-800'
                    },
                    {
                      name: 'Jessica Williams',
                      avatar: 'JW',
                      color: 'bg-indigo-500',
                      tier: 'Gold',
                      tierColor: 'text-yellow-500',
                      tasksCompleted: 27,
                      pointsEarned: 3680,
                      status: 'Inactive',
                      statusColor: 'bg-gray-100 text-gray-800'
                    },
                    {
                      name: 'Alex Thompson',
                      avatar: 'AT',
                      color: 'bg-red-500',
                      tier: 'Silver',
                      tierColor: 'text-gray-400',
                      tasksCompleted: 15,
                      pointsEarned: 1920,
                      status: 'Active',
                      statusColor: 'bg-green-100 text-green-800'
                    },
                    {
                      name: 'Maria Garcia',
                      avatar: 'MG',
                      color: 'bg-teal-500',
                      tier: 'Bronze',
                      tierColor: 'text-amber-600',
                      tasksCompleted: 9,
                      pointsEarned: 850,
                      status: 'Active',
                      statusColor: 'bg-green-100 text-green-800'
                    },
                    {
                      name: 'James Wilson',
                      avatar: 'JW',
                      color: 'bg-orange-500',
                      tier: 'Platinum',
                      tierColor: 'text-blue-400',
                      tasksCompleted: 35,
                      pointsEarned: 5120,
                      status: 'Active',
                      statusColor: 'bg-green-100 text-green-800'
                    },
                    {
                      name: 'Sophie Martin',
                      avatar: 'SM',
                      color: 'bg-cyan-500',
                      tier: 'Gold',
                      tierColor: 'text-yellow-500',
                      tasksCompleted: 22,
                      pointsEarned: 2980,
                      status: 'Inactive',
                      statusColor: 'bg-gray-100 text-gray-800'
                    },
                    {
                      name: 'Robert Lee',
                      avatar: 'RL',
                      color: 'bg-violet-500',
                      tier: 'Silver',
                      tierColor: 'text-gray-400',
                      tasksCompleted: 16,
                      pointsEarned: 2100,
                      status: 'Active',
                      statusColor: 'bg-green-100 text-green-800'
                    }
                  ].map((ambassador, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 ${ambassador.color} rounded-full flex items-center justify-center text-white text-sm font-medium mr-4`}>
                            {ambassador.avatar}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{ambassador.name}</div>
                            <div className="text-sm text-gray-500">Ambassador</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${ambassador.tierColor}`}>
                          {ambassador.tier}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ambassador.tasksCompleted}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ambassador.pointsEarned.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ambassador.statusColor}`}>
                          {ambassador.status === 'Active' && '✓'} 
                          {ambassador.status === 'Inactive' && '○'} 
                          {ambassador.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="bg-white px-6 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Page 1 of 19
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled>
                    ««
                  </button>
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled>
                    ‹
                  </button>
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                    ›
                  </button>
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                    »»
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskAssignment;