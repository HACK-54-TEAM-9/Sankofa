import { useState, useRef } from 'react';
import { Menu, X, LogIn, LogOut, User, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from './ui/sheet';
import { useAuth } from './AuthContext';
import MaskGroup from '../imports/MaskGroup';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'ai-assistant', label: 'AI Assistant' },
    { id: 'volunteer', label: 'Volunteer' },
    { id: 'donations', label: 'Donate' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  const resourcesItems = [
    { id: 'location-insights', label: 'Health Insights' },
    { id: 'data', label: 'Data Analytics' },
    { id: 'blog', label: 'Blog' },
  ];

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    onNavigate('home');
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavigate('home')}
            className="flex items-center gap-3 group"
          >
            <div className="h-10 w-10 flex items-center justify-center group-hover:scale-105 transition-transform">
              <MaskGroup />
            </div>
            <span className="text-xl font-bold text-penny-dark">
              Sankofa
            </span>
          </button>

          {/* Desktop Navigation - Centered */}
          <div className="hidden items-center gap-10 lg:flex absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`text-base font-medium transition-colors relative ${
                  currentPage === item.id ? 'text-penny-dark' : 'text-gray-600 hover:text-penny-dark'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {/* Resources Dropdown */}
            <div className="relative group">
              <button
                className={`text-base font-medium transition-colors relative flex items-center gap-1 ${
                  resourcesItems.some(item => item.id === currentPage)
                    ? 'text-penny-dark'
                    : 'text-gray-600 hover:text-penny-dark'
                }`}
              >
                Resources
                <ChevronDown className="h-4 w-4" />
              </button>
              {/* Dropdown menu with CSS hover */}
              <div className="absolute top-full right-0 mt-4 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 opacity-0 invisible overflow-hidden group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {resourcesItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className="w-full text-left px-6 py-3 text-base text-gray-900 hover:bg-gray-200 hover:text-[#1a1a1a] transition-colors font-medium first:rounded-t-2xl last:rounded-b-2xl"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
            
          {/* Auth Section - Right side */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 rounded-full border">
                    <User className="h-4 w-4" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavigate(user.role === 'collector' ? 'collector' : 'hub-manager')}>
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigate('location-insights')}>
                    Health Insights
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  onClick={() => handleNavigate('login')}
                  variant="outline"
                  className="rounded-full px-7 py-5 border-2 border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-colors font-medium"
                >
                  Join Sankofa
                </Button>
                <Button
                  onClick={() => handleNavigate('login')}
                  className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white rounded-full px-7 py-5 font-medium"
                >
                  Login
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Navigate through the Sankofa website
              </SheetDescription>
              <div className="flex flex-col gap-4 mt-8">
                {/* User Info */}
                {isAuthenticated && user && (
                  <div className="px-4 py-3 bg-gradient-to-r from-[#10b981]/10 to-[#14b8a6]/10 rounded-2xl border border-[#10b981]/20 mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4 text-[#10b981]" />
                      <p className="text-gray-900">{user.name}</p>
                    </div>
                    <p className="text-xs text-gray-600 capitalize">{user.role?.replace('-', ' ')}</p>
                  </div>
                )}

                {/* Navigation Items */}
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={`text-left px-4 py-3 rounded-xl transition-colors ${
                      currentPage === item.id
                        ? 'bg-[#10b981]/10 text-[#10b981]'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}

                {/* Resources Section */}
                <div className="pt-2 border-t border-gray-100 mt-2">
                  <p className="px-4 py-2 text-xs text-gray-500">Resources</p>
                  {resourcesItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className={`text-left px-4 py-3 rounded-xl transition-colors w-full ${
                        currentPage === item.id
                          ? 'bg-[#10b981]/10 text-[#10b981]'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Auth Buttons */}
                <div className="pt-4 border-t border-gray-100 mt-2">
                  {isAuthenticated ? (
                    <>
                      <button
                        onClick={() => handleNavigate(user?.role === 'collector' ? 'collector' : 'hub-manager')}
                        className="w-full text-left px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 mb-2"
                      >
                        My Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleNavigate('login')}
                      className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2"
                  
                    >
                      <LogIn className="h-4 w-4 text-white  " />
                      Login
                    </button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
