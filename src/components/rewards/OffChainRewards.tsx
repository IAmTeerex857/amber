import React, { useState } from 'react';
import {
  Gift,
  ShoppingCart,
  CreditCard,
  Package,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  ExternalLink,
  Search,
  Filter,
  Grid,
  List,
  Heart,
  Zap
} from 'lucide-react';

interface RewardItem {
  id: string;
  name: string;
  description: string;
  type: 'gift_card' | 'merchandise' | 'experience' | 'subscription';
  category: string;
  pointsCost: number;
  retailValue: number;
  currency: string;
  imageUrl: string;
  brand: string;
  availability: 'available' | 'limited' | 'out_of_stock';
  rating: number;
  reviewCount: number;
  region?: string;
  expiryDays?: number;
  tags: string[];
  isPopular?: boolean;
}

interface RedemptionHistory {
  id: string;
  rewardId: string;
  rewardName: string;
  pointsSpent: number;
  status: 'pending' | 'processing' | 'delivered' | 'expired';
  redemptionDate: string;
  deliveryDate?: string;
  code?: string;
  trackingNumber?: string;
}

const OffChainRewards: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'browse' | 'history'>('browse');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userPoints] = useState(2450); // Mock user points

  // Mock data
  const rewardItems: RewardItem[] = [
    {
      id: '1',
      name: 'Amazon Gift Card',
      description: '$25 Amazon gift card for shopping',
      type: 'gift_card',
      category: 'Shopping',
      pointsCost: 2500,
      retailValue: 25,
      currency: 'USD',
      imageUrl: '/api/placeholder/200/150',
      brand: 'Amazon',
      availability: 'available',
      rating: 4.8,
      reviewCount: 1250,
      region: 'Global',
      expiryDays: 365,
      tags: ['shopping', 'online', 'popular'],
      isPopular: true
    },
    {
      id: '2',
      name: 'Stellar T-Shirt',
      description: 'Official Stellar branded merchandise',
      type: 'merchandise',
      category: 'Apparel',
      pointsCost: 1500,
      retailValue: 20,
      currency: 'USD',
      imageUrl: '/api/placeholder/200/150',
      brand: 'Stellar',
      availability: 'limited',
      rating: 4.6,
      reviewCount: 89,
      tags: ['apparel', 'branded', 'cotton']
    },
    {
      id: '3',
      name: 'Spotify Premium (3 months)',
      description: 'Three months of Spotify Premium subscription',
      type: 'subscription',
      category: 'Entertainment',
      pointsCost: 3000,
      retailValue: 30,
      currency: 'USD',
      imageUrl: '/api/placeholder/200/150',
      brand: 'Spotify',
      availability: 'available',
      rating: 4.9,
      reviewCount: 567,
      region: 'Global',
      expiryDays: 30,
      tags: ['music', 'streaming', 'premium']
    },
    {
      id: '4',
      name: 'Local Coffee Shop Voucher',
      description: '$10 voucher for participating coffee shops',
      type: 'gift_card',
      category: 'Food & Beverage',
      pointsCost: 1000,
      retailValue: 10,
      currency: 'USD',
      imageUrl: '/api/placeholder/200/150',
      brand: 'Local Partners',
      availability: 'available',
      rating: 4.3,
      reviewCount: 234,
      region: 'US Only',
      expiryDays: 90,
      tags: ['coffee', 'local', 'food']
    }
  ];

  const redemptionHistory: RedemptionHistory[] = [
    {
      id: '1',
      rewardId: '1',
      rewardName: 'Amazon Gift Card ($25)',
      pointsSpent: 2500,
      status: 'delivered',
      redemptionDate: '2024-01-10T10:00:00Z',
      deliveryDate: '2024-01-10T10:05:00Z',
      code: 'AMZN-XXXX-YYYY-ZZZZ'
    },
    {
      id: '2',
      rewardId: '2',
      rewardName: 'Stellar T-Shirt (Size M)',
      pointsSpent: 1500,
      status: 'processing',
      redemptionDate: '2024-01-12T14:30:00Z',
      trackingNumber: '1Z999AA1234567890'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', count: rewardItems.length },
    { id: 'Shopping', name: 'Shopping', count: 1 },
    { id: 'Apparel', name: 'Apparel', count: 1 },
    { id: 'Entertainment', name: 'Entertainment', count: 1 },
    { id: 'Food & Beverage', name: 'Food & Beverage', count: 1 }
  ];

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'text-green-600 bg-green-50';
      case 'limited': return 'text-yellow-600 bg-yellow-50';
      case 'out_of_stock': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-50';
      case 'processing': return 'text-blue-600 bg-blue-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'expired': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredRewards = rewardItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const renderRewardCard = (reward: RewardItem) => (
    <div key={reward.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={reward.imageUrl}
          alt={reward.name}
          className="w-full h-48 object-cover"
        />
        {reward.isPopular && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <Zap className="h-3 w-3 mr-1" />
              Popular
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(reward.availability)}`}>
            {reward.availability.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-sm">{reward.name}</h3>
          <button className="text-gray-400 hover:text-red-500 transition-colors">
            <Heart className="h-4 w-4" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{reward.description}</p>

        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-900">{reward.rating}</span>
            <span className="text-sm text-gray-500">({reward.reviewCount})</span>
          </div>
          {reward.region && (
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">{reward.region}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-lg font-bold text-blue-600">{reward.pointsCost.toLocaleString()} points</p>
            <p className="text-sm text-gray-500">${reward.retailValue} value</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{reward.brand}</p>
            {reward.expiryDays && (
              <p className="text-xs text-gray-500">{reward.expiryDays} days validity</p>
            )}
          </div>
        </div>

        <button
          disabled={userPoints < reward.pointsCost || reward.availability === 'out_of_stock'}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          {userPoints < reward.pointsCost ? 'Insufficient Points' : 
           reward.availability === 'out_of_stock' ? 'Out of Stock' : 'Redeem Now'}
        </button>
      </div>
    </div>
  );

  const renderRewardsList = (reward: RewardItem) => (
    <div key={reward.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <img
          src={reward.imageUrl}
          alt={reward.name}
          className="w-16 h-16 object-cover rounded-lg"
        />
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{reward.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{reward.description}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-900">{reward.rating}</span>
                </div>
                <span className="text-sm text-gray-500">{reward.brand}</span>
                {reward.region && (
                  <span className="text-sm text-gray-500">{reward.region}</span>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-lg font-bold text-blue-600">{reward.pointsCost.toLocaleString()}</p>
              <p className="text-sm text-gray-500">points</p>
              <button
                disabled={userPoints < reward.pointsCost || reward.availability === 'out_of_stock'}
                className="mt-2 px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Redeem
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-4">
      {redemptionHistory.map((item) => (
        <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{item.rewardName}</h3>
              <p className="text-sm text-gray-600 mt-1">{item.pointsSpent.toLocaleString()} points spent</p>
              
              <div className="flex items-center space-x-4 mt-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(item.redemptionDate).toLocaleDateString()}
                </span>
              </div>

              {item.code && (
                <div className="mt-3 p-2 bg-gray-50 rounded border">
                  <p className="text-sm font-medium text-gray-900">Redemption Code:</p>
                  <p className="text-sm font-mono text-gray-800">{item.code}</p>
                </div>
              )}

              {item.trackingNumber && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Tracking: <span className="font-medium">{item.trackingNumber}</span>
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {item.status === 'delivered' && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              <button className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                View Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Rewards Store</h1>
            <p className="text-gray-600">Redeem your points for exciting rewards and benefits</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Your Balance</p>
            <p className="text-2xl font-bold text-blue-600">{userPoints.toLocaleString()} points</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'browse', label: 'Browse Rewards', icon: Gift },
            { id: 'history', label: 'Redemption History', icon: Clock }
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

      {/* Browse Rewards Tab */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Filters and Search */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search rewards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Rewards Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRewards.map(renderRewardCard)}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRewards.map(renderRewardsList)}
            </div>
          )}

          {filteredRewards.length === 0 && (
            <div className="text-center py-12">
              <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No rewards found</h3>
              <p className="text-gray-600">Try adjusting your search or category filters</p>
            </div>
          )}
        </div>
      )}

      {/* Redemption History Tab */}
      {activeTab === 'history' && renderHistory()}
    </div>
  );
};

export default OffChainRewards;
