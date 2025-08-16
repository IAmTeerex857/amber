import React, { useState, useEffect } from 'react';
import { 
  Layers, FolderOpen, Plus, Pencil, 
  AlertCircle, Users, CheckCircle, X
} from 'lucide-react';
import CampaignCreation from './CampaignCreation';
import TaskAssignment, { Campaign } from './TaskAssignment';
import CampaignStatus, { CampaignStatusType } from './common/CampaignStatus';

// Using imported interfaces from TaskAssignment.tsx instead of local declarations

const STORAGE_KEY = 'amber_campaigns';
const defaultCampaigns: Campaign[] = [];

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
    if (editorMode === 'create') {
      setCampaigns(prev => [data, ...prev]);
    } else if (editorMode === 'edit' && editIndex !== null) {
      setCampaigns(prev => {
        const updated = [...prev];
        updated[editIndex] = data;
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
