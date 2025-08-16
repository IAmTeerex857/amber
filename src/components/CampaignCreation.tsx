import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  X, 
  Save
} from 'lucide-react';
import { Campaign, OKR, Task, KeyResult } from './TaskAssignment';

interface CampaignCreationProps {
  initialCampaign?: Campaign;
  onSave?: (campaign: Campaign) => void;
  onCancel?: () => void;
  mode?: 'create' | 'edit';
}

const CampaignCreation: React.FC<CampaignCreationProps> = ({ initialCampaign, onSave, onCancel, mode = 'create' }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [campaign, setCampaign] = useState<Campaign>(
    initialCampaign ?? {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      okrs: [],
      tasks: [],
      assignedSegments: [],
      ambassadors: [],
      status: 'draft',
      budget: 0
    }
  );

  // Segment presets can be passed in via props in the future if needed

  const steps = [
    { id: 1, name: 'Campaign Details' },
    { id: 2, name: 'OKRs & Goals' },
    { id: 3, name: 'Tasks & Assignment' },
    { id: 4, name: 'Review & Launch' }
  ];

  const addOKR = () => {
    const newOKR: OKR = {
      id: Date.now().toString(),
      objective: '',
      keyResults: []
    };
    setCampaign(prev => ({ ...prev, okrs: [...prev.okrs, newOKR] }));
  };

  const addKeyResult = (okrId: string) => {
    const newKR: KeyResult = {
      id: Date.now().toString(),
      description: '',
      targetValue: 0,
      currentValue: 0,
      unit: 'count'
    };
    setCampaign(prev => ({
      ...prev,
      okrs: prev.okrs.map(okr => 
        okr.id === okrId 
          ? { ...okr, keyResults: [...okr.keyResults, newKR] }
          : okr
      )
    }));
  };

  const addTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: '',
      description: '',
      points: 100,
      priority: 'medium',
      deadline: '',
      assignedSegments: [],
      proofType: 'url',
      okrId: campaign.okrs[0]?.id || ''
    };
    setCampaign(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Campaign Details</h2>
              <p className="text-gray-600">Set up the basic information for your campaign</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Name *
                </label>
                <input
                  type="text"
                  value={campaign.name}
                  onChange={(e) => setCampaign(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Q4 2024 Holiday Product Launch"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={campaign.description}
                  onChange={(e) => setCampaign(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the campaign goals and context..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={campaign.startDate}
                    onChange={(e) => setCampaign(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={campaign.endDate}
                    onChange={(e) => setCampaign(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Objectives & Key Results</h2>
                <p className="text-gray-600">Define measurable goals for your campaign</p>
              </div>
              <button
                onClick={addOKR}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add OKR
              </button>
            </div>
            
            <div className="space-y-6">
              {campaign.okrs.map((okr, okrIndex) => (
                <div key={okr.id} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">OKR {okrIndex + 1}</h3>
                    <button
                      onClick={() => setCampaign(prev => ({
                        ...prev,
                        okrs: prev.okrs.filter(o => o.id !== okr.id)
                      }))}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Objective *
                      </label>
                      <input
                        type="text"
                        value={okr.objective}
                        onChange={(e) => setCampaign(prev => ({
                          ...prev,
                          okrs: prev.okrs.map(o => 
                            o.id === okr.id ? { ...o, objective: e.target.value } : o
                          )
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Drive widespread awareness of Winter Collection"
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Key Results
                        </label>
                        <button
                          onClick={() => addKeyResult(okr.id)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          + Add Key Result
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {okr.keyResults.map((kr, krIndex) => (
                          <div key={kr.id} className="flex items-center space-x-3">
                            <span className="text-sm text-gray-500 w-8">KR{krIndex + 1}:</span>
                            <input
                              type="text"
                              value={kr.description}
                              onChange={(e) => setCampaign(prev => ({
                                ...prev,
                                okrs: prev.okrs.map(o => 
                                  o.id === okr.id 
                                    ? {
                                        ...o,
                                        keyResults: o.keyResults.map(k => 
                                          k.id === kr.id ? { ...k, description: e.target.value } : k
                                        )
                                      }
                                    : o
                                )
                              }))}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="e.g., Generate 500 verified UGC posts"
                            />
                            <input
                              type="number"
                              value={kr.targetValue}
                              onChange={(e) => setCampaign(prev => ({
                                ...prev,
                                okrs: prev.okrs.map(o => 
                                  o.id === okr.id 
                                    ? {
                                        ...o,
                                        keyResults: o.keyResults.map(k => 
                                          k.id === kr.id ? { ...k, targetValue: Number(e.target.value) } : k
                                        )
                                      }
                                    : o
                                )
                              }))}
                              className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="500"
                            />
                            <button
                              onClick={() => setCampaign(prev => ({
                                ...prev,
                                okrs: prev.okrs.map(o => 
                                  o.id === okr.id 
                                    ? { ...o, keyResults: o.keyResults.filter(k => k.id !== kr.id) }
                                    : o
                                )
                              }))}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {campaign.okrs.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No OKRs yet</h3>
                  <p className="text-gray-600 mb-4">Add your first objective to get started</p>
                  <button
                    onClick={addOKR}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create First OKR
                  </button>
                </div>
              )}
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Tasks & Assignment</h2>
                <p className="text-gray-600">Create tasks and assign them to ambassador segments</p>
              </div>
              <button
                onClick={addTask}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </button>
            </div>
            
            <div className="space-y-6">
              {campaign.tasks.map((task, taskIndex) => (
                <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Task {taskIndex + 1}</h3>
                    <button
                      onClick={() => setCampaign(prev => ({
                        ...prev,
                        tasks: prev.tasks.filter(t => t.id !== task.id)
                      }))}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Task Title *
                        </label>
                        <input
                          type="text"
                          value={task.title}
                          onChange={(e) => setCampaign(prev => ({
                            ...prev,
                            tasks: prev.tasks.map(t => 
                              t.id === task.id ? { ...t, title: e.target.value } : t
                            )
                          }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Create TikTok Unboxing Video"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={task.description}
                          onChange={(e) => setCampaign(prev => ({
                            ...prev,
                            tasks: prev.tasks.map(t => 
                              t.id === task.id ? { ...t, description: e.target.value } : t
                            )
                          }))}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Detailed instructions for the ambassador..."
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Points
                          </label>
                          <input
                            type="number"
                            value={task.points}
                            onChange={(e) => setCampaign(prev => ({
                              ...prev,
                              tasks: prev.tasks.map(t => 
                                t.id === task.id ? { ...t, points: Number(e.target.value) } : t
                              )
                            }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Priority
                          </label>
                          <select
                            value={task.priority}
                            onChange={(e) => setCampaign(prev => ({
                              ...prev,
                              tasks: prev.tasks.map(t => 
                                t.id === task.id ? { ...t, priority: e.target.value as 'low' | 'medium' | 'high' } : t
                              )
                            }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Deadline
                        </label>
                        <input
                          type="date"
                          value={task.deadline}
                          onChange={(e) => setCampaign(prev => ({
                            ...prev,
                            tasks: prev.tasks.map(t => 
                              t.id === task.id ? { ...t, deadline: e.target.value } : t
                            )
                          }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Proof Type
                        </label>
                        <select
                          value={task.proofType}
                          onChange={(e) => setCampaign(prev => ({
                            ...prev,
                            tasks: prev.tasks.map(t => 
                              t.id === task.id ? { ...t, proofType: e.target.value as 'url' | 'media' | 'auto' } : t
                            )
                          }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="url">URL Submission</option>
                          <option value="media">Media Upload</option>
                          <option value="auto">Automated Tracking</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Launch</h2>
              <p className="text-gray-600">Review your campaign before launching</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Basic Info</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Name:</span> {campaign.name}</div>
                    <div><span className="text-gray-600">Duration:</span> {campaign.startDate} to {campaign.endDate}</div>
                    <div><span className="text-gray-600">OKRs:</span> {campaign.okrs.length}</div>
                    <div><span className="text-gray-600">Tasks:</span> {campaign.tasks.length}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Metrics</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Total Points:</span> {campaign.tasks.reduce((sum, task) => sum + task.points, 0)}</div>
                    <div><span className="text-gray-600">Key Results:</span> {campaign.okrs.reduce((sum, okr) => sum + okr.keyResults.length, 0)}</div>
                  </div>
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
    <div className="bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                  ${currentStep >= step.id 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                  }
                `}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <div className="ml-3">
                  <div className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {step.name}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    flex-1 h-0.5 mx-8 transition-all
                    ${currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'}
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {renderStepContent()}
          
          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className={`
                flex items-center px-6 py-3 rounded-lg font-medium transition-all
                ${currentStep === 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-50 border border-gray-300'
                }
              `}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </button>
            
            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                {onCancel && (
                  <button
                    onClick={onCancel}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={() => {
                    if (onSave) {
                      onSave(campaign);
                    } else {
                      console.log(mode === 'edit' ? 'Save campaign:' : 'Launch campaign:', campaign);
                    }
                  }}
                  className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  {mode === 'edit' ? 'Save Changes' : 'Launch Campaign'}
                  <Save className="w-4 h-4 ml-2" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCreation;
