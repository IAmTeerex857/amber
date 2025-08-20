import React, { useState } from 'react';
import {
  DollarSign, Plus, Calendar, Send, CheckCircle,
  Clock, AlertTriangle, X, FileText, Tag
} from 'lucide-react';

interface FundRequest {
  id: string;
  title: string;
  description: string;
  amount: number;
  category: 'equipment' | 'education' | 'event' | 'travel' | 'marketing' | 'other';
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  submittedDate?: string;
  reviewedDate?: string;
  reviewNotes?: string;
}

const AmbassadorFundRequest: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'requests' | 'new'>('requests');
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);

  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    amount: '',
    category: 'equipment' as const
  });

  // Mock data
  const fundRequests: FundRequest[] = [
    {
      id: 'req-1',
      title: 'Conference Attendance - Social Media Summit',
      description: 'Professional development opportunity to learn latest social media trends and network with industry leaders.',
      amount: 500,
      category: 'education',
      status: 'approved',
      submittedDate: '2024-01-20',
      reviewedDate: '2024-01-21',
      reviewNotes: 'Great opportunity for skill development. Approved for full amount.'
    },
    {
      id: 'req-2',
      title: 'Camera Equipment Upgrade',
      description: 'Need better camera equipment for creating high-quality content for campaigns.',
      amount: 300,
      category: 'equipment',
      status: 'pending',
      submittedDate: '2024-01-22'
    },
    {
      id: 'req-3',
      title: 'Local Community Meetup',
      description: 'Organizing a local ambassador meetup to build community and share best practices.',
      amount: 150,
      category: 'event',
      status: 'rejected',
      submittedDate: '2024-01-18',
      reviewedDate: '2024-01-19',
      reviewNotes: 'Budget constraints this month. Please resubmit next month.'
    }
  ];

  const categories = [
    { value: 'equipment', label: 'Equipment & Tools' },
    { value: 'education', label: 'Education & Training' },
    { value: 'event', label: 'Events & Meetups' },
    { value: 'travel', label: 'Travel Expenses' },
    { value: 'marketing', label: 'Marketing Materials' },
    { value: 'other', label: 'Other' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'rejected':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting request:', newRequest);
    setIsNewRequestModalOpen(false);
    setNewRequest({ title: '', description: '', amount: '', category: 'equipment' });
  };

  const totalRequested = fundRequests.reduce((sum, req) => sum + req.amount, 0);
  const approvedAmount = fundRequests
    .filter(req => req.status === 'approved')
    .reduce((sum, req) => sum + req.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fund Requests</h1>
          <p className="text-gray-600 mt-1">Request funding from your chapter for ambassador activities</p>
        </div>
        <button 
          onClick={() => setIsNewRequestModalOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Request</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{fundRequests.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Requested</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">${totalRequested}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved Amount</p>
              <p className="text-2xl font-bold text-green-600 mt-1">${approvedAmount}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6">
          <div className="space-y-4">
            {fundRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)} flex items-center space-x-1`}>
                        {getStatusIcon(request.status)}
                        <span className="capitalize">{request.status}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{request.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Tag className="h-4 w-4" />
                        <span className="capitalize">{request.category}</span>
                      </div>
                      {request.submittedDate && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Submitted {new Date(request.submittedDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-2xl font-bold text-green-600">${request.amount}</p>
                  </div>
                </div>

                {request.reviewNotes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-1">Review Notes</h4>
                    <p className="text-sm text-gray-700">{request.reviewNotes}</p>
                    {request.reviewedDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        Reviewed on {new Date(request.reviewedDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Request Modal */}
      {isNewRequestModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">New Fund Request</h3>
              <button 
                onClick={() => setIsNewRequestModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Request Title</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={newRequest.title}
                  onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                  placeholder="Brief description of what you need"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={newRequest.category}
                  onChange={(e) => setNewRequest({ ...newRequest, category: e.target.value as any })}
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount Requested ($)</label>
                <input
                  type="number"
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={newRequest.amount}
                  onChange={(e) => setNewRequest({ ...newRequest, amount: e.target.value })}
                  placeholder="Enter amount"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  rows={4}
                  value={newRequest.description}
                  onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                  placeholder="Provide details about your request, including why it's needed and how it will help your ambassador work..."
                />
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">💡 Tips for a successful request:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Be specific about what you need and why</li>
                  <li>• Explain how it will improve your ambassador work</li>
                  <li>• Include estimated costs and timeline</li>
                  <li>• Be reasonable with budget requests</li>
                </ul>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsNewRequestModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Submit Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmbassadorFundRequest;
