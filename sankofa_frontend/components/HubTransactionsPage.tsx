import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
// import { Alert, AlertDescription } from './ui/alert';
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
  Receipt,
  Calendar,
  DollarSign,
  Package,
  MapPin,
  Download,
  TrendingUp,
  CheckCircle2,
  Clock,
  Coins,
} from 'lucide-react';
import { useAuth } from './AuthContext';

interface Transaction {
  id: string;
  collectorName: string;
  collectorPhone: string;
  plasticType: string;
  weight: number;
  totalValue: number;
  instantCash: number;
  savingsToken: number;
  timestamp: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export function HubTransactionsPage() {
  const { accessToken } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'amount' | 'weight'>('recent');

  useEffect(() => {
    loadTransactions();
  }, [accessToken]);

  useEffect(() => {
    filterAndSortTransactions();
  }, [transactions, searchTerm, filterBy, sortBy]);

  const loadTransactions = async () => {
    setLoading(true);
    // Mock data for now - will be replaced with API call
    const mockTransactions: Transaction[] = [
      {
        id: 'txn_001',
        collectorName: 'Ama Mensah',
        collectorPhone: '+233 24 123 4567',
        plasticType: 'PET',
        weight: 45.5,
        totalValue: 22.75,
        instantCash: 15.93,
        savingsToken: 6.83,
        timestamp: new Date().toISOString(),
        location: { latitude: 5.6037, longitude: -0.1870 },
      },
      {
        id: 'txn_002',
        collectorName: 'Kofi Osei',
        collectorPhone: '+233 24 987 6543',
        plasticType: 'HDPE',
        weight: 32.0,
        totalValue: 16.0,
        instantCash: 11.2,
        savingsToken: 4.8,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'txn_003',
        collectorName: 'Abena Asare',
        collectorPhone: '+233 20 555 1234',
        plasticType: 'PET',
        weight: 58.2,
        totalValue: 29.1,
        instantCash: 20.37,
        savingsToken: 8.73,
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        location: { latitude: 5.6037, longitude: -0.1870 },
      },
      {
        id: 'txn_004',
        collectorName: 'Yaw Mensah',
        collectorPhone: '+233 26 777 8899',
        plasticType: 'Mixed',
        weight: 40.0,
        totalValue: 20.0,
        instantCash: 14.0,
        savingsToken: 6.0,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'txn_005',
        collectorName: 'Esi Darko',
        collectorPhone: '+233 24 222 3333',
        plasticType: 'PET',
        weight: 52.5,
        totalValue: 26.25,
        instantCash: 18.38,
        savingsToken: 7.88,
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        location: { latitude: 5.6037, longitude: -0.1870 },
      },
    ];
    setTransactions(mockTransactions);
    setLoading(false);
  };

  const filterAndSortTransactions = () => {
    let filtered = [...transactions];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.collectorName.toLowerCase().includes(term) ||
          t.collectorPhone.includes(term) ||
          t.id.toLowerCase().includes(term)
      );
    }

    // Date filter
    const now = Date.now();
    if (filterBy === 'today') {
      filtered = filtered.filter(
        (t) => now - new Date(t.timestamp).getTime() < 86400000
      );
    } else if (filterBy === 'week') {
      filtered = filtered.filter(
        (t) => now - new Date(t.timestamp).getTime() < 604800000
      );
    } else if (filterBy === 'month') {
      filtered = filtered.filter(
        (t) => now - new Date(t.timestamp).getTime() < 2592000000
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.totalValue - a.totalValue;
        case 'weight':
          return b.weight - a.weight;
        case 'recent':
        default:
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
    });

    setFilteredTransactions(filtered);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  };

  const getCollectorInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const totalStats = {
    transactions: filteredTransactions.length,
    totalWeight: filteredTransactions.reduce((sum, t) => sum + t.weight, 0),
    totalValue: filteredTransactions.reduce((sum, t) => sum + t.totalValue, 0),
    totalCash: filteredTransactions.reduce((sum, t) => sum + t.instantCash, 0),
    totalTokens: filteredTransactions.reduce((sum, t) => sum + t.savingsToken, 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">Recent Transactions</h1>
          <p className="text-gray-600">View and manage all collection transactions</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="bg-white shadow-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Receipt className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-gray-500">Transactions</span>
            </div>
            <p className="text-2xl text-gray-900">{totalStats.transactions}</p>
          </Card>

          <Card className="bg-white shadow-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-4 w-4 text-green-600" />
              <span className="text-xs text-gray-500">Total Weight</span>
            </div>
            <p className="text-2xl text-gray-900">{totalStats.totalWeight.toFixed(1)} kg</p>
          </Card>

          <Card className="bg-white shadow-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-purple-600" />
              <span className="text-xs text-gray-500">Total Value</span>
            </div>
            <p className="text-2xl text-gray-900">GH₵{totalStats.totalValue.toFixed(2)}</p>
          </Card>

          <Card className="bg-white shadow-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-xs text-gray-500">Cash Paid</span>
            </div>
            <p className="text-2xl text-green-900">GH₵{totalStats.totalCash.toFixed(2)}</p>
          </Card>

          <Card className="bg-white shadow-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="h-4 w-4 text-orange-600" />
              <span className="text-xs text-gray-500">Tokens Saved</span>
            </div>
            <p className="text-2xl text-orange-900">{totalStats.totalTokens.toFixed(2)}</p>
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
                  placeholder="Search by name, phone, or transaction ID..."
                  className="pl-10 rounded-xl border-gray-300"
                />
              </div>
            </div>

            <Select value={filterBy} onValueChange={(v: any) => setFilterBy(v)}>
              <SelectTrigger className="w-full md:w-[180px] rounded-xl border-gray-300">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="w-full md:w-[180px] rounded-xl border-gray-300">
                <TrendingUp className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="amount">Highest Value</SelectItem>
                <SelectItem value="weight">Highest Weight</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="rounded-xl border-gray-300">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </Card>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <Card className="bg-white shadow-sm rounded-xl p-12 text-center">
            <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl text-gray-900 mb-2">
              {searchTerm ? 'No transactions found' : 'No transactions yet'}
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? 'Try adjusting your search or filters'
                : 'Transactions will appear here once you process them'}
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <Card
                key={transaction.id}
                className="bg-white shadow-sm rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Collector Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {getCollectorInitials(transaction.collectorName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm text-gray-900 truncate">
                          {transaction.collectorName}
                        </h3>
                        <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(transaction.timestamp)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Receipt className="h-3 w-3" />
                          {transaction.id}
                        </span>
                        {transaction.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            GPS Tracked
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Transaction Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Type</p>
                      <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">
                        {transaction.plasticType}
                      </Badge>
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Weight</p>
                      <p className="text-sm text-gray-900">{transaction.weight} kg</p>
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Cash (70%)</p>
                      <p className="text-sm text-green-600">
                        GH₵{transaction.instantCash.toFixed(2)}
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Tokens (30%)</p>
                      <p className="text-sm text-orange-600">
                        {transaction.savingsToken.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
