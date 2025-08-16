import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  Check,
  Copy,
  ExternalLink,
  AlertCircle,
  Trash2,
  Settings,
  Shield,
  Star,
  QrCode
} from 'lucide-react';

interface ConnectedWallet {
  id: string;
  address: string;
  network: 'stellar' | 'ethereum' | 'solana' | 'polygon';
  balance?: number;
  currency: string;
  isVerified: boolean;
  isPrimary: boolean;
  nickname?: string;
  dateConnected: string;
}

interface WalletConnectionProps {
  onWalletConnect?: (wallet: ConnectedWallet) => void;
  onWalletDisconnect?: (walletId: string) => void;
}

const WalletConnection: React.FC<WalletConnectionProps> = ({
  onWalletConnect,
  onWalletDisconnect
}) => {
  const [connectedWallets, setConnectedWallets] = useState<ConnectedWallet[]>([
    {
      id: '1',
      address: 'GCKFBEIYTKP6RTHVX2X2OVNFBIZLRQW2J4CZJZCGEJVDMEXU7F56X4YK',
      network: 'stellar',
      balance: 1250.50,
      currency: 'XLM',
      isVerified: true,
      isPrimary: true,
      nickname: 'My Main Wallet',
      dateConnected: '2024-01-10T10:00:00Z'
    },
    {
      id: '2',
      address: '0x742d35Cc6634C0532925a3b8D4F85D65F5000000',
      network: 'ethereum',
      balance: 0.85,
      currency: 'ETH',
      isVerified: false,
      isPrimary: false,
      dateConnected: '2024-01-15T14:30:00Z'
    }
  ]);

  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<string>('stellar');
  const [walletAddress, setWalletAddress] = useState('');
  const [nickname, setNickname] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const supportedNetworks = [
    {
      id: 'stellar',
      name: 'Stellar',
      symbol: 'XLM',
      icon: '🌟',
      description: 'Fast, low-cost payments'
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      icon: '⟠',
      description: 'Smart contracts & DeFi'
    },
    {
      id: 'solana',
      name: 'Solana',
      symbol: 'SOL',
      icon: '◎',
      description: 'High-speed transactions'
    },
    {
      id: 'polygon',
      name: 'Polygon',
      symbol: 'MATIC',
      icon: '🔷',
      description: 'Layer 2 scaling'
    }
  ];

  const getNetworkColor = (network: string) => {
    switch (network) {
      case 'stellar': return 'bg-blue-100 text-blue-800';
      case 'ethereum': return 'bg-purple-100 text-purple-800';
      case 'solana': return 'bg-green-100 text-green-800';
      case 'polygon': return 'bg-violet-100 text-violet-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Add toast notification here
  };

  const handleConnectWallet = async () => {
    if (!walletAddress.trim()) return;

    setIsConnecting(true);

    // Simulate wallet connection
    setTimeout(() => {
      const newWallet: ConnectedWallet = {
        id: Date.now().toString(),
        address: walletAddress,
        network: selectedNetwork as ConnectedWallet['network'],
        balance: 0,
        currency: supportedNetworks.find(n => n.id === selectedNetwork)?.symbol || 'TOKEN',
        isVerified: false,
        isPrimary: connectedWallets.length === 0,
        nickname: nickname || undefined,
        dateConnected: new Date().toISOString()
      };

      setConnectedWallets(prev => [...prev, newWallet]);
      onWalletConnect?.(newWallet);
      
      setShowConnectModal(false);
      setWalletAddress('');
      setNickname('');
      setIsConnecting(false);
    }, 2000);
  };

  const handleDisconnectWallet = (walletId: string) => {
    setConnectedWallets(prev => prev.filter(w => w.id !== walletId));
    onWalletDisconnect?.(walletId);
  };

  const handleSetPrimary = (walletId: string) => {
    setConnectedWallets(prev => 
      prev.map(wallet => ({
        ...wallet,
        isPrimary: wallet.id === walletId
      }))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Connected Wallets</h2>
          <p className="text-gray-600 mt-1">Manage your crypto wallets for receiving rewards</p>
        </div>
        <button
          onClick={() => setShowConnectModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Connect Wallet</span>
        </button>
      </div>

      {/* Connected Wallets List */}
      <div className="space-y-4">
        {connectedWallets.map((wallet) => (
          <div key={wallet.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-gray-600" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {wallet.nickname || `${wallet.network.charAt(0).toUpperCase() + wallet.network.slice(1)} Wallet`}
                    </h3>
                    {wallet.isPrimary && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3 mr-1" />
                        Primary
                      </span>
                    )}
                    {wallet.isVerified && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Check className="h-3 w-3 mr-1" />
                        Verified
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getNetworkColor(wallet.network)}`}>
                        {wallet.network.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600">{truncateAddress(wallet.address)}</span>
                      <button
                        onClick={() => copyToClipboard(wallet.address)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center space-x-4 text-sm">
                      {wallet.balance !== undefined && (
                        <span className="text-gray-600">
                          Balance: <span className="font-medium">{wallet.balance} {wallet.currency}</span>
                        </span>
                      )}
                      <span className="text-gray-500">
                        Connected {new Date(wallet.dateConnected).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSetPrimary(wallet.id)}
                  disabled={wallet.isPrimary}
                  className="p-2 text-gray-400 hover:text-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Set as primary wallet"
                >
                  <Star className="h-4 w-4" />
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-blue-600"
                  title="Wallet settings"
                >
                  <Settings className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDisconnectWallet(wallet.id)}
                  className="p-2 text-gray-400 hover:text-red-600"
                  title="Disconnect wallet"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {!wallet.isVerified && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-yellow-800 font-medium">Wallet verification required</p>
                    <p className="text-yellow-700 mt-1">
                      Complete verification to receive payments to this wallet.
                    </p>
                    <button className="text-yellow-800 font-medium underline mt-1 hover:text-yellow-900">
                      Verify now
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {connectedWallets.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No wallets connected</h3>
            <p className="text-gray-600 mb-4">
              Connect your crypto wallets to receive token rewards and payments
            </p>
            <button
              onClick={() => setShowConnectModal(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Connect Your First Wallet</span>
            </button>
          </div>
        )}
      </div>

      {/* Connect Wallet Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Connect Wallet</h3>
              <button
                onClick={() => setShowConnectModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Network Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Network
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {supportedNetworks.map((network) => (
                    <button
                      key={network.id}
                      onClick={() => setSelectedNetwork(network.id)}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        selectedNetwork === network.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">{network.icon}</span>
                        <span className="font-medium text-gray-900">{network.name}</span>
                      </div>
                      <p className="text-xs text-gray-600">{network.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Wallet Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wallet Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="Enter your wallet address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <QrCode className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Nickname */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nickname (Optional)
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="My Trading Wallet"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Security Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Security Notice</p>
                    <p className="mt-1">
                      We'll only use this address to send you earned rewards. We never request private keys.
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowConnectModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConnectWallet}
                  disabled={!walletAddress.trim() || isConnecting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnection;
