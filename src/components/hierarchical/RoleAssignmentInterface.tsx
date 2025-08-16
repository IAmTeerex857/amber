import React, { useState, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Users,
  Crown,
  Shield,
  MapPin,
  Building2,
  Globe,
  User,
  Search,
  Filter,
  Plus,
  Save,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  UserCheck,
  UserX,
  Eye,
  Edit3,
  Trash2,
  Award,
  Flag
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  currentRole: Role;
  assignedRegion?: string;
  assignedCountry?: string;
  performance: {
    score: number;
    ambassadorsManaged?: number;
    regionsManaged?: number;
    countriesManaged?: number;
  };
  joinedDate: string;
  lastActive: string;
  status: 'active' | 'inactive' | 'pending';
}

interface Role {
  id: string;
  name: string;
  level: 'global_admin' | 'country_head' | 'regional_manager' | 'ambassador';
  permissions: string[];
  description: string;
  icon: React.ElementType;
  color: string;
  maxAssignments?: number;
  currentAssignments: number;
}

interface Region {
  id: string;
  name: string;
  type: 'country' | 'state' | 'city';
  parentId?: string;
  currentManager?: string;
  requiresManager: boolean;
}

const RoleAssignmentInterface: React.FC = () => {
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<any[]>([]);

  // Mock data - would come from API
  const roles: Role[] = [
    {
      id: 'global_admin',
      name: 'Global Administrator',
      level: 'global_admin',
      permissions: ['all_access', 'country_management', 'global_analytics', 'system_settings'],
      description: 'Full system access with worldwide oversight',
      icon: Crown,
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      maxAssignments: 3,
      currentAssignments: 1
    },
    {
      id: 'country_head',
      name: 'Country Head',
      level: 'country_head',
      permissions: ['country_management', 'regional_oversight', 'country_analytics', 'ambassador_management'],
      description: 'Country-level management and regional oversight',
      icon: Flag,
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      maxAssignments: 25,
      currentAssignments: 8
    },
    {
      id: 'regional_manager',
      name: 'Regional Manager',
      level: 'regional_manager',
      permissions: ['regional_management', 'ambassador_oversight', 'local_analytics'],
      description: 'Regional management and direct ambassador oversight',
      icon: MapPin,
      color: 'bg-green-100 text-green-800 border-green-200',
      maxAssignments: 100,
      currentAssignments: 34
    },
    {
      id: 'ambassador',
      name: 'Ambassador',
      level: 'ambassador',
      permissions: ['task_completion', 'content_submission', 'reward_claiming'],
      description: 'Brand ambassador with task completion access',
      icon: User,
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      currentAssignments: 1247
    }
  ];

  const users: UserProfile[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      avatar: '/api/placeholder/40/40',
      currentRole: roles[0], // Global Admin
      performance: {
        score: 96,
        countriesManaged: 3,
        ambassadorsManaged: 2847
      },
      joinedDate: '2023-01-15',
      lastActive: '2024-01-15T11:30:00Z',
      status: 'active'
    },
    {
      id: '2',
      name: 'Adebayo Okafor',
      email: 'adebayo@example.com',
      avatar: '/api/placeholder/40/40',
      currentRole: roles[1], // Country Head
      assignedCountry: 'Nigeria',
      performance: {
        score: 94,
        regionsManaged: 8,
        ambassadorsManaged: 1934
      },
      joinedDate: '2023-03-20',
      lastActive: '2024-01-15T10:45:00Z',
      status: 'active'
    },
    {
      id: '3',
      name: 'Raj Patel',
      email: 'raj@example.com',
      avatar: '/api/placeholder/40/40',
      currentRole: roles[1], // Country Head
      assignedCountry: 'India',
      performance: {
        score: 89,
        regionsManaged: 12,
        ambassadorsManaged: 1756
      },
      joinedDate: '2023-02-10',
      lastActive: '2024-01-15T09:20:00Z',
      status: 'active'
    },
    {
      id: '4',
      name: 'Folake Adebayo',
      email: 'folake@example.com',
      avatar: '/api/placeholder/40/40',
      currentRole: roles[2], // Regional Manager
      assignedRegion: 'Lagos',
      assignedCountry: 'Nigeria',
      performance: {
        score: 92,
        ambassadorsManaged: 567
      },
      joinedDate: '2023-05-15',
      lastActive: '2024-01-15T11:15:00Z',
      status: 'active'
    },
    {
      id: '5',
      name: 'Michael Chen',
      email: 'michael@example.com',
      avatar: '/api/placeholder/40/40',
      currentRole: roles[3], // Ambassador
      assignedRegion: 'California',
      assignedCountry: 'United States',
      performance: {
        score: 87
      },
      joinedDate: '2023-08-22',
      lastActive: '2024-01-15T08:30:00Z',
      status: 'pending'
    }
  ];

  const regions: Region[] = [
    { id: 'us', name: 'United States', type: 'country', currentManager: 'Sarah Johnson', requiresManager: true },
    { id: 'ng', name: 'Nigeria', type: 'country', currentManager: 'Adebayo Okafor', requiresManager: true },
    { id: 'in', name: 'India', type: 'country', currentManager: 'Raj Patel', requiresManager: true },
    { id: 'lagos', name: 'Lagos', type: 'state', parentId: 'ng', currentManager: 'Folake Adebayo', requiresManager: true },
    { id: 'california', name: 'California', type: 'state', parentId: 'us', requiresManager: true },
    { id: 'mumbai', name: 'Mumbai', type: 'city', parentId: 'in', requiresManager: true }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.currentRole.id === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = useCallback((userId: string, newRoleId: string) => {
    const newRole = roles.find(r => r.id === newRoleId);
    if (!newRole) return;

    const change = {
      id: Date.now(),
      userId,
      userName: users.find(u => u.id === userId)?.name || '',
      action: 'role_change',
      from: users.find(u => u.id === userId)?.currentRole.name || '',
      to: newRole.name,
      timestamp: new Date().toISOString()
    };

    setPendingChanges(prev => [...prev, change]);
  }, [users, roles]);

  const handleBulkAssignment = () => {
    if (selectedUsers.length === 0 || !selectedRole) return;
    
    const role = roles.find(r => r.id === selectedRole);
    if (!role) return;

    const changes = selectedUsers.map(userId => ({
      id: Date.now() + Math.random(),
      userId,
      userName: users.find(u => u.id === userId)?.name || '',
      action: 'bulk_assignment',
      from: users.find(u => u.id === userId)?.currentRole.name || '',
      to: role.name,
      timestamp: new Date().toISOString()
    }));

    setPendingChanges(prev => [...prev, ...changes]);
    setSelectedUsers([]);
    setSelectedRole('');
    setShowAssignmentModal(false);
  };

  const handleSaveChanges = () => {
    // Here you would send the changes to the API
    console.log('Saving changes:', pendingChanges);
    setPendingChanges([]);
    // Show success message
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
          <p className="text-gray-600 mt-1">Assign and manage user roles across the organization</p>
        </div>
        <div className="flex items-center space-x-3">
          {pendingChanges.length > 0 && (
            <>
              <div className="flex items-center space-x-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span className="text-sm text-amber-800">{pendingChanges.length} pending changes</span>
              </div>
              <button
                onClick={handleSaveChanges}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </>
          )}
          <button
            onClick={() => setShowAssignmentModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Bulk Assignment</span>
          </button>
        </div>
      </div>

      {/* Role Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <div key={role.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${role.color.replace('text-', 'text-').replace('border-', '')}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{role.name}</h3>
                  <p className="text-sm text-gray-600">{role.currentAssignments} assigned</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{role.description}</p>
              
              {role.maxAssignments && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Capacity</span>
                    <span className="font-medium">{role.currentAssignments}/{role.maxAssignments}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${(role.currentAssignments / role.maxAssignments) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* User Management Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">User Role Assignments</h2>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(filteredUsers.map(u => u.id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((userProfile) => {
                const Icon = userProfile.currentRole.icon;
                return (
                  <tr key={userProfile.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(userProfile.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers(prev => [...prev, userProfile.id]);
                          } else {
                            setSelectedUsers(prev => prev.filter(id => id !== userProfile.id));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={userProfile.avatar} 
                          alt={userProfile.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{userProfile.name}</p>
                          <p className="text-sm text-gray-500">{userProfile.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${userProfile.currentRole.color}`}>
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{userProfile.currentRole.name}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {userProfile.assignedCountry && (
                          <p className="font-medium text-gray-900">{userProfile.assignedCountry}</p>
                        )}
                        {userProfile.assignedRegion && (
                          <p className="text-gray-500">{userProfile.assignedRegion}</p>
                        )}
                        {!userProfile.assignedCountry && !userProfile.assignedRegion && (
                          <p className="text-gray-400">No assignment</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-12 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-green-600"
                            style={{ width: `${userProfile.performance.score}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{userProfile.performance.score}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(userProfile.status)}`}>
                        {userProfile.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <select
                          value={userProfile.currentRole.id}
                          onChange={(e) => handleRoleChange(userProfile.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {roles.map(role => (
                            <option key={role.id} value={role.id}>{role.name}</option>
                          ))}
                        </select>
                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                          <Edit3 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Changes */}
      {pendingChanges.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Changes</h3>
          <div className="space-y-2">
            {pendingChanges.map((change) => (
              <div key={change.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span className="text-sm">
                    <strong>{change.userName}</strong> role change: {change.from} → {change.to}
                  </span>
                </div>
                <button
                  onClick={() => setPendingChanges(prev => prev.filter(c => c.id !== change.id))}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bulk Assignment Modal */}
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Role Assignment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose a role</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {selectedUsers.length} users selected for assignment
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAssignmentModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkAssignment}
                  disabled={!selectedRole || selectedUsers.length === 0}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleAssignmentInterface;
