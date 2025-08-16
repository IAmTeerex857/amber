import React, { useState, useEffect } from 'react';
import { 
  Layers, FolderOpen, Plus, Pencil, 
  AlertCircle, Users, CheckCircle, X
} from 'lucide-react';
import CampaignCreation from './CampaignCreation';
import TaskAssignment, { Campaign, Ambassador } from './TaskAssignment';
import CampaignStatus, { CampaignStatusType } from './common/CampaignStatus';

// Using Campaign and Ambassador interfaces imported from TaskAssignment.tsx

const STORAGE_KEY = 'amber_campaigns';

// Sample ambassador data
const sampleAmbassadors: Ambassador[] = [
  {
    id: 'amb-1',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    type: 'student',
    location: 'New York, USA',
    tier: 'Gold',
    points: 2450,
    completedTasks: 28,
    successRate: 92,
    socialMedia: [
      { platform: 'Instagram', followers: 5600 },
      { platform: 'TikTok', followers: 8900 }
    ],
    status: 'regular',
    avatar: 'https://i.pravatar.cc/150?img=1',
    joinedDate: '2024-04-15',
    lastActive: '2025-08-10',
    role: 'Ambassador'
  },
  {
    id: 'amb-2',
    name: 'Michael Chen',
    email: 'michael.c@example.com',
    type: 'influencer',
    location: 'Los Angeles, USA',
    tier: 'Platinum',
    points: 4200,
    completedTasks: 45,
    successRate: 98,
    socialMedia: [
      { platform: 'Instagram', followers: 25000 },
      { platform: 'YouTube', followers: 42000 }
    ],
    status: 'regular',
    avatar: 'https://i.pravatar.cc/150?img=2',
    joinedDate: '2024-02-10',
    lastActive: '2025-08-11',
    role: 'Ambassador'
  },
  {
    id: 'amb-3',
    name: 'Emma Wilson',
    email: 'emma.w@example.com',
    type: 'student',
    location: 'Chicago, USA',
    tier: 'Silver',
    points: 1850,
    completedTasks: 19,
    successRate: 85,
    socialMedia: [
      { platform: 'Instagram', followers: 3200 },
      { platform: 'TikTok', followers: 5100 }
    ],
    status: 'regular',
    avatar: 'https://i.pravatar.cc/150?img=3',
    joinedDate: '2024-05-22',
    lastActive: '2025-08-09',
    role: 'Ambassador'
  },
  {
    id: 'amb-4',
    name: 'David Rodriguez',
    email: 'david.r@example.com',
    type: 'business',
    location: 'Miami, USA',
    tier: 'Gold',
    points: 2780,
    completedTasks: 31,
    successRate: 94,
    socialMedia: [
      { platform: 'LinkedIn', followers: 8500 },
      { platform: 'Twitter', followers: 12300 }
    ],
    status: 'regular',
    avatar: 'https://i.pravatar.cc/150?img=4',
    joinedDate: '2024-03-14',
    lastActive: '2025-08-12',
    role: 'Ambassador'
  },
  {
    id: 'amb-5',
    name: 'Olivia Kim',
    email: 'olivia.k@example.com',
    type: 'influencer',
    location: 'Seattle, USA',
    tier: 'Platinum',
    points: 3900,
    completedTasks: 42,
    successRate: 97,
    socialMedia: [
      { platform: 'Instagram', followers: 18900 },
      { platform: 'TikTok', followers: 32000 }
    ],
    status: 'regular',
    avatar: 'https://i.pravatar.cc/150?img=5',
    joinedDate: '2024-01-30',
    lastActive: '2025-08-11',
    role: 'Ambassador'
  }
];

// Sample campaign data with tasks and OKRs
const defaultCampaigns: Campaign[] = [
  {
    id: 'campaign-1',
    name: 'Summer Product Launch',
    description: 'Promote our new summer collection across social media platforms with engaging content.',
    startDate: '2025-06-01',
    endDate: '2025-09-01',
    status: 'active',
    budget: 15000,
    okrs: [
      {
        id: 'okr-1',
        objective: 'Increase brand awareness for summer collection',
        keyResults: [
          {
            id: 'kr-1-1',
            description: 'Reach new audience members',
            targetValue: 100000,
            currentValue: 45000,
            unit: 'people'
          },
          {
            id: 'kr-1-2',
            description: 'Increase engagement rate',
            targetValue: 15,
            currentValue: 8,
            unit: '%'
          },
          {
            id: 'kr-1-3',
            description: 'Generate content pieces',
            targetValue: 50,
            currentValue: 22,
            unit: 'posts'
          }
        ]
      },
      {
        id: 'okr-2',
        objective: 'Drive sales for featured products',
        keyResults: [
          {
            id: 'kr-2-1',
            description: 'Increase conversion rate',
            targetValue: 5,
            currentValue: 2.8,
            unit: '%'
          },
          {
            id: 'kr-2-2',
            description: 'Generate referral clicks',
            targetValue: 25000,
            currentValue: 12400,
            unit: 'clicks'
          }
        ]
      }
    ],
    tasks: [
      {
        id: 'task-1',
        title: 'Instagram Product Feature',
        description: 'Create an Instagram post featuring our new summer collection items. Show the products in use in an outdoor setting.',
        type: 'social_post',
        platform: 'Instagram',
        points: 150,
        priority: 'high',
        deadline: '2025-08-20',
        assignedSegments: ['students', 'influencers'],
        proofType: 'media',
        okrId: 'okr-1',
        status: 'in_progress',
        assignedCount: 12,
        completedCount: 5,
        approvedCount: 4,
        tags: ['summer', 'product', 'instagram']
      },
      {
        id: 'task-2',
        title: 'TikTok Summer Challenge',
        description: 'Create a TikTok video participating in our summer challenge using our products. Include the campaign hashtag.',
        type: 'video_content',
        platform: 'TikTok',
        points: 200,
        priority: 'medium',
        deadline: '2025-08-25',
        assignedSegments: ['students', 'influencers'],
        proofType: 'url',
        okrId: 'okr-1',
        status: 'to_do',
        assignedCount: 15,
        completedCount: 0,
        approvedCount: 0,
        tags: ['summer', 'challenge', 'tiktok']
      },
      {
        id: 'task-3',
        title: 'Product Review Blog',
        description: 'Write a detailed review of our summer collection on your blog or Medium account. Include high-quality images.',
        type: 'blog_post',
        platform: 'Blog',
        points: 250,
        priority: 'medium',
        deadline: '2025-08-30',
        assignedSegments: ['influencers', 'business'],
        proofType: 'url',
        okrId: 'okr-2',
        status: 'to_do',
        assignedCount: 8,
        completedCount: 0,
        approvedCount: 0,
        tags: ['review', 'blog', 'summer']
      },
      {
        id: 'task-4',
        title: 'Referral Program Promotion',
        description: 'Share your unique referral link with your audience and encourage them to check out our summer collection.',
        type: 'referral',
        platform: 'Multiple',
        points: 100,
        priority: 'low',
        deadline: '2025-08-28',
        assignedSegments: ['students', 'influencers', 'business'],
        proofType: 'url',
        okrId: 'okr-2',
        status: 'in_progress',
        assignedCount: 20,
        completedCount: 7,
        approvedCount: 6,
        tags: ['referral', 'promotion']
      },
      {
        id: 'task-5',
        title: 'Summer Collection Unboxing',
        description: 'Create an unboxing video showcasing the summer collection items you received. Highlight key features.',
        type: 'video_content',
        platform: 'YouTube',
        points: 180,
        priority: 'high',
        deadline: '2025-08-15',
        assignedSegments: ['influencers'],
        proofType: 'url',
        okrId: 'okr-1',
        status: 'done',
        assignedCount: 5,
        completedCount: 5,
        approvedCount: 5,
        tags: ['unboxing', 'youtube', 'summer']
      }
    ],
    assignedSegments: ['students', 'influencers', 'business'],
    recurrence: false,
    ambassadors: sampleAmbassadors
  },
  {
    id: 'campaign-2',
    name: 'Back to School Campaign',
    description: 'Promote our educational products and student discounts for the upcoming school year.',
    startDate: '2025-08-15',
    endDate: '2025-09-30',
    status: 'upcoming',
    budget: 12000,
    okrs: [
      {
        id: 'okr-3',
        objective: 'Increase student engagement with our brand',
        keyResults: [
          {
            id: 'kr-3-1',
            description: 'Grow student ambassador sign-ups',
            targetValue: 500,
            currentValue: 0,
            unit: 'ambassadors'
          },
          {
            id: 'kr-3-2',
            description: 'Increase student discount usage',
            targetValue: 2000,
            currentValue: 0,
            unit: 'redemptions'
          }
        ]
      }
    ],
    tasks: [
      {
        id: 'task-6',
        title: 'Campus Rep Program',
        description: 'Promote our Campus Rep Program at your school. Share information about benefits and how to join.',
        type: 'social_post',
        platform: 'Multiple',
        points: 120,
        priority: 'high',
        deadline: '2025-09-10',
        assignedSegments: ['students'],
        proofType: 'media',
        okrId: 'okr-3',
        status: 'to_do',
        assignedCount: 0,
        completedCount: 0,
        approvedCount: 0,
        tags: ['campus', 'student', 'recruitment']
      },
      {
        id: 'task-7',
        title: 'Student Discount Promotion',
        description: 'Create content highlighting our exclusive student discounts and how to redeem them.',
        type: 'social_post',
        platform: 'Instagram',
        points: 100,
        priority: 'medium',
        deadline: '2025-09-15',
        assignedSegments: ['students', 'influencers'],
        proofType: 'url',
        okrId: 'okr-3',
        status: 'to_do',
        assignedCount: 0,
        completedCount: 0,
        approvedCount: 0,
        tags: ['discount', 'student', 'promotion']
      }
    ],
    assignedSegments: ['students', 'influencers'],
    recurrence: false,
    ambassadors: sampleAmbassadors.slice(0, 3)
  },
  {
    id: 'campaign-3',
    name: 'Monthly Brand Awareness',
    description: 'Ongoing campaign to maintain brand visibility and engagement across social platforms.',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    status: 'active',
    budget: 24000,
    okrs: [
      {
        id: 'okr-4',
        objective: 'Maintain consistent brand presence',
        keyResults: [
          {
            id: 'kr-4-1',
            description: 'Monthly content pieces',
            targetValue: 120,
            currentValue: 85,
            unit: 'posts'
          },
          {
            id: 'kr-4-2',
            description: 'Engagement rate',
            targetValue: 10,
            currentValue: 7.5,
            unit: '%'
          }
        ]
      }
    ],
    tasks: [
      {
        id: 'task-8',
        title: 'Monthly Brand Feature',
        description: 'Create one post per month featuring our brand in your everyday life. Be authentic and creative.',
        type: 'social_post',
        platform: 'Any',
        points: 100,
        priority: 'medium',
        deadline: '2025-08-31',
        assignedSegments: ['students', 'influencers', 'business'],
        proofType: 'media',
        okrId: 'okr-4',
        status: 'in_progress',
        assignedCount: 25,
        completedCount: 18,
        approvedCount: 18,
        tags: ['monthly', 'brand', 'lifestyle']
      }
    ],
    assignedSegments: ['students', 'influencers', 'business'],
    recurrence: true,
    ambassadors: sampleAmbassadors
  }
];

// Main CampaignsPage component
const CampaignsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(defaultCampaigns);
  const [activeTab, setActiveTab] = useState<string>('active');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [initialCampaign, setInitialCampaign] = useState<Campaign | undefined>();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create');
  const [showAssign, setShowAssign] = useState<boolean>(false);

  // Load from storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Campaign[];
        setCampaigns(parsed);
      } else {
        setCampaigns(defaultCampaigns);
      }
    } catch (e) {
      console.warn('Failed to load campaigns from storage', e);
      setCampaigns(defaultCampaigns);
    }
  }, []);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
    } catch (e) {
      console.warn('Failed to save campaigns to storage', e);
    }
  }, [campaigns]);

  // Helper Functions
  const getCampaignStatus = (campaign: Campaign): CampaignStatusType => {
    const now = new Date();
    const startDate = new Date(campaign.startDate);
    const endDate = new Date(campaign.endDate);
    
    if (now < startDate) return 'upcoming';
    if (now > endDate) return 'ended';
    if (campaign.recurrence) return 'recurring';
    return 'active';
  };

  // Campaign Action Handlers
  const handleCreate = () => {
    setEditorMode('create');
    setInitialCampaign(undefined);
    setShowEditor(true);
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditorMode('edit');
    setInitialCampaign(campaigns[index]);
    setShowEditor(true);
  };

  const handleAssign = (index: number) => {
    setSelectedCampaign(campaigns[index]);
    setShowAssign(true);
  };

  // Save handler for CampaignCreation component
  const handleSave = (data: Campaign) => {
    // Ensure the campaign data has all the required fields for TaskAssignment
    const completeData: Campaign = {
      ...data,
      // Add required fields if missing
      id: data.id || `campaign-${Date.now()}`,
      status: data.status || 'active',
      budget: data.budget || 5000,
      // Ensure ambassadors array exists
      ambassadors: data.ambassadors || [],
      // Ensure tasks have the correct structure
      tasks: (data.tasks || []).map(task => ({
        ...task,
        id: task.id || `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        status: task.status || 'to_do'
      }))
    };
    
    if (editorMode === 'create') {
      setCampaigns(prev => [completeData, ...prev]);
    } else if (editorMode === 'edit' && editIndex !== null) {
      setCampaigns(prev => {
        const updated = [...prev];
        updated[editIndex] = completeData;
        return updated;
      });
      setEditIndex(null);
    }
    setShowEditor(false);
  };

  // Filter campaigns by status
  const getFilteredCampaigns = () => {
    return campaigns.filter(c => {
      const status = getCampaignStatus(c);
      if (activeTab === 'all') return true;
      return status === activeTab;
    });
  };
  
  const filteredCampaigns = getFilteredCampaigns();
  const campaignsEmpty = campaigns.length === 0;
  const noFilteredResults = !campaignsEmpty && filteredCampaigns.length === 0;

  return (
    <div className="p-6 h-full">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
            <p className="mt-1 text-sm text-gray-500">
              Create and manage your ambassador campaigns and track progress
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {/* View Mode Toggles */}
            <div className="flex items-center mr-4 bg-gray-100 rounded-md p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center px-3 py-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Layers className="w-4 h-4 mr-1.5" />
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center px-3 py-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <FolderOpen className="w-4 h-4 mr-1.5" />
                List
              </button>
            </div>
            {/* Create Campaign Button */}
            <button
              onClick={handleCreate}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Create Campaign
            </button>
          </div>
        </div>

        {/* Campaign Status Filter Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex -mb-px space-x-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('active')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'active' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Active Campaigns
            </button>
            <button
              onClick={() => setActiveTab('ended')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'ended' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Ended Campaigns
            </button>
            <button
              onClick={() => setActiveTab('recurring')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'recurring' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Recurring Campaigns
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'upcoming' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Upcoming Campaigns
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'all' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              All Campaigns
            </button>
          </div>
        </div>

        {/* Empty State */}
        {campaignsEmpty && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-blue-100 p-3 mb-4">
              <AlertCircle className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No campaigns yet</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-md">
              Get started by creating your first ambassador campaign to engage your community.
            </p>
            <div className="mt-6">
              <button
                onClick={handleCreate}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Create Campaign
              </button>
            </div>
          </div>
        )}

        {/* Empty State for No Filtered Results */}
        {noFilteredResults && (
          <div className="text-center py-12">
            <div className="rounded-full bg-gray-100 p-3 mx-auto w-fit mb-4">
              <AlertCircle className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No campaigns match the filter</h3>
            <p className="mt-1 text-sm text-gray-500">
              There are no {activeTab} campaigns to display. Try changing the filter or create a new campaign.
            </p>
          </div>
        )}

        {/* Campaign Grid View */}
        {!campaignsEmpty && filteredCampaigns.length > 0 && viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign, index) => {
              const status = getCampaignStatus(campaign);
              return (
                <div key={index} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <CampaignStatus status={status} />
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEdit(index)}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full focus:outline-none"
                          title="Edit Campaign"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{campaign.name}</h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{campaign.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs text-gray-500">
                        {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-gray-500">{campaign.tasks.length} tasks</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {campaign.assignedSegments ? campaign.assignedSegments.length : 0} ambassadors
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 bg-gray-50 p-3">
                    <button
                      onClick={() => handleAssign(index)}
                      className="w-full py-1.5 text-sm text-blue-600 font-medium hover:text-blue-700 hover:bg-blue-50 rounded transition-colors flex items-center justify-center"
                    >
                      View Campaign Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
          
        {/* Campaign List View */}
        {!campaignsEmpty && filteredCampaigns.length > 0 && viewMode === 'list' && (
          <div className="overflow-hidden bg-white shadow sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredCampaigns.map((campaign, index) => {
                const status = getCampaignStatus(campaign);
                return (
                  <li key={index}>
                    <div className="flex items-center px-4 py-4 sm:px-6 hover:bg-gray-50">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center mb-1">
                          <CampaignStatus status={status} />
                          <span className="ml-2 text-sm text-gray-500">
                            {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 truncate">{campaign.name}</h3>
                        <p className="text-sm text-gray-500 line-clamp-1">{campaign.description}</p>
                        <div className="mt-2 flex items-center">
                          <div className="flex items-center mr-6">
                            <CheckCircle className="h-4 w-4 text-gray-400 mr-1.5" />
                            <span className="text-sm text-gray-500">{campaign.tasks.length} tasks</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 text-gray-400 mr-1.5" />
                            <span className="text-sm text-gray-500">
                              {campaign.assignedSegments ? campaign.assignedSegments.length : 0} ambassadors
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(index)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full focus:outline-none"
                          title="Edit"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleAssign(index)}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Campaign Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowEditor(false)}></div>
          <div className="relative z-50 w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl border border-gray-200">
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b bg-white rounded-t-lg">
              <h3 className="text-lg font-semibold text-gray-900">
                {editorMode === 'edit' ? 'Edit Campaign' : 'Create Campaign'}
              </h3>
              <button
                onClick={() => setShowEditor(false)}
                className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <CampaignCreation
                initialCampaign={initialCampaign}
                mode={editorMode}
                onSave={handleSave}
                onCancel={() => setShowEditor(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Task Assignment Modal */}
      {showAssign && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAssign(false)}></div>
          <div className="relative z-50 w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl border border-gray-200">
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b bg-white rounded-t-lg">
              <h3 className="text-lg font-semibold text-gray-900">Campaign Details & Task Assignment</h3>
              <button
                onClick={() => setShowAssign(false)}
                className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              {selectedCampaign && (
                <TaskAssignment 
                  campaign={{
                    ...selectedCampaign,
                    // Ensure all required properties exist to satisfy TaskAssignment's Campaign type
                    id: selectedCampaign.id || `campaign-${Date.now()}`,
                    status: selectedCampaign.status || 'active',
                    budget: selectedCampaign.budget || 5000,
                    ambassadors: selectedCampaign.ambassadors || [],
                    tasks: (selectedCampaign.tasks || []).map(task => ({
                      ...task,
                      id: task.id || `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                      status: task.status || 'to_do',
                      // Set proofType to ensure it's not undefined
                      proofType: task.proofType || 'url'
                    }))
                  }} 
                  onClose={() => setSelectedCampaign(null)} 
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignsPage;
