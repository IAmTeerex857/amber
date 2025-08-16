import React, { useState, useEffect } from 'react';
import {
  Wallet,
  Eye,
  EyeOff,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Minus,
  DollarSign,
  Bitcoin,
  Gift,
  Coins,
  Globe,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

interface Balance {
  currency: string;
  name: string;
  symbol: string;
  amount: number;
  usdValue: number;
  change24h: number;
  changePercent: number;
  icon: React.ReactNode;
  color: string;
  walletAddress?: string;
  lastUpdated: string;
}

interface Transaction {
  id: string;
  type: 'earned' | 'converted' | 'redeemed' | 'bonus';
  currency: string;
  amount: number;
  usdValue: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

const MultiCurrencyBalance: React.FC = () => {
  const [balancesVisible, setBalancesVisible] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d' | '3m'>('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock balance data
  const [balances] = useState<Balance[]>([
    {
      currency: 'points',
      name: 'Amber Points',
      symbol: 'PTS',
      amount: 15750,
      usdValue: 157.50,
      change24h: 450,
      changePercent: 2.9,
      icon: <Coins className="h-5 w-5" />,
      color: 'bg-blue-500',
      lastUpdated: '2024-01-15T10:30:00Z'
    },
    {
      currency: 'usd',
      name: 'US Dollar',
      symbol: 'USD',
      amount: 245.80,
      usdValue: 245.80,
      change24h: -12.50,
      changePercent: -4.8,
      icon: <DollarSign className="h-5 w-5" />,
      color: 'bg-green-500',
      walletAddress: 'Bank Account ***4521',
      lastUpdated: '2024-01-15T09:15:00Z'
    },
    {
      currency: 'xlm',
      name: 'Stellar Lumens',
      symbol: 'XLM',
      amount: 892.35,
      usdValue: 89.24,
      change24h: 15.75,
      changePercent: 1.8,
      icon: <Bitcoin className="h-5 w-5" />,
      color: 'bg-blue-600',
      walletAddress: 'GCKF...X4YK',
      lastUpdated: '2024-01-15T10:25:00Z'
    },
    {
      currency: 'vouchers',
      name: 'Gift Vouchers',
      symbol: 'VOUCH',
      amount: 85.00,
      usdValue: 85.00,
      change24h: 25.00,
      changePercent: 41.7,
      icon: <Gift className="h-5 w-5" />,
      color: 'bg-purple-500',
      lastUpdated: '2024-01-15T08:45:00Z'
    }
  ]);

  // Mock recent transactions
  const [recentTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'earned',
      currency: 'points',
      amount: 500,
      usdValue: 5.00,
      description: 'Task completion: Social Media Campaign',
      date: '2024-01-15T14:30:00Z',
      status: 'completed'
    },
    {
      id: '2',
      type: 'converted',
      currency: 'xlm',
      amount: 20,
      usdValue: 2.00,
      description: 'Points to XLM conversion',
      date: '2024-01-15T12:15:00Z',
      status: 'completed'
    },
    {
      id: '3',
      type: 'redeemed',
      currency: 'vouchers',
      amount: -25,
      usdValue: -25.00,
      description: 'Amazon Gift Card redemption',
      date: '2024-01-15T10:45:00Z',
      status: 'completed'
    }
  ]);

  const totalUsdValue = balances.reduce((sum, balance) => sum + balance.usdValue, 0);
  const totalChange24h = balances.reduce((sum, balance) => sum + balance.change24h, 0);
  const totalChangePercent = (totalChange24h / (totalUsdValue - totalChange24h)) * 100;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earned': return <Plus className="h-4 w-4 text-green-600" />;
      case 'converted': return <ArrowUpRight className="h-4 w-4 text-blue-600" />;
      case 'redeemed': return <Minus className="h-4 w-4 text-red-600" />;
      case 'bonus': return <Gift className="h-4 w-4 text-purple-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'usd') {
      return `$${amount.toFixed(2)}`;
    } else if (currency === 'points') {
      return `${amount.toLocaleString()} PTS`;
    } else {
      return `${amount.toFixed(2)} ${currency.toUpperCase()}`;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Overview</h1>
          <p className="text-gray-600 mt-1">Multi-currency balance and transaction history</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setBalancesVisible(!balancesVisible)}
            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {balancesVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{balancesVisible ? 'Hide' : 'Show'} Balances</span>
          </button>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Total Portfolio Value */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-200 mb-2">Total Portfolio Value</p>
            <div className="flex items-center space-x-4">
              {balancesVisible ? (
                <h2 className="text-4xl font-bold">${totalUsdValue.toFixed(2)}</h2>
              ) : (
                <h2 className="text-4xl font-bold">••••••</h2>
              )}
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm ${
                totalChangePercent >= 0 ? 'bg-green-500 bg-opacity-20' : 'bg-red-500 bg-opacity-20'
              }`}>
                {totalChangePercent >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>{Math.abs(totalChangePercent).toFixed(1)}%</span>
              </div>
            </div>
            <p className="text-blue-200 mt-1">
              {totalChange24h >= 0 ? '+' : ''}${totalChange24h.toFixed(2)} (24h)
            </p>
          </div>
          <div className="h-16 w-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Wallet className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Balance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {balances.map((balance) => (
          <div key={balance.currency} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`h-10 w-10 ${balance.color} rounded-lg flex items-center justify-center text-white`}>
                  {balance.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{balance.name}</h3>
                  <p className="text-sm text-gray-600">{balance.symbol}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {balancesVisible ? formatCurrency(balance.amount, balance.currency) : '••••••'}
                </p>
                <p className="text-sm text-gray-600">
                  {balancesVisible ? `≈ $${balance.usdValue.toFixed(2)}` : '••••••'}
                </p>
              </div>

              <div className={`flex items-center space-x-1 text-sm ${
                balance.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {balance.changePercent >= 0 ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownLeft className="h-4 w-4" />
                )}
                <span>
                  {balance.changePercent >= 0 ? '+' : ''}{balance.changePercent.toFixed(1)}%
                </span>
                <span className="text-gray-500">(24h)</span>
              </div>

              {balance.walletAddress && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500 truncate">
                    {balance.walletAddress}
                  </p>
                </div>
              )}

              <div className="text-xs text-gray-500">
                Updated {new Date(balance.lastUpdated).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Portfolio Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Allocation */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <PieChart className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Asset Allocation</h3>
          </div>
          
          <div className="space-y-4">
            {balances.map((balance) => {
              const percentage = (balance.usdValue / totalUsdValue) * 100;
              return (
                <div key={balance.currency} className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${balance.color}`} />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{balance.name}</span>
                    <span className="text-sm text-gray-600">
                      {balancesVisible ? `${percentage.toFixed(1)}%` : '••%'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Visual allocation bar */}
          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden flex">
            {balances.map((balance) => {
              const percentage = (balance.usdValue / totalUsdValue) * 100;
              return (
                <div
                  key={balance.currency}
                  className={balance.color}
                  style={{ width: `${percentage}%` }}
                />
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-500">View All</button>
          </div>

          <div className="space-y-4">
            {recentTransactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  {getTransactionIcon(transaction.type)}
                </div>
                
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(transaction.date).toLocaleString()}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount), transaction.currency)}
                  </p>
                  <p className="text-xs text-gray-500">
                    ${Math.abs(transaction.usdValue).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Charts Placeholder */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Portfolio Performance</h3>
          </div>
          
          <div className="flex space-x-2">
            {(['24h', '7d', '30d', '3m'] as const).map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  selectedTimeframe === timeframe
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {timeframe}
              </button>
            ))}
          </div>
        </div>

        {/* Chart placeholder */}
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Portfolio performance chart</p>
            <p className="text-sm text-gray-500 mt-1">Chart visualization coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiCurrencyBalance;
