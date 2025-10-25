import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAuth } from './AuthContext';
import { LogIn, User, Building2, AlertCircle, Loader2, Eye, EyeOff, Sparkles } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('collector');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      // Navigate to appropriate dashboard
      setTimeout(() => {
        onNavigate(activeTab === 'collector' ? 'collector' : 'hub-manager');
      }, 500);
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }

    setIsLoading(false);
  };

  const fillDemoCredentials = (role: 'collector' | 'hub-manager') => {
    if (role === 'collector') {
      setEmail('collector@demo.com');
      setPassword('collector123');
    } else {
      setEmail('hubmanager@demo.com');
      setPassword('manager123');
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#10b981] to-[#14b8a6] shadow-lg">
              <span className="text-3xl">🐦</span>
            </div>
          </div>
          <h1 className="text-4xl text-gray-900 mb-4">Welcome Back</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sign in to access your dashboard and track your impact on community health
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
                <h2 className="text-2xl text-gray-900 mb-2">Collector Login</h2>
                <p className="text-gray-600">Access your collection stats and earnings</p>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-6 rounded-2xl border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
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
                      placeholder="Enter your password"
                      required
                      disabled={isLoading}
                      className="rounded-xl border-gray-200 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
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

              <div className="mt-6 p-4 bg-gradient-to-br from-[#10b981]/5 to-[#3b82f6]/5 rounded-2xl border border-[#10b981]/10">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-[#10b981] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-900 mb-2">Try Demo Account</p>
                    <p className="text-xs text-gray-600 mb-3">
                      Test the platform with pre-filled credentials
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fillDemoCredentials('collector')}
                      disabled={isLoading}
                      className="border-2 border-gray-200 hover:border-[#10b981] hover:text-[#10b981] rounded-full"
                    >
                      Fill Demo Credentials
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="hub-manager">
            <Card className="bg-white border-0 shadow-sm rounded-3xl p-8 md:p-10">
              <div className="mb-6">
                <h2 className="text-2xl text-gray-900 mb-2">Hub Manager Login</h2>
                <p className="text-gray-600">Manage your Hub and track collections</p>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-6 rounded-2xl border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

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
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
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

              <div className="mt-6 p-4 bg-gradient-to-br from-[#3b82f6]/5 to-[#8b5cf6]/5 rounded-2xl border border-[#3b82f6]/10">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-[#3b82f6] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-900 mb-2">Try Demo Account</p>
                    <p className="text-xs text-gray-600 mb-3">
                      Test the platform with pre-filled credentials
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fillDemoCredentials('hub-manager')}
                      disabled={isLoading}
                      className="border-2 border-gray-200 hover:border-[#3b82f6] hover:text-[#3b82f6] rounded-full"
                    >
                      Fill Demo Credentials
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate(activeTab === 'collector' ? 'collector' : 'hub-manager')}
              className="text-[#10b981] hover:text-[#059669] hover:underline"
            >
              Learn how to join
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
