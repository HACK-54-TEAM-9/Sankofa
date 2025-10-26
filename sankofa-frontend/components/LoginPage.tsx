import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAuth } from './AuthContext';
import { LogIn, User, Building2, AlertCircle, Loader2, Eye, EyeOff, Sparkles, UserPlus } from 'lucide-react';
import logoImage from '../assets/logo.png';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const { login, signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('collector');
  const [mode, setMode] = useState<'login' | 'signup'>('login');

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
      result = await signup(email, password, name, activeTab as 'collector' | 'hub-manager');
    } else {
      result = await login(email, password);
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
  };

  return (
    <div className="min-h-screen bg-[#fafafa] py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#10b981] to-[#14b8a6] shadow-lg p-2">
              <img src={logoImage} alt="Sankofa Logo" className="h-full w-full object-contain" />
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
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-full gap-2"
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

                {mode === 'login' && (
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      setEmail('collector@demo.com');
                      setPassword('demo123');
                    }}
                    disabled={isLoading}
                    className="w-full rounded-full gap-2 border-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    Use Demo Account
                  </Button>
                )}
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
                  Hub Manager {mode === 'login' ? 'Login' : 'Signup'}
                </h2>
                <p className="text-gray-600">
                  {mode === 'login' 
                    ? 'Manage your Hub and track collections'
                    : 'Register your Hub and start managing collections'
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

              <form onSubmit={handleSubmit} className="space-y-6">
                {mode === 'signup' && (
                  <div>
                    <Label htmlFor="manager-name" className="text-gray-900 mb-2 block">
                      Full Name
                    </Label>
                    <Input
                      id="manager-name"
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
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-full gap-2"
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

                {mode === 'login' && (
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      setEmail('hubmanager@demo.com');
                      setPassword('demo123');
                    }}
                    disabled={isLoading}
                    className="w-full rounded-full gap-2 border-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    Use Demo Account
                  </Button>
                )}
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-sm text-gray-600 hover:text-[#3b82f6]"
                >
                  {mode === 'login' 
                    ? "Don't have an account? Sign up" 
                    : 'Already have an account? Sign in'
                  }
                </button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

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
