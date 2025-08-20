import React, { useState } from 'react';
import {
  Search, Filter, Calendar, Download, Eye,
  DollarSign, ArrowRight, ArrowLeft, CheckCircle,
  Clock, AlertTriangle, Users, Building2, Crown,
  FileText, TrendingUp, BarChart3, Shield,
  ExternalLink, RefreshCw, Archive, Star
} from 'lucide-react';

interface AuditTransaction {
  id: string;
  timestamp: string;
  type: 'allocation' | 'distribution' | 'reward' | 'request' | 'refund';
  fromEntity: {
    id: string;
    name: string;
    type: 'organization' | 'chapter' | 'ambassador';
  };
  toEntity: {
    id: string;
    name: string;
    type: 'organization' | 'chapter' | 'ambassador';
  };
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  category: string;
  description: string;
  reference: string;
}

const AuditTrail: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'transactions' | 'flow' | 'analytics'>('transactions');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'allocation' | 'distribution' | 'reward'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');

  // Mock data
  const auditTransactions: AuditTransaction[] = [
    {
      id: 'txn-001',
      timestamp: '2024-01-22T14:30:00Z',
      type: 'allocation',
      fromEntity: { id: 'org-1', name: 'Acme Corp', type: 'organization' },
      toEntity: { id: 'chapter-usa', name: 'USA Chapter', type: 'chapter' },
      amount: 10000,
      status: 'completed',
      category: 'Monthly Allocation',
      description: 'Automated monthly chapter funding allocation',
      reference: 'AUTO-ALLOC-202401'
    },
    {
      id: 'txn-002',
      timestamp: '2024-01-22T13:15:00Z',
      type: 'distribution',
      fromEntity: { id: 'chapter-usa', name: 'USA Chapter', type: 'chapter' },
      toEntity: { id: 'amb-001', name: 'Sarah Johnson', type: 'ambassador' },
      amount: 150,
      status: 'completed',
      category: 'Task Reward',
      description: 'Social media campaign completion reward',
      reference: 'DIST-20240122-001'
    },
    {
      id: 'txn-003',
      timestamp: '2024-01-22T12:45:00Z',
      type: 'request',
      fromEntity: { id: 'amb-002', name: 'Mike Chen', type: 'ambassador' },
      toEntity: { id: 'chapter-usa', name: 'USA Chapter', type: 'chapter' },
      amount: 200,
      status: 'pending',
      category: 'Event Funding',
      description: 'Community meetup organization funding',
      reference: 'REQ-20240122-003'
    }
  ];

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'organization':
        return <Building2 className="h-4 w-4" />;
      case 'chapter':
        return <Crown className="h-4 w-4" />;
      case 'ambassador':
        return <Users className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
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
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredTransactions = auditTransactions.filter(txn => {
    const matchesSearch = txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         txn.fromEntity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         txn.toEntity.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || txn.type === filterType;
    const matchesStatus = filterStatus === 'all' || txn.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Trail</h1>
          <p className="text-gray-600 mt-1">Complete transaction visibility and funding flow auditing</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">1,247</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Volume</p>
              <p className="text-2xl font-bold text-green-600 mt-1">$185,600</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">98.5%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Processing</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">2.3s</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 py-4">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'transactions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Transaction Log ({filteredTransactions.length})
            </button>
            <button
              onClick={() => setActiveTab('flow')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'flow'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Fund Flow Visualization
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Analytics & Reports
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'transactions' && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                <div className="flex-1 relative">
                  <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                >
                  <option value="all">All Types</option>
                  <option value="allocation">Allocations</option>
                  <option value="distribution">Distributions</option>
                  <option value="reward">Rewards</option>
                </select>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              {/* Transaction List */}
              <div className="space-y-3">
                {filteredTransactions.map((txn) => (
                  <div key={txn.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-gray-900">{formatCurrency(txn.amount)}</h4>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(txn.status)} flex items-center space-x-1`}>
                            {getStatusIcon(txn.status)}
                            <span className="capitalize">{txn.status}</span>
                          </div>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full capitalize">
                            {txn.type}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 mb-2">{txn.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            {getEntityIcon(txn.fromEntity.type)}
                            <span>{txn.fromEntity.name}</span>
                          </div>
                          <ArrowRight className="h-3 w-3" />
                          <div className="flex items-center space-x-1">
                            {getEntityIcon(txn.toEntity.type)}
                            <span>{txn.toEntity.name}</span>
                          </div>
                          <span>•</span>
                          <span>{formatDateTime(txn.timestamp)}</span>
                          <span>•</span>
                          <span>{txn.reference}</span>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'flow' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Fund Flow Visualization</h3>
              
              {/* Visual Fund Flow */}
              <div className="bg-gray-50 rounded-xl p-8">
                <div className="flex items-center justify-between space-x-8">
                  {/* Organization */}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                      <Building2 className="h-8 w-8 text-purple-600" />
                    </div>
                    <h4 className="font-medium text-gray-900">Organization</h4>
                    <p className="text-2xl font-bold text-purple-600 mt-1">$185.6K</p>
                    <p className="text-sm text-gray-500">Total Volume</p>
                  </div>

                  <ArrowRight className="h-8 w-8 text-gray-400" />

                  {/* Chapters */}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                      <Crown className="h-8 w-8 text-yellow-600" />
                    </div>
                    <h4 className="font-medium text-gray-900">Chapters</h4>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">$142.3K</p>
                    <p className="text-sm text-gray-500">Distributed</p>
                  </div>

                  <ArrowRight className="h-8 w-8 text-gray-400" />

                  {/* Ambassadors */}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-gray-900">Ambassadors</h4>
                    <p className="text-2xl font-bold text-blue-600 mt-1">$48.2K</p>
                    <p className="text-sm text-gray-500">Received</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Transaction Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Transaction Volume</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>This Month</span>
                      <span className="font-medium">$42,350</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last Month</span>
                      <span className="font-medium">$38,920</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Growth</span>
                      <span className="font-medium text-green-600">+8.8%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Processing Stats</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Success Rate</span>
                      <span className="font-medium text-green-600">98.5%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Avg Time</span>
                      <span className="font-medium">2.3s</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Failed</span>
                      <span className="font-medium text-red-600">1.5%</span>
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

export default AuditTrail;
