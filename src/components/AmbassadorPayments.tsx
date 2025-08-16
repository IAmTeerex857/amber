import React, { useState } from 'react';
import {
  CreditCard, Wallet, Gift, Coins, Plus, Eye, Settings, 
  TrendingUp, CheckCircle, Clock, AlertCircle, Star,
  Copy, ExternalLink, RefreshCw, Download, Search,
  Filter, MoreHorizontal, ArrowUpRight, ArrowDownLeft
} from 'lucide-react';

// Tab types for the unified payments interface
type PaymentTab = 'overview' | 'wallets' | 'points' | 'rewards' | 'transactions';

// Interface definitions
interface WalletConnection {
  id: string;
  name: string;
  type: 'stellar' | 'ethereum' | 'solana';
  address: string;
  balance: string;
  isPrimary: boolean;
  isVerified: boolean;
  connectedDate: string;
}

interface PointsBalance {
  current: number;
  lifetime: number;
  redeemed: number;
  conversionRate: number; // points to USD
}

interface RewardItem {
  id: string;
  name: string;
  description: string;
  category: string;
  pointsRequired: number;
  value: string;
  availability: 'available' | 'limited' | 'out_of_stock';
  rating: number;
  provider: string;
  validityDays: number;
  image?: string;
}

interface Transaction {
  id: string;
  type: 'earning' | 'payout' | 'redemption' | 'conversion';
  description: string;
  amount: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  points?: number;
}

const AmbassadorPayments: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PaymentTab>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: CreditCard },
    { id: 'wallets', name: 'Connected Wallets', icon: Wallet },
    { id: 'points', name: 'Points System', icon: Coins },
    { id: 'rewards', name: 'Reward Store', icon: Gift },
    { id: 'transactions', name: 'Transactions', icon: TrendingUp }
  ];

  // Mock data
  const paymentOverview = {
    availableBalance: '$1247.50',
    pendingEarnings: '$325.00',
    totalEarnings: '$3580.75',
    thisMonth: '$485.50',
    successfulPayouts: 8,
    avgTaskReward: '$52',
    totalPayouts: '$2333'
  };

  const pointsBalance: PointsBalance = {
    current: 2450,
    lifetime: 15750,
    redeemed: 13300,
    conversionRate: 100 // 100 points = $1 USD
  };

  const connectedWallets: WalletConnection[] = [
    {
      id: '1',
      name: 'My Main Wallet',
      type: 'stellar',
      address: 'GCKFBE...X4YK',
      balance: '1250.5 XLM',
      isPrimary: true,
      isVerified: true,
      connectedDate: '10/01/2024'
    },
    {
      id: '2',
      name: 'Ethereum Wallet',
      type: 'ethereum',
      address: '0x742d...0000',
      balance: '0.85 ETH',
      isPrimary: false,
      isVerified: false,
      connectedDate: '15/01/2024'
    }
  ];

  const rewardItems: RewardItem[] = [
    {
      id: '1',
      name: 'Amazon Gift Card',
      description: '$25 Amazon gift card for shopping',
      category: 'Gift Cards',
      pointsRequired: 2500,
      value: '$25',
      availability: 'available',
      rating: 4.8,
      provider: 'Amazon',
      validityDays: 365
    },
    {
      id: '2',
      name: 'Stellar T-Shirt',
      description: 'Official Stellar branded merchandise',
      category: 'Merchandise',
      pointsRequired: 1500,
      value: '$20',
      availability: 'limited',
      rating: 4.6,
      provider: 'Stellar',
      validityDays: 0
    },
    {
      id: '3',
      name: 'Spotify Premium (3 months)',
      description: 'Three months of Spotify Premium subscription',
      category: 'Subscriptions',
      pointsRequired: 3000,
      value: '$30',
      availability: 'available',
      rating: 4.9,
      provider: 'Spotify',
      validityDays: 30
    },
    {
      id: '4',
      name: 'Local Coffee Shop Voucher',
      description: '$10 voucher for participating coffee shops',
      category: 'Vouchers',
      pointsRequired: 1000,
      value: '$10',
      availability: 'available',
      rating: 4.3,
      provider: 'Local Partners',
      validityDays: 90
    }
  ];

  const recentTransactions: Transaction[] = [
    {
      id: '1',
      type: 'earning',
      description: 'Instagram Reel - New Feature Launch',
      amount: '+$50.00',
      status: 'completed',
      date: '10/01/2024',
      points: 5000
    },
    {
      id: '2',
      type: 'payout',
      description: 'PayPal Payout',
      amount: '-$200.00',
      status: 'completed',
      date: '08/01/2024'
    },
    {
      id: '3',
      type: 'redemption',
      description: 'Stellar T-Shirt Redeemed',
      amount: '1,500 points',
      status: 'completed',
      date: '05/01/2024',
      points: -1500
    },
    {
      id: '4',
      type: 'earning',
      description: 'LinkedIn Article - Financial Literacy',
      amount: '+$75.00',
      status: 'pending',
      date: '03/01/2024',
      points: 7500
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Eye className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-xs text-gray-500">Available</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{paymentOverview.availableBalance}</h3>
          <p className="text-sm text-gray-600">Available Balance</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <span className="text-xs text-gray-500">Under review</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 text-orange-600">{paymentOverview.pendingEarnings}</h3>
          <p className="text-sm text-gray-600">Pending Earnings</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-xs text-gray-500">All time</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 text-green-600">{paymentOverview.totalEarnings}</h3>
          <p className="text-sm text-gray-600">Total Earnings</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Coins className="h-5 w-5 text-purple-600" />
            </div>
            <span className="text-xs text-green-600">+12% from last month</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 text-blue-600">{paymentOverview.thisMonth}</h3>
          <p className="text-sm text-gray-600">This Month</p>
        </div>
      </div>

      {/* Points Balance */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Current Points Balance</h3>
          <Coins className="h-6 w-6" />
        </div>
        <div className="text-3xl font-bold mb-2">{pointsBalance.current.toLocaleString()} points</div>
        <div className="flex items-center space-x-4 text-sm opacity-90">
          <span>Lifetime: {pointsBalance.lifetime.toLocaleString()}</span>
          <span>•</span>
          <span>Redeemed: {pointsBalance.redeemed.toLocaleString()}</span>
        </div>
        <div className="mt-4 flex space-x-3">
          <button className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
            Convert Points
          </button>
          <button className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
            View Rewards
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{paymentOverview.successfulPayouts}</div>
          <div className="text-sm text-gray-600">Successful Payouts</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-3">
            <TrendingUp className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{paymentOverview.avgTaskReward}</div>
          <div className="text-sm text-gray-600">Avg. Task Reward</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-3">
            <CreditCard className="h-6 w-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{paymentOverview.totalPayouts}</div>
          <div className="text-sm text-gray-600">Total Payouts</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <button className="text-blue-600 text-sm font-medium hover:text-blue-700">View All</button>
        </div>
        <div className="space-y-4">
          {recentTransactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  transaction.type === 'earning' ? 'bg-green-100' :
                  transaction.type === 'payout' ? 'bg-red-100' :
                  'bg-blue-100'
                }`}>
                  {transaction.type === 'earning' ? (
                    <ArrowDownLeft className="h-4 w-4 text-green-600" />
                  ) : transaction.type === 'payout' ? (
                    <ArrowUpRight className="h-4 w-4 text-red-600" />
                  ) : (
                    <Gift className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{transaction.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'earning' ? 'text-green-600' :
                  transaction.type === 'payout' ? 'text-red-600' :
                  'text-blue-600'
                }`}>
                  {transaction.amount}
                </p>
                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                  transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                  transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWallets = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Connected Wallets</h3>
            <p className="text-gray-600 mt-1">Manage your crypto wallets for receiving rewards</p>
          </div>
          <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Connect Wallet</span>
          </button>
        </div>

        <div className="space-y-4">
          {connectedWallets.map((wallet) => (
            <div key={wallet.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Wallet className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-900">{wallet.name}</h4>
                      {wallet.isPrimary && (
                        <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
                          Primary
                        </span>
                      )}
                      {wallet.isVerified ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-600 font-mono">{wallet.address}</span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">Balance: {wallet.balance} • Connected {wallet.connectedDate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Settings className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {!wallet.isVerified && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-yellow-800">Wallet verification required</span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">Complete verification to receive payments to this wallet.</p>
                  <button className="mt-2 text-sm font-medium text-yellow-800 hover:text-yellow-900">
                    Verify now →
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRewards = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Rewards Store</h3>
            <p className="text-gray-600 mt-1">Redeem your points for exciting rewards and benefits</p>
            <div className="mt-2 flex items-center space-x-2 text-sm">
              <span className="text-gray-500">Your Balance:</span>
              <span className="font-semibold text-blue-600">{pointsBalance.current.toLocaleString()} points</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search rewards..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-2 border border-gray-300 rounded-lg text-gray-400 hover:text-gray-600">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rewardItems.map((reward) => (
            <div key={reward.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  reward.availability === 'available' ? 'bg-green-100 text-green-800' :
                  reward.availability === 'limited' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {reward.availability}
                </span>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Star className="h-3 w-3 fill-current text-yellow-400" />
                  <span>{reward.rating}</span>
                </div>
              </div>
              
              <div className="h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                <Gift className="h-8 w-8 text-gray-400" />
              </div>
              
              <h4 className="font-semibold text-gray-900 mb-2">{reward.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
              
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-gray-500">{reward.provider}</span>
                <span className="text-green-600 font-medium">{reward.value} value</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-semibold text-blue-600">{reward.pointsRequired.toLocaleString()} points</span>
                <button
                  className={`px-3 py-1 text-sm font-medium rounded-lg ${
                    pointsBalance.current >= reward.pointsRequired
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={pointsBalance.current < reward.pointsRequired || reward.availability === 'out_of_stock'}
                >
                  {pointsBalance.current >= reward.pointsRequired ? 'Redeem Now' : 'Insufficient Points'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'wallets':
        return renderWallets();
      case 'rewards':
        return renderRewards();
      case 'points':
      case 'transactions':
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="text-gray-400 mb-4">
              {activeTab === 'points' ? <Coins className="h-16 w-16 mx-auto" /> : <TrendingUp className="h-16 w-16 mx-auto" />}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'points' ? 'Points System' : 'Transaction History'} Coming Soon
            </h3>
            <p className="text-gray-500">This section is being integrated into the unified payments interface.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
            <p className="text-gray-600 mt-1">Manage your wallets, points, and rewards in one place</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
            <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as PaymentTab)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AmbassadorPayments;
