import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Coins,
  ArrowUpDown,
  Settings,
  TrendingUp,
  Calendar,
  User,
  Globe,
  Edit3,
  Save,
  X,
  Plus,
  Minus,
  DollarSign,
  Bitcoin,
  Gift,
  Target,
  Clock,
  CheckCircle
} from 'lucide-react';

interface PointsTransaction {
  id: string;
  type: 'earned' | 'redeemed' | 'bonus' | 'adjustment';
  amount: number;
  description: string;
  taskId?: string;
  taskName?: string;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
}

interface ConversionRate {
  id: string;
  fromType: 'points';
  toType: 'usd' | 'xlm' | 'gift_card';
  rate: number;
  minAmount: number;
  maxAmount?: number;
  isActive: boolean;
  lastUpdated: string;
}

interface PointsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  category: 'monthly' | 'quarterly' | 'annual' | 'custom';
  status: 'active' | 'completed' | 'paused';
}

const HybridPointsSystem: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'conversion' | 'goals'>('overview');
  const [isEditingRates, setIsEditingRates] = useState(false);
  
  // Mock user points data
  const [userPoints] = useState({
    current: 2450,
    totalEarned: 15750,
    totalRedeemed: 13300,
    lifetimeBalance: 15750
  });

  // Mock transactions
  const [transactions] = useState<PointsTransaction[]>([
    {
      id: '1',
      type: 'earned',
      amount: 500,
      description: 'Social Media Campaign Completion',
      taskId: 'T001',
      taskName: 'Instagram Post Campaign',
      date: '2024-01-15T10:30:00Z',
      status: 'completed'
    },
    {
      id: '2',
      type: 'redeemed',
      amount: -2500,
      description: 'Amazon Gift Card Redemption',
      date: '2024-01-14T15:45:00Z',
      status: 'completed'
    },
    {
      id: '3',
      type: 'bonus',
      amount: 200,
      description: 'Weekly Completion Bonus',
      date: '2024-01-13T09:00:00Z',
      status: 'completed'
    },
    {
      id: '4',
      type: 'earned',
      amount: 300,
      description: 'Event Attendance',
      taskId: 'T002',
      taskName: 'Virtual Conference Participation',
      date: '2024-01-12T14:20:00Z',
      status: 'completed'
    }
  ]);

  // Mock conversion rates (admin view)
  const [conversionRates, setConversionRates] = useState<ConversionRate[]>([
    {
      id: '1',
      fromType: 'points',
      toType: 'usd',
      rate: 100, // 100 points = $1
      minAmount: 1000,
      maxAmount: 50000,
      isActive: true,
      lastUpdated: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      fromType: 'points',
      toType: 'xlm',
      rate: 25, // 25 points = 1 XLM
      minAmount: 500,
      maxAmount: 25000,
      isActive: true,
      lastUpdated: '2024-01-15T10:00:00Z'
    },
    {
      id: '3',
      fromType: 'points',
      toType: 'gift_card',
      rate: 100, // 100 points = $1 gift card value
      minAmount: 1000,
      isActive: true,
      lastUpdated: '2024-01-15T10:00:00Z'
    }
  ]);

  // Mock goals
  const [pointsGoals] = useState<PointsGoal[]>([
    {
      id: '1',
      name: 'Monthly Target',
      targetAmount: 3000,
      currentAmount: 2450,
      deadline: '2024-01-31T23:59:59Z',
      category: 'monthly',
      status: 'active'
    },
    {
      id: '2',
      name: 'Q1 Milestone',
      targetAmount: 10000,
      currentAmount: 7800,
      deadline: '2024-03-31T23:59:59Z',
      category: 'quarterly',
      status: 'active'
    }
  ]);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earned': return <Plus className="h-4 w-4 text-green-600" />;
      case 'redeemed': return <Minus className="h-4 w-4 text-red-600" />;
      case 'bonus': return <Gift className="h-4 w-4 text-purple-600" />;
      case 'adjustment': return <Edit3 className="h-4 w-4 text-blue-600" />;
      default: return <Coins className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earned': return 'text-green-600';
      case 'redeemed': return 'text-red-600';
      case 'bonus': return 'text-purple-600';
      case 'adjustment': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case 'usd': return <DollarSign className="h-4 w-4" />;
      case 'xlm': return <Bitcoin className="h-4 w-4" />;
      case 'gift_card': return <Gift className="h-4 w-4" />;
      default: return <Coins className="h-4 w-4" />;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Points Balance Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Current Balance</h2>
            <p className="text-4xl font-bold">{userPoints.current.toLocaleString()}</p>
            <p className="text-blue-200 mt-1">points available</p>
          </div>
          <div className="h-16 w-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Coins className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Total Earned</h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{userPoints.totalEarned.toLocaleString()}</p>
          <p className="text-sm text-green-600 mt-1">Lifetime earnings</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Total Redeemed</h3>
            <ArrowUpDown className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{userPoints.totalRedeemed.toLocaleString()}</p>
          <p className="text-sm text-blue-600 mt-1">Points spent</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Conversion Rate</h3>
            <Settings className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">100:1</p>
          <p className="text-sm text-purple-600 mt-1">Points to USD</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ArrowUpDown className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Convert Points</p>
              <p className="text-sm text-gray-500">Exchange for cash or tokens</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Gift className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Redeem Rewards</p>
              <p className="text-sm text-gray-500">Browse gift cards & more</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Set Goals</p>
              <p className="text-sm text-gray-500">Track your progress</p>
            </div>
          </button>
        </div>
      </div>

      {/* Active Goals */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Goals</h3>
        <div className="space-y-4">
          {pointsGoals.filter(goal => goal.status === 'active').map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const daysLeft = goal.deadline ? Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;
            
            return (
              <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{goal.name}</h4>
                  {daysLeft && (
                    <span className="text-sm text-gray-500">{daysLeft} days left</span>
                  )}
                </div>
                
                <div className="mb-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{goal.currentAmount.toLocaleString()} / {goal.targetAmount.toLocaleString()} points</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                {getTransactionIcon(transaction.type)}
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                {transaction.taskName && (
                  <p className="text-sm text-gray-600">Task: {transaction.taskName}</p>
                )}
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()}
                  </span>
                  <span className={`text-sm capitalize ${getTransactionColor(transaction.type)}`}>
                    {transaction.type}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className={`text-lg font-semibold ${getTransactionColor(transaction.type)}`}>
                {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">points</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderConversion = () => (
    <div className="space-y-6">
      {user?.role === 'organization' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Conversion Rate Settings</h3>
            <button
              onClick={() => setIsEditingRates(!isEditingRates)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {isEditingRates ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
              <span>{isEditingRates ? 'Cancel' : 'Edit Rates'}</span>
            </button>
          </div>

          <div className="space-y-4">
            {conversionRates.map((rate) => (
              <div key={rate.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      {getCurrencyIcon(rate.toType)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Points to {rate.toType.toUpperCase()}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {rate.rate} points = 1 {rate.toType.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {isEditingRates ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          defaultValue={rate.rate}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <span className="text-sm text-gray-500">points</span>
                      </div>
                    ) : (
                      <div>
                        <p className="font-semibold text-gray-900">{rate.rate}:1</p>
                        <p className="text-sm text-gray-500">
                          Min: {rate.minAmount} pts
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    rate.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {rate.isActive ? 'Active' : 'Inactive'}
                  </span>
                  
                  <span className="text-xs text-gray-500">
                    Updated {new Date(rate.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {isEditingRates && (
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setIsEditingRates(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsEditingRates(false);
                  // Save logic here
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Conversion Calculator */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Calculator</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {conversionRates.filter(rate => rate.isActive).map((rate) => (
            <div key={rate.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                {getCurrencyIcon(rate.toType)}
                <h4 className="font-medium text-gray-900">
                  Convert to {rate.toType.toUpperCase()}
                </h4>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Points to convert</label>
                  <input
                    type="number"
                    placeholder={`Min ${rate.minAmount}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="text-sm text-gray-600">
                  Rate: {rate.rate} points = 1 {rate.toType.toUpperCase()}
                </div>
                
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Convert Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGoals = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Points Goals</h3>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Create Goal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pointsGoals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const isCompleted = goal.status === 'completed';
          const daysLeft = goal.deadline ? Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;
          
          return (
            <div key={goal.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    isCompleted ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Target className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{goal.name}</h4>
                    <p className="text-sm text-gray-600 capitalize">{goal.category} goal</p>
                  </div>
                </div>
                
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  goal.status === 'completed' ? 'bg-green-100 text-green-800' :
                  goal.status === 'active' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {goal.status}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{goal.currentAmount.toLocaleString()} / {goal.targetAmount.toLocaleString()} points</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isCompleted ? 'bg-green-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>

                {goal.deadline && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>
                      {daysLeft && daysLeft > 0 ? 
                        `${daysLeft} days remaining` : 
                        'Deadline passed'
                      }
                    </span>
                  </div>
                )}

                <div className="flex space-x-2 pt-2">
                  <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Edit
                  </button>
                  <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Points System</h1>
        <p className="text-gray-600">Manage your points, conversions, and rewards</p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'transactions', label: 'Transactions', icon: Clock },
            { id: 'conversion', label: 'Conversion', icon: ArrowUpDown },
            { id: 'goals', label: 'Goals', icon: Target }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className={`mr-2 h-5 w-5 ${
                  activeTab === tab.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                }`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'transactions' && renderTransactions()}
      {activeTab === 'conversion' && renderConversion()}
      {activeTab === 'goals' && renderGoals()}
    </div>
  );
};

export default HybridPointsSystem;
