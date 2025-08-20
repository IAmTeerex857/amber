import React, { useState } from 'react';
import {
  Crown, MapPin, DollarSign, Users,
  Plus, MoreHorizontal, TrendingUp, AlertTriangle,
  CheckCircle, Clock, Search
} from 'lucide-react';
import { useAuth, Chapter } from '../contexts/AuthContext';

const ChapterManagement: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Mock data for demonstration - in real app, this would come from API
  const mockChapters: Chapter[] = [
    {
      id: 'chapter-usa',
      name: 'United States Chapter',
      country: 'USA',
      region: 'North America',
      organizationId: user?.organizationId || 'org-123',
      presidentId: 'president-john',
      monthlyBudget: 10000,
      ambassadorCount: 12,
      isActive: true,
      createdDate: '2024-01-15'
    },
    {
      id: 'chapter-canada',
      name: 'Canada Chapter',
      country: 'Canada',
      region: 'North America',
      organizationId: user?.organizationId || 'org-123',
      presidentId: 'president-jane',
      monthlyBudget: 10000,
      ambassadorCount: 8,
      isActive: true,
      createdDate: '2024-02-20'
    },
    {
      id: 'chapter-uk',
      name: 'United Kingdom Chapter',
      country: 'United Kingdom',
      region: 'Europe',
      organizationId: user?.organizationId || 'org-123',
      presidentId: 'president-mike',
      monthlyBudget: 10000,
      ambassadorCount: 15,
      isActive: true,
      createdDate: '2024-03-10'
    },
    {
      id: 'chapter-germany',
      name: 'Germany Chapter',
      country: 'Germany',
      region: 'Europe',
      organizationId: user?.organizationId || 'org-123',
      presidentId: undefined, // No president assigned yet
      monthlyBudget: 10000,
      ambassadorCount: 0,
      isActive: false,
      createdDate: '2024-04-05'
    }
  ];

  const filteredChapters = mockChapters.filter(chapter => {
    const matchesSearch = chapter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chapter.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && chapter.isActive) ||
                         (filterStatus === 'inactive' && !chapter.isActive);
    return matchesSearch && matchesFilter;
  });

  const totalAmbassadors = mockChapters.reduce((sum, chapter) => sum + chapter.ambassadorCount, 0);
  const totalBudget = mockChapters.reduce((sum, chapter) => sum + chapter.monthlyBudget, 0);
  const activeChapters = mockChapters.filter(chapter => chapter.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chapter Management</h1>
          <p className="text-gray-600 mt-1">Manage chapters and assign presidents across regions</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Create Chapter</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Chapters</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{mockChapters.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Crown className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-green-600">{activeChapters} active</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Ambassadors</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalAmbassadors}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-blue-600">Across {activeChapters} chapters</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Budget</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${totalBudget.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-gray-600">${(totalBudget/12).toLocaleString()}/month avg</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Growth Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">+24%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-green-600">+3 new ambassadors</span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search chapters..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            Showing {filteredChapters.length} of {mockChapters.length} chapters
          </div>
        </div>
      </div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredChapters.map((chapter) => (
          <div key={chapter.id} className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${chapter.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <MapPin className={`h-5 w-5 ${chapter.isActive ? 'text-green-600' : 'text-gray-500'}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{chapter.name}</h3>
                  <p className="text-sm text-gray-500">{chapter.region}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  chapter.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {chapter.isActive ? (
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-3 w-3" />
                      <span>Active</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>Setup Required</span>
                    </div>
                  )}
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">President</span>
                {chapter.presidentId ? (
                  <span className="font-medium text-gray-900">Assigned</span>
                ) : (
                  <div className="flex items-center space-x-1 text-red-600">
                    <AlertTriangle className="h-3 w-3" />
                    <span className="font-medium">Not Assigned</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Ambassadors</span>
                <span className="font-medium text-gray-900">{chapter.ambassadorCount}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Monthly Budget</span>
                <span className="font-medium text-gray-900">${chapter.monthlyBudget.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Created</span>
                <span className="font-medium text-gray-900">
                  {new Date(chapter.createdDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View Details
              </button>
              {!chapter.presidentId && (
                <button className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200">
                  Assign President
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChapterManagement;
