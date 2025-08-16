import React from 'react';
import {
  Trophy,
  Target,
  Coins,
  Award,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import MetricCardV2 from './MetricCardV2';
import SimpleAreaChart from './SimpleAreaChart';
import RadialGauge from './RadialGauge';

interface AmbassadorStats {
  totalPoints: number;
  cashValue: number;
  currentTier: string;
  nextTier: string;
  tierProgress: number;
  weeklyRank: number;
  monthlyRank: number;
  totalTasks: number;
  completedTasks: number;
  totalReferrals: number;
  totalEarnings: number;
  pointsHistory: { x: string; y: number }[];
  recentActivities: {
    id: string;
    activity: string;
    status: 'completed' | 'pending' | 'upcoming';
    date: string;
    points: number;
  }[];
}

const AmbassadorDashboard: React.FC = () => {
  const { user } = useAuth();
  const displayName = user?.name || user?.discordUsername || (user?.email ? user.email.split('@')[0] : undefined) || 'Ambassador';
  
  // Navigation handler for "View More" buttons
  const handleNavigation = (destination: string) => {
    // Use proper navigation by updating the hash which will trigger the router
    if (window.location.hash !== `#${destination}`) {
      window.location.hash = destination;
    }
  };

  // Mock data - would come from API
  const ambassadorStats: AmbassadorStats = {
    totalPoints: 8750,
    cashValue: 87.50,
    currentTier: 'Silver',
    nextTier: 'Gold',
    tierProgress: 65,
    weeklyRank: 12,
    monthlyRank: 8,
    totalTasks: 45,
    completedTasks: 38,
    totalReferrals: 23,
    totalEarnings: 342.75,
    pointsHistory: [
      { x: '1 Aug', y: 320 },
      { x: '8 Aug', y: 480 },
      { x: '15 Aug', y: 410 },
      { x: '22 Aug', y: 350 },
      { x: '29 Aug', y: 500 },
      { x: '5 Sep', y: 450 },
      { x: '12 Sep', y: 580 },
      { x: '19 Sep', y: 620 },
      { x: '26 Sep', y: 750 },
    ],
    recentActivities: [
      { id: '#TSK001', activity: 'Social Media Post', status: 'completed', date: '10/08/2025', points: 250 },
      { id: '#TSK002', activity: 'Product Review', status: 'completed', date: '05/08/2025', points: 500 },
      { id: '#TSK003', activity: 'Community Event', status: 'upcoming', date: '15/08/2025', points: 750 },
    ]
  };


  // Removed unused getTierColor function
  
  // Ambassador-focused KPI tiles with navigation destinations
  const metrics = [
    {
      title: 'Wallet Balance',
      value: `$${ambassadorStats.cashValue.toFixed(2)}`,
      delta: '+$12.50',
      trend: 'up' as const,
      icon: Coins,
      sparkline: [32, 38, 40, 42, 48, 50, 52, 55, 58, 61],
      actionText: 'View More',
      onAction: () => handleNavigation('payments'),
    },
    {
      title: 'Current Tier',
      value: ambassadorStats.currentTier,
      delta: `${ambassadorStats.tierProgress}% to ${ambassadorStats.nextTier}`,
      trend: 'up' as const,
      icon: Award,
      sparkline: [40, 42, 45, 48, 50, 55, 58, 60, 62, 65],
      actionText: 'View More',
      onAction: () => handleNavigation('rewards'),
    },
    {
      title: 'Weekly Rank',
      value: `#${ambassadorStats.weeklyRank}`,
      delta: '+2 positions',
      trend: 'up' as const,
      icon: Trophy,
      sparkline: [18, 16, 15, 14, 13, 14, 13, 12, 12, 12],
      actionText: 'View More',
      onAction: () => handleNavigation('leaderboard'),
    },
    {
      title: 'Tasks Completed',
      value: `${ambassadorStats.completedTasks}/${ambassadorStats.totalTasks}`,
      delta: '84% completion',
      trend: 'up' as const,
      icon: Target,
      sparkline: [22, 24, 26, 28, 30, 32, 34, 36, 38, 38],
      actionText: 'View More',
      onAction: () => handleNavigation('my-tasks'),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {displayName}! 👋</h1>
            <p className="text-blue-100">You're doing great! Keep up the momentum.</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{ambassadorStats.totalPoints.toLocaleString()}</div>
            <div className="text-blue-100">Total Points</div>
          </div>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCardV2
            key={index}
            title={metric.title}
            value={metric.value}
            delta={metric.delta}
            trend={metric.trend}
            icon={metric.icon}
            sparkline={metric.sparkline}
            actionText="View More"
            onAction={metric.onAction}
          />
        ))}
      </div>

      {/* Content row: Points History + Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="relative">
            <SimpleAreaChart 
              title="Points History" 
              subtitle="Weekly performance" 
              rangeLabel="Last 2 months" 
              series={ambassadorStats.pointsHistory}
              onViewMore={() => handleNavigation('rewards')}
            />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tier Progress</h3>
            <button className="text-sm text-gray-600 hover:text-gray-900">This month</button>
          </div>
          <div className="flex items-center justify-center">
            <RadialGauge 
              value={ambassadorStats.tierProgress} 
              totalLabel={ambassadorStats.nextTier} 
              caption={`${ambassadorStats.tierProgress}% Complete`} 
              accentColor="#3b82f6" 
            />
          </div>

          <div className="mt-6 space-y-3">
            {[
              { label: 'Current Tier', value: ambassadorStats.currentTier, trend: `${ambassadorStats.tierProgress}%`, color: 'text-blue-600' },
              { label: 'Weekly Rank', value: `#${ambassadorStats.weeklyRank}`, trend: '+2', color: 'text-green-600' },
              { label: 'Monthly Rank', value: `#${ambassadorStats.monthlyRank}`, trend: '+1', color: 'text-green-600' },
            ].map((row, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="text-sm text-gray-700">{row.label}</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">{row.value}</span>
                  <span className={`text-xs font-medium ${row.color}`}>{row.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Activities
          </h3>
          <button 
            onClick={() => handleNavigation('my-tasks')} 
            className="px-3 py-1.5 rounded-md text-sm bg-gray-900 text-white hover:bg-black/80"
          >
            View All
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {ambassadorStats.recentActivities.map((activity) => (
            <div key={activity.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Target className="h-5 w-5 text-gray-700" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{activity.id}</div>
                  <div className="text-xs text-gray-500 truncate">{activity.activity}</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                  activity.status === 'completed' ? 'bg-green-100 text-green-700' : 
                  activity.status === 'upcoming' ? 'bg-purple-100 text-purple-700' : 
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  <TrendingUp className="h-3.5 w-3.5" />
                  {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                </span>
                <div className="text-sm text-gray-600 w-28 text-right">{activity.date}</div>
                <div className="text-sm font-semibold text-blue-600 w-28 text-right">+{activity.points} pts</div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 text-right">
          <button 
            onClick={() => handleNavigation('my-tasks')} 
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            View More
          </button>
        </div>
      </div>
    </div>
  );
};

export default AmbassadorDashboard;
