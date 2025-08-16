import React from 'react';
import { Building2 } from 'lucide-react';
import { Organization } from '../../contexts/AuthContext';

interface OrganizationSelectionProps {
  organizations: Organization[];
  onSelect: (organizationId: string) => void;
  isLoading: boolean;
}

const OrganizationSelection: React.FC<OrganizationSelectionProps> = ({ 
  organizations, 
  onSelect, 
  isLoading 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Select your organization
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Choose which Discord server you want to access
          </p>
        </div>
        
        <div className="mt-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {organizations.length === 0 ? (
                <li className="px-4 py-5 sm:px-6">
                  <div className="text-center text-gray-500">
                    No organizations found
                  </div>
                </li>
              ) : (
                organizations.map((org) => (
                  <li key={org.id}>
                    <button
                      onClick={() => onSelect(org.id)}
                      disabled={isLoading}
                      className="w-full text-left px-4 py-5 sm:px-6 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition ease-in-out duration-150"
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {org.logoUrl ? (
                            <img 
                              className="h-10 w-10 rounded-full" 
                              src={org.logoUrl} 
                              alt={org.name} 
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <Building2 className="h-6 w-6 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm leading-5 font-medium text-blue-600 truncate">
                            {org.name}
                          </div>
                          <div className="mt-1 text-xs leading-4 text-gray-500">
                            {org.memberCount.toLocaleString()} members
                          </div>
                        </div>
                      </div>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
          
          {isLoading && (
            <div className="mt-4 flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationSelection;
