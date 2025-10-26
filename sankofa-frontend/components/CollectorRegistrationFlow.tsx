import { useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
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
  User,
  Phone,
  MapPin,
  Camera,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Languages,
  Users,
  ArrowLeft,
  ArrowRight,
  Home,
  Save,
  X,
  IdCard,
  Fingerprint,
  UserCheck,
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { hubAPI } from '../utils/api';

interface CollectorRegistrationFlowProps {
  onNavigate: (page: string) => void;
  onComplete?: () => void;
}

export function CollectorRegistrationFlow({
  onNavigate,
  onComplete,
}: CollectorRegistrationFlowProps) {
  const { accessToken } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form data
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hasPhone, setHasPhone] = useState<'yes' | 'no' | 'shared'>('yes');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [landmark, setLandmark] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('');
  const [canRead, setCanRead] = useState<'yes' | 'no'>('no');
  const [photo, setPhoto] = useState<string | null>(null);
  const [physicalIdNumber, setPhysicalIdNumber] = useState('');
  const [notes, setNotes] = useState('');

  // Phone number duplicate checking
  const [checkingPhone, setCheckingPhone] = useState(false);
  const [phoneExists, setPhoneExists] = useState(false);
  const [existingCollector, setExistingCollector] = useState<any>(null);

  // Generated data
  const [generatedCollectorId, setGeneratedCollectorId] = useState('');
  const [generatedCardNumber, setGeneratedCardNumber] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  // Check if phone number exists when user types
  useEffect(() => {
    const checkPhoneNumber = async () => {
      // Only check if phone has value and is valid format
      if (!phoneNumber || phoneNumber.length < 10 || hasPhone === 'no') {
        setPhoneExists(false);
        setExistingCollector(null);
        return;
      }

      setCheckingPhone(true);
      try {
        const result = await hubAPI.searchCollector(accessToken!, phoneNumber);
        if (result.found && result.collector) {
          setPhoneExists(true);
          setExistingCollector(result.collector);
        } else {
          setPhoneExists(false);
          setExistingCollector(null);
        }
      } catch (err) {
        // If error, assume phone doesn't exist
        setPhoneExists(false);
        setExistingCollector(null);
      } finally {
        setCheckingPhone(false);
      }
    };

    // Debounce the check
    const timeoutId = setTimeout(() => {
      checkPhoneNumber();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [phoneNumber, hasPhone, accessToken]);

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleNext = () => {
    // Validation for each step
    if (currentStep === 1) {
      if (!fullName.trim()) {
        setError('Please enter the collector\'s full name');
        return;
      }
    }

    if (currentStep === 2) {
      if (hasPhone !== 'no' && !phoneNumber.trim()) {
        setError('Please enter a phone number or select "No Phone"');
        return;
      }
      if (phoneExists) {
        setError('This phone number is already registered. Please use a different number or view the existing collector.');
        return;
      }
    }

    if (currentStep === 3) {
      if (!neighborhood) {
        setError('Please select a neighborhood');
        return;
      }
    }

    setError('');
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setError('');
    setCurrentStep(currentStep - 1);
  };

  const generateIds = () => {
    // Generate unique collector ID
    const timestamp = Date.now();
    const collectorId = `COL${timestamp.toString().slice(-8)}`;
    const cardNumber = Math.floor(100000 + Math.random() * 900000).toString();

    setGeneratedCollectorId(collectorId);
    setGeneratedCardNumber(cardNumber);

    return { collectorId, cardNumber };
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const { collectorId, cardNumber } = generateIds();

      const registrationData = {
        collectorId,
        cardNumber,
        fullName: fullName.trim(),
        phoneNumber: hasPhone === 'no' ? null : phoneNumber.trim(),
        hasPhone,
        emergencyContact: emergencyContact.trim() || null,
        neighborhood,
        landmark: landmark.trim() || null,
        preferredLanguage,
        canRead,
        photo: photo || null,
        physicalIdNumber: physicalIdNumber.trim() || null,
        notes: notes.trim() || null,
        registeredBy: 'hub-manager',
        registrationDate: new Date().toISOString(),
      };

      const result = await hubAPI.registerCollectorFull(accessToken!, registrationData);

      setSuccess(`Successfully registered ${fullName}!`);
      setCurrentStep(totalSteps + 1); // Move to success screen
      
      // SMS notification if phone available
      if (phoneNumber && hasPhone !== 'no') {
        console.log(`SMS sent to ${phoneNumber}: Welcome to Sankofa! Your ID: ${collectorId}`);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to register collector';
      if (errorMessage.includes('phone number already registered')) {
        setError('This phone number is already registered. Please check the existing collector or use a different number.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setFullName('');
    setPhoneNumber('');
    setHasPhone('yes');
    setEmergencyContact('');
    setNeighborhood('');
    setLandmark('');
    setPreferredLanguage('');
    setCanRead('no');
    setPhoto(null);
    setPhysicalIdNumber('');
    setNotes('');
    setGeneratedCollectorId('');
    setGeneratedCardNumber('');
    setError('');
    setSuccess('');
  };

  // Success Screen
  if (currentStep > totalSteps) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="bg-white shadow-sm rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-[#10b981] to-[#14b8a6] p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <CheckCircle2 className="h-12 w-12 text-white" />
                </div>
              </div>
              <h2 className="text-3xl text-white mb-2">Registration Complete! 🎉</h2>
              <p className="text-white/90">
                {fullName} has been successfully registered
              </p>
            </div>

            <div className="p-8">
              {/* Collector ID Card */}
              <div className="bg-gradient-to-br from-[#3b82f6] to-[#2563eb] rounded-2xl p-6 mb-6 text-white shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-white/70 mb-1">SANKOFA COLLECTOR</p>
                    <h3 className="text-2xl mb-1">{fullName}</h3>
                    <p className="text-sm text-white/90">{neighborhood}</p>
                  </div>
                  {photo && (
                    <img
                      src={photo}
                      alt="Collector"
                      className="h-16 w-16 rounded-xl object-cover border-2 border-white/30"
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                  <div>
                    <p className="text-xs text-white/70 mb-1">Collector ID</p>
                    <p className="text-lg">{generatedCollectorId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/70 mb-1">Card Number</p>
                    <p className="text-lg">{generatedCardNumber}</p>
                  </div>
                </div>

                {phoneNumber && hasPhone !== 'no' && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-xs text-white/70 mb-1">Phone</p>
                    <p className="text-sm">{phoneNumber}</p>
                  </div>
                )}
              </div>

              {/* Important Instructions */}
              <Alert className="bg-blue-50 border-blue-200 mb-6">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-900">
                  <strong>Next Steps:</strong>
                  <ul className="list-disc ml-4 mt-2 space-y-1 text-sm">
                    <li>Write the Card Number ({generatedCardNumber}) on a physical card</li>
                    <li>Give the card to {fullName} to keep safe</li>
                    {phoneNumber && hasPhone !== 'no' && (
                      <li>SMS confirmation sent to {phoneNumber}</li>
                    )}
                    {hasPhone === 'no' && (
                      <li>Explain that they should bring their card for each collection</li>
                    )}
                    <li>Show them where to bring plastic waste</li>
                  </ul>
                </AlertDescription>
              </Alert>

              {/* Communication Method */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h4 className="text-sm text-gray-900 mb-3">Communication Method</h4>
                <div className="space-y-2 text-sm">
                  {hasPhone === 'no' ? (
                    <Badge className="bg-orange-100 text-orange-800 border-0">
                      <Phone className="h-3 w-3 mr-1" />
                      No Phone - Use Card Number
                    </Badge>
                  ) : hasPhone === 'shared' ? (
                    <Badge className="bg-blue-100 text-blue-800 border-0">
                      <Users className="h-3 w-3 mr-1" />
                      Shared Phone - {phoneNumber}
                    </Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-800 border-0">
                      <Phone className="h-3 w-3 mr-1" />
                      Personal Phone - {phoneNumber}
                    </Badge>
                  )}
                  
                  {canRead === 'no' && (
                    <Badge className="bg-purple-100 text-purple-800 border-0">
                      <Languages className="h-3 w-3 mr-1" />
                      Requires Verbal Communication
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1 rounded-xl border-2"
                >
                  Register Another Collector
                </Button>
                <Button
                  onClick={() => onNavigate('hub-manager')}
                  className="flex-1 bg-gradient-to-r from-[#10b981] to-[#14b8a6] hover:from-[#059669] hover:to-[#0d9488] text-white rounded-xl"
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
      <div className="container mx-auto px-4 max-w-3xl">
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
              <h1 className="text-3xl text-gray-900 mb-2">Register New Collector</h1>
              <p className="text-gray-600">
                Step {currentStep} of {totalSteps} - {
                  currentStep === 1 ? 'Personal Information' :
                  currentStep === 2 ? 'Contact Details' :
                  currentStep === 3 ? 'Location' :
                  currentStep === 4 ? 'Photo & Identification' :
                  'Review & Confirm'
                }
              </p>
            </div>
            <Badge className="bg-blue-100 text-blue-800 border-0 px-4 py-2">
              <User className="h-4 w-4 mr-2" />
              Low-Tech Registration
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

        {/* Step Content */}
        <Card className="bg-white shadow-sm rounded-2xl p-8">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg text-gray-900">Personal Information</h3>
                    <p className="text-sm text-gray-500">Basic details about the collector</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName" className="text-gray-900 mb-2 block">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g., Ama Mensah"
                      className="rounded-xl border-gray-300"
                      autoFocus
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Ask the collector to tell you their full name
                    </p>
                  </div>

                  <div>
                    <Label className="text-gray-900 mb-2 block">
                      Can the collector read and write? <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant={canRead === 'yes' ? 'default' : 'outline'}
                        onClick={() => setCanRead('yes')}
                        className={`rounded-xl justify-start ${
                          canRead === 'yes'
                            ? 'bg-[#10b981] hover:bg-[#059669]'
                            : 'border-2'
                        }`}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Yes, can read
                      </Button>
                      <Button
                        type="button"
                        variant={canRead === 'no' ? 'default' : 'outline'}
                        onClick={() => setCanRead('no')}
                        className={`rounded-xl justify-start ${
                          canRead === 'no'
                            ? 'bg-[#10b981] hover:bg-[#059669]'
                            : 'border-2'
                        }`}
                      >
                        <X className="h-4 w-4 mr-2" />
                        No, illiterate
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="language" className="text-gray-900 mb-2 block">
                      Preferred Language <span className="text-red-500">*</span>
                    </Label>
                    <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
                      <SelectTrigger className="rounded-xl border-gray-300">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Twi">Twi</SelectItem>
                        <SelectItem value="Ga">Ga</SelectItem>
                        <SelectItem value="Ewe">Ewe</SelectItem>
                        <SelectItem value="Hausa">Hausa</SelectItem>
                        <SelectItem value="Dagbani">Dagbani</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      Select the language they speak most comfortably
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg text-gray-900">Contact Details</h3>
                    <p className="text-sm text-gray-500">How can we reach them?</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-900 mb-2 block">
                      Does the collector have a phone? <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        type="button"
                        variant={hasPhone === 'yes' ? 'default' : 'outline'}
                        onClick={() => setHasPhone('yes')}
                        className={`rounded-xl ${
                          hasPhone === 'yes'
                            ? 'bg-[#10b981] hover:bg-[#059669]'
                            : 'border-2'
                        }`}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Own Phone
                      </Button>
                      <Button
                        type="button"
                        variant={hasPhone === 'shared' ? 'default' : 'outline'}
                        onClick={() => setHasPhone('shared')}
                        className={`rounded-xl ${
                          hasPhone === 'shared'
                            ? 'bg-[#10b981] hover:bg-[#059669]'
                            : 'border-2'
                        }`}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Shared
                      </Button>
                      <Button
                        type="button"
                        variant={hasPhone === 'no' ? 'default' : 'outline'}
                        onClick={() => setHasPhone('no')}
                        className={`rounded-xl ${
                          hasPhone === 'no'
                            ? 'bg-[#10b981] hover:bg-[#059669]'
                            : 'border-2'
                        }`}
                      >
                        <X className="h-4 w-4 mr-2" />
                        No Phone
                      </Button>
                    </div>
                  </div>

                  {hasPhone !== 'no' && (
                    <div>
                      <Label htmlFor="phone" className="text-gray-900 mb-2 block">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="phone"
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="0XX XXX XXXX"
                          className={`rounded-xl ${
                            phoneExists
                              ? 'border-red-500 focus-visible:ring-red-500'
                              : 'border-gray-300'
                          }`}
                        />
                        {checkingPhone && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Duplicate Phone Warning */}
                      {phoneExists && existingCollector && (
                        <Alert className="mt-2 bg-red-50 border-red-200">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-red-900">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <strong className="block mb-1">⚠️ Phone Number Already Registered</strong>
                                <div className="text-sm space-y-1">
                                  <p className="flex items-center gap-2">
                                    <UserCheck className="h-3 w-3" />
                                    <span><strong>Collector:</strong> {existingCollector.fullName || existingCollector.name}</span>
                                  </p>
                                  <p className="flex items-center gap-2">
                                    <IdCard className="h-3 w-3" />
                                    <span><strong>ID:</strong> {existingCollector.collectorId || existingCollector.id}</span>
                                  </p>
                                  {existingCollector.registrationDate && (
                                    <p className="text-xs text-red-700 mt-1">
                                      Registered: {new Date(existingCollector.registrationDate).toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                      })}
                                    </p>
                                  )}
                                </div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onNavigate('view-collectors')}
                                  className="mt-3 text-xs rounded-lg border-red-300 text-red-700 hover:bg-red-100"
                                >
                                  View Collector Details
                                </Button>
                              </div>
                            </div>
                          </AlertDescription>
                        </Alert>
                      )}

                      {hasPhone === 'shared' && !phoneExists && (
                        <p className="text-xs text-gray-500 mt-1">
                          ℹ️ This is a shared/family phone number
                        </p>
                      )}
                    </div>
                  )}

                  {hasPhone === 'no' && (
                    <Alert className="bg-orange-50 border-orange-200">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <AlertDescription className="text-orange-900">
                        <strong>No Phone Available</strong>
                        <p className="text-sm mt-1">
                          We'll issue a physical card with a unique number for identification.
                          They should bring this card for each collection.
                        </p>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div>
                    <Label htmlFor="emergency" className="text-gray-900 mb-2 block">
                      Emergency Contact (Optional)
                    </Label>
                    <Input
                      id="emergency"
                      type="tel"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      placeholder="Alternative contact number"
                      className="rounded-xl border-gray-300"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      A friend or family member we can contact if needed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg text-gray-900">Location</h3>
                    <p className="text-sm text-gray-500">Where does the collector live/work?</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="neighborhood" className="text-gray-900 mb-2 block">
                      Neighborhood/Area <span className="text-red-500">*</span>
                    </Label>
                    <Select value={neighborhood} onValueChange={setNeighborhood}>
                      <SelectTrigger className="rounded-xl border-gray-300">
                        <SelectValue placeholder="Select neighborhood" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Accra Central">Accra Central</SelectItem>
                        <SelectItem value="Jamestown">Jamestown</SelectItem>
                        <SelectItem value="Osu">Osu</SelectItem>
                        <SelectItem value="Nima">Nima</SelectItem>
                        <SelectItem value="Madina">Madina</SelectItem>
                        <SelectItem value="Teshie">Teshie</SelectItem>
                        <SelectItem value="Tema">Tema</SelectItem>
                        <SelectItem value="Dansoman">Dansoman</SelectItem>
                        <SelectItem value="Kaneshie">Kaneshie</SelectItem>
                        <SelectItem value="Achimota">Achimota</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="landmark" className="text-gray-900 mb-2 block">
                      Nearest Landmark (Optional)
                    </Label>
                    <Input
                      id="landmark"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g., Near the big market, by the church"
                      className="rounded-xl border-gray-300"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Helps identify where they usually collect plastic
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Photo & ID */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
                    <Camera className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg text-gray-900">Photo & Identification</h3>
                    <p className="text-sm text-gray-500">Optional but recommended</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-900 mb-2 block">
                      Collector Photo (Optional)
                    </Label>
                    
                    {!photo ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                        <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 mb-4">
                          Take or upload a photo for easy identification
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handlePhotoCapture}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="rounded-xl border-2"
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Take/Upload Photo
                        </Button>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={photo}
                          alt="Collector"
                          className="w-full h-64 object-cover rounded-xl"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={handleRemovePhoto}
                          className="absolute top-2 right-2 rounded-full"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="physicalId" className="text-gray-900 mb-2 block">
                      Existing ID Number (Optional)
                    </Label>
                    <Input
                      id="physicalId"
                      value={physicalIdNumber}
                      onChange={(e) => setPhysicalIdNumber(e.target.value)}
                      placeholder="Ghana Card, Voter ID, etc."
                      className="rounded-xl border-gray-300"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      If they have any government ID, record the number
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg text-gray-900">Review & Confirm</h3>
                    <p className="text-sm text-gray-500">Check all details before registering</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Summary Card */}
                  <Card className="bg-gray-50 border-0 p-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        {photo ? (
                          <img
                            src={photo}
                            alt="Collector"
                            className="h-20 w-20 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="h-20 w-20 rounded-xl bg-gray-200 flex items-center justify-center">
                            <User className="h-10 w-10 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="text-xl text-gray-900 mb-1">{fullName}</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p className="flex items-center gap-2">
                              <MapPin className="h-3 w-3" />
                              {neighborhood}
                              {landmark && ` • ${landmark}`}
                            </p>
                            {phoneNumber && hasPhone !== 'no' && (
                              <p className="flex items-center gap-2">
                                <Phone className="h-3 w-3" />
                                {phoneNumber}
                                {hasPhone === 'shared' && ' (Shared)'}
                              </p>
                            )}
                            <p className="flex items-center gap-2">
                              <Languages className="h-3 w-3" />
                              {preferredLanguage}
                              {canRead === 'no' && ' • Illiterate'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Additional Notes */}
                  <div>
                    <Label htmlFor="notes" className="text-gray-900 mb-2 block">
                      Additional Notes (Optional)
                    </Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special instructions or notes about this collector..."
                      className="rounded-xl border-gray-300 min-h-[100px]"
                    />
                  </div>

                  {/* Important Reminders */}
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-900">
                      <strong>Before registering:</strong>
                      <ul className="list-disc ml-4 mt-2 space-y-1 text-sm">
                        <li>Verify the collector's name pronunciation</li>
                        {hasPhone !== 'no' && <li>Confirm phone number is correct</li>}
                        {hasPhone === 'no' && (
                          <li>Explain that they'll receive a physical ID card</li>
                        )}
                        <li>Tell them where to bring collected plastic</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1 rounded-xl border-2"
                disabled={loading}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}

            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-[#10b981] to-[#14b8a6] hover:from-[#059669] hover:to-[#0d9488] text-white rounded-xl"
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-[#10b981] to-[#14b8a6] hover:from-[#059669] hover:to-[#0d9488] text-white rounded-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Register Collector
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
