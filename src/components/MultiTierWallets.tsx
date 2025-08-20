import React, { useState } from 'react';
import {
  Wallet, DollarSign, Building2, Crown, Users,
  CheckCircle, Lock, Unlock, Settings, Send,
  Eye, EyeOff, TrendingUp, BarChart3
} from 'lucide-react';

interface WalletAccount {
  id: string;
  name: string;
  type: 'organization' | 'chapter' | 'ambassador';
  balance: number;
  status: 'active' | 'frozen';
  address: string;
  isConnected: boolean;
}

const MultiTierWallets: React.FC = () => {
  const [showBalances, setShowBalances] = useState(true);

  const wallets: WalletAccount[] = [
    {
      id: 'org-1', name: 'Acme Corp Treasury', type: 'organization',
      balance: 487500, status: 'active', address: '0x1234...abcd', isConnected: true
    },
    {
      id: 'chapter-usa', name: 'USA Chapter Wallet', type: 'chapter',
      balance: 28500, status: 'active', address: '0x5678...efgh', isConnected: true
    },
    {
      id: 'amb-001', name: 'Sarah Johnson Wallet', type: 'ambassador',
      balance: 1250, status: 'active', address: '0xdef0...mnop', isConnected: true
    }
  ];

  const getWalletIcon = (type: string) => {
    switch (type) {
      case 'organization': return <Building2 className="h-5 w-5" />;
      case 'chapter': return <Crown className="h-5 w-5" />;
      case 'ambassador': return <Users className="h-5 w-5" />;
      default: return <Wallet className="h-5 w-5" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD',
      notation: amount >= 1000000 ? 'compact' : 'standard'
    }).format(amount);
  };

  const getTotalBalance = () => wallets.reduce((sum, w) => sum + w.balance, 0);
  const getConnectedCount = () => wallets.filter(w => w.isConnected).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Multi-Tier Wallets</h1>
          <p className="text-gray-600 mt-1">Hierarchical wallet management system</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowBalances(!showBalances)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
          >
            {showBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{showBalances ? 'Hide' : 'Show'} Balances</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Send className="h-4 w-4" />
            <span>Transfer Funds</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Balance</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {showBalances ? formatCurrency(getTotalBalance()) : '****'}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center space-x-1 text-sm text-green-600 mt-2">
            <TrendingUp className="h-3 w-3" />
            <span>+12.5% this month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Connected Wallets</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {getConnectedCount()}/{wallets.length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Wallet className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Volume</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {showBalances ? formatCurrency(185600) : '****'}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Hierarchy */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Wallet Hierarchy</h3>
        
        <div className="space-y-4">
          {wallets.map((wallet) => (
            <div key={wallet.id} className={`border rounded-lg p-4 ${
              wallet.type === 'organization' ? 'bg-purple-50 border-purple-200' :
              wallet.type === 'chapter' ? 'bg-yellow-50 border-yellow-200' :
              'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${
                    wallet.type === 'organization' ? 'bg-purple-100' :
                    wallet.type === 'chapter' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    {getWalletIcon(wallet.type)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{wallet.name}</h4>
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <span>{wallet.address}</span>
                      <div className="flex items-center space-x-1">
                        {wallet.isConnected ? (
                          <Unlock className="h-3 w-3 text-green-500" />
                        ) : (
                          <Lock className="h-3 w-3 text-red-500" />
                        )}
                        <span>{wallet.isConnected ? 'Connected' : 'Disconnected'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Balance</p>
                    <p className={`font-bold ${
                      wallet.type === 'organization' ? 'text-purple-600' :
                      wallet.type === 'chapter' ? 'text-yellow-600' : 'text-blue-600'
                    }`}>
                      {showBalances ? formatCurrency(wallet.balance) : '****'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600 capitalize">{wallet.status}</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800">
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultiTierWallets;
