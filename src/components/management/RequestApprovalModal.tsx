import React, { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  User,
  MapPin,
  Star,
  Clock,
  MessageSquare,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Send
} from 'lucide-react';

interface OrganizationRequest {
  id: string;
  userId: string;
  applicantName: string;
  applicantEmail: string;
  applicantRole: 'president' | 'ambassador';
  submittedAt: string;
  preferredRegion: string;
  requestReason: string;
  experience: string;
  availability: string;
  score?: number;
  tags: string[];
}

interface RequestApprovalModalProps {
  request: OrganizationRequest;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (requestId: string, approvalData?: any) => Promise<void>;
  onReject: (requestId: string, rejectionReason: string) => Promise<void>;
  isProcessing?: boolean;
}

const RequestApprovalModal: React.FC<RequestApprovalModalProps> = ({
  request,
  isOpen,
  onClose,
  onApprove,
  onReject,
  isProcessing = false
}) => {
  const [currentAction, setCurrentAction] = useState<'view' | 'approve' | 'reject'>('view');
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvalData, setApprovalData] = useState({
    welcomeMessage: '',
    assignedMentor: '',
    startDate: '',
    probationPeriod: 30,
    customNotes: ''
  });
  const [customRejectionReason, setCustomRejectionReason] = useState('');

  const predefinedRejectionReasons = [
    'Insufficient relevant experience',
    'Unclear motivation or commitment level',
    'Does not meet minimum requirements',
    'Better fit for different role',
    'Capacity constraints in preferred region',
    'Application quality below standards',
    'Other (please specify)'
  ];

  const handleApprove = async () => {
    try {
      await onApprove(request.id, approvalData);
      onClose();
    } catch (error) {
      console.error('Failed to approve request:', error);
    }
  };

  const handleReject = async () => {
    const finalReason = rejectionReason === 'Other (please specify)' 
      ? customRejectionReason 
      : rejectionReason;
    
    if (!finalReason.trim()) {
      return;
    }

    try {
      await onReject(request.id, finalReason);
      onClose();
    } catch (error) {
      console.error('Failed to reject request:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {currentAction === 'view' && 'Review Request'}
              {currentAction === 'approve' && 'Approve Request'}
              {currentAction === 'reject' && 'Reject Request'}
            </h3>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>

          {/* Applicant Info */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex items-start space-x-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">{request.applicantName}</h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    request.applicantRole === 'president' 
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {request.applicantRole}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{request.applicantEmail}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {request.preferredRegion}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatDate(request.submittedAt)}
                  </span>
                  {request.score && (
                    <span className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(request.score)}`}>
                      <Star className="h-3 w-3 mr-1" />
                      {request.score}/100
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            {request.tags.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {request.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white border border-gray-200 text-gray-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Request Details */}
          {currentAction === 'view' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivation & Interest
                </label>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-900 leading-relaxed">{request.requestReason}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relevant Experience
                </label>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-900 leading-relaxed">{request.experience}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Region
                  </label>
                  <p className="text-gray-900">{request.preferredRegion}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <p className="text-gray-900 capitalize">{request.availability.replace('-', ' ')}</p>
                </div>
              </div>

              {/* AI Assessment */}
              {request.score && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    AI Assessment
                  </label>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">Overall Score</span>
                      <span className={`text-lg font-bold ${request.score >= 80 ? 'text-green-600' : request.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {request.score}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div 
                        className={`h-2 rounded-full ${request.score >= 80 ? 'bg-green-500' : request.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${request.score}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Based on experience relevance, motivation clarity, and background fit.
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setCurrentAction('approve')}
                  disabled={isProcessing}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Approve Request
                </button>
                <button
                  onClick={() => setCurrentAction('reject')}
                  disabled={isProcessing}
                  className="flex-1 flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                >
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  Reject Request
                </button>
              </div>
            </div>
          )}

          {/* Approval Form */}
          {currentAction === 'approve' && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-green-800">Approving {request.applicantName}</h4>
                    <p className="text-green-700 text-sm mt-1">
                      They will be granted access to the organization and can proceed with onboarding.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="welcomeMessage" className="block text-sm font-medium text-gray-700 mb-2">
                  Welcome Message (Optional)
                </label>
                <textarea
                  id="welcomeMessage"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Welcome to the team! We're excited to have you join us..."
                  value={approvalData.welcomeMessage}
                  onChange={(e) => setApprovalData(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="assignedMentor" className="block text-sm font-medium text-gray-700 mb-2">
                    Assign Mentor (Optional)
                  </label>
                  <input
                    type="text"
                    id="assignedMentor"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter mentor name..."
                    value={approvalData.assignedMentor}
                    onChange={(e) => setApprovalData(prev => ({ ...prev, assignedMentor: e.target.value }))}
                  />
                </div>
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={approvalData.startDate}
                    onChange={(e) => setApprovalData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="probationPeriod" className="block text-sm font-medium text-gray-700 mb-2">
                  Probation Period (days)
                </label>
                <select
                  id="probationPeriod"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={approvalData.probationPeriod}
                  onChange={(e) => setApprovalData(prev => ({ ...prev, probationPeriod: Number(e.target.value) }))}
                >
                  <option value={0}>No probation period</option>
                  <option value={30}>30 days</option>
                  <option value={60}>60 days</option>
                  <option value={90}>90 days</option>
                </select>
              </div>

              <div>
                <label htmlFor="customNotes" className="block text-sm font-medium text-gray-700 mb-2">
                  Internal Notes (Optional)
                </label>
                <textarea
                  id="customNotes"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Internal notes about this approval..."
                  value={approvalData.customNotes}
                  onChange={(e) => setApprovalData(prev => ({ ...prev, customNotes: e.target.value }))}
                />
              </div>

              <div className="flex space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setCurrentAction('view')}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                >
                  Back to Review
                </button>
                <button
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirm Approval
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Rejection Form */}
          {currentAction === 'reject' && (
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-red-800">Rejecting {request.applicantName}</h4>
                    <p className="text-red-700 text-sm mt-1">
                      Please provide a clear reason for rejection to help them improve future applications.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Reason for Rejection *
                </label>
                <div className="space-y-2">
                  {predefinedRejectionReasons.map((reason) => (
                    <label key={reason} className="flex items-start space-x-3">
                      <input
                        type="radio"
                        name="rejectionReason"
                        value={reason}
                        checked={rejectionReason === reason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="mt-1 focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              {rejectionReason === 'Other (please specify)' && (
                <div>
                  <label htmlFor="customReason" className="block text-sm font-medium text-gray-700 mb-2">
                    Please specify the reason *
                  </label>
                  <textarea
                    id="customReason"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Please provide specific feedback..."
                    value={customRejectionReason}
                    onChange={(e) => setCustomRejectionReason(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="flex space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setCurrentAction('view')}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                >
                  Back to Review
                </button>
                <button
                  onClick={handleReject}
                  disabled={isProcessing || !rejectionReason || (rejectionReason === 'Other (please specify)' && !customRejectionReason.trim())}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Rejection
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestApprovalModal;
