import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Alert, AlertDescription } from './ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Loader2,
  Search,
  Users,
  Phone,
  MapPin,
  Package,
  TrendingUp,
  DollarSign,
  FileText,
  ArrowLeft,
  Filter,
  Download,
  Eye,
  Award,
  Calendar,
  Coins,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { hubAPI } from '../utils/api';

interface RegisteredCollectorsListProps {
  onNavigate: (page: string) => void;
}

interface Collector {
  id: string;
  cardNumber?: string;
  fullName?: string;
  name?: string;
  phoneNumber?: string;
  phone?: string;
  hasPhone?: string;
  neighborhood: string;
  landmark?: string;
  preferredLanguage?: string;
  canRead?: string;
  photo?: string;
  totalKg: number;
  earningsGHS: number;
  savingsTokens?: number;
  totalCollections?: number;
  registrationDate?: string;
  createdAt?: string;
}

export function RegisteredCollectorsList({
  onNavigate,
}: RegisteredCollectorsListProps) {
  const { accessToken } = useAuth();
  const [collectors, setCollectors] = useState<Collector[]>([]);
  const [filteredCollectors, setFilteredCollectors] = useState<Collector[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'collections' | 'earnings' | 'recent'>('recent');
  
  const [selectedCollector, setSelectedCollector] = useState<Collector | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    loadCollectors();
  }, [accessToken]);

  useEffect(() => {
    filterAndSortCollectors();
  }, [collectors, searchTerm, filterBy, sortBy]);

  const loadCollectors = async () => {
    if (!accessToken) return;

    setLoading(true);
    setError('');

    try {
      const result = await hubAPI.getCollectors(accessToken);
      setCollectors(result.collectors || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load collectors');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCollectors = () => {
    let filtered = [...collectors];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          (c.fullName || c.name || '').toLowerCase().includes(term) ||
          (c.phoneNumber || c.phone || '').includes(term) ||
          (c.cardNumber || '').includes(term) ||
          c.neighborhood.toLowerCase().includes(term)
      );
    }

    // Activity filter
    if (filterBy === 'active') {
      filtered = filtered.filter((c) => (c.totalCollections || 0) > 0);
    } else if (filterBy === 'inactive') {
      filtered = filtered.filter((c) => (c.totalCollections || 0) === 0);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.fullName || a.name || '').localeCompare(b.fullName || b.name || '');
        case 'collections':
          return (b.totalCollections || 0) - (a.totalCollections || 0);
        case 'earnings':
          return b.earningsGHS - a.earningsGHS;
        case 'recent':
          const dateA = new Date(a.registrationDate || a.createdAt || 0).getTime();
          const dateB = new Date(b.registrationDate || b.createdAt || 0).getTime();
          return dateB - dateA;
        default:
          return 0;
      }
    });

    setFilteredCollectors(filtered);
  };

  const viewCollectorDetails = (collector: Collector) => {
    setSelectedCollector(collector);
    setShowDetailsDialog(true);
  };

  const getCollectorInitials = (collector: Collector) => {
    const name = collector.fullName || collector.name || 'C';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getActivityStatus = (collector: Collector) => {
    const collections = collector.totalCollections || 0;
    if (collections === 0) return { label: 'New', color: 'bg-gray-100 text-gray-700' };
    if (collections < 5) return { label: 'Getting Started', color: 'bg-blue-100 text-blue-700' };
    if (collections < 20) return { label: 'Active', color: 'bg-green-100 text-green-700' };
    return { label: 'Super Collector', color: 'bg-purple-100 text-purple-700' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading collectors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl text-gray-900 mb-2">Registered Collectors</h1>
              <p className="text-gray-600">
                Manage and view all collectors in your hub
              </p>
            </div>
            <Button
              onClick={() => onNavigate('register-collector')}
              className="bg-gradient-to-r from-[#10b981] to-[#14b8a6] hover:from-[#059669] hover:to-[#0d9488] text-white rounded-xl"
            >
              Register New Collector
            </Button>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white shadow-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Collectors</p>
                  <p className="text-2xl text-gray-900">{collectors.length}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-white shadow-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active</p>
                  <p className="text-2xl text-gray-900">
                    {collectors.filter((c) => (c.totalCollections || 0) > 0).length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-white shadow-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
                  <Package className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Collections</p>
                  <p className="text-2xl text-gray-900">
                    {collectors.reduce((sum, c) => sum + (c.totalCollections || 0), 0)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-white shadow-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
                  <DollarSign className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Paid</p>
                  <p className="text-2xl text-gray-900">
                    GH₵{collectors.reduce((sum, c) => sum + c.earningsGHS, 0).toFixed(0)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="bg-white shadow-sm rounded-xl p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, phone, card, or neighborhood..."
                    className="pl-10 rounded-xl border-gray-300"
                  />
                </div>
              </div>

              <Select value={filterBy} onValueChange={(v: any) => setFilterBy(v)}>
                <SelectTrigger className="w-full md:w-[180px] rounded-xl border-gray-300">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Collectors</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">New/Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                <SelectTrigger className="w-full md:w-[180px] rounded-xl border-gray-300">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="collections">Most Collections</SelectItem>
                  <SelectItem value="earnings">Highest Earnings</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Collectors List */}
        {filteredCollectors.length === 0 ? (
          <Card className="bg-white shadow-sm rounded-xl p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl text-gray-900 mb-2">
              {searchTerm
                ? 'No collectors found'
                : 'No collectors registered yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? 'Try adjusting your search or filters'
                : 'Start by registering your first collector'}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => onNavigate('register-collector')}
                className="bg-gradient-to-r from-[#10b981] to-[#14b8a6] text-white rounded-xl"
              >
                Register First Collector
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredCollectors.map((collector) => {
              const status = getActivityStatus(collector);
              const hasPhone = collector.hasPhone !== 'no' && (collector.phoneNumber || collector.phone);
              const displayName = collector.fullName || collector.name || 'Unknown';
              const contactInfo = hasPhone
                ? collector.phoneNumber || collector.phone
                : `Card: ${collector.cardNumber}`;

              return (
                <Card
                  key={collector.id}
                  className="bg-white shadow-sm rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => viewCollectorDetails(collector)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                        {collector.photo ? (
                          <AvatarImage src={collector.photo} alt={displayName} />
                        ) : null}
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-lg">
                          {getCollectorInitials(collector)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg text-gray-900">{displayName}</h3>
                          <Badge className={`${status.color} border-0 text-xs`}>
                            {status.label}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            {hasPhone ? (
                              <>
                                <Phone className="h-3.5 w-3.5" />
                                {contactInfo}
                              </>
                            ) : (
                              <>
                                <FileText className="h-3.5 w-3.5" />
                                {contactInfo}
                              </>
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {collector.neighborhood}
                          </span>
                          {collector.preferredLanguage && (
                            <span className="flex items-center gap-1">
                              <FileText className="h-3.5 w-3.5" />
                              {collector.preferredLanguage}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Collections</p>
                        <p className="text-xl text-gray-900">
                          {collector.totalCollections || 0}
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Total Weight</p>
                        <p className="text-xl text-gray-900">{collector.totalKg.toFixed(0)} kg</p>
                      </div>

                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Earnings</p>
                        <p className="text-xl text-green-600">
                          GH₵{collector.earningsGHS.toFixed(2)}
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                        onClick={(e) => {
                          e.stopPropagation();
                          viewCollectorDetails(collector);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Mobile Stats */}
                  <div className="md:hidden mt-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Collections</p>
                        <p className="text-lg text-gray-900">
                          {collector.totalCollections || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Weight</p>
                        <p className="text-lg text-gray-900">
                          {collector.totalKg.toFixed(0)} kg
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Earnings</p>
                        <p className="text-lg text-green-600">
                          GH₵{collector.earningsGHS.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Collector Details Dialog */}
      {selectedCollector && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                  {selectedCollector.photo ? (
                    <AvatarImage
                      src={selectedCollector.photo}
                      alt={selectedCollector.fullName || selectedCollector.name || ''}
                    />
                  ) : null}
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                    {getCollectorInitials(selectedCollector)}
                  </AvatarFallback>
                </Avatar>
                {selectedCollector.fullName || selectedCollector.name}
              </DialogTitle>
              <DialogDescription>Complete collector profile and stats</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Contact Information */}
              <div>
                <h4 className="text-sm text-gray-900 mb-3">Contact Information</h4>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  {selectedCollector.hasPhone !== 'no' &&
                  (selectedCollector.phoneNumber || selectedCollector.phone) ? (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-900">
                        {selectedCollector.phoneNumber || selectedCollector.phone}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-900">
                        Card Number: {selectedCollector.cardNumber}
                      </span>
                      <Badge className="bg-orange-100 text-orange-700 border-0 text-xs ml-2">
                        No Phone
                      </Badge>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-900">
                      {selectedCollector.neighborhood}
                    </span>
                  </div>
                  {selectedCollector.landmark && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Landmark: {selectedCollector.landmark}
                      </span>
                    </div>
                  )}
                  {selectedCollector.preferredLanguage && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-900">
                        Language: {selectedCollector.preferredLanguage}
                      </span>
                    </div>
                  )}
                  {selectedCollector.canRead === 'no' && (
                    <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">
                      Cannot Read/Write
                    </Badge>
                  )}
                </div>
              </div>

              {/* Performance Stats */}
              <div>
                <h4 className="text-sm text-gray-900 mb-3">Performance Stats</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-blue-600" />
                      <span className="text-xs text-blue-900">Collections</span>
                    </div>
                    <p className="text-3xl text-blue-900">
                      {selectedCollector.totalCollections || 0}
                    </p>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-xs text-green-900">Total Weight</span>
                    </div>
                    <p className="text-3xl text-green-900">
                      {selectedCollector.totalKg.toFixed(1)} kg
                    </p>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-purple-600" />
                      <span className="text-xs text-purple-900">Earnings</span>
                    </div>
                    <p className="text-3xl text-purple-900">
                      GH₵{selectedCollector.earningsGHS.toFixed(2)}
                    </p>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Coins className="h-4 w-4 text-orange-600" />
                      <span className="text-xs text-orange-900">Savings</span>
                    </div>
                    <p className="text-3xl text-orange-900">
                      {selectedCollector.savingsTokens?.toFixed(2) || '0.00'}
                    </p>
                  </Card>
                </div>
              </div>

              {/* Registration Info */}
              {selectedCollector.registrationDate && (
                <div>
                  <h4 className="text-sm text-gray-900 mb-3">Registration</h4>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-900">
                        Registered on{' '}
                        {new Date(selectedCollector.registrationDate).toLocaleDateString(
                          'en-GB',
                          {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setShowDetailsDialog(false)}
                variant="outline"
                className="flex-1 rounded-xl"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setShowDetailsDialog(false);
                  onNavigate('hub-transaction');
                }}
                className="flex-1 bg-gradient-to-r from-[#10b981] to-[#14b8a6] text-white rounded-xl"
              >
                New Transaction
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
