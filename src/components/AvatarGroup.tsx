import React from 'react';

interface AvatarGroupProps {
  avatars?: Array<{
    name: string;
    image?: string;
    color?: string;
  }>;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({ 
  avatars = [], 
  max = 3,
  size = 'md'
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getRandomColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
    ];
    
    // Use name to deterministically select a color
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-10 w-10 text-base'
  };

  const displayAvatars = avatars.slice(0, max);
  const hasMore = avatars.length > max;
  
  return (
    <div className="flex -space-x-2 overflow-hidden">
      {displayAvatars.map((avatar, index) => (
        <div 
          key={index}
          className={`${sizeClasses[size]} relative inline-flex items-center justify-center rounded-full border-2 border-white ${avatar.color || getRandomColor(avatar.name)}`}
          title={avatar.name}
        >
          {avatar.image ? (
            <img
              className="h-full w-full rounded-full object-cover"
              src={avatar.image}
              alt={avatar.name}
            />
          ) : (
            <span className="font-medium text-white">
              {getInitials(avatar.name)}
            </span>
          )}
        </div>
      ))}
      
      {hasMore && (
        <div 
          className={`${sizeClasses[size]} relative inline-flex items-center justify-center rounded-full border-2 border-white bg-gray-100 text-gray-500`}
          title={`${avatars.length - max} more`}
        >
          <span className="font-medium">
            +{avatars.length - max}
          </span>
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;
