import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Clock,
  Building2,
  Mail,
  CheckCircle,
  XCircle,
  RefreshCw,
  MessageSquare,
  Calendar,
  User,
  Edit3,
  ExternalLink,
  AlertTriangle,
  Crown,
  FileText,
  Brain,
  AlertCircle
} from 'lucide-react';

interface PendingRequest {
  id: string;
  organizationId: string;
  organizationName: string;
  organizationLogo: string;
  submittedAt: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  estimatedReviewTime: string;
  reviewerName?: string;
  rejectionReason?: string;
  lastUpdated: string;
  requestData: {
    preferredRegion: string;
    requestReason: string;
    experience: string;
    availability: string;
  };
}

interface PendingApprovalScreenProps {
  onEditRequest?: () => void;
  onWithdrawRequest?: () => void;
}

const PendingApprovalScreen: React.FC<PendingApprovalScreenProps> = ({
  onEditRequest,
  onWithdrawRequest
}) => {
  const { user, checkRequestStatus, submitOrganizationRequest } = useAuth();
  const [request, setRequest] = useState<PendingRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);

  // Mock request data - replace with actual API call
  useEffect(() => {
    const loadRequestData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - replace with actual API response
        const mockRequest: PendingRequest = {
          id: 'req-123',
          organizationId: 'stellar-foundation',
          organizationName: 'Stellar Development Foundation',
          organizationLogo: '/Stellar logos.jpeg',
          submittedAt: '2024-01-15T10:30:00Z',
          status: 'under_review',
          estimatedReviewTime: '3-5 business days',
          reviewerName: 'Sarah Chen',
          lastUpdated: '2024-01-16T14:20:00Z',
          requestData: {
            preferredRegion: 'North America',
            requestReason: 'I am passionate about blockchain technology and financial inclusion...',
            experience: 'Software developer with 5 years experience in fintech...',
            availability: 'part-time'
          }
        };
        
        setRequest(mockRequest);
      } catch (error) {
        console.error('Failed to load request data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRequestData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate API call to check status
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real implementation: await checkRequestStatus();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleWithdrawRequest = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real implementation: await withdrawRequest(request.id);
      onWithdrawRequest?.();
    } catch (error) {
      console.error('Failed to withdraw request:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'under_review': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'approved': return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
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
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your request status...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">No Pending Request Found</h1>
          <p className="text-gray-600">You don't have any pending organization requests.</p>
        </div>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(request.status);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <img 
            src="/Stellar logos.jpeg" 
            alt="Stellar Logo" 
            className="h-12 w-12 mx-auto mb-4 rounded-lg object-cover"
          />
          <h1 className="text-3xl font-bold text-gray-900">Organization Request Status</h1>
          <p className="text-gray-600 mt-2">
            Track the progress of your membership request
          </p>
        </div>

        {/* Main Status Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          {/* Organization Info */}
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={request.organizationLogo}
              alt={request.organizationName}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{request.organizationName}</h2>
              <p className="text-gray-600">Request submitted {formatRelativeTime(request.submittedAt)}</p>
            </div>
          </div>

          {/* Status */}
          <div className={`inline-flex items-center px-4 py-2 rounded-full border ${getStatusColor(request.status)} mb-6`}>
            <StatusIcon className="h-5 w-5 mr-2" />
            <span className="font-medium capitalize">{request.status.replace('_', ' ')}</span>
          </div>

          {/* Status Details */}
          <div className="space-y-4">
            {request.status === 'pending' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-yellow-800">Request Submitted</h3>
                    <p className="text-yellow-700 text-sm mt-1">
                      Your request is in the queue and will be reviewed soon. Estimated review time: {request.estimatedReviewTime}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {request.status === 'under_review' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <RefreshCw className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-blue-800">Under Review</h3>
                    <p className="text-blue-700 text-sm mt-1">
                      {request.reviewerName ? `${request.reviewerName} is reviewing your request.` : 'Your request is being reviewed by the organization team.'}
                      {' '}Expected completion: {request.estimatedReviewTime}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {request.status === 'approved' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-green-800">Request Approved!</h3>
                    <p className="text-green-700 text-sm mt-1">
                      Congratulations! Your request has been approved. You can now proceed with the onboarding process.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {request.status === 'rejected' && request.rejectionReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-red-800">Request Not Approved</h3>
                    <p className="text-red-700 text-sm mt-1">{request.rejectionReason}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Last Updated */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <span className="text-sm text-gray-500">
              Last updated: {formatDate(request.lastUpdated)}
            </span>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Status
            </button>
          </div>
        </div>

        {/* Request Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Request Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Region
              </label>
              <p className="text-gray-900">{request.requestData.preferredRegion}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <p className="text-gray-900 capitalize">{request.requestData.availability.replace('-', ' ')}</p>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivation & Interest
            </label>
            <p className="text-gray-900 leading-relaxed">{request.requestData.requestReason}</p>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relevant Experience
            </label>
            <p className="text-gray-900 leading-relaxed">{request.requestData.experience}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Actions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(request.status === 'pending' || request.status === 'under_review') && (
              <>
                {onEditRequest && (
                  <button
                    onClick={onEditRequest}
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Request
                  </button>
                )}
                
                <button
                  onClick={() => setShowWithdrawConfirm(true)}
                  className="flex items-center justify-center px-4 py-3 border border-red-300 rounded-lg text-red-700 hover:bg-red-50 transition-colors"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Withdraw Request
                </button>
              </>
            )}

            {request.status === 'approved' && (
              <button
                onClick={() => {/* Navigate to onboarding */}}
                className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors md:col-span-2"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Continue Onboarding
              </button>
            )}

            {request.status === 'rejected' && (
              <button
                onClick={() => {/* Navigate to new request */}}
                className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors md:col-span-2"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Submit New Request
              </button>
            )}
          </div>

          {/* Contact Support */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">
              Need help with your request?
            </p>
            <button className="flex items-center text-sm text-blue-600 hover:text-blue-700">
              <MessageSquare className="h-4 w-4 mr-1" />
              Contact Support
            </button>
          </div>
        </div>

        {/* Demo Proceed Button */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <button
              onClick={() => {
                // Simulate approved status and proceed to president dashboard
                const approvedUser = {
                  ...user,
                  organizationId: 'stellar-org',
                  organizationRequestStatus: 'approved',
                  isOnboarded: true,
                  role: 'president',
                  chapterId: 'north-america'
                };
                localStorage.setItem('userData', JSON.stringify(approvedUser));
                window.location.href = '/dashboard';
              }}
              className="w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <Crown className="h-5 w-5 mr-2" />
              Proceed as President
            </button>
          </div>
        </div>

        {/* Withdraw Confirmation Modal */}
        {showWithdrawConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Withdraw Request</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to withdraw your organization request? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowWithdrawConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdrawRequest}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Withdraw
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingApprovalScreen;
