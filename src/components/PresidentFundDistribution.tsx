import React, { useState } from 'react';
import {
  DollarSign, Users, Calendar, Send, Clock,
  CheckCircle, AlertTriangle, Plus, Search,
  Filter, ArrowUpRight, ArrowDownLeft, Trophy,
  Gift, MapPin, Target, FileText, X, Edit3
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface FundDistribution {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientEmail: string;
  amount: number;
  type: 'reward' | 'event' | 'bonus' | 'allowance';
  category: 'task_completion' | 'performance_bonus' | 'event_funding' | 'monthly_allowance';
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  reason: string;
  requestedDate: string;
  processedDate?: string;
  notes?: string;
}

const PresidentFundDistribution: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'distribute' | 'history'>('overview');
  const [isDistributeModalOpen, setIsDistributeModalOpen] = useState(false);
  const [selectedAmbassadors, setSelectedAmbassadors] = useState<string[]>([]);

  const [newDistribution, setNewDistribution] = useState({
    amount: '',
    type: 'reward' as const,
    category: 'task_completion' as const,
    reason: '',
    notes: ''
  });

  // Mock data
  const chapterBudget = {
    totalAllocated: 5000,
    totalSpent: 2850,
    totalPending: 750,
    remaining: 1400
  };

  const ambassadors = [
    {
      id: 'amb-1',
      name: 'Sarah Johnson',
      email: 'sarah@email.com',
      totalEarned: 450,
      tasksCompleted: 12,
      performance: 92,
      status: 'active'
    },
    {
      id: 'amb-2',
      name: 'Mike Chen',
      email: 'mike@email.com',
      totalEarned: 380,
      tasksCompleted: 10,
      performance: 88,
      status: 'active'
    },
    {
      id: 'amb-3',
      name: 'Lisa Park',
      email: 'lisa@email.com',
      totalEarned: 520,
      tasksCompleted: 15,
      performance: 95,
      status: 'active'
    }
  ];

  const fundDistributions: FundDistribution[] = [
    {
      id: 'dist-1',
      recipientId: 'amb-1',
      recipientName: 'Sarah Johnson',
      recipientEmail: 'sarah@email.com',
      amount: 100,
      type: 'reward',
      category: 'task_completion',
      status: 'completed',
      reason: 'Exceptional performance on social media campaign',
      requestedDate: '2024-01-22',
      processedDate: '2024-01-22'
    },
    {
      id: 'dist-2',
      recipientId: 'amb-2',
      recipientName: 'Mike Chen',
      recipientEmail: 'mike@email.com',
      amount: 250,
      type: 'event',
      category: 'event_funding',
      status: 'pending',
      reason: 'Community meetup organization',
      requestedDate: '2024-01-21'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'rejected':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const budgetUtilization = Math.round((chapterBudget.totalSpent / chapterBudget.totalAllocated) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fund Distribution</h1>
          <p className="text-gray-600 mt-1">Manage and distribute funding to your chapter ambassadors</p>
        </div>
        <button 
          onClick={() => setIsDistributeModalOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Distribute Funds</span>
        </button>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Allocated</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">${chapterBudget.totalAllocated}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${budgetUtilization}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{budgetUtilization}% utilized</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-red-600 mt-1">${chapterBudget.totalSpent}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <ArrowUpRight className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">${chapterBudget.totalPending}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Remaining</p>
              <p className="text-2xl font-bold text-green-600 mt-1">${chapterBudget.remaining}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <ArrowDownLeft className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 py-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('distribute')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'distribute'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Quick Distribute
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Distribution History
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Distributions</h3>
                <div className="space-y-3">
                  {fundDistributions.slice(0, 3).map((dist) => (
                    <div key={dist.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white rounded-lg">
                          <DollarSign className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">${dist.amount} to {dist.recipientName}</p>
                          <p className="text-sm text-gray-600">{dist.reason}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(dist.status)} flex items-center space-x-1`}>
                        {getStatusIcon(dist.status)}
                        <span className="capitalize">{dist.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ambassador Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {ambassadors.map((ambassador) => (
                    <div key={ambassador.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{ambassador.name}</h4>
                        <span className="text-sm font-medium text-green-600">{ambassador.performance}%</span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Total Earned:</span>
                          <span className="font-medium">${ambassador.totalEarned}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tasks Completed:</span>
                          <span className="font-medium">{ambassador.tasksCompleted}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Distribution History</h3>
              <div className="space-y-3">
                {fundDistributions.map((dist) => (
                  <div key={dist.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-gray-900">${dist.amount} - {dist.recipientName}</h4>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(dist.status)} flex items-center space-x-1`}>
                            {getStatusIcon(dist.status)}
                            <span className="capitalize">{dist.status}</span>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2">{dist.reason}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Requested: {new Date(dist.requestedDate).toLocaleDateString()}</span>
                          {dist.processedDate && (
                            <span>Processed: {new Date(dist.processedDate).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PresidentFundDistribution;
