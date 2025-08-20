import React, { useState } from 'react';
import {
  Plus, Clock, CheckCircle, Upload, FileText, Calendar, Tag, MapPin,
  Send, Star, AlertCircle, Edit, Trash2, X, Search, ArrowRight, Users,
  ChevronDown, ChevronUp, Target, Coins, Briefcase
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  points: number;
  deadline: string;
  status: 'available' | 'in-progress' | 'submitted' | 'approved' | 'rejected';
  category: string;
  priority: 'low' | 'medium' | 'high';
  icon?: string;
  peopleWorking?: number;
  assignees?: string[];
  timeSpent?: number;
  completedDate?: string;
  location?: string;
  proofFiles?: ProofFile[];
  socialLinks?: string[];
  notes?: string;
}

interface ProofFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  url: string;
  size: number;
}

interface KeyResult {
  id: string;
  description: string;
  target: number;
  current: number;
  unit: string;
}

interface OKR {
  id: string;
  objective: string;
  keyResults: KeyResult[];
}

interface TaskLog {
  id: string;
  title: string;
  description: string;
  category: 'content' | 'event' | 'social' | 'research' | 'community' | 'other';
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  timeSpent: number;
  completedDate: string;
  location?: string;
  proofFiles: ProofFile[];
  socialLinks: string[];
  notes: string;
  submittedDate?: string;
  reviewNotes?: string;
  points?: number;
}

interface Category {
  value: string;
  label: string;
  icon: any;
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'completed';
  okrs: OKR[];
  tasks: Task[];
  progress: number;
}

const MyTasks: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'logs' | 'new'>('tasks');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [isNewLogModalOpen, setIsNewLogModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCampaigns, setExpandedCampaigns] = useState<Set<string>>(new Set());
  
  const [newLog, setNewLog] = useState({
    title: '',
    description: '',
    category: 'content',
    timeSpent: '',
    completedDate: new Date().toISOString().split('T')[0],
    location: '',
    notes: '',
    socialLinks: [''],
    proofFiles: [] as ProofFile[]
  });

  // Mock data: task logs from TaskLogging functionality  
  const taskLogs: TaskLog[] = [
    {
      id: 'log-1',
      title: 'Instagram Story Series - Product Launch',
      description: 'Created 5-part Instagram story series highlighting key features of the new product launch.',
      category: 'social',
      status: 'approved',
      timeSpent: 120,
      completedDate: '2024-01-22',
      location: 'New York, NY',
      proofFiles: [
        { id: 'f1', name: 'story-1.jpg', type: 'image' as const, url: '#', size: 2048 },
        { id: 'f2', name: 'story-2.jpg', type: 'image' as const, url: '#', size: 1856 }
      ],
      socialLinks: ['https://instagram.com/story/123', 'https://instagram.com/story/124'],
      notes: 'Great engagement rates - 15% higher than usual',
      points: 50
    }
  ];

  const categories: Category[] = [
    { value: 'content', label: 'Content Creation', icon: FileText },
    { value: 'social', label: 'Social Media', icon: Star },
    { value: 'event', label: 'Events & Meetups', icon: Calendar },
    { value: 'research', label: 'Market Research', icon: AlertCircle },
    { value: 'community', label: 'Community Building', icon: MapPin },
    { value: 'other', label: 'Other Activities', icon: Plus }
  ];

  // Mock data: Campaigns with their tasks and OKRs
  const campaigns: Campaign[] = [
    {
      id: '1',
      name: 'Summer Product Launch 2023',
      description: 'Launch our new summer product line with comprehensive social media and content marketing strategy',
      startDate: '2023-07-01',
      endDate: '2023-08-31',
      status: 'active',
      progress: 65,
      okrs: [
        {
          id: '1',
          objective: 'Increase brand awareness and reach',
          keyResults: [
            { id: '1', description: 'Generate 50,000 impressions across social platforms', target: 50000, current: 32500, unit: 'impressions' },
            { id: '2', description: 'Achieve 1,000 new followers', target: 1000, current: 650, unit: 'followers' }
          ]
        },
        {
          id: '2',
          objective: 'Drive product engagement and sales',
          keyResults: [
            { id: '3', description: 'Generate 25 product reviews', target: 25, current: 15, unit: 'reviews' },
            { id: '4', description: 'Create 50 pieces of user-generated content', target: 50, current: 28, unit: 'content pieces' }
          ]
        }
      ],
      tasks: [
        {
          id: '1',
          title: 'Create TikTok Unboxing Video',
          description: 'Film a 15-30 second unboxing video featuring our new product line',
          points: 500,
          deadline: '2023-08-05',
          status: 'available',
          category: 'Content Creation',
          priority: 'high',
          peopleWorking: 0,
          assignees: [],
        },
        {
          id: '2',
          title: 'Share Instagram Story',
          description: 'Post an Instagram story showing how you use our product daily',
          points: 200,
          deadline: '2023-08-03',
          status: 'in-progress',
          category: 'Social Media',
          priority: 'medium',
          peopleWorking: 2,
          assignees: ['Alex', 'Jamie'],
        },
        {
          id: '3',
          title: 'Write Product Review',
          description: 'Write a detailed review on your blog or LinkedIn',
          points: 750,
          deadline: '2023-08-07',
          status: 'submitted',
          category: 'Content Creation',
          priority: 'high',
          peopleWorking: 1,
          assignees: ['Taylor'],
        }
      ]
    },
    {
      id: '2',
      name: 'Back-to-School Campaign',
      description: 'Target students and parents with educational content and promotions',
      startDate: '2023-08-01',
      endDate: '2023-09-15',
      status: 'active',
      progress: 30,
      okrs: [
        {
          id: '3',
          objective: 'Reach student demographic effectively',
          keyResults: [
            { id: '5', description: 'Create 20 educational content pieces', target: 20, current: 6, unit: 'content pieces' },
            { id: '6', description: 'Engage with 100 student communities', target: 100, current: 25, unit: 'communities' }
          ]
        }
      ],
      tasks: [
        {
          id: '4',
          title: 'Email Newsletter Content',
          description: 'Create engaging newsletter content featuring back-to-school tips',
          points: 350,
          deadline: '2023-08-10',
          status: 'available',
          category: 'Content Creation',
          priority: 'medium',
          peopleWorking: 0,
          assignees: [],
        },
        {
          id: '5',
          title: 'Social Media Management',
          description: 'Manage our Twitter account for 1 week with daily posts targeting students',
          points: 600,
          deadline: '2023-08-12',
          status: 'available',
          category: 'Social Media',
          priority: 'low',
          peopleWorking: 3,
          assignees: ['Sam', 'Jordan', 'Casey'],
        }
      ]
    }
  ];

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'available':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-amber-100 text-amber-800';
      case 'submitted':
        return 'bg-purple-100 text-purple-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'available':
        return <Clock className="h-4 w-4" />;
      case 'in-progress':
        return <Clock className="h-4 w-4" />;
      case 'submitted':
        return <CheckCircle className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityPill = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartTask = (task: Task) => {
    // In a real app, this would make an API call to update the task status
    console.log(`Starting task: ${task.id}`);
    alert(`Starting task: ${task.title}`);
    // For demo purposes, we'll just show a message
    // In a real app, we would update the state with the API response from backend
    // const updatedTasks = tasks.map(t => 
    //   t.id === task.id ? { ...t, status: 'in-progress' as const } : t
    // );
  };
  
  const handleViewDetails = (task: Task) => {
    setActiveTask(task);
    setShowTaskDetails(true);
  };
  
  const handleSubmitProof = (task: Task) => {
    setActiveTask(task);
    setShowSubmitForm(true);
  };
  
  const handleSubmitFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would make an API call to submit the proof
    console.log(`Submitting proof for task: ${activeTask?.id}`);
    alert(`Proof submitted for: ${activeTask?.title}`);
    setShowSubmitForm(false);
  };

  const closeModal = () => {
    setActiveTask(null);
    setShowTaskDetails(false);
    setShowSubmitForm(false);
  };

  const toggleCampaign = (campaignId: string) => {
    const newExpanded = new Set(expandedCampaigns);
    if (newExpanded.has(campaignId)) {
      newExpanded.delete(campaignId);
    } else {
      newExpanded.add(campaignId);
    }
    setExpandedCampaigns(newExpanded);
  };

  const getCampaignStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper functions for task logging
  const getLogStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const addSocialLink = () => {
    setNewLog({ ...newLog, socialLinks: [...newLog.socialLinks, ''] });
  };

  const removeSocialLink = (index: number) => {
    const newLinks = newLog.socialLinks.filter((_, i) => i !== index);
    setNewLog({ ...newLog, socialLinks: newLinks });
  };

  const updateSocialLink = (index: number, value: string) => {
    const newLinks = [...newLog.socialLinks];
    newLinks[index] = value;
    setNewLog({ ...newLog, socialLinks: newLinks });
  };

  const handleSubmitLog = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting task log:', newLog);
    setIsNewLogModalOpen(false);
    // Reset form
    setNewLog({
      title: '',
      description: '',
      category: 'content',
      timeSpent: '',
      completedDate: new Date().toISOString().split('T')[0],
      location: '',
      notes: '',
      socialLinks: [''],
      proofFiles: []
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-600 text-sm">Manage your tasks, log work, and track submissions.</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setIsNewLogModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md text-sm font-medium flex items-center gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            New Task Log
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tasks'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Campaign Tasks
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'logs'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Task Logs
          </button>
        </nav>
      </div>

      {activeTab === 'tasks' && (
        <div>
          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-wrap gap-4 items-center justify-between mb-6">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tasks..."
                className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Options */}
            <div className="flex flex-wrap gap-3">
              <select
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="content">Content</option>
                <option value="social">Social Media</option>
                <option value="event">Events</option>
                <option value="research">Research</option>
              </select>

              <select
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="in-progress">In Progress</option>
                <option value="submitted">Submitted</option>
                <option value="approved">Approved</option>
              </select>
            </div>
          </div>

          {/* Campaign Cards */}
          <div className="space-y-6">
        {campaigns.map((campaign) => {
          const isExpanded = expandedCampaigns.has(campaign.id);
          const campaignTasks = campaign.tasks.filter((task) => {
            const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
            const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
            const matchesSearch = searchQuery === '' || 
              task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesStatus && matchesSearch;
          });

          if (campaignTasks.length === 0) return null;

          return (
            <div key={campaign.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Campaign Header */}
              <div 
                className="p-6 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleCampaign(campaign.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Briefcase className="h-5 w-5 text-gray-600" />
                      <h2 className="text-xl font-semibold text-gray-900">{campaign.name}</h2>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCampaignStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{campaign.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        <span>{campaignTasks.length} tasks available</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${campaign.progress}%` }}
                          />
                        </div>
                        <span>{campaign.progress}% complete</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </div>
              </div>

              {/* Expanded Campaign Content */}
              {isExpanded && (
                <div className="p-6 space-y-6">
                  {/* Campaign OKRs */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Campaign Goals & OKRs
                    </h3>
                    <div className="space-y-4">
                      {campaign.okrs.map((okr) => (
                        <div key={okr.id} className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3">{okr.objective}</h4>
                          <div className="space-y-2">
                            {okr.keyResults.map((kr) => (
                              <div key={kr.id} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">{kr.description}</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-20 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-green-600 h-2 rounded-full" 
                                      style={{ width: `${(kr.current / kr.target) * 100}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium text-gray-900">
                                    {kr.current.toLocaleString()}/{kr.target.toLocaleString()} {kr.unit}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Campaign Tasks */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Available Tasks
                    </h3>
                    <div className="space-y-4">
                      {campaignTasks.map((task) => (
                        <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold text-gray-900">{task.title}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                  {getStatusIcon(task.status)}
                                  <span className="ml-1 capitalize">{task.status.replace('-', ' ')}</span>
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityPill(task.priority)}`}>
                                  {task.priority} priority
                                </span>
                              </div>
                              <p className="text-gray-600 mb-3">{task.description}</p>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Coins className="h-4 w-4" />
                                  <span>{task.points} points</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>Due {new Date(task.deadline).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Tag className="h-4 w-4" />
                                  <span>{task.category}</span>
                                </div>
                                {task.peopleWorking! > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    <span>{task.peopleWorking} working</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex gap-2 ml-4">
                              {task.status === 'available' && (
                                <button 
                                  onClick={() => handleStartTask(task)}
                                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                >
                                  Start Task
                                  <ArrowRight className="h-4 w-4" />
                                </button>
                              )}
                              
                              {task.status === 'in-progress' && (
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => handleSubmitProof(task)}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                                  >
                                    Submit
                                  </button>
                                  <button 
                                    onClick={() => handleViewDetails(task)}
                                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                                  >
                                    Continue
                                  </button>
                                </div>
                              )}
                              
                              {task.status === 'submitted' && (
                                <button 
                                  onClick={() => handleViewDetails(task)}
                                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                                >
                                  View Details
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
          </div>
        </div>
      )}

      {/* Task Logs Tab */}
      {activeTab === 'logs' && (
        <div className="space-y-6">
          <div className="grid gap-4">
            {taskLogs.map((log) => (
              <div key={log.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{log.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLogStatusColor(log.status)}`}>
                        {log.status === 'approved' && <CheckCircle className="h-3 w-3 inline mr-1" />}
                        {log.status === 'submitted' && <Clock className="h-3 w-3 inline mr-1" />}
                        {log.status === 'rejected' && <AlertCircle className="h-3 w-3 inline mr-1" />}
                        {log.status === 'draft' && <Edit className="h-3 w-3 inline mr-1" />}
                        {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                      </span>
                      {log.points && (
                        <div className="flex items-center gap-1 text-sm text-blue-600">
                          <Coins className="h-4 w-4" />
                          <span>{log.points} points</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{log.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{Math.floor(log.timeSpent / 60)}h {log.timeSpent % 60}m</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(log.completedDate).toLocaleDateString()}</span>
                      </div>
                      {log.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{log.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        <span className="capitalize">{log.category}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {log.notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{log.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      {showTaskDetails && activeTask !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">{activeTask?.title}</h3>
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  &times;
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activeTask.status)}`}>
                    {getStatusIcon(activeTask.status)}
                    <span>{activeTask.status.charAt(0).toUpperCase() + activeTask.status.slice(1).replace('-', ' ')}</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityPill(activeTask.priority)}`}>
                    {activeTask.priority} priority
                  </span>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                  <p className="text-gray-800">{activeTask.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Points</h4>
                    <p className="text-gray-800 font-medium">{activeTask.points} points</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Due Date</h4>
                    <p className="text-gray-800">{new Date(activeTask.deadline).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Category</h4>
                    <p className="text-gray-800">{activeTask.category}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Requirements</h4>
                  <ul className="list-disc pl-5 text-gray-800">
                    <li>Follow brand guidelines for content creation</li>
                    <li>Include product name and key features</li>
                    <li>Tag the brand's official account in your post</li>
                    <li>Use approved hashtags in your caption</li>
                  </ul>
                </div>
                
                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                  
                  {activeTask.status === 'available' && (
                    <button 
                      onClick={() => {
                        handleStartTask(activeTask);
                        closeModal();
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Start Task
                    </button>
                  )}
                  
                  {activeTask.status === 'in-progress' && (
                    <button 
                      onClick={() => {
                        closeModal();
                        handleSubmitProof(activeTask);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Submit Proof
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Submit Proof Modal */}
      {showSubmitForm && activeTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Submit Proof: {activeTask?.title}</h3>
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  &times;
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmitFormSubmit}>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Screenshot or Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="space-y-2">
                      <div className="flex justify-center">
                        <svg className="h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="social-link" className="block text-sm font-medium text-gray-700 mb-1">Social Media Link (Optional)</label>
                  <input
                    type="text"
                    id="social-link"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="https://instagram.com/your-post"
                  />
                </div>
                
                <div>
                  <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-1">Caption/Description</label>
                  <textarea
                    id="caption"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Describe what you did for this task..."
                  ></textarea>
                </div>
                
                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Submit Proof
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Task Logs Tab */}
      {activeTab === 'logs' && (
        <div className="space-y-6">
          <div className="grid gap-4">
            {taskLogs.map((log) => (
              <div key={log.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{log.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLogStatusColor(log.status)}`}>
                        {log.status === 'approved' && <CheckCircle className="h-3 w-3 inline mr-1" />}
                        {log.status === 'submitted' && <Clock className="h-3 w-3 inline mr-1" />}
                        {log.status === 'rejected' && <AlertCircle className="h-3 w-3 inline mr-1" />}
                        {log.status === 'draft' && <Edit className="h-3 w-3 inline mr-1" />}
                        {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                      </span>
                      {log.points && (
                        <div className="flex items-center gap-1 text-sm text-blue-600">
                          <Coins className="h-4 w-4" />
                          <span>{log.points} points</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{log.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{Math.floor(log.timeSpent / 60)}h {log.timeSpent % 60}m</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(log.completedDate).toLocaleDateString()}</span>
                      </div>
                      {log.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{log.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        <span className="capitalize">{log.category}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {log.notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{log.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Task Log Modal */}
      {isNewLogModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Log New Task</h2>
                <button
                  onClick={() => setIsNewLogModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitLog} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newLog.title}
                    onChange={(e) => setNewLog({ ...newLog, title: e.target.value })}
                    placeholder="Enter task title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    value={newLog.description}
                    onChange={(e) => setNewLog({ ...newLog, description: e.target.value })}
                    placeholder="Describe what you accomplished..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={newLog.category}
                      onChange={(e) => setNewLog({ ...newLog, category: e.target.value })}
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time Spent (minutes)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={newLog.timeSpent}
                      onChange={(e) => setNewLog({ ...newLog, timeSpent: e.target.value })}
                      placeholder="60"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Completion Date</label>
                    <input
                      type="date"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={newLog.completedDate}
                      onChange={(e) => setNewLog({ ...newLog, completedDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location (Optional)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={newLog.location}
                      onChange={(e) => setNewLog({ ...newLog, location: e.target.value })}
                      placeholder="City, State"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Social Media Links</label>
                  <div className="space-y-2">
                    {newLog.socialLinks.map((link, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="url"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={link}
                          onChange={(e) => updateSocialLink(index, e.target.value)}
                          placeholder="https://..."
                        />
                        <button
                          type="button"
                          onClick={() => removeSocialLink(index)}
                          className="px-3 py-2 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addSocialLink}
                      className="px-3 py-1 text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Link</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Proof of Work</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Upload screenshots, videos, or documents</p>
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      Choose Files
                    </button>
                    <p className="text-xs text-gray-500 mt-2">Max 10MB per file. JPG, PNG, PDF, MP4 accepted</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    value={newLog.notes}
                    onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
                    placeholder="Any additional context or results..."
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsNewLogModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Submit Task Log</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTasks;
