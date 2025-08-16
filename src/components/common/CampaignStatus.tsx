import React from 'react';

export type CampaignStatusType = 'active' | 'ended' | 'upcoming' | 'recurring';

interface CampaignStatusProps {
  status: CampaignStatusType;
}

const CampaignStatus: React.FC<CampaignStatusProps> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'ended':
        return 'bg-gray-100 text-gray-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'recurring':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'ended':
        return 'Ended';
      case 'upcoming':
        return 'Upcoming';
      case 'recurring':
        return 'Recurring';
      default:
        return 'Unknown';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles()}`}>
      {getStatusLabel()}
    </span>
  );
};

export default CampaignStatus;
