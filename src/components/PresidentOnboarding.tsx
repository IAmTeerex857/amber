import React, { useState } from 'react';
import {
  Crown, MapPin, CheckCircle, 
  AlertCircle, Clock, Plus, X,
  User, Send
} from 'lucide-react';
import { useAuth, Chapter } from '../contexts/AuthContext';

interface PresidentInvite {
  id: string;
  email: string;
  name: string;
  chapterId: string;
  chapterName: string;
  status: 'pending' | 'sent' | 'accepted' | 'declined';
  sentDate: string;
  expiryDate: string;
}

const PresidentOnboarding: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'invite' | 'pending' | 'assigned'>('invite');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  
  // Form state for new president invite
  const [inviteForm, setInviteForm] = useState({
    email: '',
    name: '',
    chapterId: '',
    message: ''
  });

  // Mock data for demonstration
  const mockChapters: Chapter[] = [
    {
      id: 'chapter-usa',
      name: 'United States Chapter',
      country: 'USA',
      region: 'North America',
      organizationId: user?.organizationId || 'org-123',
      presidentId: undefined,
      monthlyBudget: 10000,
      ambassadorCount: 0,
      isActive: false,
      createdDate: '2024-01-15'
    },
    {
      id: 'chapter-canada',
      name: 'Canada Chapter',
      country: 'Canada',
      region: 'North America',
      organizationId: user?.organizationId || 'org-123',
      presidentId: undefined,
      monthlyBudget: 10000,
      ambassadorCount: 0,
      isActive: false,
      createdDate: '2024-02-20'
    },
    {
      id: 'chapter-germany',
      name: 'Germany Chapter',
      country: 'Germany',
      region: 'Europe',
      organizationId: user?.organizationId || 'org-123',
      presidentId: undefined,
      monthlyBudget: 10000,
      ambassadorCount: 0,
      isActive: false,
      createdDate: '2024-04-05'
    }
  ];

  const mockInvites: PresidentInvite[] = [
    {
      id: 'invite-1',
      email: 'john.smith@email.com',
      name: 'John Smith',
      chapterId: 'chapter-usa',
      chapterName: 'United States Chapter',
      status: 'pending',
      sentDate: '2024-01-20',
      expiryDate: '2024-02-20'
    },
    {
      id: 'invite-2',
      email: 'jane.doe@email.com',
      name: 'Jane Doe',
      chapterId: 'chapter-canada',
      chapterName: 'Canada Chapter',
      status: 'sent',
      sentDate: '2024-01-18',
      expiryDate: '2024-02-18'
    }
  ];

  const mockAssignedPresidents = [
    {
      id: 'president-1',
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      chapterId: 'chapter-uk',
      chapterName: 'United Kingdom Chapter',
      assignedDate: '2024-01-10',
      ambassadorCount: 15,
      monthlyBudget: 10000
    }
  ];

  const chaptersNeedingPresidents = mockChapters.filter(chapter => !chapter.presidentId);

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would call API to send invite
    console.log('Sending invite:', inviteForm);
    setIsInviteModalOpen(false);
    setInviteForm({ email: '', name: '', chapterId: '', message: '' });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'sent':
        return <Send className="h-4 w-4 text-blue-500" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'declined':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">President Onboarding</h1>
          <p className="text-gray-600 mt-1">Invite and manage chapter presidents</p>
        </div>
        <button 
          onClick={() => setIsInviteModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Invite President</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Chapters Needing Presidents</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{chaptersNeedingPresidents.length}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Invites</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {mockInvites.filter(i => i.status === 'pending').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Presidents</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{mockAssignedPresidents.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Crown className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Chapters</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{mockChapters.length + 1}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 py-4">
            <button
              onClick={() => setActiveTab('invite')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'invite'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Invite President
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Pending Invites ({mockInvites.length})
            </button>
            <button
              onClick={() => setActiveTab('assigned')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'assigned'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Assigned Presidents ({mockAssignedPresidents.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'invite' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Chapters Needing Presidents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {chaptersNeedingPresidents.map((chapter) => (
                  <div key={chapter.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <MapPin className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{chapter.name}</h4>
                        <p className="text-sm text-gray-500">{chapter.region}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex justify-between">
                        <span>Budget:</span>
                        <span className="font-medium">${chapter.monthlyBudget.toLocaleString()}/mo</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Created:</span>
                        <span className="font-medium">{new Date(chapter.createdDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setInviteForm({ ...inviteForm, chapterId: chapter.id });
                        setIsInviteModalOpen(true);
                      }}
                      className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Invite President</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'pending' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Pending Invitations</h3>
              <div className="space-y-4">
                {mockInvites.map((invite) => (
                  <div key={invite.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{invite.name}</h4>
                          <p className="text-sm text-gray-500">{invite.email}</p>
                          <p className="text-sm text-gray-500">{invite.chapterName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invite.status)} flex items-center space-x-1`}>
                          {getStatusIcon(invite.status)}
                          <span className="capitalize">{invite.status}</span>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <p>Sent: {new Date(invite.sentDate).toLocaleDateString()}</p>
                          <p>Expires: {new Date(invite.expiryDate).toLocaleDateString()}</p>
                        </div>
                        <button className="px-3 py-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Resend
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'assigned' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Active Presidents</h3>
              <div className="space-y-4">
                {mockAssignedPresidents.map((president) => (
                  <div key={president.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Crown className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{president.name}</h4>
                          <p className="text-sm text-gray-500">{president.email}</p>
                          <p className="text-sm text-gray-500">{president.chapterName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Ambassadors</p>
                          <p className="text-lg font-semibold text-gray-900">{president.ambassadorCount}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Budget</p>
                          <p className="text-lg font-semibold text-gray-900">${president.monthlyBudget.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Assigned</p>
                          <p className="text-sm text-gray-900">{new Date(president.assignedDate).toLocaleDateString()}</p>
                        </div>
                        <button className="px-3 py-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Invite President</h3>
              <button 
                onClick={() => setIsInviteModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chapter</label>
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={inviteForm.chapterId}
                  onChange={(e) => setInviteForm({ ...inviteForm, chapterId: e.target.value })}
                >
                  <option value="">Select Chapter</option>
                  {chaptersNeedingPresidents.map((chapter) => (
                    <option key={chapter.id} value={chapter.id}>{chapter.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Personal Message (Optional)</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  value={inviteForm.message}
                  onChange={(e) => setInviteForm({ ...inviteForm, message: e.target.value })}
                  placeholder="Add a personal message to the invitation..."
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Invite</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PresidentOnboarding;
