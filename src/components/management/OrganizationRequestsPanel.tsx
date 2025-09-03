import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Users,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Mail,
  MapPin,
  Calendar,
  User,
  Building2,
  Star,
  MessageSquare,
  ExternalLink,
  RefreshCw,
  Download,
  MoreHorizontal,
  AlertCircle
} from 'lucide-react';

interface OrganizationRequest {
  id: string;
  userId: string;
  applicantName: string;
  applicantEmail: string;
  applicantRole: 'president' | 'ambassador';
  submittedAt: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  preferredRegion: string;
  requestReason: string;
  experience: string;
  availability: string;
  socialLinks: {
    linkedin: string;
    twitter: string;
    discord: string;
    other: string;
  };
  additionalInfo: string;
  reviewerId?: string;
  reviewerName?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  score?: number; // AI-generated applicant score
  tags: string[];
}

interface OrganizationRequestsPanelProps {
  organizationId?: string;
}

const OrganizationRequestsPanel: React.FC<OrganizationRequestsPanelProps> = ({ organizationId }) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<OrganizationRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<OrganizationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<OrganizationRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'score'>('newest');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [bulkActions, setBulkActions] = useState<string[]>([]);

  // Mock data - replace with actual API call
  useEffect(() => {
    const loadRequests = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockRequests: OrganizationRequest[] = [
          {
            id: 'req-001',
            userId: 'user-001',
            applicantName: 'Alex Johnson',
            applicantEmail: 'alex.johnson@email.com',
            applicantRole: 'ambassador',
            submittedAt: '2024-01-15T10:30:00Z',
            status: 'pending',
            preferredRegion: 'North America',
            requestReason: 'I am passionate about blockchain technology and financial inclusion. I have been following Stellar for over 2 years and believe in its mission to create an open financial system.',
            experience: 'Software developer with 5 years experience in fintech. Previously worked at a digital payments startup and have deep understanding of cross-border payments challenges.',
            availability: 'part-time',
            socialLinks: {
              linkedin: 'https://linkedin.com/in/alexjohnson',
              twitter: 'https://twitter.com/alexjdev',
              discord: 'alexj#1234',
              other: 'https://alexjohnson.dev'
            },
            additionalInfo: 'I also speak Spanish and Portuguese fluently, which could help with LATAM expansion.',
            score: 85,
            tags: ['Developer', 'Fintech', 'Multilingual']
          },
          {
            id: 'req-002',
            userId: 'user-002',
            applicantName: 'Sarah Chen',
            applicantEmail: 'sarah.chen@email.com',
            applicantRole: 'president',
            submittedAt: '2024-01-14T15:45:00Z',
            status: 'under_review',
            preferredRegion: 'Asia Pacific',
            requestReason: 'I want to lead the growth of Stellar in the Asia Pacific region. I have extensive experience in community building and blockchain education.',
            experience: 'Community manager at a major blockchain protocol for 3 years. Led initiatives that grew community from 5K to 50K members.',
            availability: 'full-time',
            socialLinks: {
              linkedin: 'https://linkedin.com/in/sarahchen',
              twitter: 'https://twitter.com/sarahcrypto',
              discord: 'sarahc#5678',
              other: ''
            },
            additionalInfo: 'Fluent in English, Mandarin, and Japanese. Have organized 15+ blockchain events.',
            reviewerId: 'admin-001',
            reviewerName: 'John Smith',
            score: 92,
            tags: ['Community', 'Leadership', 'Events']
          },
          {
            id: 'req-003',
            userId: 'user-003',
            applicantName: 'Miguel Rodriguez',
            applicantEmail: 'miguel.rodriguez@email.com',
            applicantRole: 'ambassador',
            submittedAt: '2024-01-13T09:20:00Z',
            status: 'approved',
            preferredRegion: 'Latin America',
            requestReason: 'I want to help bring financial inclusion to underbanked populations in Latin America through Stellar.',
            experience: 'Fintech consultant with focus on emerging markets. Worked with NGOs on financial literacy programs.',
            availability: 'flexible',
            socialLinks: {
              linkedin: 'https://linkedin.com/in/miguelrodriguez',
              twitter: 'https://twitter.com/miguel_fintech',
              discord: 'miguel#9999',
              other: 'https://miguelrodriguez.com'
            },
            additionalInfo: 'Based in Mexico City. Strong network in fintech and microfinance sectors.',
            reviewerId: 'admin-001',
            reviewerName: 'John Smith',
            reviewedAt: '2024-01-14T16:30:00Z',
            score: 88,
            tags: ['Fintech', 'NGO', 'Financial Inclusion']
          },
          {
            id: 'req-004',
            userId: 'user-004',
            applicantName: 'Emma Wilson',
            applicantEmail: 'emma.wilson@email.com',
            applicantRole: 'ambassador',
            submittedAt: '2024-01-12T14:15:00Z',
            status: 'rejected',
            preferredRegion: 'Europe',
            requestReason: 'I am interested in cryptocurrency and want to learn more about Stellar.',
            experience: 'Recent graduate with basic knowledge of blockchain technology.',
            availability: 'occasional',
            socialLinks: {
              linkedin: '',
              twitter: '',
              discord: 'emma#1111',
              other: ''
            },
            additionalInfo: '',
            reviewerId: 'admin-002',
            reviewerName: 'Lisa Davis',
            reviewedAt: '2024-01-13T11:45:00Z',
            rejectionReason: 'Limited relevant experience and unclear commitment level.',
            score: 42,
            tags: ['Entry Level']
          }
        ];
        
        setRequests(mockRequests);
        setFilteredRequests(mockRequests);
      } catch (error) {
        console.error('Failed to load requests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, [organizationId]);

  // Filter and search logic
  useEffect(() => {
    let filtered = requests;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.preferredRegion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(request => request.applicantRole === roleFilter);
    }

    // Region filter
    if (regionFilter !== 'all') {
      filtered = filtered.filter(request => request.preferredRegion === regionFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
        case 'oldest':
          return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
        case 'score':
          return (b.score || 0) - (a.score || 0);
        default:
          return 0;
      }
    });

    setFilteredRequests(filtered);
  }, [requests, searchTerm, statusFilter, roleFilter, regionFilter, sortBy]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'under_review': return 'text-blue-600 bg-blue-50';
      case 'approved': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'under_review': return RefreshCw;
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      default: return Clock;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'approved', reviewedAt: new Date().toISOString(), reviewerId: user?.id, reviewerName: user?.name }
          : req
      ));
    } catch (error) {
      console.error('Failed to approve request:', error);
    }
  };

  const handleRejectRequest = async (requestId: string, reason: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'rejected', rejectionReason: reason, reviewedAt: new Date().toISOString(), reviewerId: user?.id, reviewerName: user?.name }
          : req
      ));
    } catch (error) {
      console.error('Failed to reject request:', error);
    }
  };

  const handleBulkAction = async (action: 'approve' | 'reject', requestIds: string[]) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Update requests based on action
    } catch (error) {
      console.error('Failed to perform bulk action:', error);
    }
  };

  const exportRequests = () => {
    // Implementation for exporting requests to CSV
    console.log('Exporting requests...');
  };

  const regions = [...new Set(requests.map(req => req.preferredRegion))];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading organization requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organization Requests</h1>
          <p className="text-gray-600 mt-1">Manage membership requests from presidents and ambassadors</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportRequests}
            className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">
                {requests.filter(r => r.status === 'pending').length}
              </p>
              <p className="text-gray-600">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <RefreshCw className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">
                {requests.filter(r => r.status === 'under_review').length}
              </p>
              <p className="text-gray-600">Under Review</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">
                {requests.filter(r => r.status === 'approved').length}
              </p>
              <p className="text-gray-600">Approved</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">
                {requests.filter(r => r.status === 'rejected').length}
              </p>
              <p className="text-gray-600">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search applicants..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Role Filter */}
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="president">President</option>
            <option value="ambassador">Ambassador</option>
          </select>

          {/* Region Filter */}
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
          >
            <option value="all">All Regions</option>
            {regions.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="score">Highest Score</option>
          </select>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-600">No organization requests match your current filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Region
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => {
                  const StatusIcon = getStatusIcon(request.status);
                  return (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-500" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{request.applicantName}</div>
                            <div className="text-sm text-gray-500">{request.applicantEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          request.applicantRole === 'president' 
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {request.applicantRole}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.preferredRegion}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {request.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {request.score && (
                          <span className={`text-sm font-medium ${getScoreColor(request.score)}`}>
                            {request.score}/100
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(request.submittedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApproveRequest(request.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowReviewModal(true);
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && !showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Request Details</h3>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              {/* Request content */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">{selectedRequest.applicantName}</h4>
                    <p className="text-gray-600">{selectedRequest.applicantEmail}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{selectedRequest.applicantRole}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Preferred Region</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRequest.preferredRegion}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Availability</label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{selectedRequest.availability.replace('-', ' ')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Submitted</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedRequest.submittedAt)}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Motivation</label>
                  <p className="mt-1 text-sm text-gray-900 leading-relaxed">{selectedRequest.requestReason}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Experience</label>
                  <p className="mt-1 text-sm text-gray-900 leading-relaxed">{selectedRequest.experience}</p>
                </div>

                {selectedRequest.additionalInfo && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Additional Information</label>
                    <p className="mt-1 text-sm text-gray-900 leading-relaxed">{selectedRequest.additionalInfo}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Social Links</label>
                  <div className="space-y-2">
                    {selectedRequest.socialLinks.linkedin && (
                      <a href={selectedRequest.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        LinkedIn
                      </a>
                    )}
                    {selectedRequest.socialLinks.twitter && (
                      <a href={selectedRequest.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Twitter/X
                      </a>
                    )}
                    {selectedRequest.socialLinks.discord && (
                      <p className="text-sm text-gray-900">Discord: {selectedRequest.socialLinks.discord}</p>
                    )}
                    {selectedRequest.socialLinks.other && (
                      <a href={selectedRequest.socialLinks.other} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Portfolio/Website
                      </a>
                    )}
                  </div>
                </div>

                {selectedRequest.score && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">AI Assessment Score</label>
                    <div className="mt-1 flex items-center">
                      <span className={`text-2xl font-bold ${getScoreColor(selectedRequest.score)}`}>
                        {selectedRequest.score}/100
                      </span>
                      <div className="ml-4 flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${selectedRequest.score >= 80 ? 'bg-green-500' : selectedRequest.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${selectedRequest.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedRequest.tags.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedRequest.tags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {selectedRequest.status === 'pending' && (
                <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => handleApproveRequest(selectedRequest.id)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showReviewModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Request</h3>
              <p className="text-gray-600 mb-4">
                Please provide a reason for rejecting {selectedRequest.applicantName}'s request:
              </p>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter rejection reason..."
              />
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    setSelectedRequest(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // handleRejectRequest(selectedRequest.id, rejectionReason);
                    setShowReviewModal(false);
                    setSelectedRequest(null);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationRequestsPanel;
