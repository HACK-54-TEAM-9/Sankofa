import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { useAuth } from './AuthContext';
import { LogIn, User, Building2, AlertCircle, Loader2, Eye, EyeOff, Sparkles, UserPlus, Mail, ExternalLink } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const { login, loginWithPhone, signup, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('collector');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    let result;
    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your name');
        setIsLoading(false);
        return;
      }
      // For collector signup, include phone if provided
      const phoneValue = activeTab === 'collector' && phone.trim() ? phone.trim() : undefined;
      result = await signup(email, password, name, activeTab as 'collector' | 'hub-manager', phoneValue);
    } else {
      // For collector login, use phone or email based on loginMethod
      if (activeTab === 'collector' && loginMethod === 'phone') {
        console.log('Attempting phone login with:', phone);
        result = await loginWithPhone(phone, password);
      } else {
        result = await login(email, password);
      }
    }

    if (result.success) {
      if (mode === 'signup') {
        setSuccess('Account created successfully! Redirecting...');
      }
      // Navigate to appropriate dashboard
      setTimeout(() => {
        onNavigate(activeTab === 'collector' ? 'collector' : 'hub-manager');
      }, mode === 'signup' ? 1500 : 500);
    } else {
      setError(result.error || `${mode === 'signup' ? 'Signup' : 'Login'} failed. Please try again.`);
    }

    setIsLoading(false);
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');
    setResetLoading(true);

    const result = await resetPassword(resetEmail);

    if (result.success) {
      setResetSuccess('Password reset link sent! Check your email.');
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetEmail('');
        setResetSuccess('');
      }, 3000);
    } else {
      setResetError(result.error || 'Failed to send reset email. Please try again.');
    }

    setResetLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg p-2">
              <img 
                src="/logo.png" 
                alt="Sankofa-Coin Logo"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
          <h1 className="text-4xl text-gray-900 mb-4">
            {mode === 'login' ? 'Welcome Back' : 'Join Sankofa'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {mode === 'login' 
              ? 'Sign in to access your dashboard and track your impact on community health'
              : 'Create an account to start transforming plastic pollution into health intelligence'
            }
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white rounded-full p-1 border border-gray-200">
            <TabsTrigger 
              value="collector" 
              className="gap-2 rounded-full data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white"
            >
              <User className="h-4 w-4" />
              Collector
            </TabsTrigger>
            <TabsTrigger 
              value="hub-manager" 
              className="gap-2 rounded-full data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white"
            >
              <Building2 className="h-4 w-4" />
              Hub Manager
            </TabsTrigger>
          </TabsList>

          <TabsContent value="collector">
            <Card className="bg-white border-0 shadow-sm rounded-3xl p-8 md:p-10">
              <div className="mb-6">
                <h2 className="text-2xl text-gray-900 mb-2">
                  Collector {mode === 'login' ? 'Login' : 'Signup'}
                </h2>
                <p className="text-gray-600">
                  {mode === 'login' 
                    ? 'Access your collection stats and earnings'
                    : 'Start collecting plastic and earning rewards'
                  }
                </p>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-6 rounded-2xl border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-6 rounded-2xl border-green-200 bg-green-50">
                  <Sparkles className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              {mode === 'login' && (
                <div className="mb-4 rounded-xl bg-stone-50 border border-stone-200 p-4">
                  <p className="text-xs text-stone-600 mb-2">Demo Account:</p>
                  <p className="text-sm text-stone-900">
                    {loginMethod === 'phone' ? '0501234567' : 'collector@demo.com'} / demo123
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {mode === 'signup' && (
                  <div>
                    <Label htmlFor="collector-name" className="text-gray-900 mb-2 block">
                      Full Name
                    </Label>
                    <Input
                      id="collector-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      required
                      disabled={isLoading}
                      className="rounded-xl border-gray-200"
                    />
                  </div>
                )}

                {mode === 'login' && (
                  <div className="flex gap-2 p-1 bg-stone-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setLoginMethod('email')}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm transition-colors ${
                        loginMethod === 'email'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginMethod('phone')}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm transition-colors ${
                        loginMethod === 'phone'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Phone Number
                    </button>
                  </div>
                )}

                {mode === 'login' && loginMethod === 'phone' ? (
                  <div>
                    <Label htmlFor="collector-phone" className="text-gray-900 mb-2 block">
                      Phone Number
                    </Label>
                    <Input
                      id="collector-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0XXXXXXXXX"
                      required
                      disabled={isLoading}
                      className="rounded-xl border-gray-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Demo: 0501234567 (password: demo123)
                    </p>
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="collector-email" className="text-gray-900 mb-2 block">
                      Email Address
                    </Label>
                    <Input
                      id="collector-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      disabled={isLoading}
                      className="rounded-xl border-gray-200"
                    />
                  </div>
                )}

                {mode === 'signup' && (
                  <div>
                    <Label htmlFor="collector-phone-signup" className="text-gray-900 mb-2 block">
                      Phone Number <span className="text-gray-500 text-sm">(Optional)</span>
                    </Label>
                    <Input
                      id="collector-phone-signup"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0XXXXXXXXX"
                      disabled={isLoading}
                      className="rounded-xl border-gray-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">You can login with your phone number later</p>
                  </div>
                )}

                <div>
                  <Label htmlFor="collector-password" className="text-gray-900 mb-2 block">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="collector-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={mode === 'signup' ? 'Create a strong password' : 'Enter your password'}
                      required
                      disabled={isLoading}
                      className="rounded-xl border-gray-200 pr-10"
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {mode === 'signup' && (
                    <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                  )}
                  {mode === 'login' && (
                    <div className="text-right mt-1">
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-xs text-[#08A26F] hover:text-[#059669] hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white hover:text-white rounded-full gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {mode === 'signup' ? 'Creating Account...' : 'Signing In...'}
                    </>
                  ) : (
                    <>
                      {mode === 'signup' ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
                      {mode === 'signup' ? 'Create Account' : 'Sign In'}
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-sm text-gray-600 hover:text-[#10b981]"
                >
                  {mode === 'login' 
                    ? "Don't have an account? Sign up" 
                    : 'Already have an account? Sign in'
                  }
                </button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="hub-manager">
            <Card className="bg-white border-0 shadow-sm rounded-3xl p-8 md:p-10">
              <div className="mb-6">
                <h2 className="text-2xl text-gray-900 mb-2">
                  Hub Manager Login
                </h2>
                <p className="text-gray-600">
                  Manage your Hub and track collections
                </p>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-6 rounded-2xl border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-6 rounded-2xl border-green-200 bg-green-50">
                  <Sparkles className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              <div className="mb-4 rounded-xl bg-stone-50 border border-stone-200 p-4">
                <p className="text-xs text-stone-600 mb-2">Demo Account:</p>
                <p className="text-sm text-stone-900 mb-3">manager@demo.com / demo123</p>
                <Button
                  type="button"
                  onClick={() => window.open('https://port-lizard-13129616.figma.site', '_blank')}
                  variant="outline"
                  size="sm"
                  className="w-full rounded-lg border-stone-300 hover:bg-stone-100 gap-2"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Preview Demo
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="manager-email" className="text-gray-900 mb-2 block">
                    Email Address
                  </Label>
                  <Input
                    id="manager-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={isLoading}
                    className="rounded-xl border-gray-200"
                  />
                </div>

                <div>
                  <Label htmlFor="manager-password" className="text-gray-900 mb-2 block">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="manager-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      disabled={isLoading}
                      className="rounded-xl border-gray-200 pr-10"
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="text-right mt-1">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-xs text-[#08A26F] hover:text-[#059669] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white hover:text-white rounded-full gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-stone-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-2 text-stone-500">New to Sankofa?</span>
                  </div>
                </div>
                
                <div className="mt-6 p-6 bg-[#08A26F]/5 rounded-2xl border border-[#08A26F]/20">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#08A26F]">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 mb-1">Want to Become a Hub Manager?</h3>
                      <p className="text-sm text-gray-600">
                        Hub Managers are approved community leaders. Submit an application to join our team.
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={() => onNavigate('hub-manager')}
                    className="w-full bg-[#08A26F] hover:bg-[#059669] text-white rounded-xl gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    Apply to Be a Hub Manager
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Forgot Password Dialog */}
        <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
          <DialogContent className="sm:max-w-md bg-white rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Reset Password</DialogTitle>
              <DialogDescription className="text-gray-600">
                Enter your email address and we'll send you a link to reset your password.
              </DialogDescription>
            </DialogHeader>

            {resetError && (
              <Alert variant="destructive" className="rounded-2xl border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{resetError}</AlertDescription>
              </Alert>
            )}

            {resetSuccess && (
              <Alert className="rounded-2xl border-green-200 bg-green-50">
                <Mail className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{resetSuccess}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <Label htmlFor="reset-email" className="text-gray-900 mb-2 block">
                  Email Address
                </Label>
                <Input
                  id="reset-email"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={resetLoading}
                  className="rounded-xl border-gray-200"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmail('');
                    setResetError('');
                    setResetSuccess('');
                  }}
                  disabled={resetLoading}
                  className="flex-1 rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={resetLoading}
                  className="flex-1 bg-[#08A26F] hover:bg-[#059669] text-white rounded-full gap-2"
                >
                  {resetLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" />
                      Send Reset Link
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <button
              onClick={() => onNavigate('contact')}
              className="text-[#10b981] hover:text-[#059669] hover:underline"
            >
              Contact Support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
