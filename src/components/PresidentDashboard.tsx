import React, { useState } from 'react';
import {
  Users, Target, MapPin, Wallet, Plus,
  CheckCircle, Award
} from 'lucide-react';

const PresidentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'ambassadors' | 'funding'>('overview');

  // Mock chapter stats
  const stats = {
    totalAmbassadors: 12,
    activeAmbassadors: 10,
    monthlyBudget: 10000,
    budgetRemaining: 3500,
    tasksCompleted: 28,
    averageRating: 4.7
  };

  const ambassadors = [
    { id: '1', name: 'Sarah Wilson', tasksCompleted: 8, totalEarned: 420, rating: 4.9 },
    { id: '2', name: 'David Chen', tasksCompleted: 5, totalEarned: 275, rating: 4.6 },
    { id: '3', name: 'Emma Rodriguez', tasksCompleted: 12, totalEarned: 680, rating: 4.8 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chapter Dashboard</h1>
          <div className="flex items-center space-x-2 mt-1">
            <MapPin className="h-4 w-4 text-gray-500" />
            <p className="text-gray-600">United States Chapter</p>
            <div className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              Active
            </div>
          </div>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Invite Ambassador</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Ambassadors</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalAmbassadors}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-green-600">{stats.activeAmbassadors} active</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Budget Remaining</p>
              <p className="text-2xl font-bold text-green-600 mt-1">${stats.budgetRemaining.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Wallet className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tasks Completed</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{stats.tasksCompleted}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.averageRating}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Award className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 py-4">
            {['overview', 'ambassadors', 'funding'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
              <div className="space-y-3">
                {ambassadors.map((amb, index) => (
                  <div key={amb.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{amb.name}</p>
                        <p className="text-sm text-gray-500">{amb.tasksCompleted} tasks</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">⭐ {amb.rating}</p>
                      <p className="text-sm text-gray-500">${amb.totalEarned}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ambassadors' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Chapter Ambassadors</h3>
              <div className="space-y-3">
                {ambassadors.map((amb) => (
                  <div key={amb.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{amb.name}</h4>
                        <p className="text-sm text-gray-500">{amb.tasksCompleted} tasks • ${amb.totalEarned} earned</p>
                      </div>
                      <div className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        <CheckCircle className="h-3 w-3 inline mr-1" />
                        Active
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'funding' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Chapter Funding</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Monthly Budget</h4>
                  <p className="text-2xl font-bold text-blue-600">${stats.monthlyBudget.toLocaleString()}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Remaining</h4>
                  <p className="text-2xl font-bold text-green-600">${stats.budgetRemaining.toLocaleString()}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Quick Actions</h4>
                  <button className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    Distribute Funds
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PresidentDashboard;
