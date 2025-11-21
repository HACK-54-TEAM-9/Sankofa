import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  Loader2,
  Search,
  Scale,
  Wallet,
  Coins,
  CheckCircle2,
  AlertCircle,
  User,
  Phone,
  ArrowLeft,
  Banknote,
  FileText,
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { hubAPI } from '../utils/api';

interface HubTransactionFlowProps {
  onNavigate: (page: string) => void;
}

interface Collector {
  id: string;
  fullName?: string;
  name?: string;
  phone?: string;
  phoneNumber?: string;
  cardNumber?: string;
  neighborhood: string;
  totalKg: number;
  earningsGHS: number;
  hasPhone?: string;
}

export function HubTransactionFlow({ onNavigate }: HubTransactionFlowProps) {
  const { accessToken, user: _ } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Step 1: Find Collector
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedCollector, setSelectedCollector] = useState<Collector | null>(null);
  
  // Registered collectors list for dropdown
  const [registeredCollectors, setRegisteredCollectors] = useState<Collector[]>([]);
  const [loadingCollectors, setLoadingCollectors] = useState(false);

  // Step 2: Record Materials
  const [plasticType, setPlasticType] = useState('');
  const [weight, setWeight] = useState('');

  // Step 3: Auto-calculated values
  const [totalValue, setTotalValue] = useState(0);
  const [instantCash, setInstantCash] = useState(0);
  const [savingsTokens, setSavingsTokens] = useState(0);

  // Session tracking
  const [cashFloat, setCashFloat] = useState(5000); // Starting cash
  const [transactionsToday, setTransactionsToday] = useState(0);
  const [totalPaidToday, setTotalPaidToday] = useState(0);

  // GPS location (optional)
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [locationStatus, setLocationStatus] = useState<'loading' | 'success' | 'error'>('loading');

  // Load registered collectors on mount
  useEffect(() => {
    loadRegisteredCollectors();
  }, [accessToken]);

  const loadRegisteredCollectors = async () => {
    if (!accessToken) return;

    setLoadingCollectors(true);
    try {
      const result = await hubAPI.getCollectors(accessToken);
      setRegisteredCollectors(result.collectors || []);
    } catch (err) {
      console.error('Failed to load collectors:', err);
    } finally {
      setLoadingCollectors(false);
    }
  };

  const selectCollectorFromDropdown = async (collectorId: string) => {
    const collector = registeredCollectors.find(c => c.id === collectorId);
    if (collector) {
      setSelectedCollector(collector);
      setCurrentStep(2);
      setError('');
    }
  };

  // Get GPS on load (optional, won't block transaction)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position);
          setLocationStatus('success');
        },
        (err) => {
          // GPS is optional - don't show error to user, just log it
          console.warn('GPS not available (this is okay):', err.message || 'Permission denied or unavailable');
          setLocationStatus('error');
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 60000,
        }
      );
    } else {
      setLocationStatus('error');
    }
  }, []);

  // Calculate rewards automatically when weight changes
  useEffect(() => {
    if (weight && parseFloat(weight) > 0) {
      const weightKg = parseFloat(weight);
      const total = weightKg * 2; // GH₵2 per kg
      const cash = total * 0.7; // 70% instant
      const tokens = total * 0.3; // 30% savings

      setTotalValue(total);
      setInstantCash(cash);
      setSavingsTokens(tokens);
    } else {
      setTotalValue(0);
      setInstantCash(0);
      setSavingsTokens(0);
    }
  }, [weight]);

  const searchCollector = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a phone number or card number');
      return;
    }

    setSearchLoading(true);
    setError('');

    try {
      const result = await hubAPI.searchCollector(accessToken!, searchTerm);

      if (result.found) {
        setSelectedCollector(result.collector);
        setCurrentStep(2);
        setError('');
      } else {
        setError('Collector not found. Please use the Registration Flow to register new collectors.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to search collector');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleRecordMaterials = () => {
    // Validation
    if (!plasticType) {
      setError('Please select plastic type');
      return;
    }
    if (!weight || parseFloat(weight) <= 0) {
      setError('Please enter a valid weight');
      return;
    }
    if (instantCash > cashFloat) {
      setError(`Insufficient cash float. Available: GH₵${cashFloat.toFixed(2)}, Required: GH₵${instantCash.toFixed(2)}`);
      return;
    }

    setError('');
    setCurrentStep(3);
  };

  const handleProcessTransaction = async () => {
    if (!selectedCollector) return;

    setLoading(true);
    setError('');

    try {
      const transactionData = {
        collectorId: selectedCollector.id,
        collectorPhone: selectedCollector.phone || selectedCollector.phoneNumber || selectedCollector.cardNumber || '',
        plasticType,
        weight: parseFloat(weight),
        location: location
          ? {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }
          : null,
        totalValue,
        instantCash,
        savingsToken: savingsTokens,
        timestamp: new Date().toISOString(),
      };

      await hubAPI.processTransaction(accessToken!, transactionData);

      // Update session stats
      setCashFloat((prev) => prev - instantCash);
      setTransactionsToday((prev) => prev + 1);
      setTotalPaidToday((prev) => prev + instantCash);

      setSuccess('Transaction completed successfully!');
      setCurrentStep(4);
    } catch (err: any) {
      setError(err.message || 'Failed to process transaction');
    } finally {
      setLoading(false);
    }
  };

  const resetTransaction = () => {
    setCurrentStep(1);
    setSearchTerm('');
    setSelectedCollector(null);
    setPlasticType('');
    setWeight('');
    setTotalValue(0);
    setInstantCash(0);
    setSavingsTokens(0);
    setError('');
    setSuccess('');
  };

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  // Success screen
  if (currentStep === 4) {
    const collectorName = selectedCollector?.fullName || selectedCollector?.name || 'Collector';
    const collectorContact = selectedCollector?.phone || selectedCollector?.phoneNumber || selectedCollector?.cardNumber || 'N/A';
    const hasPhoneAccess = selectedCollector?.hasPhone !== 'no' && (selectedCollector?.phone || selectedCollector?.phoneNumber);

    return (
      <div className="min-h-screen bg-[#FAFAFA] py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="bg-white shadow-sm rounded-2xl overflow-hidden">
            {/* Success Header */}
            <div className="bg-gradient-to-br from-[#10b981] to-[#14b8a6] p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <CheckCircle2 className="h-12 w-12 text-white" />
                </div>
              </div>
              <h2 className="text-3xl text-white mb-2">Transaction Complete! 🎉</h2>
              <p className="text-white/90">
                Payment processed for {collectorName}
              </p>
            </div>

            <div className="p-8">
              {/* Transaction Receipt */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                  <span className="text-sm text-gray-500">Transaction Receipt</span>
                  <Badge className="bg-green-100 text-green-800 border-0">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                </div>

                <div className="space-y-4">
                  {/* Collector Info */}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Collector</p>
                    <p className="text-lg text-gray-900">{collectorName}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                      {hasPhoneAccess ? (
                        <>
                          <Phone className="h-3 w-3" />
                          {collectorContact}
                        </>
                      ) : (
                        <>
                          <FileText className="h-3 w-3" />
                          Card: {collectorContact}
                        </>
                      )}
                    </p>
                  </div>

                  {/* Material Info */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Material Type</p>
                      <p className="text-sm text-gray-900">{plasticType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Weight</p>
                      <p className="text-sm text-gray-900">{weight} kg</p>
                    </div>
                  </div>

                  {/* Payment Breakdown */}
                  <div className="pt-4 border-t border-gray-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Value</span>
                      <span className="text-sm text-gray-900">GH₵{totalValue.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 flex items-center gap-2">
                        <Banknote className="h-4 w-4 text-green-600" />
                        Instant Cash (70%)
                      </span>
                      <span className="text-lg text-green-600">GH₵{instantCash.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 flex items-center gap-2">
                        <Coins className="h-4 w-4 text-blue-600" />
                        Savings Tokens (30%)
                      </span>
                      <span className="text-lg text-blue-600">{savingsTokens.toFixed(2)} tokens</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SMS Confirmation */}
              {hasPhoneAccess ? (
                <Alert className="bg-blue-50 border-blue-200 mb-6">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-900">
                    SMS confirmation sent to {collectorContact}
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="bg-orange-50 border-orange-200 mb-6">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-900">
                    <strong>No Phone Access</strong> - Please verbally confirm the payment details with the collector.
                  </AlertDescription>
                </Alert>
              )}

              {/* Session Stats */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
                <h4 className="text-sm text-gray-900 mb-3">Today's Session</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl text-gray-900">{transactionsToday}</p>
                    <p className="text-xs text-gray-500">Transactions</p>
                  </div>
                  <div>
                    <p className="text-2xl text-gray-900">GH₵{totalPaidToday.toFixed(0)}</p>
                    <p className="text-xs text-gray-500">Paid Out</p>
                  </div>
                  <div>
                    <p className="text-2xl text-gray-900">GH₵{cashFloat.toFixed(0)}</p>
                    <p className="text-xs text-gray-500">Remaining</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={resetTransaction}
                  className="flex-1 bg-gradient-to-r from-[#10b981] to-[#14b8a6] hover:from-[#059669] hover:to-[#0d9488] text-white rounded-xl"
                >
                  New Transaction
                </Button>
                <Button
                  onClick={() => onNavigate('hub-manager')}
                  variant="outline"
                  className="flex-1 rounded-xl border-2"
                >
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => onNavigate('hub-manager')}
            className="mb-4 rounded-xl"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl text-gray-900 mb-2">Process Collection</h1>
              <p className="text-gray-600">
                Step {currentStep} of {totalSteps} -{' '}
                {currentStep === 1 ? 'Find Collector' : currentStep === 2 ? 'Record Materials' : 'Confirm & Pay'}
              </p>
            </div>
            <Badge className="bg-blue-100 text-blue-800 border-0 px-4 py-2">
              Cash Float: GH₵{cashFloat.toFixed(2)}
            </Badge>
          </div>

          {/* Progress Bar */}
          <Progress value={progress} className="h-2 bg-gray-200" />
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-900">{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-sm rounded-2xl p-8">
              {/* Step 1: Find Collector */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                      <Search className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl text-gray-900">Find Collector</h3>
                      <p className="text-sm text-gray-500">Search by phone or card number</p>
                    </div>
                  </div>

                  {/* Quick Select from Registered Collectors */}
                  <div>
                    <Label htmlFor="quickSelect" className="text-gray-900 mb-2 block">
                      Quick Select Registered Collector
                    </Label>
                    <Select onValueChange={selectCollectorFromDropdown} disabled={loadingCollectors}>
                      <SelectTrigger className="rounded-xl border-gray-300">
                        <SelectValue placeholder={
                          loadingCollectors 
                            ? "Loading collectors..." 
                            : registeredCollectors.length > 0 
                              ? "Select a collector from your list" 
                              : "No collectors registered yet"
                        } />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {registeredCollectors.map((collector) => {
                          const displayName = collector.fullName || collector.name || 'Unknown';
                          const hasPhone = collector.hasPhone !== 'no' && (collector.phoneNumber || collector.phone);
                          const contactInfo = hasPhone 
                            ? (collector.phoneNumber || collector.phone)
                            : `Card: ${collector.cardNumber}`;
                          
                          return (
                            <SelectItem key={collector.id} value={collector.id}>
                              <div className="flex flex-col">
                                <span>{displayName}</span>
                                <span className="text-xs text-gray-500">
                                  {contactInfo} • {collector.neighborhood}
                                </span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-2">
                      ⚡ Quickly select from your registered collectors
                    </p>
                  </div>

                  {/* OR Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">or search manually</span>
                    </div>
                  </div>

                  {/* Manual Search */}
                  <div>
                    <Label htmlFor="search" className="text-gray-900 mb-2 block">
                      Phone Number or Card Number
                    </Label>
                    <div className="flex gap-3">
                      <Input
                        id="search"
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="0XX XXX XXXX or 6-digit card"
                        className="rounded-xl border-gray-300"
                        onKeyDown={(e) => e.key === 'Enter' && searchCollector()}
                      />
                      <Button
                        onClick={searchCollector}
                        disabled={searchLoading}
                        className="bg-blue-600 hover:bg-blue-700 rounded-xl px-8"
                      >
                        {searchLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Search className="h-4 w-4 mr-2" />
                            Search
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      💡 For collectors without phones, enter their 6-digit card number
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-900">
                      <strong>New Collector?</strong> Use the{' '}
                      <button
                        onClick={() => onNavigate('register-collector')}
                        className="underline hover:text-blue-700 font-medium"
                      >
                        Registration Flow
                      </button>{' '}
                      to properly register collectors first.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Record Materials */}
              {currentStep === 2 && selectedCollector && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                      <Scale className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl text-gray-900">Record Materials</h3>
                      <p className="text-sm text-gray-500">Weigh and categorize the plastic</p>
                    </div>
                  </div>

                  {/* Collector Info */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">
                          {selectedCollector.fullName || selectedCollector.name}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-2">
                          {selectedCollector.hasPhone !== 'no' && (selectedCollector.phone || selectedCollector.phoneNumber) ? (
                            <>
                              <Phone className="h-3 w-3" />
                              {selectedCollector.phone || selectedCollector.phoneNumber}
                            </>
                          ) : (
                            <>
                              <FileText className="h-3 w-3" />
                              Card: {selectedCollector.cardNumber}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="plasticType" className="text-gray-900 mb-2 block">
                        Plastic Type <span className="text-red-500">*</span>
                      </Label>
                      <Select value={plasticType} onValueChange={setPlasticType}>
                        <SelectTrigger className="rounded-xl border-gray-300">
                          <SelectValue placeholder="Select plastic type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PET">PET - Water Bottles</SelectItem>
                          <SelectItem value="HDPE">HDPE - Milk Jugs, Detergent</SelectItem>
                          <SelectItem value="LDPE">LDPE - Shopping Bags</SelectItem>
                          <SelectItem value="PP">PP - Food Containers</SelectItem>
                          <SelectItem value="Mixed">Mixed Plastics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="weight" className="text-gray-900 mb-2 block">
                        Weight (kg) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="0.0"
                        className="rounded-xl border-gray-300 text-lg"
                      />
                    </div>

                    {/* Auto-calculated preview */}
                    {weight && parseFloat(weight) > 0 && (
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mt-4">
                        <h4 className="text-sm text-gray-900 mb-3">Payment Preview</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Total Value</span>
                            <span className="text-sm text-gray-900">GH₵{totalValue.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center justify-between text-green-600">
                            <span className="text-sm flex items-center gap-2">
                              <Banknote className="h-4 w-4" />
                              Instant Cash (70%)
                            </span>
                            <span className="text-lg">GH₵{instantCash.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center justify-between text-blue-600">
                            <span className="text-sm flex items-center gap-2">
                              <Coins className="h-4 w-4" />
                              Savings Tokens (30%)
                            </span>
                            <span className="text-lg">{savingsTokens.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 rounded-xl border-2"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={handleRecordMaterials}
                      className="flex-1 bg-gradient-to-r from-[#10b981] to-[#14b8a6] hover:from-[#059669] hover:to-[#0d9488] text-white rounded-xl"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirm & Pay */}
              {currentStep === 3 && selectedCollector && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                      <Wallet className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl text-gray-900">Confirm & Pay</h3>
                      <p className="text-sm text-gray-500">Review and process payment</p>
                    </div>
                  </div>

                  {/* Transaction Summary */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h4 className="text-sm text-gray-900 mb-4">Transaction Summary</h4>

                    <div className="space-y-4">
                      <div className="flex items-start justify-between pb-4 border-b border-gray-200">
                        <div>
                          <p className="text-sm text-gray-900 mb-1">
                            {selectedCollector.fullName || selectedCollector.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {selectedCollector.neighborhood}
                          </p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-0">
                          Active
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Material</p>
                          <p className="text-sm text-gray-900">{plasticType}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Weight</p>
                          <p className="text-sm text-gray-900">{weight} kg</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Total Value (GH₵2/kg)</span>
                          <span className="text-lg text-gray-900">GH₵{totalValue.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between bg-green-50 -mx-2 px-2 py-2 rounded">
                          <span className="text-sm text-green-700 flex items-center gap-2">
                            <Banknote className="h-4 w-4" />
                            Instant Cash (70%)
                          </span>
                          <span className="text-2xl text-green-700">GH₵{instantCash.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between bg-blue-50 -mx-2 px-2 py-2 rounded">
                          <span className="text-sm text-blue-700 flex items-center gap-2">
                            <Coins className="h-4 w-4" />
                            Savings Tokens (30%)
                          </span>
                          <span className="text-2xl text-blue-700">{savingsTokens.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Instructions */}
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-900">
                      <strong>Payment Instructions:</strong>
                      <ol className="list-decimal ml-4 mt-2 space-y-1 text-sm">
                        <li>Count out GH₵{instantCash.toFixed(2)} in cash</li>
                        <li>Hand the cash to the collector</li>
                        {selectedCollector.hasPhone !== 'no' && (selectedCollector.phone || selectedCollector.phoneNumber) ? (
                          <li>Confirm they received SMS confirmation</li>
                        ) : (
                          <li>Verbally confirm their savings tokens balance</li>
                        )}
                        <li>Click "Process Payment" to complete</li>
                      </ol>
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="flex-1 rounded-xl border-2"
                      disabled={loading}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={handleProcessTransaction}
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-[#10b981] to-[#14b8a6] hover:from-[#059669] hover:to-[#0d9488] text-white rounded-xl text-lg py-6"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Wallet className="h-5 w-5 mr-2" />
                          Process Payment
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Right Sidebar - Session Info */}
          <div className="space-y-4">
            <Card className="bg-white shadow-sm rounded-xl p-6">
              <h3 className="text-sm text-gray-900 mb-4">Today's Session</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Transactions</p>
                  <p className="text-2xl text-gray-900">{transactionsToday}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Paid Out</p>
                  <p className="text-2xl text-gray-900">GH₵{totalPaidToday.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Cash Remaining</p>
                  <p className="text-2xl text-green-600">GH₵{cashFloat.toFixed(2)}</p>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">GPS Status</p>
                  <div className="flex items-center gap-2">
                    {locationStatus === 'loading' && (
                      <Badge className="bg-gray-100 text-gray-600 border-0 text-xs">
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Checking...
                      </Badge>
                    )}
                    {locationStatus === 'success' && (
                      <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    )}
                    {locationStatus === 'error' && (
                      <Badge className="bg-gray-100 text-gray-600 border-0 text-xs">
                        Not Available
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Optional feature</p>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-sm rounded-xl p-6">
              <h3 className="text-sm text-gray-900 mb-3">Quick Guide</h3>
              <div className="space-y-2 text-xs text-gray-700">
                <p>1️⃣ Find collector by phone/card</p>
                <p>2️⃣ Weigh and record materials</p>
                <p>3️⃣ System auto-calculates 70/30 split</p>
                <p>4️⃣ Hand cash to collector</p>
                <p>5️⃣ Complete transaction</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
