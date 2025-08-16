import React from 'react';

export type SocialPlatform = 'instagram' | 'twitter' | 'tiktok' | 'youtube' | 'facebook' | 'linkedin' | 'snapchat';

interface SocialIconProps {
  platform: SocialPlatform;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  url?: string;
  className?: string;
}

export const SocialIcon: React.FC<SocialIconProps> = ({ 
  platform, 
  size = 'md', 
  url,
  className = ''
}) => {
  const sizeClasses = {
    xs: 'h-4 w-4',
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };

  const iconPath = `/Social media icons/${getIconFilename(platform)}`;
  
  const Icon = (
    <img 
      src={iconPath} 
      alt={`${platform} icon`} 
      className={`${sizeClasses[size]} ${className}`}
    />
  );
  
  if (url) {
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-block"
      >
        {Icon}
      </a>
    );
  }
  
  return Icon;
};

// Helper function to get the correct filename based on platform
function getIconFilename(platform: SocialPlatform): string {
  switch (platform) {
    case 'instagram':
      return 'instagram.png';
    case 'twitter':
      return 'twitter.png';
    case 'tiktok':
      return 'tik-tok.png';
    case 'youtube':
      return 'youtube.png';
    case 'facebook':
      return 'facebook.png';
    case 'linkedin':
      return 'linkedin.png';
    case 'snapchat':
      return 'SnapChat.png';
    default:
      return 'instagram.png'; // Default fallback
  }
}

// Helper to build a social profile URL from a handle or full URL
export function buildSocialUrl(platform: SocialPlatform, handleOrUrl: string): string {
  if (handleOrUrl.startsWith('http')) return handleOrUrl;
  
  const handle = handleOrUrl.replace(/^@/, '');
  switch (platform) {
    case 'instagram':
      return `https://instagram.com/${handle}`;
    case 'twitter':
      return `https://twitter.com/${handle}`;
    case 'tiktok':
      return `https://www.tiktok.com/@${handle}`;
    case 'youtube':
      return `https://www.youtube.com/@${handle}`;
    case 'facebook':
      return `https://facebook.com/${handle}`;
    case 'linkedin':
      return `https://linkedin.com/in/${handle}`;
    case 'snapchat':
      return `https://www.snapchat.com/add/${handle}`;
    default:
      return '#';
  }
}

// Default export
export default { SocialIcon, buildSocialUrl };

