import React, { useState } from 'react';
import { 
  Trophy, 
  ArrowUp, 
  TrendingUp, 
  ChevronDown
} from 'lucide-react';
import { SocialIcon, buildSocialUrl } from './SocialMediaIcons';

type LeaderboardPeriod = 'weekly' | 'monthly' | 'allTime';
type LeaderboardCategory = 'points' | 'tasks' | 'referrals';

interface Socials {
  instagram?: string; // handle or full url
  twitter?: string;   // handle or full url
  tiktok?: string;    // handle or full url
  youtube?: string;   // handle or full url
  snapchat?: string;  // handle or full url
  facebook?: string;  // handle or full url
}

interface Ambassador {
  id: string;
  name: string;
  profileImage?: string;
  points: number;
  tasksCompleted: number;
  referrals: number;
  rank: number;
  rankChange: number;
  tier: string;
  socials?: Socials;
}

const AmbassadorLeaderboard: React.FC = () => {
  const [period, setPeriod] = useState<LeaderboardPeriod>('weekly');
  const [category, setCategory] = useState<LeaderboardCategory>('points');
  const [expanded, setExpanded] = useState(false);

  // Mock data for ambassador rankings
  const topAmbassadors: Ambassador[] = [
    {
      id: '1',
      name: 'Isabella Rodriguez',
      points: 1250,
      tasksCompleted: 28,
      referrals: 15,
      rank: 1,
      rankChange: 0,
      tier: 'Diamond',
      socials: { instagram: 'isa_rodriguez', twitter: 'isarod', tiktok: 'isa.rodriguez' }
    },
    {
      id: '2',
      name: 'Sam Johnson',
      points: 1120,
      tasksCompleted: 26,
      referrals: 10,
      rank: 2,
      rankChange: 2,
      tier: 'Platinum',
      socials: { instagram: 'sammiej', twitter: 'sam_j', tiktok: 'samj.creates' }
    },
    {
      id: '3',
      name: 'Brian Chen',
      points: 980,
      tasksCompleted: 22,
      referrals: 12,
      rank: 3,
      rankChange: -1,
      tier: 'Platinum',
      socials: { instagram: 'brianchen', twitter: 'brian_codes' }
    },
    {
      id: '4',
      name: 'Emma Williams',
      points: 920,
      tasksCompleted: 21,
      referrals: 8,
      rank: 4,
      rankChange: 3,
      tier: 'Gold',
      socials: { instagram: 'emmawilliams', snapchat: 'emma_w', facebook: 'emma.williams' }
    },
    {
      id: '5',
      name: 'Michael Brown',
      points: 880,
      tasksCompleted: 20,
      referrals: 7,
      rank: 5,
      rankChange: -2,
      tier: 'Gold',
      socials: { instagram: 'mikebrown', tiktok: 'mike.creates' }
    },
    {
      id: '6',
      name: 'Sophia Martinez',
      points: 820,
      tasksCompleted: 18,
      referrals: 8,
      rank: 6,
      rankChange: 1,
      tier: 'Gold',
      socials: { instagram: 'sophiamartinez', youtube: 'sophia_martinez', snapchat: 'sophia_m' }
    },
    {
      id: '7',
      name: 'Alexander Lee',
      points: 785,
      tasksCompleted: 17,
      referrals: 6,
      rank: 7,
      rankChange: 0,
      tier: 'Silver',
      socials: { instagram: 'alexlee', facebook: 'alexander.lee' }
    },
    {
      id: '8',
      name: 'Olivia Taylor',
      points: 750,
      tasksCompleted: 16,
      referrals: 5,
      rank: 8,
      rankChange: 2,
      tier: 'Silver',
      socials: { instagram: 'oliviataylor', tiktok: 'olivia.t', twitter: 'olivia_taylor' }
    },
    {
      id: '9',
      name: 'Noah Clark',
      points: 720,
      tasksCompleted: 15,
      referrals: 6,
      rank: 9,
      rankChange: -1,
      tier: 'Silver',
      socials: { instagram: 'noahclark', snapchat: 'noah_c' }
    },
    {
      id: '10',
      name: 'Ava Wright',
      points: 685,
      tasksCompleted: 14,
      referrals: 5,
      rank: 10,
      rankChange: -3,
      tier: 'Silver',
      socials: { instagram: 'avawright', facebook: 'ava.wright', youtube: 'ava_creates' }
    },
  ];

  // Mock current user's position
  const currentUser: Ambassador = {
    id: '42',
    name: 'You',
    points: 480,
    tasksCompleted: 10,
    referrals: 3,
    rank: 24,
    rankChange: 5,
    tier: 'Bronze'
  };

  // Get value based on selected category
  const getValue = (ambassador: Ambassador): number => {
    switch(category) {
      case 'points': return ambassador.points;
      case 'tasks': return ambassador.tasksCompleted;
      case 'referrals': return ambassador.referrals;
      default: return ambassador.points;
    }
  };

  // Get label based on selected category
  const getLabel = (): string => {
    switch(category) {
      case 'points': return 'Points';
      case 'tasks': return 'Tasks';
      case 'referrals': return 'Referrals';
      default: return 'Points';
    }
  };

  // Get the top 3 ambassadors for podium display
  const podiumAmbassadors = topAmbassadors.slice(0, 3);
  
  // Get all ambassadors for the list
  const listAmbassadors = expanded 
    ? topAmbassadors
    : topAmbassadors.slice(0, 7);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Ambassador Leaderboard</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="relative">
            <select 
              className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              value={period}
              onChange={(e) => setPeriod(e.target.value as LeaderboardPeriod)}
            >
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="allTime">All Time</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
          
          <div className="relative">
            <select 
              className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              value={category}
              onChange={(e) => setCategory(e.target.value as LeaderboardCategory)}
            >
              <option value="points">Points</option>
              <option value="tasks">Tasks</option>
              <option value="referrals">Referrals</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500 flex items-center gap-2">
            <div className="text-center">
              <div className="relative mb-4">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold mb-2 mx-auto">
                  {podiumAmbassadors[1]?.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-gray-700">
                  2
                </div>
              </div>
              <div className="text-sm font-medium">{podiumAmbassadors[1]?.name}</div>
              <div className="text-xs opacity-80">{getValue(podiumAmbassadors[1])}</div>
            </div>

            {/* 1st Place */}
            <div className="text-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 bg-white bg-opacity-30 rounded-full flex items-center justify-center text-2xl font-bold mb-2 mx-auto border-4 border-yellow-400">
                  {podiumAmbassadors[0]?.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-yellow-900">
                  <Trophy className="w-4 h-4" />
                </div>
              </div>
              <div className="text-lg font-bold">{podiumAmbassadors[0]?.name}</div>
              <div className="text-sm opacity-90">{getValue(podiumAmbassadors[0])}</div>
            </div>

            {/* 3rd Place */}
            <div className="text-center">
              <div className="relative mb-4">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold mb-2 mx-auto">
                  {podiumAmbassadors[2]?.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center text-xs font-bold text-orange-900">
                  3
                </div>
              </div>
              <div className="text-sm font-medium">{podiumAmbassadors[2]?.name}</div>
              <div className="text-xs opacity-80">{getValue(podiumAmbassadors[2])}</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Time Period Selector */}
            <div className="flex space-x-2">
              {(['weekly', 'monthly', 'allTime'] as LeaderboardPeriod[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    period === p 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {p === 'allTime' ? 'All Time' : p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>

            {/* Category Selector */}
            <div className="flex space-x-2">
              {(['points', 'tasks', 'referrals'] as LeaderboardCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    category === cat 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Rankings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Rankings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ambassador
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tier
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {getLabel()}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {listAmbassadors.map((ambassador) => (
                  <tr key={ambassador.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="font-semibold text-gray-700">{ambassador.rank}</span>
                        <span className="ml-2">
                          {ambassador.rankChange > 0 && (
                            <div className="text-green-600 flex items-center">
                              <ArrowUp className="h-3 w-3" />
                              <span className="text-xs">{ambassador.rankChange}</span>
                            </div>
                          )}
                          {ambassador.rankChange < 0 && (
                            <div className="text-red-600 flex items-center">
                              <ArrowUp className="h-3 w-3 transform rotate-180" />
                              <span className="text-xs">{Math.abs(ambassador.rankChange)}</span>
                            </div>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                          {ambassador.profileImage ? (
                            <img 
                              src={ambassador.profileImage} 
                              alt={ambassador.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-medium text-gray-700">
                              {ambassador.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{ambassador.name}</div>
                          {ambassador.socials && (
                            <div className="flex space-x-2 mt-1">
                              {ambassador.socials.instagram && (
                                <SocialIcon platform="instagram" size="xs" url={buildSocialUrl('instagram', ambassador.socials.instagram)} />
                              )}
                              {ambassador.socials.twitter && (
                                <SocialIcon platform="twitter" size="xs" url={buildSocialUrl('twitter', ambassador.socials.twitter)} />
                              )}
                              {ambassador.socials.tiktok && (
                                <SocialIcon platform="tiktok" size="xs" url={buildSocialUrl('tiktok', ambassador.socials.tiktok)} />
                              )}
                              {ambassador.socials.youtube && (
                                <SocialIcon platform="youtube" size="xs" url={buildSocialUrl('youtube', ambassador.socials.youtube)} />
                              )}
                              {ambassador.socials.snapchat && (
                                <SocialIcon platform="snapchat" size="xs" url={buildSocialUrl('snapchat', ambassador.socials.snapchat)} />
                              )}
                              {ambassador.socials.facebook && (
                                <SocialIcon platform="facebook" size="xs" url={buildSocialUrl('facebook', ambassador.socials.facebook)} />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                        {ambassador.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <span className="font-bold">{getValue(ambassador)}</span>
                    </td>
                  </tr>
                ))}
                
                {/* Show more button */}
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center">
                    <button
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                      onClick={() => setExpanded(!expanded)}
                    >
                      {expanded ? 'Show Less' : 'Show More'}
                    </button>
                  </td>
                </tr>

                {/* Divider */}
                <tr>
                  <td colSpan={4} className="px-6 py-1">
                    <div className="border-t border-gray-200"></div>
                  </td>
                </tr>

                {/* Current User Row */}
                <tr className="bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-700">{currentUser.rank}</span>
                      <span className="ml-2">
                        {currentUser.rankChange > 0 && (
                          <div className="text-green-600 flex items-center">
                            <ArrowUp className="h-3 w-3" />
                            <span className="text-xs">{currentUser.rankChange}</span>
                          </div>
                        )}
                        {currentUser.rankChange < 0 && (
                          <div className="text-red-600 flex items-center">
                            <ArrowUp className="h-3 w-3 transform rotate-180" />
                            <span className="text-xs">{Math.abs(currentUser.rankChange)}</span>
                          </div>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-700">
                          YO
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-blue-900">You</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                      {currentUser.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <span className="font-bold">{getValue(currentUser)}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* How to Improve Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
          How to Improve Your Ranking
        </h3>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-center">
            <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">1</div>
            <span>Complete more tasks to earn points</span>
          </li>
          <li className="flex items-center">
            <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">2</div>
            <span>Submit quality content that gets high ratings</span>
          </li>
          <li className="flex items-center">
            <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">3</div>
            <span>Invite friends using your referral link</span>
          </li>
          <li className="flex items-center">
            <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">4</div>
            <span>Participate in community challenges</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AmbassadorLeaderboard;
