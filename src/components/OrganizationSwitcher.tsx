import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { useAuth, Organization } from '../contexts/AuthContext';

interface OrganizationSwitcherProps {
  className?: string;
}

const OrganizationSwitcher: React.FC<OrganizationSwitcherProps> = ({ className = '' }) => {
  const { user, organizations, switchOrganization } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Make all organizations available, including current one
  // This allows users to see their current organization in the list
  const availableOrganizations = organizations;
  
  // Find the current organization
  const currentOrganization = organizations.find(
    (org: Organization) => org.id === user?.organizationId
  );
  
  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleSwitchOrg = async (orgId: string) => {
    try {
      setIsLoading(true);
      await switchOrganization(orgId);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to switch organization:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // If user has no organizations or only one organization, don't show the switcher
  if (!currentOrganization || availableOrganizations.length === 0) {
    return null;
  }
  
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Main button with current organization */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center justify-between gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-30 min-w-[180px]"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center gap-3">
          {currentOrganization?.logoUrl ? (
            <div className="relative">
              <img 
                src={currentOrganization.logoUrl} 
                alt={currentOrganization.name}
                className="h-8 w-8 rounded-lg object-cover shadow-sm border border-gray-100"
              />
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
              </span>
            </div>
          ) : (
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold">
                {currentOrganization?.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="flex flex-col items-start">
            <span className="font-medium truncate max-w-[120px]">{currentOrganization?.name}</span>
            <span className="text-xs text-gray-500">Active workspace</span>
          </div>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      
      {/* Dropdown menu with animation */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden animate-fadeIn">
          <div role="menu" aria-orientation="vertical">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-900">Switch Organization</h3>
              <p className="text-xs text-gray-500 mt-1">Select the organization you want to work with</p>
            </div>
            
            <div className="max-h-[320px] overflow-y-auto py-1">
              {availableOrganizations.map((org: Organization) => {
                const isActive = org.id === user?.organizationId;
                return (
                  <button
                    key={org.id}
                    onClick={() => !isActive && handleSwitchOrg(org.id)}
                    className={`w-full text-left flex items-center justify-between px-4 py-3 ${isActive ? 'bg-blue-50' : 'hover:bg-gray-50'} transition-colors duration-150`}
                    role="menuitem"
                    disabled={isActive || isLoading}
                  >
                    <div className="flex items-center gap-3">
                      {org.logoUrl ? (
                        <img 
                          src={org.logoUrl} 
                          alt={org.name}
                          className="h-8 w-8 rounded-lg object-cover border border-gray-100 shadow-sm"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
                          <span className="text-white font-bold">{org.name.charAt(0)}</span>
                        </div>
                      )}
                      <div className="flex flex-col items-start">
                        <span className="font-medium text-sm">{org.name}</span>
                        <span className="text-xs text-gray-500">{org.memberCount} members</span>
                      </div>
                    </div>
                    {isActive && <CheckCircle2 className="h-5 w-5 text-blue-500" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationSwitcher;
