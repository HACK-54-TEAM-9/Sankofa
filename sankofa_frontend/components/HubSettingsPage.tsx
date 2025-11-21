import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  User,
  Building2,
  Bell,
  Lock,
  Phone,
  Mail,
  Save,
  Camera,
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

export function HubSettingsPage() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'hub' | 'notifications' | 'security'>('profile');

  // Profile Settings
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Kwame Asante',
    email: user?.email || 'kwame.asante@sankofa.com',
    phone: '+233 24 123 4567',
    role: 'Hub Manager',
  });

  // Hub Settings
  const [hubData, setHubData] = useState({
    hubName: 'Accra Central Hub',
    location: 'Accra, Greater Accra Region',
    address: '123 Independence Avenue, Accra',
    operatingHours: '8:00 AM - 6:00 PM',
    contactNumber: '+233 30 123 4567',
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: true,
    transactionAlerts: true,
    dailySummary: true,
    weeklyReports: false,
    collectorRegistrations: true,
    lowInventoryAlerts: true,
  });

  // Security Settings
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSaveProfile = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    toast.success('Profile updated successfully!');
  };

  const handleSaveHub = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    toast.success('Hub settings updated successfully!');
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    toast.success('Notification preferences updated!');
  };

  const handleChangePassword = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    if (securityData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters!');
      return;
    }

    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    toast.success('Password changed successfully!');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
    { id: 'hub', label: 'Hub Details', icon: <Building2 className="h-4 w-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
    { id: 'security', label: 'Security', icon: <Lock className="h-4 w-4" /> },
  ] as const;

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account and hub preferences</p>
        </div>

        {/* Tabs */}
        <Card className="bg-white shadow-sm rounded-xl mb-6">
          <div className="flex overflow-x-auto border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#10b981] text-[#10b981]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.icon}
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <Card className="bg-white shadow-sm rounded-xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl">
                    {profileData.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 p-1.5 bg-[#10b981] text-white rounded-full hover:bg-[#059669] transition-colors">
                  <Camera className="h-3 w-3" />
                </button>
              </div>
              <div>
                <h3 className="text-lg text-gray-900">{profileData.name}</h3>
                <p className="text-sm text-gray-600">{profileData.role}</p>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-gray-900 mb-2 block">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    className="rounded-xl border-gray-300"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-900 mb-2 block">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    className="rounded-xl border-gray-300"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-gray-900 mb-2 block">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    className="rounded-xl border-gray-300"
                  />
                </div>

                <div>
                  <Label htmlFor="role" className="text-gray-900 mb-2 block">
                    Role
                  </Label>
                  <Input
                    id="role"
                    value={profileData.role}
                    disabled
                    className="rounded-xl border-gray-300 bg-gray-50"
                  />
                </div>
              </div>

              <Button
                onClick={handleSaveProfile}
                disabled={saving}
                className="bg-gradient-to-r from-[#10b981] to-[#14b8a6] hover:from-[#059669] hover:to-[#0d9488] text-white rounded-xl"
              >
                {saving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}

        {/* Hub Details Tab */}
        {activeTab === 'hub' && (
          <Card className="bg-white shadow-sm rounded-xl p-6">
            <h3 className="text-lg text-gray-900 mb-6">Hub Information</h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="hubName" className="text-gray-900 mb-2 block">
                  Hub Name
                </Label>
                <Input
                  id="hubName"
                  value={hubData.hubName}
                  onChange={(e) =>
                    setHubData({ ...hubData, hubName: e.target.value })
                  }
                  className="rounded-xl border-gray-300"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location" className="text-gray-900 mb-2 block">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={hubData.location}
                    onChange={(e) =>
                      setHubData({ ...hubData, location: e.target.value })
                    }
                    className="rounded-xl border-gray-300"
                  />
                </div>

                <div>
                  <Label htmlFor="contactNumber" className="text-gray-900 mb-2 block">
                    Contact Number
                  </Label>
                  <Input
                    id="contactNumber"
                    value={hubData.contactNumber}
                    onChange={(e) =>
                      setHubData({ ...hubData, contactNumber: e.target.value })
                    }
                    className="rounded-xl border-gray-300"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address" className="text-gray-900 mb-2 block">
                  Full Address
                </Label>
                <Input
                  id="address"
                  value={hubData.address}
                  onChange={(e) =>
                    setHubData({ ...hubData, address: e.target.value })
                  }
                  className="rounded-xl border-gray-300"
                />
              </div>

              <div>
                <Label htmlFor="hours" className="text-gray-900 mb-2 block">
                  Operating Hours
                </Label>
                <Input
                  id="hours"
                  value={hubData.operatingHours}
                  onChange={(e) =>
                    setHubData({ ...hubData, operatingHours: e.target.value })
                  }
                  className="rounded-xl border-gray-300"
                />
              </div>

              <Button
                onClick={handleSaveHub}
                disabled={saving}
                className="bg-gradient-to-r from-[#10b981] to-[#14b8a6] hover:from-[#059669] hover:to-[#0d9488] text-white rounded-xl"
              >
                {saving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <Card className="bg-white shadow-sm rounded-xl p-6">
            <h3 className="text-lg text-gray-900 mb-2">Notification Preferences</h3>
            <p className="text-sm text-gray-600 mb-6">
              Choose how you want to receive updates and alerts
            </p>

            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm text-gray-900">Communication Channels</h4>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-900">Email Notifications</p>
                      <p className="text-xs text-gray-600">Receive updates via email</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, emailNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-900">SMS Notifications</p>
                      <p className="text-xs text-gray-600">Receive alerts via SMS</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.smsNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, smsNotifications: checked })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm text-gray-900">Alert Types</h4>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-900">Transaction Alerts</p>
                    <p className="text-xs text-gray-600">Get notified of each transaction</p>
                  </div>
                  <Switch
                    checked={notifications.transactionAlerts}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, transactionAlerts: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-900">Daily Summary</p>
                    <p className="text-xs text-gray-600">End-of-day activity summary</p>
                  </div>
                  <Switch
                    checked={notifications.dailySummary}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, dailySummary: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-900">Weekly Reports</p>
                    <p className="text-xs text-gray-600">Comprehensive weekly analytics</p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, weeklyReports: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-900">Collector Registrations</p>
                    <p className="text-xs text-gray-600">New collector sign-ups</p>
                  </div>
                  <Switch
                    checked={notifications.collectorRegistrations}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        collectorRegistrations: checked,
                      })
                    }
                  />
                </div>
              </div>

              <Button
                onClick={handleSaveNotifications}
                disabled={saving}
                className="bg-gradient-to-r from-[#10b981] to-[#14b8a6] hover:from-[#059669] hover:to-[#0d9488] text-white rounded-xl"
              >
                {saving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <Card className="bg-white shadow-sm rounded-xl p-6">
            <h3 className="text-lg text-gray-900 mb-2">Security Settings</h3>
            <p className="text-sm text-gray-600 mb-6">
              Update your password and security preferences
            </p>

            <Alert className="mb-6 border-blue-200 bg-blue-50">
              <Lock className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-900">
                Choose a strong password with at least 8 characters, including uppercase,
                lowercase, and numbers.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <Label htmlFor="currentPassword" className="text-gray-900 mb-2 block">
                  Current Password
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={securityData.currentPassword}
                  onChange={(e) =>
                    setSecurityData({ ...securityData, currentPassword: e.target.value })
                  }
                  className="rounded-xl border-gray-300"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <Label htmlFor="newPassword" className="text-gray-900 mb-2 block">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={securityData.newPassword}
                  onChange={(e) =>
                    setSecurityData({ ...securityData, newPassword: e.target.value })
                  }
                  className="rounded-xl border-gray-300"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-gray-900 mb-2 block">
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={securityData.confirmPassword}
                  onChange={(e) =>
                    setSecurityData({ ...securityData, confirmPassword: e.target.value })
                  }
                  className="rounded-xl border-gray-300"
                  placeholder="Confirm new password"
                />
              </div>

              <Button
                onClick={handleChangePassword}
                disabled={
                  saving ||
                  !securityData.currentPassword ||
                  !securityData.newPassword ||
                  !securityData.confirmPassword
                }
                className="bg-gradient-to-r from-[#10b981] to-[#14b8a6] hover:from-[#059669] hover:to-[#0d9488] text-white rounded-xl"
              >
                {saving ? (
                  <>Updating...</>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
