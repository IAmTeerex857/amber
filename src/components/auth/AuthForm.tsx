import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Building2, Crown, Users } from 'lucide-react';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import DiscordAuthButton from './DiscordAuthButton';
import OrganizationSelection from './OrganizationSelection';

interface AuthFormProps {
  onSuccess?: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const { login, signup, resetPassword, isLoading, loginWithDiscord, selectOrganization, organizations } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login');
  const [userType, setUserType] = useState<UserRole | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [authStep, setAuthStep] = useState<'credentials' | 'user-type' | 'discord-auth' | 'org-selection'>('credentials');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleDiscordLogin = async () => {
    try {
      setError('');
      const discordProfile = await loginWithDiscord();
      if (discordProfile) {
        setAuthStep('org-selection');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Discord authentication failed');
    }
  };

  const handleOrganizationSelect = async (organizationId: string) => {
    try {
      await selectOrganization(organizationId);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to select organization');
      setAuthStep('credentials');
    }
  };

  const handleUserTypeSelect = async (selectedUserType: UserRole) => {
    setUserType(selectedUserType);
    
    // Continue with authentication automatically after user type selection
    try {
      if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setAuthStep('credentials');
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          setAuthStep('credentials');
          return;
        }
        await signup(formData.email, formData.password, formData.name, selectedUserType);
      } else {
        await login(formData.email, formData.password, selectedUserType);
      }

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setAuthStep('credentials');
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // If no user type selected and we're not in reset mode, show user type selection
    if (!userType && mode !== 'reset') {
      setAuthStep('user-type');
      return;
    }

    try {
      if (mode === 'reset') {
        await resetPassword(formData.email);
        setResetEmailSent(true);
        return;
      }

      if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          return;
        }
        await signup(formData.email, formData.password, formData.name, userType!);
      } else {
        await login(formData.email, formData.password, userType!);
      }

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const resetForm = () => {
    setFormData({ email: '', password: '', name: '', confirmPassword: '' });
    setError('');
    setResetEmailSent(false);
  };

  const switchMode = (newMode: 'login' | 'signup' | 'reset') => {
    setMode(newMode);
    resetForm();
  };

  // User Type Selection Step
  if (authStep === 'user-type') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 flex items-center justify-center mb-8">
              <img src="/Amber Icon purple.svg" alt="Amber Logo" className="w-16 h-16" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Select user type</h2>
          </div>

          <div className="space-y-4">
            {/* Organization */}
            <button
              onClick={() => handleUserTypeSelect('organization')}
              className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all group text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Building2 className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Organization</h3>
                  <p className="text-sm text-gray-500">Manage chapters and ambassadors</p>
                </div>
              </div>
            </button>

            {/* President */}
            <button
              onClick={() => handleUserTypeSelect('president')}
              className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all group text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Crown className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">President</h3>
                  <p className="text-sm text-gray-500">Regional chapter management</p>
                </div>
              </div>
            </button>

            {/* Ambassador */}
            <button
              onClick={() => handleUserTypeSelect('ambassador')}
              className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all group text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Ambassador</h3>
                  <p className="text-sm text-gray-500">Community engagement and tasks</p>
                </div>
              </div>
            </button>

            <p className="text-sm text-gray-500 text-center mt-6">
              You will only have permission to view the content but you can't edit or make changes.
            </p>
          </div>

          <div className="flex items-center justify-between pt-6">
            <button
              onClick={() => setAuthStep('credentials')}
              className="flex items-center text-purple-600 hover:text-purple-700 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              BACK
            </button>
            <button
              disabled
              className="px-8 py-3 bg-purple-600 text-white rounded-full font-medium opacity-50 cursor-not-allowed"
            >
              CONTINUE
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (authStep === 'org-selection') {
    return <OrganizationSelection 
      organizations={organizations} 
      onSelect={handleOrganizationSelect} 
      isLoading={isLoading}
    />;
  }

  if (mode === 'reset' && resetEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Check your email
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We've sent a password reset link to {formData.email}
            </p>
            <button
              onClick={() => switchMode('login')}
              className="mt-4 text-blue-600 hover:text-blue-500 font-medium"
            >
              Back to login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Auth Form with Two-Column Layout
  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Column - Form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Back to Home Link */}
          <div className="flex items-center text-gray-600 hover:text-gray-800 cursor-pointer">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="text-sm">Back to home</span>
          </div>

          {/* Logo and Title */}
          <div>
            <div className="flex items-center mb-8">
              <img src="/Amber Icon purple.svg" alt="Amber Logo" className="w-8 h-8 mr-3" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {mode === 'login' ? 'Sign in to your account' : mode === 'signup' ? 'Create your account' : 'Reset your password'}
            </h2>
            <p className="text-gray-600 text-sm">
              {mode === 'reset' 
                ? 'Enter your email to receive a password reset link'
                : 'Please continue to sign in to your business account'
              }
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>

            {mode !== 'reset' && (
              <>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>

                {mode === 'signup' && (
                  <div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full px-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Confirm your password"
                    />
                  </div>
                )}
              </>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
              ) : (
                <>
                  {mode === 'login' && 'Continue'}
                  {mode === 'signup' && 'Create account'}
                  {mode === 'reset' && 'Send reset link'}
                </>
              )}
            </button>

            {mode !== 'reset' && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">OR</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDiscordLogin}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.191.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  Continue with Discord
                </button>

                <button
                  type="button"
                  className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
              </>
            )}

            <div className="text-center">
              {mode === 'login' && (
                <>
                  <button
                    type="button"
                    onClick={() => switchMode('reset')}
                    className="text-blue-600 hover:text-blue-500 text-sm"
                  >
                    Forgot your password?
                  </button>
                  <div className="mt-2">
                    <span className="text-gray-600 text-sm">Don't have an account? </span>
                    <button
                      type="button"
                      onClick={() => switchMode('signup')}
                      className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                    >
                      Create account
                    </button>
                  </div>
                </>
              )}
              {mode === 'signup' && (
                <div>
                  <span className="text-gray-600 text-sm">Already have an account? </span>
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                  >
                    Sign in
                  </button>
                </div>
              )}
              {mode === 'reset' && (
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-blue-600 hover:text-blue-500 text-sm"
                >
                  Back to sign in
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Right Column - Image */}
      <div className="hidden lg:flex lg:flex-1 relative">
        <img 
          src="/Amber auth .jpg"
          alt="Authentication Background" 
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default AuthForm;
