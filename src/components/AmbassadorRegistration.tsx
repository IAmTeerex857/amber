import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Building2,
  GraduationCap,
  Star,
  Check,
  ArrowRight,
  ArrowLeft,
  Users,
  Target,
  Gift,
  Info,
  CheckCircle2,
  Link2,
  X,
  Camera,
  Briefcase
} from 'lucide-react';
import { SocialIcon } from './SocialMediaIcons';

interface AmbassadorData {
  // Basic Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  
  // Ambassador Type
  type: 'student' | 'influencer' | 'business';
  
  // Type-specific data
  student?: {
    university: string;
    major: string;
    graduationYear: string;
    campusInfluence: string;
  };
  
  influencer?: {
    primaryPlatform: string;
    followerCount: string;
    engagementRate: string;
    contentNiche: string[];
  };
  
  business?: {
    companyName: string;
    role: string;
    industry: string;
    companySize: string;
  };
  
  // Social Media
  socialMedia: {
    instagram?: string;
    tiktok?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
    snapchat?: string;
  };
  
  // Motivation & Goals
  motivation: string;
  goals: string[];
  referralSource: string;
}

const AmbassadorRegistration: React.FC = () => {
  const { updateUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<'student' | 'influencer' | 'business' | null>(null);
  const [formData, setFormData] = useState<AmbassadorData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    type: 'student',
    socialMedia: {},
    motivation: '',
    goals: [],
    referralSource: ''
  });

  type PlatformKey = 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'snapchat';
  const platformKeys: PlatformKey[] = ['instagram', 'tiktok', 'youtube', 'twitter', 'snapchat'];

  const [connections, setConnections] = useState<Record<PlatformKey, boolean>>({
    instagram: false,
    tiktok: false,
    youtube: false,
    twitter: false,
    snapchat: false,
  });

  const [socialError, setSocialError] = useState<string | null>(null);

  const toggleConnect = (key: PlatformKey) => {
    setConnections(prev => ({ ...prev, [key]: !prev[key] }));
    setSocialError(null);
  };

  const updateHandle = (key: PlatformKey, value: string) => {
    handleNestedInputChange('socialMedia', key, value);
    setSocialError(null);
  };

  // Brand styles for platform icons
  const brandWrapperClass: Record<PlatformKey, string> = {
    instagram: 'bg-blue-600',
    tiktok: 'bg-black ring-1 ring-cyan-400/40',
    youtube: 'bg-red-600',
    twitter: 'bg-black',
    snapchat: 'bg-yellow-400',
  };

  const brandIconColorClass: Record<PlatformKey, string> = {
    instagram: 'text-white',
    tiktok: 'text-white',
    youtube: 'text-white',
    twitter: 'text-white',
    snapchat: 'text-black',
  };

  const brandLinkColorClass: Record<PlatformKey, string> = {
    instagram: 'text-blue-500',
    tiktok: 'text-cyan-400',
    youtube: 'text-red-500',
    twitter: 'text-gray-900',
    snapchat: 'text-yellow-500',
  };

  const steps = [
    { id: 1, name: 'Ambassador Type', icon: Users },
    { id: 2, name: 'Basic Information', icon: User },
    { id: 3, name: 'Profile Details', icon: Star },
    { id: 4, name: 'Social Media', icon: Instagram },
    { id: 5, name: 'Goals & Motivation', icon: Target }
  ];

  // Colored themes per onboarding step
  const STEP_COLORS: Record<number, { bg: string; border: string; text: string; line: string }> = {
    1: { bg: 'bg-indigo-600', border: 'border-indigo-600', text: 'text-indigo-600', line: 'bg-indigo-600' },
    2: { bg: 'bg-sky-600', border: 'border-sky-600', text: 'text-sky-600', line: 'bg-sky-600' },
    3: { bg: 'bg-purple-600', border: 'border-purple-600', text: 'text-purple-600', line: 'bg-purple-600' },
    4: { bg: 'bg-pink-600', border: 'border-pink-600', text: 'text-pink-600', line: 'bg-pink-600' },
    5: { bg: 'bg-emerald-600', border: 'border-emerald-600', text: 'text-emerald-600', line: 'bg-emerald-600' },
  };

  // Colored themes for ambassador type icons
  const TYPE_COLORS: Record<'blue' | 'purple' | 'green', { bg: string; light: string; text: string; border: string }> = {
    blue:   { bg: 'bg-blue-500',   light: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-500' },
    purple: { bg: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-500' },
    green:  { bg: 'bg-green-500',  light: 'bg-green-50',  text: 'text-green-600',  border: 'border-green-500' },
  };

  const ambassadorTypes = [
    {
      id: 'student',
      title: 'Student Ambassador',
      description: 'University students looking to earn money and gain marketing experience',
      icon: GraduationCap,
      benefits: ['Flexible earning opportunities', 'Resume building experience', 'Campus networking'],
      color: 'blue'
    },
    {
      id: 'influencer',
      title: 'Content Creator',
      description: 'Social media influencers and content creators with engaged audiences',
      icon: Star,
      benefits: ['Creative freedom', 'Performance-based rewards', 'Brand partnerships'],
      color: 'purple'
    },
    {
      id: 'business',
      title: 'Business Partner',
      description: 'Business owners and professionals for B2B referrals and partnerships',
      icon: Building2,
      benefits: ['High-value commissions', 'Strategic partnerships', 'Lead generation'],
      color: 'green'
    }
  ];

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedInputChange = (section: string, field: string, value: string | string[]) => {
    setFormData(prev => {
      const currentSection = prev[section as keyof AmbassadorData];
      const updatedSection = typeof currentSection === 'object' && currentSection !== null 
        ? { ...currentSection, [field]: value }
        : { [field]: value };
      
      return {
        ...prev,
        [section]: updatedSection
      };
    });
  };

  const nextStep = () => {
    if (currentStep === 4) {
      const anyConnected = platformKeys.some((k) => connections[k]);
      const anyHandle = Object.values(formData.socialMedia || {}).some((v) => !!v);
      if (!anyConnected && !anyHandle) {
        setSocialError('Connect at least one social account or provide a profile handle to continue.');
        return;
      }
    }
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Ambassador registration:', formData);
    
    // Mark user as onboarded to complete the registration flow
    updateUser({ isOnboarded: true });
    
    // Optional: Show success message
    alert('Registration completed successfully! Welcome to the ambassador program.');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Choose Your Ambassador Type</h2>
              <p className="text-lg text-gray-600">Select the option that best describes you</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              {ambassadorTypes.map((type) => (
                <div
                  key={type.id}
                  onClick={() => {
                    setSelectedType(type.id as 'student' | 'influencer' | 'business');
                    handleInputChange('type', type.id);
                  }}
                  className={`
                    group relative bg-white border-2 rounded-3xl p-8 cursor-pointer transition-all duration-300 transform hover:scale-105
                    ${selectedType === type.id 
                      ? `${TYPE_COLORS[(type.color as 'blue'|'purple'|'green')].border} ${TYPE_COLORS[(type.color as 'blue'|'purple'|'green')].light} shadow-xl ring-4 ring-blue-100 scale-105`
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                    }
                  `}
                >
                  {selectedType === type.id && (
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className={`
                      mx-auto w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-all duration-300
                      ${selectedType === type.id 
                        ? `${TYPE_COLORS[(type.color as 'blue'|'purple'|'green')].bg} text-white shadow-lg` 
                        : `${TYPE_COLORS[(type.color as 'blue'|'purple'|'green')].light} ${TYPE_COLORS[(type.color as 'blue'|'purple'|'green')].text} group-hover:shadow-md`
                      }
                    `}>
                      <type.icon className="h-10 w-10" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{type.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{type.description}</p>
                    
                    <div className="space-y-3">
                      {type.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start text-sm text-gray-700">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                            <Check className="h-3 w-3 text-green-600" />
                          </div>
                          <span className="leading-relaxed">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Basic Information</h2>
              <p className="text-lg text-gray-600">Tell us about yourself</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    First Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="Your first name"
                    />
                    <User className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Last Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="Your last name"
                    />
                    <User className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="your.email@example.com"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">@</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="+1 (555) 123-4567"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400">📞</div>
                  </div>
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Location *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="City, State/Country"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400">🌍</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Profile Details</h2>
              <p className="text-lg text-gray-600">
                {formData.type === 'student' && 'Tell us about your university and studies'}
                {formData.type === 'influencer' && 'Share details about your content and audience'}
                {formData.type === 'business' && 'Tell us about your business and role'}
              </p>
            </div>
            
            {formData.type === 'student' && (
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl p-8 border border-purple-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mr-4">
                    <GraduationCap className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Student Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      University *
                    </label>
                    <input
                      type="text"
                      value={formData.student?.university || ''}
                      onChange={(e) => handleNestedInputChange('student', 'university', e.target.value)}
                      className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="University name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Major/Field of Study
                    </label>
                    <input
                      type="text"
                      value={formData.student?.major || ''}
                      onChange={(e) => handleNestedInputChange('student', 'major', e.target.value)}
                      className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="e.g., Business Administration"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Expected Graduation Year
                    </label>
                    <select
                      value={formData.student?.graduationYear || ''}
                      onChange={(e) => handleNestedInputChange('student', 'graduationYear', e.target.value)}
                      className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-gray-900"
                    >
                      <option value="">Select year</option>
                      {[2024, 2025, 2026, 2027, 2028].map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Campus Influence Level
                    </label>
                    <select
                      value={formData.student?.campusInfluence || ''}
                      onChange={(e) => handleNestedInputChange('student', 'campusInfluence', e.target.value)}
                      className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-gray-900"
                    >
                      <option value="">Select level</option>
                      <option value="low">Low - Few connections</option>
                      <option value="medium">Medium - Some friend groups</option>
                      <option value="high">High - Well-connected, clubs/organizations</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            
            {formData.type === 'influencer' && (
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-8 border border-pink-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center mr-4">
                    <Camera className="h-6 w-6 text-pink-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Influencer Details</h3>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        Primary Platform *
                      </label>
                      <select
                        value={formData.influencer?.primaryPlatform || ''}
                        onChange={(e) => handleNestedInputChange('influencer', 'primaryPlatform', e.target.value)}
                        className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-gray-900"
                      >
                        <option value="">Select platform</option>
                        <option value="instagram">Instagram</option>
                        <option value="tiktok">TikTok</option>
                        <option value="youtube">YouTube</option>
                        <option value="twitter">Twitter/X</option>
                        <option value="linkedin">LinkedIn</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        Follower Count *
                      </label>
                      <select
                        value={formData.influencer?.followerCount || ''}
                        onChange={(e) => handleNestedInputChange('influencer', 'followerCount', e.target.value)}
                        className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-gray-900"
                      >
                        <option value="">Select range</option>
                        <option value="1k-5k">1K - 5K</option>
                        <option value="5k-10k">5K - 10K</option>
                        <option value="10k-50k">10K - 50K</option>
                        <option value="50k-100k">50K - 100K</option>
                        <option value="100k+">100K+</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-900">
                      Content Niche (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['Lifestyle', 'Fashion', 'Tech', 'Finance', 'Food', 'Travel', 'Fitness', 'Beauty', 'Education'].map((niche) => (
                        <label key={niche} className="group flex items-center bg-white rounded-2xl p-4 border-2 border-gray-200 cursor-pointer hover:border-pink-300 transition-all duration-200">
                          <input
                            type="checkbox"
                            checked={formData.influencer?.contentNiche?.includes(niche) || false}
                            onChange={(e) => {
                              const current = formData.influencer?.contentNiche || [];
                              const updated = e.target.checked 
                                ? [...current, niche]
                                : current.filter(n => n !== niche);
                              handleNestedInputChange('influencer', 'contentNiche', updated);
                            }}
                            className="w-5 h-5 rounded-lg border-2 border-gray-300 text-pink-600 focus:ring-2 focus:ring-pink-500 mr-3"
                          />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-pink-600">{niche}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {formData.type === 'business' && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mr-4">
                    <Briefcase className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Business Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={formData.business?.companyName || ''}
                      onChange={(e) => handleNestedInputChange('business', 'companyName', e.target.value)}
                      className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="Your company name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Your Role *
                    </label>
                    <input
                      type="text"
                      value={formData.business?.role || ''}
                      onChange={(e) => handleNestedInputChange('business', 'role', e.target.value)}
                      className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="e.g., CEO, Marketing Director"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Industry
                    </label>
                    <select
                      value={formData.business?.industry || ''}
                      onChange={(e) => handleNestedInputChange('business', 'industry', e.target.value)}
                      className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900"
                    >
                      <option value="">Select industry</option>
                      <option value="technology">Technology</option>
                      <option value="marketing">Marketing & Advertising</option>
                      <option value="finance">Finance & Banking</option>
                      <option value="retail">Retail & E-commerce</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="education">Education</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Company Size
                    </label>
                    <select
                      value={formData.business?.companySize || ''}
                      onChange={(e) => handleNestedInputChange('business', 'companySize', e.target.value)}
                      className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900"
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-1000">201-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Connect Social Accounts</h2>
              <div className="text-lg text-gray-600 space-y-3">
                <p>Authenticate one or more social accounts to help organizations discover and verify your reach.</p>
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3 mt-4">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Info className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-sm text-blue-800 leading-relaxed">We never store your password. Connections use secure OAuth tokens and you can disconnect anytime.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {([
                { key: 'instagram', name: 'Facebook & Instagram', platform: 'facebook', placeholder: '@username or profile URL' },
                { key: 'tiktok', name: 'TikTok', platform: 'tiktok', placeholder: '@username or profile URL' },
                { key: 'youtube', name: 'YouTube', platform: 'youtube', placeholder: 'Channel URL' },
                { key: 'snapchat', name: 'Snapchat', platform: 'snapchat', placeholder: 'Profile URL' },
                { key: 'twitter', name: 'X', platform: 'twitter', placeholder: '@username or profile URL' },
              ] as { key: PlatformKey; name: string; platform: string; placeholder: string; }[]).map((p) => (
                <div key={p.key} className="bg-white border-2 border-gray-200 rounded-3xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${brandWrapperClass[p.key]} shadow-sm`}>
                        <SocialIcon platform={p.platform as any} size="md" className="!w-6 !h-6" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">{p.name}</div>
                        <div className="text-sm text-gray-500">Recommended platform</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {connections[p.key] && (
                        <span className="inline-flex items-center text-green-700 bg-green-100 border-2 border-green-200 text-sm px-3 py-2 rounded-2xl font-medium">
                          <CheckCircle2 className="w-4 h-4 mr-2" /> Connected
                        </span>
                      )}
                      <button
                        onClick={() => toggleConnect(p.key)}
                        className={`px-6 py-3 rounded-2xl text-sm font-bold border-2 transition-all duration-200 ${connections[p.key] ? 'text-gray-700 bg-gray-50 border-gray-300 hover:bg-gray-100' : 'text-white bg-blue-600 border-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'}`}
                      >
                        {connections[p.key] ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Profile URL or @handle</label>
                    <div className="relative">
                      <Link2 className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${brandLinkColorClass[p.key]}`} />
                      <input
                        type="text"
                        value={(formData.socialMedia[p.key] as string) || ''}
                        onChange={(e) => updateHandle(p.key, e.target.value)}
                        placeholder={p.placeholder}
                        className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {socialError && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <X className="w-4 h-4 text-red-600" />
                </div>
                <span className="text-sm text-red-800 leading-relaxed">{socialError}</span>
              </div>
            )}
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Goals & Motivation</h2>
              <p className="text-lg text-gray-600">Help us understand what you're looking to achieve</p>
            </div>
            
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-8 border border-orange-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mr-4">
                    <Target className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Your Motivation</h3>
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    What motivates you to become an ambassador? *
                  </label>
                  <textarea
                    value={formData.motivation}
                    onChange={(e) => handleInputChange('motivation', e.target.value)}
                    rows={5}
                    className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none"
                    placeholder="Tell us about your motivation and what you hope to achieve. Share your story, passions, and what drives you to represent brands..."
                  />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl p-8 border border-teal-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center mr-4">
                    <Star className="h-6 w-6 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Your Goals</h3>
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-900">
                    What are your main goals? (Select all that apply)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      'Earn extra income',
                      'Build marketing experience',
                      'Network with professionals',
                      'Create engaging content',
                      'Grow my personal brand',
                      'Learn about fintech',
                      'Help others discover great products',
                      'Develop business skills'
                    ].map((goal) => (
                      <label key={goal} className="group flex items-center bg-white rounded-2xl p-4 border-2 border-gray-200 cursor-pointer hover:border-teal-300 transition-all duration-200">
                        <input
                          type="checkbox"
                          checked={formData.goals.includes(goal)}
                          onChange={(e) => {
                            const updated = e.target.checked 
                              ? [...formData.goals, goal]
                              : formData.goals.filter(g => g !== goal);
                            handleInputChange('goals', updated);
                          }}
                          className="w-5 h-5 rounded-lg border-2 border-gray-300 text-teal-600 focus:ring-2 focus:ring-teal-500 mr-3"
                        />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-teal-600">{goal}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl p-8 border border-violet-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-violet-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">How You Found Us</h3>
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    How did you hear about us?
                  </label>
                  <select
                    value={formData.referralSource}
                    onChange={(e) => handleInputChange('referralSource', e.target.value)}
                    className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 text-gray-900"
                  >
                    <option value="">Select source</option>
                    <option value="social-media">Social Media</option>
                    <option value="friend-referral">Friend Referral</option>
                    <option value="university">University/School</option>
                    <option value="online-search">Online Search</option>
                    <option value="email">Email</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join as Ambassador</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start your journey with us and unlock amazing opportunities
          </p>
        </div>

        {/* Modern Step Indicator */}
        <div className="mb-16">
          <div className="flex items-center justify-center space-x-4 md:space-x-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`
                    relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 transform
                    ${currentStep >= step.id 
                      ? `${STEP_COLORS[step.id].bg} text-white shadow-lg scale-110` 
                      : currentStep === step.id
                        ? `${STEP_COLORS[step.id].bg} text-white shadow-lg scale-110 ring-4 ring-blue-100`
                        : 'bg-white border-2 border-gray-200 text-gray-400'
                    }
                  `}>
                    {currentStep > step.id ? (
                      <CheckCircle2 className="w-7 h-7" />
                    ) : (
                      <step.icon className="w-7 h-7" />
                    )}
                    {currentStep === step.id && (
                      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-25 animate-pulse"></div>
                    )}
                  </div>
                  <div className="mt-3 text-center">
                    <div className={`text-sm font-semibold ${
                      currentStep >= step.id ? STEP_COLORS[step.id].text : 'text-gray-400'
                    }`}>
                      Step {step.id}
                    </div>
                    <div className={`text-xs mt-1 ${
                      currentStep >= step.id ? 'text-gray-700' : 'text-gray-500'
                    }`}>
                      {step.name}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block mx-6">
                    <div className={`
                      w-16 h-0.5 transition-all duration-500
                      ${currentStep > step.id 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500' 
                        : 'bg-gray-300'
                      }
                    `} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 md:p-12">
          <div className="max-w-3xl mx-auto">
            {renderStepContent()}
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100 max-w-3xl mx-auto">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`
                group flex items-center px-8 py-4 rounded-2xl font-semibold transition-all duration-200
                ${currentStep === 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg hover:-translate-y-0.5'
                }
              `}
            >
              <ArrowLeft className="w-5 h-5 mr-3 transition-transform group-hover:-translate-x-1" />
              Previous
            </button>
            
            {currentStep < 5 ? (
              <button
                onClick={nextStep}
                className="group flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Next
                <ArrowRight className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="group flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Complete Registration
                <Gift className="w-5 h-5 ml-3 transition-transform group-hover:rotate-12" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmbassadorRegistration;
