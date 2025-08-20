import React, { useState } from 'react';
import {
  Calendar, DollarSign, TrendingUp, AlertTriangle,
  CheckCircle, Clock, Settings, Play, Pause,
  BarChart3, PieChart, ArrowRight, RefreshCw,
  Download, Upload, Bell, Users, Target
} from 'lucide-react';

interface AllocationRule {
  id: string;
  name: string;
  chapterId: string;
  chapterName: string;
  baseAmount: number;
  performanceMultiplier: number;
  isActive: boolean;
  lastProcessed: string;
  nextProcessingDate: string;
}

interface AllocationHistory {
  id: string;
  chapterId: string;
  chapterName: string;
  amount: number;
  month: string;
  year: number;
  status: 'scheduled' | 'processing' | 'completed' | 'failed';
  processedDate?: string;
  notes?: string;
  performanceScore: number;
  ambassadorCount: number;
  tasksCompleted: number;
}

interface ChapterPerformance {
  chapterId: string;
  chapterName: string;
  ambassadorCount: number;
  tasksCompleted: number;
  averageRating: number;
  engagementScore: number;
  performanceScore: number;
  recommendedAllocation: number;
}

const MonthlyAllocations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'rules' | 'history' | 'performance'>('overview');
  const [automationEnabled, setAutomationEnabled] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Mock data
  const allocationRules: AllocationRule[] = [
    {
      id: 'rule-1',
      name: 'USA Chapter Standard',
      chapterId: 'chapter-usa',
      chapterName: 'United States Chapter',
      baseAmount: 10000,
      performanceMultiplier: 1.2,
      isActive: true,
      lastProcessed: '2024-01-01',
      nextProcessingDate: '2024-02-01'
    },
    {
      id: 'rule-2',
      name: 'UK Chapter Standard',
      chapterId: 'chapter-uk',
      chapterName: 'United Kingdom Chapter',
      baseAmount: 8000,
      performanceMultiplier: 1.1,
      isActive: true,
      lastProcessed: '2024-01-01',
      nextProcessingDate: '2024-02-01'
    },
    {
      id: 'rule-3',
      name: 'Canada Chapter Standard',
      chapterId: 'chapter-canada',
      chapterName: 'Canada Chapter',
      baseAmount: 9000,
      performanceMultiplier: 1.15,
      isActive: false,
      lastProcessed: '2023-12-01',
      nextProcessingDate: '2024-02-01'
    }
  ];

  const allocationHistory: AllocationHistory[] = [
    {
      id: 'hist-1',
      chapterId: 'chapter-usa',
      chapterName: 'United States Chapter',
      amount: 12000,
      month: 'January',
      year: 2024,
      status: 'completed',
      processedDate: '2024-01-01T00:00:00Z',
      performanceScore: 92,
      ambassadorCount: 15,
      tasksCompleted: 248
    },
    {
      id: 'hist-2',
      chapterId: 'chapter-uk',
      chapterName: 'United Kingdom Chapter',
      amount: 8800,
      month: 'January',
      year: 2024,
      status: 'completed',
      processedDate: '2024-01-01T00:00:00Z',
      performanceScore: 88,
      ambassadorCount: 12,
      tasksCompleted: 195
    },
    {
      id: 'hist-3',
      chapterId: 'chapter-usa',
      chapterName: 'United States Chapter',
      amount: 12000,
      month: 'February',
      year: 2024,
      status: 'scheduled',
      performanceScore: 95,
      ambassadorCount: 16,
      tasksCompleted: 0
    }
  ];

  const chapterPerformance: ChapterPerformance[] = [
    {
      chapterId: 'chapter-usa',
      chapterName: 'United States Chapter',
      ambassadorCount: 16,
      tasksCompleted: 248,
      averageRating: 4.8,
      engagementScore: 92,
      performanceScore: 95,
      recommendedAllocation: 12000
    },
    {
      chapterId: 'chapter-uk',
      chapterName: 'United Kingdom Chapter',
      ambassadorCount: 12,
      tasksCompleted: 195,
      averageRating: 4.6,
      engagementScore: 88,
      performanceScore: 90,
      recommendedAllocation: 8800
    },
    {
      chapterId: 'chapter-canada',
      chapterName: 'Canada Chapter',
      ambassadorCount: 8,
      tasksCompleted: 156,
      averageRating: 4.4,
      engagementScore: 85,
      performanceScore: 87,
      recommendedAllocation: 9500
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'scheduled':
        return <Clock className="h-4 w-4" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const totalMonthlyBudget = allocationRules
    .filter(rule => rule.isActive)
    .reduce((sum, rule) => sum + rule.baseAmount, 0);

  const currentMonthAllocations = allocationHistory.filter(
    hist => hist.month === new Date().toLocaleString('default', { month: 'long' }) && 
            hist.year === new Date().getFullYear()
  );

  const processAutomaticAllocations = () => {
    console.log('Processing automatic allocations...');
    // Implementation would trigger backend automation
  };

  const handleRunManualAllocation = () => {
    console.log('Running manual allocation...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monthly Allocations</h1>
          <p className="text-gray-600 mt-1">Automated chapter funding distribution system</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Automation</span>
            <button
              onClick={() => setAutomationEnabled(!automationEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                automationEnabled ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  automationEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <button
            onClick={processAutomaticAllocations}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Play className="h-4 w-4" />
            <span>Run Allocations</span>
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Monthly Budget</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">${totalMonthlyBudget.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500 mt-2">
            <span>Across {allocationRules.filter(r => r.isActive).length} active chapters</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month Allocated</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                ${currentMonthAllocations.reduce((sum, alloc) => sum + alloc.amount, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500 mt-2">
            <span>{currentMonthAllocations.length} chapters funded</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Automation Status</p>
              <p className={`text-2xl font-bold mt-1 ${automationEnabled ? 'text-green-600' : 'text-red-600'}`}>
                {automationEnabled ? 'ACTIVE' : 'PAUSED'}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${automationEnabled ? 'bg-green-100' : 'bg-red-100'}`}>
              {automationEnabled ? (
                <Play className="h-6 w-6 text-green-600" />
              ) : (
                <Pause className="h-6 w-6 text-red-600" />
              )}
            </div>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500 mt-2">
            <span>Next run: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Processing Queue</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {allocationHistory.filter(h => h.status === 'scheduled').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500 mt-2">
            <span>Pending allocations</span>
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
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'rules'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Allocation Rules ({allocationRules.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Allocation History
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'performance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Performance Analytics
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Allocations</h3>
                <div className="space-y-3">
                  {allocationHistory.filter(h => h.status === 'scheduled').map((allocation) => (
                    <div key={allocation.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{allocation.chapterName}</h4>
                          <p className="text-sm text-gray-600">
                            ${allocation.amount.toLocaleString()} for {allocation.month} {allocation.year}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(allocation.status)} flex items-center space-x-1`}>
                            {getStatusIcon(allocation.status)}
                            <span className="capitalize">{allocation.status}</span>
                          </div>
                          <button
                            onClick={handleRunManualAllocation}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                          >
                            Process Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Allocations</h3>
                <div className="space-y-3">
                  {allocationHistory.filter(h => h.status === 'completed').slice(0, 3).map((allocation) => (
                    <div key={allocation.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{allocation.chapterName}</h4>
                          <p className="text-sm text-gray-600">
                            ${allocation.amount.toLocaleString()} • {allocation.month} {allocation.year}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(allocation.status)} flex items-center space-x-1`}>
                            {getStatusIcon(allocation.status)}
                            <span className="capitalize">{allocation.status}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {allocation.processedDate && new Date(allocation.processedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Allocation Rules</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>New Rule</span>
                </button>
              </div>

              <div className="space-y-3">
                {allocationRules.map((rule) => (
                  <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{rule.name}</h4>
                        <p className="text-sm text-gray-600">{rule.chapterName}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          rule.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {rule.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <button className="text-blue-600 hover:text-blue-800">
                          <Settings className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Base Amount:</span>
                        <p className="font-medium">${rule.baseAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Performance Multiplier:</span>
                        <p className="font-medium">{rule.performanceMultiplier}x</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Next Processing:</span>
                        <p className="font-medium">{new Date(rule.nextProcessingDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Allocation History</h3>
                <div className="flex items-center space-x-2">
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i}>
                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  >
                    <option value={2024}>2024</option>
                    <option value={2023}>2023</option>
                  </select>
                  <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {allocationHistory.map((allocation) => (
                  <div key={allocation.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{allocation.chapterName}</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          ${allocation.amount.toLocaleString()} • {allocation.month} {allocation.year}
                        </p>
                        <div className="grid grid-cols-3 gap-4 text-sm text-gray-500">
                          <div>Performance: {allocation.performanceScore}%</div>
                          <div>Ambassadors: {allocation.ambassadorCount}</div>
                          <div>Tasks: {allocation.tasksCompleted}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(allocation.status)} flex items-center space-x-1`}>
                          {getStatusIcon(allocation.status)}
                          <span className="capitalize">{allocation.status}</span>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          {allocation.processedDate && new Date(allocation.processedDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Chapter Performance & Recommendations</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chapterPerformance.map((chapter) => (
                  <div key={chapter.chapterId} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">{chapter.chapterName}</h4>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Performance Score</p>
                        <p className="text-2xl font-bold text-green-600">{chapter.performanceScore}%</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ambassadors:</span>
                        <span className="font-medium">{chapter.ambassadorCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tasks Completed:</span>
                        <span className="font-medium">{chapter.tasksCompleted}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Average Rating:</span>
                        <span className="font-medium">{chapter.averageRating}/5.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Engagement:</span>
                        <span className="font-medium">{chapter.engagementScore}%</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Recommended:</span>
                        <span className="text-lg font-bold text-blue-600">
                          ${chapter.recommendedAllocation.toLocaleString()}
                        </span>
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

export default MonthlyAllocations;
