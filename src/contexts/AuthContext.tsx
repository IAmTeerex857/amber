import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'organization' | 'president' | 'ambassador';

export interface DiscordProfile {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  servers: Array<{
    id: string;
    name: string;
    icon: string;
    roles: string[];
  }>;
}

// Chapter interface for the new chapter-based structure
export interface Chapter {
  id: string;
  name: string;
  country: string;
  region: string;
  organizationId: string;
  presidentId?: string;
  monthlyBudget: number;
  ambassadorCount: number;
  isActive: boolean;
  createdDate: string;
}

// Export the Organization interface to make it available in the OrganizationSwitcher
export interface Organization {
  id: string;
  name: string;
  logoUrl?: string;
  memberCount: number;
}

// Organization Request interfaces
export interface OrganizationRequestData {
  organizationId: string;
  organizationName: string;
  requestReason: string;
  experience: string;
  preferredRegion: string;
  availability: string;
  socialLinks: {
    linkedin: string;
    twitter: string;
    discord: string;
    other: string;
  };
  additionalInfo: string;
}

export interface OrganizationRequest {
  id: string;
  userId: string;
  organizationId: string;
  organizationName: string;
  applicantName: string;
  applicantEmail: string;
  applicantRole: 'president' | 'ambassador';
  submittedAt: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  requestData: OrganizationRequestData;
  reviewerId?: string;
  reviewerName?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  approvalData?: {
    welcomeMessage?: string;
    assignedMentor?: string;
    startDate?: string;
    probationPeriod?: number;
    customNotes?: string;
  };
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  organizationId?: string;
  chapterId?: string; // New: chapter assignment for presidents and ambassadors
  isOnboarded: boolean;
  discordId?: string; 
  discordUsername?: string;
  discordAvatar?: string;
  // Organization request status
  organizationRequestId?: string;
  organizationRequestStatus?: 'none' | 'pending' | 'under_review' | 'approved' | 'rejected';
  hasActiveRequest?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  organizations: Organization[];
  chapters: Chapter[];
  // Organization request state
  organizationRequests: OrganizationRequest[];
  userRequest: OrganizationRequest | null;
  // Authentication methods
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  loginWithDiscord: () => Promise<DiscordProfile | null>;
  selectOrganization: (organizationId: string) => Promise<void>;
  switchOrganization: (organizationId: string) => Promise<void>;
  selectChapter: (chapterId: string) => Promise<void>;
  switchChapter: (chapterId: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  // Organization request methods
  submitOrganizationRequest: (requestData: OrganizationRequestData) => Promise<void>;
  checkRequestStatus: () => Promise<OrganizationRequest | null>;
  getOrganizationRequests: (organizationId?: string) => Promise<OrganizationRequest[]>;
  approveRequest: (requestId: string, approvalData?: any) => Promise<void>;
  rejectRequest: (requestId: string, rejectionReason: string) => Promise<void>;
  withdrawRequest: (requestId: string) => Promise<void>;
  updateRequestStatus: (requestId: string, status: OrganizationRequest['status']) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  // Organization request state
  const [organizationRequests, setOrganizationRequests] = useState<OrganizationRequest[]>([]);
  const [userRequest, setUserRequest] = useState<OrganizationRequest | null>(null);

  useEffect(() => {
    // Check for existing session on app load
    const checkAuthState = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        const orgsData = localStorage.getItem('organizations');
        const chaptersData = localStorage.getItem('chapters');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          
          // Load organizations from localStorage if available
          if (orgsData) {
            try {
              const parsedOrgs = JSON.parse(orgsData);
              setOrganizations(parsedOrgs);
            } catch (e) {
              console.error('Error parsing organizations data:', e);
            }
          }
          
          // Load chapters from localStorage if available
          if (chaptersData) {
            try {
              const parsedChapters = JSON.parse(chaptersData);
              setChapters(parsedChapters);
            } catch (e) {
              console.error('Error parsing chapters data:', e);
            }
          }
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('organizations');
        localStorage.removeItem('chapters');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - replace with actual API response
      const mockUser: User = {
        id: `${role}-${Date.now()}`,
        email,
        role,
        name: email.split('@')[0],
        organizationId: role === 'ambassador' ? 'org-123' : undefined,
        chapterId: role === 'president' ? 'chapter-123' : undefined,
        isOnboarded: false // New users need onboarding
      };

      const mockToken = `mock-token-${Date.now()}`;
      
      // Create mock organizations for ambassador users
      if (role === 'ambassador') {
        const mockOrgs: Organization[] = [
          {
            id: 'org-123',
            name: 'Primary Organization',
            logoUrl: 'https://via.placeholder.com/50',
            memberCount: 255
          },
          {
            id: 'org-456',
            name: 'Secondary Community',
            logoUrl: 'https://via.placeholder.com/50/0000FF',
            memberCount: 178
          },
          {
            id: 'org-789',
            name: 'Developer Guild',
            logoUrl: 'https://via.placeholder.com/50/FF0000',
            memberCount: 89
          }
        ];
        setOrganizations(mockOrgs);
        // Persist organizations to localStorage
        localStorage.setItem('organizations', JSON.stringify(mockOrgs));
      }
      
      // Create mock chapters for president users
      if (role === 'president') {
        const mockChapters: Chapter[] = [
          {
            id: 'chapter-123',
            name: 'Primary Chapter',
            country: 'USA',
            region: 'North America',
            organizationId: 'org-123',
            presidentId: mockUser.id,
            monthlyBudget: 10000,
            ambassadorCount: 5,
            isActive: true,
            createdDate: '2024-01-01'
          },
          {
            id: 'chapter-456',
            name: 'Secondary Chapter',
            country: 'Canada',
            region: 'North America',
            organizationId: 'org-456',
            presidentId: mockUser.id,
            monthlyBudget: 10000,
            ambassadorCount: 3,
            isActive: true,
            createdDate: '2024-02-01'
          }
        ];
        setChapters(mockChapters);
        // Persist chapters to localStorage
        localStorage.setItem('chapters', JSON.stringify(mockChapters));
      }
      
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('userData', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch {
      throw new Error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - replace with actual API response
      const mockUser: User = {
        id: `${role}-${Date.now()}`,
        email,
        role,
        name,
        organizationId: role === 'ambassador' ? 'org-123' : undefined,
        chapterId: role === 'president' ? 'chapter-123' : undefined,
        isOnboarded: false // New users need onboarding
      };

      const mockToken = `mock-token-${Date.now()}`;
      
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('userData', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch {
      throw new Error('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    try {
      // TODO: Replace with actual API call
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Password reset email sent to:', email);
    } catch {
      throw new Error('Failed to send password reset email.');
    }
  };
  
  const loginWithDiscord = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual Discord OAuth2 flow
      // In a real implementation, this would redirect to Discord's OAuth page
      // and handle the callback with the code to exchange for a token
      
      // For now, we'll simulate the Discord authentication flow
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock Discord profile - replace with actual API response
      const mockDiscordProfile: DiscordProfile = {
        id: `discord-${Date.now()}`,
        username: 'discord_user',
        discriminator: '1234',
        avatar: 'https://cdn.discordapp.com/avatars/12345/abcdef.png',
        servers: [
          {
            id: 'server-1',
            name: 'Blockchain Community 1',
            icon: 'https://cdn.discordapp.com/icons/12345/abcdef.png',
            roles: ['member']
          },
          {
            id: 'server-2',
            name: 'NFT Creators',
            icon: 'https://cdn.discordapp.com/icons/67890/ghijkl.png',
            roles: ['ambassador']
          },
          {
            id: 'server-3',
            name: 'DeFi Enthusiasts',
            icon: 'https://cdn.discordapp.com/icons/54321/mnopqr.png',
            roles: ['member', 'moderator']
          }
        ]
      };

      // Set mock organizations based on Discord servers
      const mockOrgs: Organization[] = mockDiscordProfile.servers.map(server => ({
        id: server.id,
        name: server.name,
        logoUrl: server.icon,
        memberCount: Math.floor(Math.random() * 1000) + 100
      }));
      
      setOrganizations(mockOrgs);
      // Persist organizations to localStorage
      localStorage.setItem('organizations', JSON.stringify(mockOrgs));
      
      return mockDiscordProfile;
    } catch {
      throw new Error('Discord authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectOrganization = async (organizationId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call to set the selected organization
      await new Promise(resolve => setTimeout(resolve, 800));

      const selectedOrg = organizations.find(org => org.id === organizationId);
      if (!selectedOrg && organizationId) {
        throw new Error('Organization not found');
      }

      // Create user with Discord profile info
      const mockUser: User = {
        id: `ambassador-${Date.now()}`,
        email: 'discord_user@example.com', // Discord might not provide email
        role: 'ambassador',
        name: 'Discord User',
        organizationId: organizationId || undefined,
        isOnboarded: false,
        discordId: 'discord-12345',
        discordUsername: 'discord_user',
        discordAvatar: 'https://cdn.discordapp.com/avatars/12345/abcdef.png'
      };

      const mockToken = `mock-discord-token-${Date.now()}`;
      
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('userData', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch {
      throw new Error('Failed to select organization. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchOrganization = async (organizationId: string) => {
    if (!user) return Promise.reject('No user logged in');
    
    setIsLoading(true);
    try {
      // Simulate API call to switch organization
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update user with new organization
      const updatedUser = {
        ...user,
        organizationId
      };
      
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch {
      throw new Error('Failed to switch organization. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectChapter = async (chapterId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call to set the selected chapter
      await new Promise(resolve => setTimeout(resolve, 800));

      const selectedChapter = chapters.find(chapter => chapter.id === chapterId);
      if (!selectedChapter && chapterId) {
        throw new Error('Chapter not found');
      }

      // Create user with chapter info
      const mockUser: User = {
        id: `president-${Date.now()}`,
        email: 'president@example.com',
        role: 'president',
        name: 'President User',
        chapterId: chapterId || undefined,
        isOnboarded: false,
        discordId: 'discord-12345',
        discordUsername: 'discord_user',
        discordAvatar: 'https://cdn.discordapp.com/avatars/12345/abcdef.png'
      };

      const mockToken = `mock-chapter-token-${Date.now()}`;
      
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('userData', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch {
      throw new Error('Failed to select chapter. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchChapter = async (chapterId: string) => {
    if (!user) return Promise.reject('No user logged in');
    
    setIsLoading(true);
    try {
      // Simulate API call to switch chapter
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update user with new chapter
      const updatedUser = {
        ...user,
        chapterId
      };
      
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch {
      throw new Error('Failed to switch chapter. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Organization Request Methods
  const submitOrganizationRequest = async (requestData: OrganizationRequestData): Promise<void> => {
    if (!user) {
      throw new Error('User must be logged in to submit organization request');
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newRequest: OrganizationRequest = {
        id: `req-${Date.now()}`,
        userId: user.id,
        organizationId: requestData.organizationId,
        organizationName: requestData.organizationName,
        applicantName: user.name,
        applicantEmail: user.email,
        applicantRole: user.role as 'president' | 'ambassador',
        submittedAt: new Date().toISOString(),
        status: 'pending',
        requestData
      };

      // Update user with request info
      const updatedUser: User = {
        ...user,
        organizationRequestId: newRequest.id,
        organizationRequestStatus: 'pending',
        hasActiveRequest: true
      };

      setUser(updatedUser);
      setUserRequest(newRequest);
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      localStorage.setItem('userRequest', JSON.stringify(newRequest));

    } catch (error) {
      throw new Error('Failed to submit organization request');
    } finally {
      setIsLoading(false);
    }
  };

  const checkRequestStatus = async (): Promise<OrganizationRequest | null> => {
    if (!user?.organizationRequestId) {
      return null;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In real implementation, fetch from API
      // For now, return stored request or simulate status update
      if (userRequest) {
        return userRequest;
      }

      // Try to load from localStorage
      const storedRequest = localStorage.getItem('userRequest');
      if (storedRequest) {
        const request = JSON.parse(storedRequest) as OrganizationRequest;
        setUserRequest(request);
        return request;
      }

      return null;
    } catch (error) {
      console.error('Failed to check request status:', error);
      return null;
    }
  };

  const getOrganizationRequests = async (organizationId?: string): Promise<OrganizationRequest[]> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock requests data - in real implementation, fetch from API
      const mockRequests: OrganizationRequest[] = [
        {
          id: 'req-001',
          userId: 'user-001',
          organizationId: organizationId || 'stellar-foundation',
          organizationName: 'Stellar Development Foundation',
          applicantName: 'Alex Johnson',
          applicantEmail: 'alex.johnson@email.com',
          applicantRole: 'ambassador',
          submittedAt: '2024-01-15T10:30:00Z',
          status: 'pending',
          requestData: {
            organizationId: organizationId || 'stellar-foundation',
            organizationName: 'Stellar Development Foundation',
            requestReason: 'I am passionate about blockchain technology...',
            experience: 'Software developer with 5 years experience...',
            preferredRegion: 'North America',
            availability: 'part-time',
            socialLinks: {
              linkedin: 'https://linkedin.com/in/alexjohnson',
              twitter: 'https://twitter.com/alexjdev',
              discord: 'alexj#1234',
              other: ''
            },
            additionalInfo: 'I speak Spanish and Portuguese fluently.'
          }
        }
      ];

      setOrganizationRequests(mockRequests);
      return mockRequests;
    } catch (error) {
      throw new Error('Failed to fetch organization requests');
    } finally {
      setIsLoading(false);
    }
  };

  const approveRequest = async (requestId: string, approvalData?: any): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update request status
      setOrganizationRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { 
                ...req, 
                status: 'approved', 
                reviewerId: user?.id,
                reviewerName: user?.name,
                reviewedAt: new Date().toISOString(),
                approvalData 
              }
            : req
        )
      );

      // If this is the current user's request, update user state
      if (userRequest?.id === requestId) {
        const updatedRequest: OrganizationRequest = {
          ...userRequest,
          status: 'approved',
          reviewerId: user?.id,
          reviewerName: user?.name,
          reviewedAt: new Date().toISOString(),
          approvalData
        };

        const updatedUser: User = {
          ...user!,
          organizationRequestStatus: 'approved',
          organizationId: userRequest.organizationId // Grant access to organization
        };

        setUserRequest(updatedRequest);
        setUser(updatedUser);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        localStorage.setItem('userRequest', JSON.stringify(updatedRequest));
      }

    } catch (error) {
      throw new Error('Failed to approve request');
    } finally {
      setIsLoading(false);
    }
  };

  const rejectRequest = async (requestId: string, rejectionReason: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update request status
      setOrganizationRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { 
                ...req, 
                status: 'rejected', 
                reviewerId: user?.id,
                reviewerName: user?.name,
                reviewedAt: new Date().toISOString(),
                rejectionReason 
              }
            : req
        )
      );

      // If this is the current user's request, update user state
      if (userRequest?.id === requestId) {
        const updatedRequest: OrganizationRequest = {
          ...userRequest,
          status: 'rejected',
          reviewerId: user?.id,
          reviewerName: user?.name,
          reviewedAt: new Date().toISOString(),
          rejectionReason
        };

        const updatedUser: User = {
          ...user!,
          organizationRequestStatus: 'rejected'
        };

        setUserRequest(updatedRequest);
        setUser(updatedUser);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        localStorage.setItem('userRequest', JSON.stringify(updatedRequest));
      }

    } catch (error) {
      throw new Error('Failed to reject request');
    } finally {
      setIsLoading(false);
    }
  };

  const withdrawRequest = async (requestId: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // Remove request
      setOrganizationRequests(prev => prev.filter(req => req.id !== requestId));

      // If this is the current user's request, clear user state
      if (userRequest?.id === requestId) {
        const updatedUser: User = {
          ...user!,
          organizationRequestId: undefined,
          organizationRequestStatus: 'none',
          hasActiveRequest: false
        };

        setUserRequest(null);
        setUser(updatedUser);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        localStorage.removeItem('userRequest');
      }

    } catch (error) {
      throw new Error('Failed to withdraw request');
    } finally {
      setIsLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, status: OrganizationRequest['status']): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // Update request status
      setOrganizationRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status }
            : req
        )
      );

      // If this is the current user's request, update user state
      if (userRequest?.id === requestId) {
        const updatedRequest: OrganizationRequest = {
          ...userRequest,
          status
        };

        const updatedUser: User = {
          ...user!,
          organizationRequestStatus: status
        };

        setUserRequest(updatedRequest);
        setUser(updatedUser);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        localStorage.setItem('userRequest', JSON.stringify(updatedRequest));
      }

    } catch (error) {
      throw new Error('Failed to update request status');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('userData', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    organizations,
    chapters,
    // Organization request state
    organizationRequests,
    userRequest,
    // Authentication methods
    login,
    signup,
    loginWithDiscord,
    selectOrganization,
    switchOrganization,
    selectChapter,
    switchChapter,
    logout,
    resetPassword,
    updateUser,
    // Organization request methods
    submitOrganizationRequest,
    checkRequestStatus,
    getOrganizationRequests,
    approveRequest,
    rejectRequest,
    withdrawRequest,
    updateRequestStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
