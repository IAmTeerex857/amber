import React from 'react';
import {
  Users,
  CheckSquare,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import MetricCardV2 from './MetricCardV2';
import SimpleAreaChart from './SimpleAreaChart';
import RadialGauge from './RadialGauge';

const Dashboard: React.FC = () => {
  // Organization-focused KPI tiles for ambassador management
  const metrics = [
    {
      title: 'Total Ambassadors',
      value: '247',
      delta: '+12',
      trend: 'up' as const,
      icon: Users,
      sparkline: [32, 36, 40, 45, 48, 52, 58, 63, 68, 72],
    },
    {
      title: 'Active Tasks',
      value: '38',
      delta: '+5',
      trend: 'up' as const,
      icon: CheckSquare,
      sparkline: [18, 22, 19, 21, 23, 25, 28, 30, 34, 38],
    },
    {
      title: 'Total Payouts',
      value: '$15,840',
      delta: '+$2,450',
      trend: 'up' as const,
      icon: DollarSign,
      sparkline: [12, 14, 15, 16, 18, 20, 22, 24, 25, 28],
    },
    {
      title: 'Campaign Performance',
      value: '92%',
      delta: '+3.8%',
      trend: 'up' as const,
      icon: TrendingUp,
      sparkline: [75, 78, 80, 82, 84, 85, 87, 89, 91, 92],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <MetricCardV2
            key={i}
            title={m.title}
            value={m.value}
            delta={m.delta}
            trend={m.trend}
            icon={m.icon}
            sparkline={m.sparkline}
          />
        ))}
      </div>

      {/* Content row: Ambassador Engagement + Task Completion */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SimpleAreaChart 
            title="Ambassador Engagement" 
            subtitle="Monthly activity trends" 
            rangeLabel="Last 30 days" 
          />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Campaign Progress</h3>
            <button className="text-sm text-gray-600 hover:text-gray-900">This month</button>
          </div>
          <div className="flex items-center justify-center">
            <RadialGauge value={78} totalLabel="78%" caption="Completion Rate" />
          </div>

          <div className="mt-6 space-y-3">
            {[
              { label: 'Tasks Completed', value: '152/195', trend: '+18', color: 'text-green-600' },
              { label: 'Tasks In Progress', value: '43', trend: '-5', color: 'text-amber-600' },
              { label: 'Ambassador Participation', value: '87%', trend: '+4.3%', color: 'text-green-600' },
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

      {/* Recent Payouts */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900">Recent Payouts</h3>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All Payouts</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left pb-3 text-sm font-semibold text-gray-600">Ambassador</th>
                <th className="text-left pb-3 text-sm font-semibold text-gray-600">Campaign</th>
                <th className="text-left pb-3 text-sm font-semibold text-gray-600">Amount</th>
                <th className="text-left pb-3 text-sm font-semibold text-gray-600">Date</th>
                <th className="text-left pb-3 text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { ambassador: 'Alex Johnson', campaign: 'Summer Launch', amount: '$320.00', date: 'Jun 12, 2023', status: 'Completed' },
                { ambassador: 'Jamie Wilson', campaign: 'Product Demo', amount: '$275.50', date: 'Jun 10, 2023', status: 'Completed' },
                { ambassador: 'Taylor Smith', campaign: 'Summer Launch', amount: '$410.25', date: 'Jun 8, 2023', status: 'Completed' },
                { ambassador: 'Morgan Lee', campaign: 'Content Creation', amount: '$350.00', date: 'Jun 5, 2023', status: 'Completed' },
                { ambassador: 'Casey Brown', campaign: 'Product Demo', amount: '$225.75', date: 'Jun 3, 2023', status: 'Completed' },
              ].map((payout, index) => (
                <tr key={index} className="border-b border-gray-100 last:border-b-0">
                  <td className="py-3 text-sm text-gray-800">{payout.ambassador}</td>
                  <td className="py-3 text-sm text-gray-800">{payout.campaign}</td>
                  <td className="py-3 text-sm font-medium text-gray-900">{payout.amount}</td>
                  <td className="py-3 text-sm text-gray-600">{payout.date}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {payout.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;