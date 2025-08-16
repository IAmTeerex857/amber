import React, { useState } from 'react';
import {
  User as UserIcon,
  CheckCircle2,
  Pencil,
  Mail,
  Briefcase,
  Star,
  Globe
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const TABS = [
  { id: 'about', label: 'About' },
  { id: 'background', label: 'Background' },
  { id: 'recommendations', label: 'Recommendations' },
  { id: 'following', label: 'Following' },
  { id: 'organizations', label: 'Organizations' },
] as const;

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]['id']>('about');

  const name = user?.name || 'John Smith';
  const followers = 8; // mock for now

  const renderAbout = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left column */}
      <div className="space-y-6">
        {/* Skills Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Brand Design</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">UI Design</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Figma</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Adobe After Effects</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Sketch</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Pen & Paper</span>
          </div>
        </div>

        {/* Portfolio Links */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Links</h3>
          <div className="flex space-x-3">
            <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Verifications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Verifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-700">Facebook Connected</span>
              </div>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center mr-3">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-700">LinkedIn Connected</span>
              </div>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-blue-300 rounded-full flex items-center justify-center mr-3">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-700">Twitter Connected</span>
              </div>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center mr-3">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-700">Phone Verified</span>
              </div>
              <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded">Get Verified</button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center mr-3">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-700">Email Verified</span>
              </div>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-700">Identity Verified</span>
              </div>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </div>

        {/* Proficiency */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Proficiency</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Design 45%</span>
              <span className="text-sm text-gray-700">Brand Design 45%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">UI Design 45%</span>
              <span className="text-sm text-gray-700">Adobe After Effects 45%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Figma 45%</span>
              <span className="text-sm text-gray-700">Pen & paper 45%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-6">
        {/* About Me */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">About Me</h3>
          <p className="text-gray-600 leading-relaxed">
            I have very Good command in Photoshop, Illustrator and Web-design. I have experience in creating engaging visual content and managing social media campaigns for various brands.
          </p>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li>• Ability to provide services to the customers to meet their needs.</li>
            <li>• Ability to work independently as well as a team member.</li>
            <li>• Ability to work under pressure.</li>
            <li>• Dependable, Highly-Organized, Self-Motivated, and Responsible.</li>
          </ul>
        </div>

        {/* Experience */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Experience</h3>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-gray-900">Freelance Art Director</h4>
                <p className="text-sm text-gray-600">Apple Corporation</p>
                <p className="text-sm text-gray-500">April 2017- Present (7 Months)</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-gray-900">Design Lead</h4>
                <p className="text-sm text-gray-600">Apple Corporation</p>
                <p className="text-sm text-gray-500">April 2017- Present (7 Months)</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-gray-900">UX Designer</h4>
                <p className="text-sm text-gray-600">Apple Corporation</p>
                <p className="text-sm text-gray-500">April 2017- Present (7 Months)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-100 rounded-lg h-32 flex items-center justify-center">
              <div className="text-blue-600 text-xs">Portfolio Item</div>
            </div>
            <div className="bg-red-100 rounded-lg h-32 flex items-center justify-center">
              <div className="text-red-600 text-xs">Portfolio Item</div>
            </div>
            <div className="bg-green-100 rounded-lg h-32 flex items-center justify-center">
              <div className="text-green-600 text-xs">Portfolio Item</div>
            </div>
            <div className="bg-yellow-100 rounded-lg h-32 flex items-center justify-center">
              <div className="text-yellow-600 text-xs">Portfolio Item</div>
            </div>
            <div className="bg-purple-100 rounded-lg h-32 flex items-center justify-center">
              <div className="text-purple-600 text-xs">Portfolio Item</div>
            </div>
            <div className="bg-pink-100 rounded-lg h-32 flex items-center justify-center">
              <div className="text-pink-600 text-xs">Portfolio Item</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBackground = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Background</h3>
      <p className="text-gray-600 leading-relaxed mb-4">
        Background information and career history coming soon.
      </p>
    </div>
  );

  const renderRecommendations = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
      <p className="text-gray-600 leading-relaxed">
        Professional recommendations and testimonials coming soon.
      </p>
    </div>
  );

  const renderFollowing = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Following</h3>
      <p className="text-gray-600 leading-relaxed">
        People and organizations you follow coming soon.
      </p>
    </div>
  );

  const renderOrganizations = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Organizations</h3>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-gray-600">You don't belong to any organizations</div>
        <div className="text-xs text-gray-500">Sort: Last Post</div>
      </div>
      <div className="border rounded-md overflow-hidden">
        <div className="p-4 text-sm text-gray-500">Showing 0 of 0 entries</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="h-28 sm:h-36 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row">
            <div className="flex items-center">
              <div className="-mt-10 mr-3 h-16 w-16 rounded-full bg-blue-600 ring-4 ring-white flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold text-gray-900">{name}</h2>
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-sm text-gray-500">{followers} followers</div>
              </div>
            </div>
            <button className="mt-3 sm:mt-0 inline-flex items-center px-3 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-50">
              <Pencil className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-4 border-b">
            <nav className="-mb-px flex space-x-6 overflow-x-auto">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`whitespace-nowrap pb-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === t.id
                      ? 'border-blue-600 text-blue-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'about' && renderAbout()}
      {activeTab === 'background' && renderBackground()}
      {activeTab === 'recommendations' && renderRecommendations()}
      {activeTab === 'following' && renderFollowing()}
      {activeTab === 'organizations' && renderOrganizations()}
    </div>
  );
};

export default ProfilePage;
