import React, { useState } from 'react';
import {
  DollarSign, TrendingUp, TrendingDown, Users, 
  Calendar, ArrowUpRight, ArrowDownRight, Filter,
  Download, Plus, RefreshCw, AlertTriangle,
  CheckCircle, Clock, Target, Crown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface FundingAllocation {
  id: string;
  chapterId: string;
  chapterName: string;
  presidentName: string;
  monthlyBudget: number;
  utilized: number;
  remaining: number;
  lastDistribution: string;
  status: 'active' | 'pending' | 'overbudget';
}

interface Transaction {
  id: string;
  type: 'allocation' | 'distribution' | 'reward' | 'event';
  chapterName: string;
  amount: number;
  recipient: string;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

const FundingDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'allocations' | 'transactions' | 'analytics'>('overview');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Mock data for demonstration
  const mockAllocations: FundingAllocation[] = [
    {
      id: 'alloc-1',
      chapterId: 'chapter-usa',
      chapterName: 'United States Chapter',
      presidentName: 'John Smith',
      monthlyBudget: 10000,
      utilized: 7500,
      remaining: 2500,
      lastDistribution: '2024-01-15',
      status: 'active'
    },
    {
      id: 'alloc-2',
      chapterId: 'chapter-uk',
      chapterName: 'United Kingdom Chapter',
      presidentName: 'Mike Johnson',
      monthlyBudget: 10000,
      utilized: 12000,
      remaining: -2000,
      lastDistribution: '2024-01-20',
      status: 'overbudget'
    },
    {
      id: 'alloc-3',
      chapterId: 'chapter-canada',
      chapterName: 'Canada Chapter',
      presidentName: 'Jane Doe',
      monthlyBudget: 10000,
      utilized: 3000,
      remaining: 7000,
      lastDistribution: '2024-01-10',
      status: 'active'
    }
  ];

  const mockTransactions: Transaction[] = [
    {
      id: 'tx-1',
      type: 'reward',
      chapterName: 'United States Chapter',
      amount: 150,
      recipient: 'Sarah Wilson',
      description: 'Social media campaign completion',
      date: '2024-01-20',
      status: 'completed'
    },
    {
      id: 'tx-2',
      type: 'event',
      chapterName: 'United Kingdom Chapter',
      amount: 2500,
      recipient: 'Chapter Event Fund',
      description: 'Q1 Community Meetup',
      date: '2024-01-19',
      status: 'pending'
    },
    {
      id: 'tx-3',
      type: 'allocation',
      chapterName: 'Canada Chapter',
      amount: 10000,
      recipient: 'Jane Doe',
      description: 'Monthly chapter allocation',
      date: '2024-01-18',
      status: 'completed'
    }
  ];

  const totalBudget = mockAllocations.reduce((sum, alloc) => sum + alloc.monthlyBudget, 0);
  const totalUtilized = mockAllocations.reduce((sum, alloc) => sum + alloc.utilized, 0);
  const totalRemaining = totalBudget - totalUtilized;
  const utilizationRate = (totalUtilized / totalBudget) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overbudget':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'allocation':
        return <ArrowDownRight className="h-4 w-4" />;
      case 'distribution':
        return <ArrowUpRight className="h-4 w-4" />;
      case 'reward':
        return <Target className="h-4 w-4" />;
      case 'event':
        return <Calendar className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'allocation':
        return 'bg-blue-100 text-blue-800';
      case 'distribution':
        return 'bg-purple-100 text-purple-800';
      case 'reward':
        return 'bg-green-100 text-green-800';
      case 'event':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Funding Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor and manage chapter funding distributions</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d' | '1y')}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New Allocation</span>
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${totalBudget.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-green-600">Monthly allocation</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Utilized</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">${totalUtilized.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-gray-600">{utilizationRate.toFixed(1)}% of budget</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Remaining</p>
              <p className={`text-2xl font-bold mt-1 ${totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(totalRemaining).toLocaleString()}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${totalRemaining >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              {totalRemaining >= 0 ? (
                <TrendingUp className="h-6 w-6 text-green-600" />
              ) : (
                <TrendingDown className="h-6 w-6 text-red-600" />
              )}
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className={totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'}>
              {totalRemaining >= 0 ? 'Available' : 'Over budget'}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Chapters</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{mockAllocations.filter(a => a.status === 'active').length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-gray-600">of {mockAllocations.length} total</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 py-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('allocations')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'allocations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Chapter Allocations
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'transactions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Recent Transactions
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Budget Utilization Chart Placeholder */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Utilization</h3>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                      <p>Utilization chart would go here</p>
                    </div>
                  </div>
                </div>

                {/* Top Spending Chapters */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Spending Chapters</h3>
                  <div className="space-y-3">
                    {mockAllocations
                      .sort((a, b) => b.utilized - a.utilized)
                      .slice(0, 3)
                      .map((allocation) => (
                        <div key={allocation.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Crown className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{allocation.chapterName}</p>
                              <p className="text-sm text-gray-500">{allocation.presidentName}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">${allocation.utilized.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">
                              {((allocation.utilized / allocation.monthlyBudget) * 100).toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors text-left">
                    <Plus className="h-6 w-6 text-blue-600 mb-2" />
                    <h4 className="font-medium text-gray-900">New Allocation</h4>
                    <p className="text-sm text-gray-500">Create monthly budget allocation for a chapter</p>
                  </button>
                  <button className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors text-left">
                    <RefreshCw className="h-6 w-6 text-green-600 mb-2" />
                    <h4 className="font-medium text-gray-900">Adjust Budget</h4>
                    <p className="text-sm text-gray-500">Modify existing chapter budget allocations</p>
                  </button>
                  <button className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors text-left">
                    <Download className="h-6 w-6 text-purple-600 mb-2" />
                    <h4 className="font-medium text-gray-900">Export Report</h4>
                    <p className="text-sm text-gray-500">Download funding report for accounting</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'allocations' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Chapter Allocations</h3>
                <div className="flex items-center space-x-3">
                  <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {mockAllocations.map((allocation) => (
                  <div key={allocation.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <Crown className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{allocation.chapterName}</h4>
                          <p className="text-sm text-gray-500">President: {allocation.presidentName}</p>
                          <p className="text-sm text-gray-500">
                            Last distribution: {new Date(allocation.lastDistribution).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Monthly Budget</p>
                          <p className="text-lg font-semibold text-gray-900">${allocation.monthlyBudget.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Utilized</p>
                          <p className="text-lg font-semibold text-orange-600">${allocation.utilized.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Remaining</p>
                          <p className={`text-lg font-semibold ${allocation.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${Math.abs(allocation.remaining).toLocaleString()}
                          </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(allocation.status)}`}>
                          {allocation.status === 'overbudget' && <AlertTriangle className="h-3 w-3 inline mr-1" />}
                          {allocation.status === 'active' && <CheckCircle className="h-3 w-3 inline mr-1" />}
                          {allocation.status === 'pending' && <Clock className="h-3 w-3 inline mr-1" />}
                          <span className="capitalize">{allocation.status}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Budget Utilization</span>
                        <span>{((allocation.utilized / allocation.monthlyBudget) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            allocation.utilized > allocation.monthlyBudget 
                              ? 'bg-red-500' 
                              : allocation.utilized > allocation.monthlyBudget * 0.8 
                                ? 'bg-yellow-500' 
                                : 'bg-green-500'
                          }`}
                          style={{ 
                            width: `${Math.min((allocation.utilized / allocation.monthlyBudget) * 100, 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Export All</span>
                </button>
              </div>

              <div className="space-y-3">
                {mockTransactions.map((transaction) => (
                  <div key={transaction.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${getTransactionTypeColor(transaction.type)}`}>
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                          <p className="text-sm text-gray-500">{transaction.chapterName} • {transaction.recipient}</p>
                          <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">${transaction.amount.toLocaleString()}</p>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getTransactionTypeColor(transaction.type)}`}>
                            {transaction.type}
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                          transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status === 'completed' && <CheckCircle className="h-3 w-3 inline mr-1" />}
                          {transaction.status === 'pending' && <Clock className="h-3 w-3 inline mr-1" />}
                          {transaction.status === 'failed' && <AlertTriangle className="h-3 w-3 inline mr-1" />}
                          <span className="capitalize">{transaction.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Funding Analytics</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Spending Trends</h4>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                      <p>Spending trends chart would go here</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Fund Distribution by Type</h4>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <DollarSign className="h-12 w-12 mx-auto mb-2" />
                      <p>Distribution pie chart would go here</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Monthly Performance</h4>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Calendar className="h-12 w-12 mx-auto mb-2" />
                    <p>Monthly performance chart would go here</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FundingDashboard;
