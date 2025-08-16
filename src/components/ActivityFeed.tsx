import React from 'react';
import { Clock, User, AlertCircle, CheckCircle, Info } from 'lucide-react';

const ActivityFeed: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'user',
      message: 'New user registered',
      user: 'Alice Cooper',
      time: '5 minutes ago',
      icon: User,
      color: 'blue'
    },
    {
      id: 2,
      type: 'success',
      message: 'Data backup completed',
      user: 'System',
      time: '10 minutes ago',
      icon: CheckCircle,
      color: 'green'
    },
    {
      id: 3,
      type: 'warning',
      message: 'High memory usage detected',
      user: 'Monitor',
      time: '15 minutes ago',
      icon: AlertCircle,
      color: 'amber'
    },
    {
      id: 4,
      type: 'info',
      message: 'Weekly report generated',
      user: 'Admin',
      time: '1 hour ago',
      icon: Info,
      color: 'gray'
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-600';
      case 'green':
        return 'bg-green-100 text-green-600';
      case 'amber':
        return 'bg-amber-100 text-amber-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Recent Activity
        </h3>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${getColorClasses(activity.color)}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.message}
                  </p>
                  <p className="text-sm text-gray-500">
                    by {activity.user} • {activity.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button className="w-full text-center text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors">
            View all activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;