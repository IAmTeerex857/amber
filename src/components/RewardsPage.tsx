import React from 'react';
import { CheckCircle } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // emoji for now
  earned: boolean;
  earnedDate?: string;
  progress?: number; // 0-100 if not yet earned
}

const RewardsPage: React.FC = () => {
  // Mock achievements/badges only (Rewards page is focused solely on these)
  const achievements: Achievement[] = [
    { id: 'a1', title: 'First Sale', description: 'Generate your first referral sale', icon: '🎯', earned: true, earnedDate: '2025-07-12' },
    { id: 'a2', title: 'Content Creator', description: 'Complete 10 content tasks', icon: '📸', earned: true, earnedDate: '2025-07-22' },
    { id: 'a3', title: 'Social Butterfly', description: 'Share on 5 platforms', icon: '🦋', earned: false, progress: 60 },
    { id: 'a4', title: 'Top Performer', description: 'Reach top 10 monthly', icon: '🏆', earned: true, earnedDate: '2025-07-30' },
    { id: 'a5', title: 'Consistent', description: 'Complete tasks 4 weeks in a row', icon: '📅', earned: false, progress: 50 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Rewards</h1>
        <p className="text-gray-600 text-sm">Your achievements and badges</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Achievements & Badges</h2>
          <p className="text-sm text-gray-600">Earn badges by completing tasks and hitting milestones.</p>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`border rounded-lg p-4 ${a.earned ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${a.earned ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <span className="text-xl">{a.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{a.title}</p>
                    <p className="text-xs text-gray-500">{a.description}</p>
                  </div>
                </div>
                {a.earned ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <span className="text-xs font-medium text-gray-500">{a.progress}%</span>
                )}
              </div>
              {!a.earned && (
                <div className="mt-3 w-full bg-gray-100 h-2 rounded">
                  <div className="h-2 bg-blue-500 rounded" style={{ width: `${a.progress || 0}%` }} />
                </div>
              )}
              {a.earned && (
                <p className="mt-2 text-xs text-green-700">Earned on {a.earnedDate}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;
