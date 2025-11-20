import { useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from './ui/sheet';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import {
  LayoutDashboard,
  Users,
  Receipt,
  Settings,
  Menu,
  X,
  Building2,
  UserPlus,
  Plus,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useAuth } from './AuthContext';
import MaskGroup from '../imports/MaskGroup';

interface HubManagerLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

export function HubManagerLayout({
  children,
  currentPage,
  onNavigate,
}: HubManagerLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems: NavItem[] = [
    {
      id: 'hub-manager',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      id: 'view-collectors',
      label: 'Collectors',
      icon: <Users className="h-5 w-5" />,
    },
    {
      id: 'hub-transactions',
      label: 'Recent Transactions',
      icon: <Receipt className="h-5 w-5" />,
    },
    {
      id: 'hub-settings',
      label: 'Settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const quickActions = [
    {
      id: 'hub-transaction',
      label: 'New Transaction',
      icon: <Plus className="h-4 w-4" />,
      color: 'bg-gradient-to-r from-[#10b981] to-[#14b8a6] hover:from-[#059669] hover:to-[#0d9488] text-white',
    },
    {
      id: 'register-collector',
      label: 'Register Collector',
      icon: <UserPlus className="h-4 w-4" />,
      color: 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200',
    },
  ];

  const handleLogout = () => {
    logout();
    onNavigate('home');
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo & Hub Info */}
      <div className="border-b border-gray-200 p-6">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 mb-4 group"
        >
          <img 
            src="/components/images/logo.png" 
            alt="Sankofa-Coin Logo"
            className="h-10 w-10 object-contain group-hover:scale-105 transition-transform"
          />
          <span className="text-lg text-gray-900">Sankofa</span>
        </button>
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-gray-900">Accra Central Hub</p>
            <p className="text-xs text-gray-600">Hub Manager</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border-b border-gray-200 p-6">
        <p className="text-xs text-gray-500 mb-3">Quick Actions</p>
        <div className="space-y-2">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              onClick={() => {
                onNavigate(action.id);
                setSidebarOpen(false);
              }}
              className={`w-full justify-start gap-2 rounded-xl ${action.color}`}
              size="sm"
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-6">
        <p className="text-xs text-gray-500 mb-3">Navigation</p>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-[#10b981]/10 to-[#14b8a6]/10 text-[#10b981] border border-[#10b981]/20'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.badge && (
                  <Badge className="bg-red-500 text-white border-0 text-xs">
                    {item.badge}
                  </Badge>
                )}
                {isActive && <ChevronRight className="h-4 w-4" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Section */}
      <div className="border-t border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
              {user?.name?.substring(0, 2).toUpperCase() || 'HM'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900 truncate">{user?.name || 'Hub Manager'}</p>
            <p className="text-xs text-gray-600">{user?.email || ''}</p>
          </div>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start gap-2 rounded-xl text-red-600 border-red-200 hover:bg-red-50"
          size="sm"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2"
          >
            <div className="h-8 w-8 flex items-center justify-center">
              <MaskGroup />
            </div>
            <span className="text-lg text-gray-900">Sankofa</span>
          </button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col border-r border-gray-200 bg-white">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Hub Manager Navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Navigate through your hub management dashboard
          </SheetDescription>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="lg:pl-72">
        {children}
      </main>
    </div>
  );
}
