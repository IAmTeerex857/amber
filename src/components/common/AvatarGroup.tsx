import React from 'react';

interface Avatar {
  name: string;
  image?: string;
}

interface AvatarGroupProps {
  avatars: Avatar[];
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({ avatars, max = 5, size = 'md' }) => {
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  const ringClasses = {
    xs: '-ml-1.5',
    sm: '-ml-2',
    md: '-ml-2.5',
    lg: '-ml-3',
  };

  const visibleAvatars = avatars.slice(0, max);
  const extraAvatars = avatars.length - max;

  return (
    <div className="flex">
      {visibleAvatars.map((avatar, index) => (
        <div 
          key={index}
          className={`${sizeClasses[size]} ${index > 0 ? ringClasses[size] : ''} rounded-full ring-2 ring-white relative flex items-center justify-center bg-gray-200 overflow-hidden`}
          title={avatar.name}
        >
          {avatar.image ? (
            <img 
              src={avatar.image} 
              alt={avatar.name} 
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="font-medium text-gray-600">
              {avatar.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      ))}
      {extraAvatars > 0 && (
        <div 
          className={`${sizeClasses[size]} ${ringClasses[size]} rounded-full ring-2 ring-white flex items-center justify-center bg-gray-100 text-gray-600 font-medium`}
        >
          +{extraAvatars}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;
