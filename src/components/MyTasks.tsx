import React, { useState } from 'react';
import { Coins, Calendar, Search, ArrowRight, CheckCircle, Clock, AlertCircle, Users, Calendar as CalendarIcon, Tag, FileText } from 'lucide-react';

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
}

const MyTasks: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const tasks: Task[] = [
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
    },
    {
      id: '4',
      title: 'Email Newsletter Content',
      description: 'Create engaging newsletter content featuring summer campaign',
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
      description: 'Manage our Twitter account for 1 week with daily posts',
      points: 600,
      deadline: '2023-08-12',
      status: 'available',
      category: 'Social Media',
      priority: 'low',
      peopleWorking: 3,
      assignees: ['Sam', 'Jordan', 'Casey'],
    },
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

  const filtered = tasks.filter((t) => {
    const catOk = filterCategory === 'all' || t.category === filterCategory;
    const statusOk = filterStatus === 'all' || t.status === filterStatus;
    const searchOk = searchQuery === '' || 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return catOk && statusOk && searchOk;
  });
  
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
    setShowTaskDetails(false);
    setShowSubmitForm(false);
    setActiveTask(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-600 text-sm">View, work on, and submit your tasks.</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-md text-sm font-medium flex items-center gap-2 shadow-sm">
            <CalendarIcon className="h-4 w-4" />
            <span>Calendar</span>
          </button>

        </div>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-wrap gap-4 items-center justify-between">
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
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center">
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="Content Creation">Content Creation</option>
              <option value="Social Media">Social Media</option>
              <option value="Referrals">Referrals</option>
            </select>
          </div>
          <div className="flex items-center">
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="in-progress">In Progress</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

        </div>
      </div>

      {/* Task Cards */}
      <div className="grid gap-4">
        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-md border border-gray-200">
            <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks found</h3>
            <p className="text-gray-500">Try changing your search or filter criteria</p>
          </div>
        )}
        {filtered.map((task) => (
          <div 
            key={task.id} 
            className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all overflow-hidden"
          >
            <div className="flex">
              <div className={`w-1 self-stretch ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
              <div className="flex-1 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {getStatusIcon(task.status)}
                      <span>{task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}</span>
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityPill(task.priority)}`}>
                      {task.priority} priority
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {task.status === 'available' && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartTask(task);
                        }} 
                        className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap text-sm"
                      >
                        <span>Start Task</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {task.status === 'in-progress' && (
                      <>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(task);
                          }} 
                          className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap text-sm"
                        >
                          Continue
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubmitProof(task);
                          }} 
                          className="px-4 py-1.5 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors whitespace-nowrap text-sm"
                        >
                          Submit
                        </button>
                      </>
                    )}
                    {(task.status === 'submitted' || task.status === 'approved' || task.status === 'rejected') && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(task);
                        }} 
                        className="px-4 py-1.5 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors whitespace-nowrap text-sm"
                      >
                        View Details
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="cursor-pointer" onClick={() => handleViewDetails(task)}>
                  <p className="text-gray-600 mb-3">{task.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Coins className="h-4 w-4 text-green-500" />
                      <span className="font-medium">{task.points} points</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span>Due {new Date(task.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Tag className="h-4 w-4 text-purple-500" />
                      <span>{task.category}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>
                        {task.peopleWorking === 1 ? '1 person working' : 
                         `${task.peopleWorking || 0} people working`}
                      </span>
                    </div>
                  </div>
                  
                  {(task.peopleWorking ?? 0) > 0 && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex -space-x-2 overflow-hidden">
                        {task.assignees?.map((assignee, index) => (
                          <div 
                            key={index} 
                            className="h-6 w-6 rounded-full bg-gray-200 text-xs flex items-center justify-center font-medium text-gray-800 ring-2 ring-white"
                            title={assignee}
                          >
                            {assignee.charAt(0)}
                          </div>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {task.assignees?.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

      </div>
      
      {/* Task Details Modal */}
      {showTaskDetails && activeTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">{activeTask.title}</h3>
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
                <h3 className="text-xl font-semibold text-gray-900">Submit Proof: {activeTask.title}</h3>
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
    </div>
  );
};

export default MyTasks;
