import React, { useState } from 'react';
import {
  Users, Plus, Mail, CheckCircle, Clock, AlertTriangle,
  X, Send, User, MapPin, Calendar, Target, Award
} from 'lucide-react';

interface AmbassadorInvite {
  id: string;
  email: string;
  name: string;
  status: 'pending' | 'sent' | 'accepted' | 'declined';
  sentDate: string;
  expiryDate: string;
}

interface Ambassador {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  status: 'onboarding' | 'active' | 'inactive';
  tasksCompleted: number;
  totalEarned: number;
  onboardingProgress: number;
}

const AmbassadorOnboardingSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'invite' | 'pending' | 'active'>('invite');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    name: '',
    message: ''
  });

  // Mock data
  const pendingInvites: AmbassadorInvite[] = [
    {
      id: 'inv-1',
      email: 'sarah@email.com',
      name: 'Sarah Wilson',
      status: 'pending',
      sentDate: '2024-01-20',
      expiryDate: '2024-02-20'
    },
    {
      id: 'inv-2',
      email: 'david@email.com',
      name: 'David Chen',
      status: 'sent',
      sentDate: '2024-01-18',
      expiryDate: '2024-02-18'
    }
  ];

  const ambassadors: Ambassador[] = [
    {
      id: 'amb-1',
      name: 'Emma Rodriguez',
      email: 'emma@email.com',
      joinDate: '2024-01-15',
      status: 'active',
      tasksCompleted: 12,
      totalEarned: 680,
      onboardingProgress: 100
    },
    {
      id: 'amb-2',
      name: 'Michael Brown',
      email: 'michael@email.com',
      joinDate: '2024-01-22',
      status: 'onboarding',
      tasksCompleted: 0,
      totalEarned: 0,
      onboardingProgress: 60
    },
    {
      id: 'amb-3',
      name: 'Lisa Wang',
      email: 'lisa@email.com',
      joinDate: '2024-01-10',
      status: 'active',
      tasksCompleted: 8,
      totalEarned: 420,
      onboardingProgress: 100
    }
  ];

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sending invite:', inviteForm);
    setIsInviteModalOpen(false);
    setInviteForm({ email: '', name: '', message: '' });
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
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'onboarding':
        return 'bg-orange-100 text-orange-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'sent':
        return <Send className="h-4 w-4" />;
      case 'accepted':
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'declined':
      case 'inactive':
        return <AlertTriangle className="h-4 w-4" />;
      case 'onboarding':
        return <Clock className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ambassador Management</h1>
          <div className="flex items-center space-x-2 mt-1">
            <MapPin className="h-4 w-4 text-gray-500" />
            <p className="text-gray-600">United States Chapter</p>
          </div>
        </div>
        <button 
          onClick={() => setIsInviteModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Invite Ambassador</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Ambassadors</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{ambassadors.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-green-600">{ambassadors.filter(a => a.status === 'active').length} active</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Invites</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingInvites.length}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Mail className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-gray-600">Awaiting responses</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Onboarding</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                {ambassadors.filter(a => a.status === 'onboarding').length}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-gray-600">Completing setup</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {ambassadors.reduce((sum, a) => sum + a.tasksCompleted, 0)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-gray-600">Completed by team</span>
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
              Invite New
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Pending Invites ({pendingInvites.length})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'active'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Active Ambassadors ({ambassadors.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'invite' && (
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Invite New Ambassadors</h3>
                <p className="text-gray-600 mb-4">
                  Send invitations to potential ambassadors to join your chapter. They'll receive an email with 
                  instructions to complete their onboarding process.
                </p>
                <button 
                  onClick={() => setIsInviteModalOpen(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Send Invitation</span>
                </button>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Invitation Guidelines</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">✅ Ideal Candidates</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Active in social media</li>
                      <li>• Strong communication skills</li>
                      <li>• Aligned with brand values</li>
                      <li>• Engaged community members</li>
                    </ul>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">📝 Next Steps</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Ambassador receives email invite</li>
                      <li>• Complete onboarding process</li>
                      <li>• Profile setup and verification</li>
                      <li>• Access to chapter community</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pending' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Pending Invitations</h3>
              <div className="space-y-4">
                {pendingInvites.map((invite) => (
                  <div key={invite.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Mail className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{invite.name}</h4>
                          <p className="text-sm text-gray-500">{invite.email}</p>
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

          {activeTab === 'active' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Chapter Ambassadors</h3>
              <div className="space-y-4">
                {ambassadors.map((ambassador) => (
                  <div key={ambassador.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{ambassador.name}</h4>
                          <p className="text-sm text-gray-500">{ambassador.email}</p>
                          <p className="text-sm text-gray-500">
                            Joined {new Date(ambassador.joinDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Tasks</p>
                          <p className="text-lg font-semibold text-gray-900">{ambassador.tasksCompleted}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Earned</p>
                          <p className="text-lg font-semibold text-green-600">${ambassador.totalEarned}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Progress</p>
                          <p className="text-lg font-semibold text-purple-600">{ambassador.onboardingProgress}%</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ambassador.status)} flex items-center space-x-1`}>
                          {getStatusIcon(ambassador.status)}
                          <span className="capitalize">{ambassador.status}</span>
                        </div>
                      </div>
                    </div>
                    
                    {ambassador.status === 'onboarding' && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Onboarding Progress</span>
                          <span>{ambassador.onboardingProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${ambassador.onboardingProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
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
              <h3 className="text-lg font-semibold text-gray-900">Invite Ambassador</h3>
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
                  placeholder="Enter full name"
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
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Personal Message (Optional)</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  value={inviteForm.message}
                  onChange={(e) => setInviteForm({ ...inviteForm, message: e.target.value })}
                  placeholder="Add a personal welcome message..."
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

export default AmbassadorOnboardingSystem;
