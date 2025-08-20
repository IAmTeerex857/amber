import React, { useState } from 'react';
import {
  DollarSign, ArrowRight, TrendingUp, TrendingDown,
  Building2, Crown, Users, ChevronDown, ChevronUp,
  BarChart3, PieChart, Activity, Target, Zap,
  AlertCircle, CheckCircle, Clock, RefreshCw
} from 'lucide-react';

interface FundingNode {
  id: string;
  name: string;
  type: 'organization' | 'chapter' | 'ambassador';
  balance: number;
  totalIn: number;
  totalOut: number;
  transactions: number;
  status: 'active' | 'pending' | 'inactive';
  children?: FundingNode[];
}

interface FlowMetrics {
  totalVolume: number;
  monthlyGrowth: number;
  activeChannels: number;
  efficiency: number;
}

const FundingFlowVisualization: React.FC = () => {
  const [viewMode, setViewMode] = useState<'hierarchy' | 'flow' | 'analytics'>('hierarchy');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('30d');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['org-1']));

  // Mock funding hierarchy data
  const fundingHierarchy: FundingNode = {
    id: 'org-1',
    name: 'Acme Corporation',
    type: 'organization',
    balance: 487500,
    totalIn: 1200000,
    totalOut: 712500,
    transactions: 156,
    status: 'active',
    children: [
      {
        id: 'chapter-usa',
        name: 'USA Chapter',
        type: 'chapter',
        balance: 28500,
        totalIn: 120000,
        totalOut: 91500,
        transactions: 89,
        status: 'active',
        children: [
          {
            id: 'amb-001',
            name: 'Sarah Johnson',
            type: 'ambassador',
            balance: 1250,
            totalIn: 8500,
            totalOut: 7250,
            transactions: 24,
            status: 'active'
          },
          {
            id: 'amb-002',
            name: 'Mike Chen',
            type: 'ambassador',
            balance: 980,
            totalIn: 6200,
            totalOut: 5220,
            transactions: 18,
            status: 'active'
          },
          {
            id: 'amb-003',
            name: 'Lisa Park',
            type: 'ambassador',
            balance: 2100,
            totalIn: 12500,
            totalOut: 10400,
            transactions: 31,
            status: 'active'
          }
        ]
      },
      {
        id: 'chapter-uk',
        name: 'UK Chapter',
        type: 'chapter',
        balance: 22800,
        totalIn: 96000,
        totalOut: 73200,
        transactions: 67,
        status: 'active',
        children: [
          {
            id: 'amb-004',
            name: 'Emma Wilson',
            type: 'ambassador',
            balance: 1500,
            totalIn: 7800,
            totalOut: 6300,
            transactions: 19,
            status: 'active'
          },
          {
            id: 'amb-005',
            name: 'James Brown',
            type: 'ambassador',
            balance: 750,
            totalIn: 4200,
            totalOut: 3450,
            transactions: 12,
            status: 'pending'
          }
        ]
      },
      {
        id: 'chapter-canada',
        name: 'Canada Chapter',
        type: 'chapter',
        balance: 31200,
        totalIn: 108000,
        totalOut: 76800,
        transactions: 78,
        status: 'active',
        children: [
          {
            id: 'amb-006',
            name: 'Alex Rodriguez',
            type: 'ambassador',
            balance: 1800,
            totalIn: 9500,
            totalOut: 7700,
            transactions: 22,
            status: 'active'
          }
        ]
      }
    ]
  };

  const flowMetrics: FlowMetrics = {
    totalVolume: 1200000,
    monthlyGrowth: 12.5,
    activeChannels: 8,
    efficiency: 94.2
  };

  const getEntityIcon = (type: string, size: string = 'h-5 w-5') => {
    switch (type) {
      case 'organization':
        return <Building2 className={size} />;
      case 'chapter':
        return <Crown className={size} />;
      case 'ambassador':
        return <Users className={size} />;
      default:
        return <Users className={size} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'inactive':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: amount >= 1000000 ? 'compact' : 'standard'
    }).format(amount);
  };

  const toggleNodeExpansion = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderFundingNode = (node: FundingNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="space-y-2">
        <div className={`flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 ${level > 0 ? 'ml-8' : ''}`}>
          <div className="flex items-center space-x-4 flex-1">
            <div className="flex items-center space-x-2">
              {hasChildren && (
                <button
                  onClick={() => toggleNodeExpansion(node.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              )}
              <div className={`p-2 rounded-lg ${
                node.type === 'organization' ? 'bg-purple-100' :
                node.type === 'chapter' ? 'bg-yellow-100' : 'bg-blue-100'
              }`}>
                {getEntityIcon(node.type)}
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-1">
                <h4 className="font-medium text-gray-900">{node.name}</h4>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(node.status)} flex items-center space-x-1`}>
                  {getStatusIcon(node.status)}
                  <span className="capitalize">{node.status}</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{node.transactions} transactions</span>
                <span>•</span>
                <span>Balance: {formatCurrency(node.balance)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-sm">
            <div className="text-center">
              <p className="text-gray-500">In</p>
              <p className="font-medium text-green-600">{formatCurrency(node.totalIn)}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500">Out</p>
              <p className="font-medium text-red-600">{formatCurrency(node.totalOut)}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500">Net</p>
              <p className={`font-medium ${(node.totalIn - node.totalOut) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(node.totalIn - node.totalOut)}
              </p>
            </div>
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div className="space-y-2">
            {node.children!.map(child => renderFundingNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Funding Flow Visualization</h2>
          <p className="text-gray-600 mt-1">Real-time view of funding distribution across your organization</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Volume</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{formatCurrency(flowMetrics.totalVolume)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center space-x-1 text-sm text-green-600 mt-2">
            <TrendingUp className="h-3 w-3" />
            <span>+{flowMetrics.monthlyGrowth}% this month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Channels</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{flowMetrics.activeChannels}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500 mt-2">
            <span>Org → Chapters → Ambassadors</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Flow Efficiency</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{flowMetrics.efficiency}%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center space-x-1 text-sm text-green-600 mt-2">
            <TrendingUp className="h-3 w-3" />
            <span>+2.1% from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Processing Time</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">2.3s</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Target className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center space-x-1 text-sm text-green-600 mt-2">
            <TrendingDown className="h-3 w-3" />
            <span>-0.4s improvement</span>
          </div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 py-4">
            <button
              onClick={() => setViewMode('hierarchy')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                viewMode === 'hierarchy'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Funding Hierarchy
            </button>
            <button
              onClick={() => setViewMode('flow')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                viewMode === 'flow'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Flow Diagram
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                viewMode === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Flow Analytics
            </button>
          </nav>
        </div>

        <div className="p-6">
          {viewMode === 'hierarchy' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Organizational Funding Structure</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>Click to expand/collapse branches</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {renderFundingNode(fundingHierarchy)}
              </div>
            </div>
          )}

          {viewMode === 'flow' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Visual Fund Flow</h3>
              
              {/* Flow Diagram */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8">
                <div className="flex items-center justify-center space-x-12">
                  {/* Organization Node */}
                  <div className="text-center">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto border-4 border-purple-200">
                      <Building2 className="h-10 w-10 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Organization</h4>
                    <p className="text-sm text-gray-600 mt-1">Acme Corporation</p>
                    <p className="text-lg font-bold text-purple-600 mt-2">{formatCurrency(fundingHierarchy.balance)}</p>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex flex-col items-center">
                    <ArrowRight className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Allocates</span>
                  </div>

                  {/* Chapters Level */}
                  <div className="text-center">
                    <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4 mx-auto border-4 border-yellow-200">
                      <Crown className="h-10 w-10 text-yellow-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Chapters</h4>
                    <p className="text-sm text-gray-600 mt-1">{fundingHierarchy.children?.length} Active</p>
                    <p className="text-lg font-bold text-yellow-600 mt-2">
                      {formatCurrency(fundingHierarchy.children?.reduce((sum, chapter) => sum + chapter.balance, 0) || 0)}
                    </p>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex flex-col items-center">
                    <ArrowRight className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Distributes</span>
                  </div>

                  {/* Ambassadors Level */}
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto border-4 border-blue-200">
                      <Users className="h-10 w-10 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Ambassadors</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {fundingHierarchy.children?.reduce((sum, chapter) => sum + (chapter.children?.length || 0), 0)} Active
                    </p>
                    <p className="text-lg font-bold text-blue-600 mt-2">
                      {formatCurrency(
                        fundingHierarchy.children?.reduce(
                          (sum, chapter) => sum + (chapter.children?.reduce((chapterSum, amb) => chapterSum + amb.balance, 0) || 0), 
                          0
                        ) || 0
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chapter Breakdown */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Chapter Distribution Breakdown</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {fundingHierarchy.children?.map((chapter) => (
                    <div key={chapter.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Crown className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">{chapter.name}</h5>
                          <p className="text-sm text-gray-500">{chapter.children?.length || 0} ambassadors</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Balance:</span>
                          <span className="font-medium">{formatCurrency(chapter.balance)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Distributed:</span>
                          <span className="font-medium text-green-600">{formatCurrency(chapter.totalOut)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Utilization:</span>
                          <span className="font-medium">
                            {((chapter.totalOut / chapter.totalIn) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {viewMode === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Flow Performance Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Distribution Efficiency</h4>
                    <BarChart3 className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Org → Chapters:</span>
                      <span className="font-medium text-green-600">96.2%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Chapters → Ambassadors:</span>
                      <span className="font-medium text-green-600">92.8%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Overall Efficiency:</span>
                      <span className="font-medium text-blue-600">94.2%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Flow Velocity</h4>
                    <PieChart className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Average Processing:</span>
                      <span className="font-medium">2.3s</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Peak Processing:</span>
                      <span className="font-medium">8.7s</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Success Rate:</span>
                      <span className="font-medium text-green-600">98.5%</span>
                    </div>
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

export default FundingFlowVisualization;
