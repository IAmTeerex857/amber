import React, { useState } from 'react';
import { 
  Plus, Clock, MapPin, Upload, Trash2, Calendar, ChevronDown, ChevronUp,
  Target, Briefcase, FileText, Search, Users, ArrowRight, CheckCircle, 
  AlertCircle, Coins, Send, X, Tag, Star, Smile, Frown
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid'; // Use uuid for unique IDs

// Data Interfaces
interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'available' | 'in-progress' | 'submitted' | 'approved' | 'rejected';
  points: number;
  deadline: string;
  peopleWorking?: number;
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'upcoming' | 'completed';
  startDate: string;
  endDate: string;
  progress: number;
  tasks: Task[];
  okrs: OKR[];
}

interface OKR {
  id: string;
  objective: string;
  keyResults: KeyResult[];
}

interface KeyResult {
  id: string;
  description: string;
  target: number;
  current: number;
  unit: string;
}

interface TaskLog {
  id: string;
  activity: string;
  category: string;
  hours: number;
  date: string;
  location: string;
  status: 'approved' | 'pending' | 'rejected';
  proofFiles: ProofFile[];
  socialLinks: string[];
  rating?: number;
  notes: string;
}

interface ProofFile {
  name: string;
  size: number; // Changed to number for better handling
  type: string;
}

const AmbassadorTaskLogging: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'logs'>('tasks');
  const [isNewLogModalOpen, setIsNewLogModalOpen] = useState(false);
  
  // Campaign and task management state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedCampaigns, setExpandedCampaigns] = useState<Set<string>>(new Set());
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  // Initial mock data, but we'll use a copy we can modify
  const initialCampaigns: Campaign[] = [
    {
      id: 'camp-1',
      name: 'Q4 Brand Awareness Drive',
      description: 'Increase brand visibility and engagement across social media platforms',
      status: 'active',
      startDate: '2024-10-01',
      endDate: '2024-12-31',
      progress: 65,
      tasks: [
        {
          id: 'task-1',
          title: 'Create Instagram Story Series',
          description: 'Develop 5-part story series showcasing product features',
          category: 'Content Creation',
          priority: 'high',
          status: 'available',
          points: 150,
          deadline: '2024-12-15',
          peopleWorking: 3
        },
        {
          id: 'task-2',
          title: 'Host Live Twitter Spaces',
          description: 'Organize and host weekly Twitter Spaces about industry trends',
          category: 'Social Media',
          priority: 'medium',
          status: 'in-progress',
          points: 200,
          deadline: '2024-12-20'
        }
      ],
      okrs: [
        {
          id: 'okr-1',
          objective: 'Increase Social Media Engagement',
          keyResults: [
            { id: 'kr-1', description: 'Reach 10K Instagram followers', target: 10000, current: 6500, unit: 'followers' },
            { id: 'kr-2', description: 'Generate 500 Twitter impressions/week', target: 500, current: 320, unit: 'impressions' }
          ]
        }
      ]
    },
    {
      id: 'camp-2',
      name: 'Holiday Campaign 2024',
      description: 'Special holiday-themed content and promotions',
      status: 'upcoming',
      startDate: '2024-12-01',
      endDate: '2024-12-25',
      progress: 25,
      tasks: [
        {
          id: 'task-3',
          title: 'Holiday Video Content',
          description: 'Create festive video content for multiple platforms',
          category: 'Content Creation',
          priority: 'high',
          status: 'available',
          points: 300,
          deadline: '2024-12-10'
        }
      ],
      okrs: [
        {
          id: 'okr-2',
          objective: 'Drive Holiday Sales',
          keyResults: [
            { id: 'kr-3', description: 'Generate 50 referral sales', target: 50, current: 12, unit: 'sales' }
          ]
        }
      ]
    }
  ];

  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [taskLogs, setTaskLogs] = useState<TaskLog[]>([
    {
      id: uuidv4(),
      activity: 'Instagram story creation',
      category: 'Content Creation',
      hours: 3.5,
      date: '2024-11-15',
      location: 'Online',
      status: 'approved',
      proofFiles: [{ name: 'story_proof.png', size: 50000, type: 'image/png' }],
      socialLinks: ['https://instagram.com/p/abcde'],
      rating: 4,
      notes: 'Showcased new product line.'
    },
    {
      id: uuidv4(),
      activity: 'Twitter engagement campaign',
      category: 'Social Media',
      hours: 2.0,
      date: '2024-11-14',
      location: 'Online',
      status: 'pending',
      proofFiles: [{ name: 'twitter_log.pdf', size: 120000, type: 'application/pdf' }],
      socialLinks: ['https://twitter.com/my-post'],
      notes: 'Engaged with community about industry trends.'
    },
    {
      id: uuidv4(),
      activity: 'Event coverage documentation',
      category: 'Events',
      hours: 4.0,
      date: '2024-11-12',
      location: 'Local Event Center',
      status: 'pending',
      proofFiles: [{ name: 'event_photos.zip', size: 1200000, type: 'application/zip' }],
      socialLinks: [],
      notes: 'Documented key speakers and moments.'
    }
  ]);

  const [newLog, setNewLog] = useState<Omit<TaskLog, 'id' | 'status' | 'proofFiles'>>({
    activity: '',
    category: 'Content Creation',
    hours: 0,
    date: new Date().toISOString().split('T')[0],
    location: '',
    socialLinks: [''],
    rating: undefined,
    notes: ''
  });
  const [newLogProofFiles, setNewLogProofFiles] = useState<ProofFile[]>([]);

  // Functions for New Log Modal
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewLog({ ...newLog, [name]: name === 'hours' ? parseFloat(value) : value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }));
      setNewLogProofFiles(files);
    }
  };

  const addSocialLink = () => {
    setNewLog({ ...newLog, socialLinks: [...newLog.socialLinks, ''] });
  };

  const updateSocialLink = (index: number, value: string) => {
    const updated = newLog.socialLinks.map((link, i) => (i === index ? value : link));
    setNewLog({ ...newLog, socialLinks: updated });
  };

  const removeSocialLink = (index: number) => {
    const updated = newLog.socialLinks.filter((_, i) => i !== index);
    setNewLog({ ...newLog, socialLinks: updated });
  };

  const handleLogSubmission = () => {
    if (!newLog.activity || !newLog.hours) {
      // In a real app, use a modal or toast for this.
      console.error('Activity and hours are required.');
      return;
    }
    const submittedLog: TaskLog = {
      ...newLog,
      id: uuidv4(),
      status: 'pending',
      proofFiles: newLogProofFiles
    };
    setTaskLogs(prevLogs => [submittedLog, ...prevLogs]);
    setIsNewLogModalOpen(false);
    // Reset form
    setNewLog({
      activity: '',
      category: 'Content Creation',
      hours: 0,
      date: new Date().toISOString().split('T')[0],
      location: '',
      socialLinks: [''],
      rating: undefined,
      notes: ''
    });
    setNewLogProofFiles([]);
  };

  // Campaign and task management functions
  const toggleCampaign = (campaignId: string) => {
    const newExpanded = new Set(expandedCampaigns);
    if (newExpanded.has(campaignId)) {
      newExpanded.delete(campaignId);
    } else {
      newExpanded.add(campaignId);
    }
    setExpandedCampaigns(newExpanded);
  };

  const handleStartTask = (task: Task) => {
    // In a real application, this would update the task status on a server
    // For this example, we'll just show the user a message in the console
    console.log(`Starting task: ${task.title}. The task status is now 'in-progress'.`);
    const updatedCampaigns = campaigns.map(campaign => ({
      ...campaign,
      tasks: campaign.tasks.map(t => 
        t.id === task.id ? { ...t, status: 'in-progress' as Task['status'] } : t
      )
    }));
    setCampaigns(updatedCampaigns);
    setActiveTask({ ...task, status: 'in-progress' as Task['status'] });
    setShowTaskDetails(false);
    setShowSubmitForm(false);
  };

  const handleViewDetails = (task: Task) => {
    setActiveTask(task);
    setShowTaskDetails(true);
  };

  const handleSubmitProof = (task: Task) => {
    setActiveTask(task);
    setShowSubmitForm(true);
    setShowTaskDetails(false);
  };

  const closeModal = () => {
    setShowTaskDetails(false);
    setShowSubmitForm(false);
    setIsNewLogModalOpen(false);
    setActiveTask(null);
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
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

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <Plus className="h-4 w-4" />;
      case 'in-progress':
        return <Clock className="h-4 w-4" />;
      case 'submitted':
        return <Upload className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getPriorityPill = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCampaignStatusColor = (status: string) => {
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

  // Calculate stats from the dynamic logs
  const approvedLogsCount = taskLogs.filter(log => log.status === 'approved').length;
  const totalLogsCount = taskLogs.length;
  const totalTaskPoints = campaigns.reduce((sum, campaign) => 
    sum + campaign.tasks.reduce((taskSum, task) => taskSum + task.points, 0), 0);
  const logHours = taskLogs.reduce((sum, log) => sum + log.hours, 0);

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-600 text-sm">Manage your tasks, log work, and track submissions.</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setIsNewLogModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm hover:bg-blue-700 transition-colors"
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
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'tasks'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Campaign Tasks
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'logs'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Task Logs
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'tasks' && (
          <div>
            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-wrap gap-4 items-center justify-between mb-6 shadow-sm">
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
                  <option value="Content Creation">Content Creation</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Events">Events</option>
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

                if (campaignTasks.length === 0 && (filterCategory !== 'all' || filterStatus !== 'all' || searchQuery !== '')) return null;

                return (
                  <div key={campaign.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                    {/* Campaign Header */}
                    <div 
                      className="p-6 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleCampaign(campaign.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <Briefcase className="h-5 w-5 text-gray-600" />
                            <h2 className="text-xl font-semibold text-gray-900">{campaign.name}</h2>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCampaignStatusColor(campaign.status)}`}>
                              {campaign.status}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">{campaign.description}</p>
                          
                          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
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
                                    <div key={kr.id} className="flex flex-wrap items-center justify-between">
                                      <span className="text-sm text-gray-600">{kr.description}</span>
                                      <div className="flex items-center gap-2">
                                        <div className="w-20 bg-gray-200 rounded-full h-2">
                                          <div 
                                            className="bg-green-600 h-2 rounded-full" 
                                            style={{ width: `${Math.min(100, (kr.current / kr.target) * 100)}%` }}
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
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3">
                                  <div className="flex-1 min-w-0 mb-3 sm:mb-0">
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                      <h4 className="font-semibold text-gray-900">{task.title}</h4>
                                      <span className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                                        {getTaskStatusIcon(task.status)}
                                        <span className="ml-1 capitalize">{task.status.replace('-', ' ')}</span>
                                      </span>
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityPill(task.priority)}`}>
                                        {task.priority} priority
                                      </span>
                                    </div>
                                    <p className="text-gray-600 mb-3 truncate">{task.description}</p>
                                    
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
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
                                      {task.peopleWorking && task.peopleWorking > 0 && (
                                        <div className="flex items-center gap-1">
                                          <Users className="h-4 w-4" />
                                          <span>{task.peopleWorking} working</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                    {task.status === 'available' && (
                                      <button 
                                        onClick={() => handleStartTask(task)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
                                      >
                                        Start Task
                                        <ArrowRight className="h-4 w-4" />
                                      </button>
                                    )}
                                    
                                    {task.status === 'in-progress' && (
                                      <div className="flex flex-col sm:flex-row gap-2">
                                        <button 
                                          onClick={() => handleSubmitProof(task)}
                                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                          Submit
                                        </button>
                                        <button 
                                          onClick={() => handleViewDetails(task)}
                                          className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                          Continue
                                        </button>
                                      </div>
                                    )}
                                    
                                    {task.status === 'submitted' && (
                                      <button 
                                        onClick={() => handleViewDetails(task)}
                                        className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
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

        {activeTab === 'logs' && (
          <div>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Logs</p>
                    <p className="text-2xl font-bold text-gray-900">{totalLogsCount}</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Approved Logs</p>
                    <p className="text-2xl font-bold text-gray-900">{approvedLogsCount}</p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Points</p>
                    <p className="text-2xl font-bold text-gray-900">{totalTaskPoints}</p>
                  </div>
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Coins className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Hours Logged</p>
                    <p className="text-2xl font-bold text-gray-900">{logHours.toFixed(1)}</p>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Task Logs Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Task Logs</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {taskLogs.length > 0 ? taskLogs.map(log => (
                      <tr key={log.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.activity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{log.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{log.hours.toFixed(1)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(log.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            log.status === 'approved' ? 'bg-green-100 text-green-800' :
                            log.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {log.rating ? (
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-4 w-4 ${i < log.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                              ))}
                            </div>
                          ) : (
                            <span>-</span>
                          )}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No logs found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Task Details Modal */}
      {showTaskDetails && activeTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto transform scale-100 transition-transform duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Task Details</h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{activeTask.title}</h4>
                  <p className="text-gray-600">{activeTask.description}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Category:</span>
                    <p className="text-gray-900">{activeTask.category}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Priority:</span>
                    <p className="text-gray-900 capitalize">{activeTask.priority}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Points:</span>
                    <p className="text-gray-900">{activeTask.points}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Deadline:</span>
                    <p className="text-gray-900">{new Date(activeTask.deadline).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                {activeTask.status === 'available' && (
                  <button
                    onClick={() => handleStartTask(activeTask)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start Task
                  </button>
                )}
                {activeTask.status === 'in-progress' && (
                  <button
                    onClick={() => handleSubmitProof(activeTask)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Submit Proof
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Log Modal */}
      {isNewLogModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto transform scale-100 transition-transform duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">New Task Log</h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); handleLogSubmission(); }} className="space-y-4">
                <div>
                  <label htmlFor="activity" className="block text-sm font-medium text-gray-700">Activity Title</label>
                  <input
                    type="text"
                    id="activity"
                    name="activity"
                    value={newLog.activity}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="E.g., Instagram Story Creation"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={newLog.category}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option>Content Creation</option>
                    <option>Social Media</option>
                    <option>Events</option>
                    <option>Community Engagement</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="hours" className="block text-sm font-medium text-gray-700">Hours Logged</label>
                    <input
                      type="number"
                      id="hours"
                      name="hours"
                      value={newLog.hours}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      min="0"
                      step="0.5"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={newLog.date}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={newLog.location}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="E.g., Online, New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Social Media Links</label>
                  {newLog.socialLinks.map((link, index) => (
                    <div key={index} className="flex items-center gap-2 mt-1">
                      <input
                        type="url"
                        value={link}
                        onChange={(e) => updateSocialLink(index, e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Paste link here"
                      />
                      <button
                        type="button"
                        onClick={() => removeSocialLink(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSocialLink}
                    className="mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition-colors"
                  >
                    Add Link
                  </button>
                </div>
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={newLog.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Add any additional details about your work..."
                  />
                </div>
                <div>
                  <label htmlFor="proofFiles" className="block text-sm font-medium text-gray-700">Proof Files</label>
                  <input
                    type="file"
                    id="proofFiles"
                    name="proofFiles"
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    multiple
                  />
                  <div className="mt-2 text-sm text-gray-600">
                    {newLogProofFiles.length > 0 ? (
                      <p>{newLogProofFiles.length} file(s) selected.</p>
                    ) : (
                      <p>No files chosen.</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Submit Log
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

export default AmbassadorTaskLogging;
