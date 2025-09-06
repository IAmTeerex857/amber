import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Building2,
  User,
  Mail,
  MessageSquare,
  MapPin,
  Calendar,
  Send,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Globe,
  AlertTriangle,
  Crown,
  FileText
} from 'lucide-react';

interface OrganizationRequestData {
  organizationId: string;
  organizationName: string;
  requestReason: string;
  experience: string;
  preferredRegion: string;
  availability: string;
  socialLinks: {
    linkedin: string;
    twitter: string;
    discord: string;
    other: string;
  };
  additionalInfo: string;
}

interface OrganizationRequestFormProps {
  onBack?: () => void;
  onSuccess?: () => void;
}

const OrganizationRequestForm: React.FC<OrganizationRequestFormProps> = ({ onBack, onSuccess }) => {
  const { user, submitOrganizationRequest, organizations } = useAuth();
  const [formData, setFormData] = useState<OrganizationRequestData>({
    organizationId: '',
    organizationName: '',
    requestReason: '',
    experience: '',
    preferredRegion: '',
    availability: '',
    socialLinks: {
      linkedin: '',
      twitter: '',
      discord: '',
      other: ''
    },
    additionalInfo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  // Mock organizations for Stellar pilot
  const availableOrganizations = [
    {
      id: 'stellar-foundation',
      name: 'Stellar Development Foundation',
      description: 'Building a more equitable financial system',
      logo: '/Stellar logos.jpeg',
      regions: ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Africa', 'Middle East'],
      memberCount: 1250,
      discordServer: 'Stellar Community'
    },
    {
      id: 'stellar-ecosystem',
      name: 'Stellar Ecosystem Partners',
      description: 'Supporting projects building on Stellar',
      logo: '/Stellar logos.jpeg',
      regions: ['Global', 'North America', 'Europe', 'Asia'],
      memberCount: 450,
      discordServer: 'Stellar Builders'
    }
  ];

  const selectedOrg = availableOrganizations.find(org => org.id === formData.organizationId);

  const handleInputChange = (field: keyof OrganizationRequestData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLinkChange = (platform: keyof typeof formData.socialLinks, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleOrganizationSelect = (orgId: string) => {
    const org = availableOrganizations.find(o => o.id === orgId);
    setFormData(prev => ({
      ...prev,
      organizationId: orgId,
      organizationName: org?.name || '',
      preferredRegion: '' // Reset region when org changes
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.organizationId || !formData.requestReason || !formData.experience) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Call the actual submit function from AuthContext
      await submitOrganizationRequest(formData);
      
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedToStep2 = formData.organizationId && formData.requestReason && formData.experience;
  const canSubmit = canProceedToStep2 && formData.preferredRegion;

  if (currentStep === 1) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <img src="/Stellar logos.jpeg" alt="Stellar Logo" className="h-12 w-12 mx-auto mb-4 rounded-lg object-cover" />
              <h1 className="text-2xl font-bold text-gray-900">Join an Organization</h1>
              <p className="text-gray-600 mt-2">
                Request to join an organization as a {user?.role}
              </p>
            </div>

            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                <span>Step 1 of 2</span>
                <span>Organization & Details</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full w-1/2"></div>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setCurrentStep(2); }} className="space-y-6">
              {/* Organization Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Organization *
                </label>
                <div className="grid gap-4">
                  {availableOrganizations.map((org) => (
                    <div
                      key={org.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        formData.organizationId === org.id
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleOrganizationSelect(org.id)}
                    >
                      <div className="flex items-start space-x-4">
                        <img
                          src={org.logo}
                          alt={org.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900">{org.name}</h3>
                          <p className="text-gray-600 text-sm mt-1">{org.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {org.memberCount} members
                            </span>
                            <span className="flex items-center">
                              <Globe className="h-4 w-4 mr-1" />
                              {org.regions.length} regions
                            </span>
                          </div>
                        </div>
                        {formData.organizationId === org.id && (
                          <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Request Reason */}
              <div>
                <label htmlFor="requestReason" className="block text-sm font-medium text-gray-700 mb-2">
                  Why do you want to join this organization? *
                </label>
                <textarea
                  id="requestReason"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Explain your motivation and what you hope to contribute..."
                  value={formData.requestReason}
                  onChange={(e) => handleInputChange('requestReason', e.target.value)}
                  required
                />
              </div>

              {/* Experience */}
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                  Relevant Experience *
                </label>
                <textarea
                  id="experience"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your relevant experience, skills, and background..."
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between pt-6">
                {onBack && (
                  <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!canProceedToStep2}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors ml-auto"
                >
                  Continue
                  <Send className="h-4 w-4 ml-2" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Additional Details
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <img src="/Stellar logos.jpeg" alt="Stellar Logo" className="h-12 w-12 mx-auto mb-4 rounded-lg object-cover" />
            <h1 className="text-2xl font-bold text-gray-900">Additional Information</h1>
            <p className="text-gray-600 mt-2">
              Complete your request to join {selectedOrg?.name}
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span>Step 2 of 2</span>
              <span>Regional Preferences & Contact Info</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full w-full"></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Preferred Region */}
            <div>
              <label htmlFor="preferredRegion" className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Region/Chapter *
              </label>
              <select
                id="preferredRegion"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.preferredRegion}
                onChange={(e) => handleInputChange('preferredRegion', e.target.value)}
                required
              >
                <option value="">Select a region...</option>
                {selectedOrg?.regions.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            {/* Availability */}
            <div>
              <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <select
                id="availability"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.availability}
                onChange={(e) => handleInputChange('availability', e.target.value)}
              >
                <option value="">Select availability...</option>
                <option value="full-time">Full-time (40+ hours/week)</option>
                <option value="part-time">Part-time (20-40 hours/week)</option>
                <option value="flexible">Flexible (10-20 hours/week)</option>
                <option value="occasional">Occasional (5-10 hours/week)</option>
              </select>
            </div>

            {/* Social Links */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Social Media & Professional Links
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="linkedin" className="block text-xs font-medium text-gray-600 mb-1">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    id="linkedin"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://linkedin.com/in/..."
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="twitter" className="block text-xs font-medium text-gray-600 mb-1">
                    Twitter/X
                  </label>
                  <input
                    type="url"
                    id="twitter"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://twitter.com/..."
                    value={formData.socialLinks.twitter}
                    onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="discord" className="block text-xs font-medium text-gray-600 mb-1">
                    Discord Username
                  </label>
                  <input
                    type="text"
                    id="discord"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="username#1234"
                    value={formData.socialLinks.discord}
                    onChange={(e) => handleSocialLinkChange('discord', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="other" className="block text-xs font-medium text-gray-600 mb-1">
                    Portfolio/Website
                  </label>
                  <input
                    type="url"
                    id="other"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://yoursite.com"
                    value={formData.socialLinks.other}
                    onChange={(e) => handleSocialLinkChange('other', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information
              </label>
              <textarea
                id="additionalInfo"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any additional information you'd like to share..."
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
              />
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </button>
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
                <Send className="h-4 w-4 ml-2" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrganizationRequestForm;
