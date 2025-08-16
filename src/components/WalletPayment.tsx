import React, { useState } from 'react';
import { 
  Wallet, 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Download, 
  Search, 
  Plus, 
  Check, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  EyeOff,
  Banknote,
  Building2,
  Smartphone,
  Globe,
  Shield,
  Info
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'earning' | 'payout' | 'bonus' | 'penalty';
  amount: number;
  description: string;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
  taskId?: string;
  payoutMethod?: string;
}

interface PayoutMethod {
  id: string;
  type: 'paypal' | 'bank' | 'crypto' | 'mobile_money';
  name: string;
  details: string;
  isVerified: boolean;
  isDefault: boolean;
}

const WalletPayment: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'payouts' | 'accounts'>('overview');
  const [showBalance, setShowBalance] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'earning' | 'payout' | 'bonus' | 'penalty'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [selectedPayoutMethod, setSelectedPayoutMethod] = useState<string>('');

  // Mock data
  const walletData = {
    availableBalance: 1247.50,
    pendingEarnings: 325.00,
    totalEarnings: 3580.75,
    totalPayouts: 2333.25,
    thisMonthEarnings: 485.50,
    successfulPayouts: 8,
    averageTaskReward: 52.30
  };

  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'earning',
      amount: 50.00,
      description: 'Instagram Reel - New Feature Launch',
      date: new Date('2024-01-10'),
      status: 'completed',
      taskId: 'task1'
    },
    {
      id: '2',
      type: 'payout',
      amount: -200.00,
      description: 'PayPal Payout',
      date: new Date('2024-01-08'),
      status: 'completed',
      payoutMethod: 'PayPal'
    },
    {
      id: '3',
      type: 'bonus',
      amount: 25.00,
      description: 'Monthly Performance Bonus',
      date: new Date('2024-01-05'),
      status: 'completed'
    },
    {
      id: '4',
      type: 'earning',
      amount: 75.00,
      description: 'LinkedIn Article - Financial Literacy',
      date: new Date('2024-01-03'),
      status: 'pending',
      taskId: 'task2'
    },
    {
      id: '5',
      type: 'earning',
      amount: 40.00,
      description: 'TikTok Unboxing Video',
      date: new Date('2024-01-01'),
      status: 'completed',
      taskId: 'task3'
    }
  ];

  const payoutMethods: PayoutMethod[] = [
    {
      id: '1',
      type: 'paypal',
      name: 'PayPal',
      details: 'user@email.com',
      isVerified: true,
      isDefault: true
    },
    {
      id: '2',
      type: 'bank',
      name: 'Bank Account',
      details: '****1234',
      isVerified: true,
      isDefault: false
    },
    {
      id: '3',
      type: 'crypto',
      name: 'Bitcoin Wallet',
      details: '1A1z...4x9c',
      isVerified: false,
      isDefault: false
    }
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesSearch = searchQuery === '' || 
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handlePayoutRequest = () => {
    if (!payoutAmount || !selectedPayoutMethod) return;
    
    const amount = parseFloat(payoutAmount);
    if (amount > walletData.availableBalance) {
      alert('Insufficient balance for this payout amount.');
      return;
    }
    
    alert(`Payout request of $${amount} submitted successfully!`);
    setShowPayoutModal(false);
    setPayoutAmount('');
    setSelectedPayoutMethod('');
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earning': return <ArrowDownLeft className="w-4 h-4 text-green-600" />;
      case 'payout': return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      case 'bonus': return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'penalty': return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      default: return <DollarSign className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'failed': case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'paypal': return <Globe className="w-5 h-5" />;
      case 'bank': return <Building2 className="w-5 h-5" />;
      case 'crypto': return <Banknote className="w-5 h-5" />;
      case 'mobile_money': return <Smartphone className="w-5 h-5" />;
      default: return <CreditCard className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payments</h1>
        <p className="text-gray-600">Manage your earnings, payouts, and payment accounts</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: Wallet },
            { id: 'transactions', name: 'Transactions', icon: DollarSign },
            { id: 'payouts', name: 'Payouts', icon: ArrowUpRight },
            { id: 'accounts', name: 'Accounts', icon: CreditCard }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'transactions' | 'payouts' | 'accounts')}
              className={`
                flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Available Balance</h3>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {showBalance ? `$${walletData.availableBalance.toFixed(2)}` : '••••••'}
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Pending Earnings</h3>
              <p className="text-2xl font-bold text-yellow-600">
                ${walletData.pendingEarnings.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Under review</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Earnings</h3>
              <p className="text-2xl font-bold text-green-600">
                ${walletData.totalEarnings.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">This Month</h3>
              <p className="text-2xl font-bold text-blue-600">
                ${walletData.thisMonthEarnings.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">+12% from last month</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{walletData.successfulPayouts}</p>
                  <p className="text-sm text-gray-600">Successful Payouts</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">${walletData.averageTaskReward.toFixed(0)}</p>
                  <p className="text-sm text-gray-600">Avg. Task Reward</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Wallet className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">${walletData.totalPayouts.toFixed(0)}</p>
                  <p className="text-sm text-gray-600">Total Payouts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    {getTransactionIcon(transaction.type)}
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">
                        {transaction.date.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                    <div className={`
                      px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}
                    `}>
                      {transaction.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search transactions..."
                />
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'earning' | 'payout' | 'bonus' | 'penalty')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="earning">Earnings</option>
                <option value="payout">Payouts</option>
                <option value="bonus">Bonuses</option>
                <option value="penalty">Penalties</option>
              </select>
              
              <button className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 font-medium">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <p className="text-sm text-gray-500">
                            {transaction.date.toLocaleDateString()}
                          </p>
                          {transaction.taskId && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Task #{transaction.taskId}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                      <div className={`
                        inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}
                      `}>
                        {transaction.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payouts Tab */}
      {activeTab === 'payouts' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Payouts</h2>
              <p className="text-sm text-gray-600">Request payouts and view their status</p>
            </div>
            <button
              onClick={() => setShowPayoutModal(true)}
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Request Payout</span>
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
            </div>
            
            <div className="p-4">
              <div className="flex flex-wrap mb-4 gap-2">
                <button 
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1 rounded-full text-sm ${filterType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setFilterType('earning')}
                  className={`px-3 py-1 rounded-full text-sm ${filterType === 'earning' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Earnings
                </button>
                <button 
                  onClick={() => setFilterType('payout')}
                  className={`px-3 py-1 rounded-full text-sm ${filterType === 'payout' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Payouts
                </button>
                <button 
                  onClick={() => setFilterType('bonus')}
                  className={`px-3 py-1 rounded-full text-sm ${filterType === 'bonus' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Bonuses
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTransactions.map(transaction => (
                      <tr key={transaction.id}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className="text-sm text-gray-900">{transaction.date.toLocaleDateString()}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                              {getTransactionIcon(transaction.type)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                              <p className="text-xs text-gray-500">
                                {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className={`text-sm font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)} USD
                          </p>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Payout History</h3>
            </div>
            
            <div className="p-6">
              {transactions
                .filter(t => t.type === 'payout')
                .length === 0 ? (
                <div className="text-center py-8">
                  <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No payouts yet</h3>
                  <p className="text-gray-600 max-w-sm mx-auto">
                    You haven't requested any payouts yet. Your earned rewards will appear here once you do.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {transactions
                        .filter(t => t.type === 'payout')
                        .map(payout => (
                          <tr key={payout.id}>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <p className="text-sm text-gray-900">{payout.date.toLocaleDateString()}</p>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                {payout.payoutMethod === 'PayPal' ? (
                                  <Globe className="h-4 w-4 text-blue-500 mr-2" />
                                ) : (
                                  <Building2 className="h-4 w-4 text-gray-500 mr-2" />
                                )}
                                <p className="text-sm text-gray-900">{payout.payoutMethod || 'Standard'}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <p className="text-sm text-gray-900">
                                ${Math.abs(payout.amount).toFixed(2)}
                              </p>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payout.status)}`}>
                                {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Accounts Tab */}
      {activeTab === 'accounts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Accounts</h3>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Account
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {payoutMethods.map((method) => (
              <div key={method.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getMethodIcon(method.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{method.name}</h4>
                      <p className="text-sm text-gray-600">{method.details}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {method.isDefault && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Default
                      </span>
                    )}
                    {method.isVerified ? (
                      <div className="flex items-center text-green-600">
                        <Shield className="w-4 h-4 mr-1" />
                        <span className="text-xs">Verified</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-yellow-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        <span className="text-xs">Unverified</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    Edit
                  </button>
                  {!method.isDefault && (
                    <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Set Default
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payout Request Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Payout</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (USD)
                </label>
                <input
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  min="10"
                  max={walletData.availableBalance}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Available: ${walletData.availableBalance.toFixed(2)} • Minimum: $10.00
                </p>
              </div>
              
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Account
                </label>
                <select
                  value={selectedPayoutMethod}
                  onChange={(e) => setSelectedPayoutMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a method</option>
                  {payoutMethods.filter(m => m.isVerified).map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.name} ({method.details})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start">
                  <Info className="w-4 h-4 text-blue-600 mr-2 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Processing Times:</p>
                    <ul className="mt-1 space-y-1 text-xs">
                      <li>• PayPal: 1-2 business days</li>
                      <li>• Bank Transfer: 3-5 business days</li>
                      <li>• Crypto: 1-24 hours</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowPayoutModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePayoutRequest}
                disabled={!payoutAmount || !selectedPayoutMethod}
                className={`
                  flex-1 px-4 py-2 rounded-lg font-medium
                  ${(!payoutAmount || !selectedPayoutMethod)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                  }
                `}
              >
                Request Payout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPayment;
