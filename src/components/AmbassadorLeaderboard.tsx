import React, { useState } from 'react';
import { 
  Trophy, 
  ArrowUp, 
  TrendingUp,
  Users,
  Target,
  Clock,
  Medal,
  Award,
  Crown
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
  const [timeRemaining, setTimeRemaining] = useState({ days: 12, hours: 6, minutes: 42 });

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
        
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as LeaderboardPeriod)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="weekly">This Week</option>
            <option value="monthly">Monthly</option>
            <option value="allTime">All Time</option>
          </select>
          
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as LeaderboardCategory)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="points">Points</option>
            <option value="tasks">Tasks</option>
            <option value="referrals">Referrals</option>
          </select>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-4 w-4 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Joined Members</p>
          <p className="text-2xl font-bold text-gray-900">346+</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Achieved Goals</p>
          <p className="text-2xl font-bold text-gray-900">732+</p>
        </div>

        <div className="col-span-2 bg-yellow-50 rounded-lg p-4 border border-yellow-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-gray-700">Remaining time to completion 🔥</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{timeRemaining.days}</div>
                  <div className="text-xs text-gray-500">DAYS</div>
                </div>
                <div className="text-2xl font-bold text-gray-400">:</div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{timeRemaining.hours}</div>
                  <div className="text-xs text-gray-500">HOURS</div>
                </div>
                <div className="text-2xl font-bold text-gray-400">:</div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{timeRemaining.minutes}</div>
                  <div className="text-xs text-gray-500">MINUTES</div>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">⚠️ Only the first three positions will be awarded prizes</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Current Leaders Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Current Leaders</h2>
          
          <div className="flex gap-2">
            {(['weekly', 'monthly', 'allTime'] as LeaderboardPeriod[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  period === p 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {p === 'weekly' ? 'Week' : p === 'monthly' ? 'Month' : 'Today'}
              </button>
            ))}
          </div>
        </div>
        
        {/* Top 3 Podium */}
        <div className="flex items-end justify-center gap-6 mb-8">
          {/* 2nd Place */}
          <div className="text-center">
            <div className="relative mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-lg font-bold mb-2 mx-auto">
                <Medal className="h-6 w-6 text-gray-500" />
              </div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-xs font-bold text-white">
                2
              </div>
            </div>
            <div className="text-sm font-medium text-gray-900">{podiumAmbassadors[1]?.name || 'Sam Johnson'}</div>
            <div className="text-sm text-gray-600">{getValue(podiumAmbassadors[1]) || '1120'} pts.</div>
          </div>

          {/* 1st Place */}
          <div className="text-center">
            <div className="relative mb-4">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center text-2xl font-bold mb-2 mx-auto border-2 border-yellow-400">
                <Crown className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-yellow-900">
                1
              </div>
            </div>
            <div className="text-lg font-bold text-gray-900">{podiumAmbassadors[0]?.name || 'Isabella Rodriguez'}</div>
            <div className="text-sm text-yellow-600 font-semibold">{getValue(podiumAmbassadors[0]) || '1250'} pts.</div>
          </div>

          {/* 3rd Place */}
          <div className="text-center">
            <div className="relative mb-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-lg font-bold mb-2 mx-auto">
                <Award className="h-6 w-6 text-orange-500" />
              </div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center text-xs font-bold text-white">
                3
              </div>
            </div>
            <div className="text-sm font-medium text-gray-900">{podiumAmbassadors[2]?.name || 'Brian Chen'}</div>
            <div className="text-sm text-gray-600">{getValue(podiumAmbassadors[2]) || '980'} pts.</div>
          </div>
        </div>
      </div>

      {/* Global Rankings Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Global Ranking</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as LeaderboardCategory)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="points">Task completed</option>
                  <option value="tasks">Tasks</option>
                  <option value="referrals">Referrals</option>
                </select>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by user name"
                  className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <div className="absolute left-2.5 top-2">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        
        {/* Compact Rankings Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User name</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Tier</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total points</th>
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
