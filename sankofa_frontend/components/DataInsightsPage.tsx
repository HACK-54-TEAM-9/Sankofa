import { Card } from './ui/card';
import { ImpactMetric } from './ImpactMetric';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Recycle, 
  Shield, 
  Users, 
  TrendingUp, 
  MapPin, 
  AlertTriangle,
  Activity,
  DollarSign,
  Database,
  BarChart3,
  Brain
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface DataInsightsPageProps {
  onNavigate: (page: string) => void;
}

export function DataInsightsPage({ onNavigate }: DataInsightsPageProps) {
  // Mock data for charts
  const monthlyCollectionData = [
    { month: 'Jun', tons: 180 },
    { month: 'Jul', tons: 220 },
    { month: 'Aug', tons: 310 },
    { month: 'Sep', tons: 380 },
    { month: 'Oct', tons: 450 },
    { month: 'Nov', tons: 520 },
  ];

  const nhisEnrollmentData = [
    { month: 'Jun', enrolled: 8200 },
    { month: 'Jul', enrolled: 9100 },
    { month: 'Aug', enrolled: 9800 },
    { month: 'Sep', enrolled: 10500 },
    { month: 'Oct', enrolled: 11200 },
    { month: 'Nov', enrolled: 12430 },
  ];

  const plasticTypeData = [
    { name: 'PET Bottles', value: 42, color: '#08A26F' },
    { name: 'HDPE Containers', value: 28, color: '#FBBF24' },
    { name: 'Plastic Bags', value: 18, color: '#78716c' },
    { name: 'Other', value: 12, color: '#a8a29e' },
  ];

  const riskZones = [
    { name: 'Accra Metropolitan', risk: 'High', plasticAccum: '850 tons', population: '2.3M', status: 'Active' },
    { name: 'Kumasi Central', risk: 'High', plasticAccum: '620 tons', population: '1.8M', status: 'Active' },
    { name: 'Tema District', risk: 'Medium', plasticAccum: '380 tons', population: '850K', status: 'Monitored' },
    { name: 'Cape Coast', risk: 'Medium', plasticAccum: '240 tons', population: '580K', status: 'Monitored' },
    { name: 'Takoradi', risk: 'Low', plasticAccum: '150 tons', population: '420K', status: 'Normal' },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1540058404349-2e5fabf32d75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzJTIwdGVjaG5vbG9neSUyMGFmcmljYXxlbnwxfHx8fDE3NjE1OTE2Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Data analytics and technology"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
                <Database className="h-4 w-4 text-white" />
                <span className="text-sm text-white">Data & Analytics</span>
              </div>
              <h1 className="mb-6 text-white">Our Impact in Numbers</h1>
              <p className="text-xl text-white/90 leading-relaxed">
                Transparency through data. Every transaction tracked, every impact measured, every community protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16 md:py-20 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#08A26F]/10 border border-[#08A26F]/20 px-4 py-2 rounded-full mb-4">
              <BarChart3 className="h-4 w-4 text-[#08A26F]" />
              <span className="text-sm text-[#08A26F]">Live Data</span>
            </div>
            <h2 className="mb-4 text-gray-900">Key Impact Metrics</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real-time data showing our collective impact across Ghana
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto mb-12">
            <div className="bg-white border border-stone-200 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-[#08A26F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Recycle className="h-8 w-8 text-[#08A26F]" />
              </div>
              <div className="text-gray-900 mb-1">2,847</div>
              <p className="text-sm text-gray-600">Tons Plastic Collected</p>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-[#08A26F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-[#08A26F]" />
              </div>
              <div className="text-gray-900 mb-1">12,430</div>
              <p className="text-sm text-gray-600">People with NHIS Access</p>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-[#FBBF24]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-[#FBBF24]" />
              </div>
              <div className="text-gray-900 mb-1">8,652</div>
              <p className="text-sm text-gray-600">Active Collectors</p>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-[#08A26F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-[#08A26F]" />
              </div>
              <div className="text-gray-900 mb-1">GH₵ 1.2M</div>
              <p className="text-sm text-gray-600">Healthcare Funds Distributed</p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            <Card className="p-6 border border-stone-200 rounded-2xl bg-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#08A26F]/10 rounded-full flex items-center justify-center">
                  <Activity className="h-5 w-5 text-[#08A26F]" />
                </div>
                <h3 className="text-gray-900">Daily Collection Rate</h3>
              </div>
              <div className="text-[#08A26F] mb-1">18.4 tons/day</div>
              <p className="text-sm text-gray-600">↑ 23% from last month</p>
            </Card>

            <Card className="p-6 border border-stone-200 rounded-2xl bg-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#08A26F]/10 rounded-full flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-[#08A26F]" />
                </div>
                <h3 className="text-gray-900">Active Hubs</h3>
              </div>
              <div className="text-[#08A26F] mb-1">127 Hubs</div>
              <p className="text-sm text-gray-600">Across 8 regions</p>
            </Card>

            <Card className="p-6 border border-stone-200 rounded-2xl bg-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#FBBF24]/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-[#FBBF24]" />
                </div>
                <h3 className="text-gray-900">Collector Earnings</h3>
              </div>
              <div className="text-[#FBBF24] mb-1">GH₵ 842K</div>
              <p className="text-sm text-gray-600">Paid to Collectors this month</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Monthly Collection Trend */}
            <Card className="p-6 md:p-8 border border-stone-200 rounded-2xl">
              <h3 className="mb-6 text-gray-900">Monthly Plastic Collection Trend</h3>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyCollectionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                    <XAxis dataKey="month" stroke="#78716c" />
                    <YAxis label={{ value: 'Tons', angle: -90, position: 'insideLeft' }} stroke="#78716c" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e7e5e4',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="tons" fill="#08A26F" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Consistent growth in plastic collection shows increasing community engagement
              </p>
            </Card>

            <div className="grid gap-8 md:grid-cols-2">
              {/* NHIS Enrollment */}
              <Card className="p-6 md:p-8 border border-stone-200 rounded-2xl">
                <h3 className="mb-6 text-gray-900">NHIS Enrollment Growth</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={nhisEnrollmentData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                      <XAxis dataKey="month" stroke="#78716c" />
                      <YAxis stroke="#78716c" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e7e5e4',
                          borderRadius: '8px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="enrolled" 
                        stroke="#08A26F" 
                        strokeWidth={3}
                        dot={{ fill: '#08A26F', r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Steady increase in healthcare access through Sankofa savings
                </p>
              </Card>

              {/* Plastic Type Distribution */}
              <Card className="p-6 md:p-8 border border-stone-200 rounded-2xl">
                <h3 className="mb-6 text-gray-900">Plastic Type Distribution</h3>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={plasticTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {plasticTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e7e5e4',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Understanding collection patterns helps optimize recycling
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Predictive Health Intelligence */}
      <section className="py-16 md:py-20 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-[#08A26F]/10 border border-[#08A26F]/20 px-4 py-2 rounded-full mb-4">
                <Brain className="h-4 w-4 text-[#08A26F]" />
                <span className="text-sm text-[#08A26F]">AI-Powered</span>
              </div>
              <h2 className="mb-4 text-gray-900">Predictive Health Intelligence</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                AI-powered risk mapping directs collection efforts to high-risk zones
              </p>
            </div>

            {/* How Our AI Works */}
            <div className="mb-12 bg-white border border-stone-200 p-8 rounded-2xl">
              <h3 className="mb-8 text-center text-gray-900">How Our AI Works</h3>
              <div className="grid gap-8 md:grid-cols-3">
                <div className="text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#08A26F] text-white mb-4 mx-auto">
                    <span className="text-xl">1</span>
                  </div>
                  <h4 className="mb-3 text-gray-900">Data Collection</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Gathers plastic type, weight, GPS location from every Hub transaction
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#08A26F] text-white mb-4 mx-auto">
                    <span className="text-xl">2</span>
                  </div>
                  <h4 className="mb-3 text-gray-900">Pattern Analysis</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Combines with flood history, rainfall data, and sanitation reports
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#08A26F] text-white mb-4 mx-auto">
                    <span className="text-xl">3</span>
                  </div>
                  <h4 className="mb-3 text-gray-900">Risk Scoring</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Creates environmental risk scores to predict disease hotspots
                  </p>
                </div>
              </div>
            </div>

            {/* Risk Zones Map Visualization */}
            <Card className="p-6 md:p-8 mb-8 border border-stone-200 rounded-2xl">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-[#FBBF24]/10 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-[#FBBF24]" />
                </div>
                <h3 className="text-gray-900">Environmental Risk Zones</h3>
              </div>
              
              {/* Simple visual map representation */}
              <div className="mb-8 bg-stone-100 p-8 rounded-xl relative overflow-hidden border border-stone-200" style={{ minHeight: '300px' }}>
                <div className="relative h-full flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-stone-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Interactive map showing real-time risk zones across Ghana
                    </p>
                  </div>
                  
                  {/* Risk zone indicators */}
                  <div className="absolute top-4 left-4 bg-red-500 h-16 w-16 rounded-full opacity-70 animate-pulse"></div>
                  <div className="absolute top-12 right-8 bg-red-500 h-12 w-12 rounded-full opacity-70 animate-pulse"></div>
                  <div className="absolute bottom-20 left-16 bg-[#FBBF24] h-10 w-10 rounded-full opacity-70"></div>
                  <div className="absolute bottom-12 right-20 bg-[#FBBF24] h-10 w-10 rounded-full opacity-70"></div>
                  <div className="absolute top-32 right-32 bg-[#08A26F] h-8 w-8 rounded-full opacity-70"></div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-6 justify-center mb-8">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-red-500"></div>
                  <span className="text-sm text-gray-700">High Risk - Priority Collection</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-[#FBBF24]"></div>
                  <span className="text-sm text-gray-700">Medium Risk - Monitored</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-[#08A26F]"></div>
                  <span className="text-sm text-gray-700">Low Risk - Normal Operations</span>
                </div>
              </div>

              {/* Risk Zones Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-stone-200 bg-stone-50">
                      <th className="text-left py-4 px-4">Region</th>
                      <th className="text-left py-4 px-4">Risk Level</th>
                      <th className="text-left py-4 px-4">Plastic Accumulation</th>
                      <th className="text-left py-4 px-4">Population</th>
                      <th className="text-left py-4 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riskZones.map((zone, index) => (
                      <tr key={index} className="border-b border-stone-100">
                        <td className="py-4 px-4 text-gray-900">{zone.name}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs ${
                            zone.risk === 'High' ? 'bg-red-100 text-red-700' :
                            zone.risk === 'Medium' ? 'bg-[#FBBF24]/20 text-[#FBBF24]' :
                            'bg-[#08A26F]/10 text-[#08A26F]'
                          }`}>
                            {zone.risk}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{zone.plasticAccum}</td>
                        <td className="py-4 px-4 text-gray-600">{zone.population}</td>
                        <td className="py-4 px-4 text-gray-600">{zone.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Impact of Predictive Intelligence */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="p-6 bg-white border-2 border-[#08A26F]/20 rounded-2xl">
                <div className="w-12 h-12 bg-[#08A26F]/10 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-[#08A26F]" />
                </div>
                <h4 className="mb-2 text-gray-900">Targeted Prevention</h4>
                <div className="mb-2 text-[#08A26F]">68% Faster</div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Response time to high-risk zones reduced through predictive modeling
                </p>
              </Card>

              <Card className="p-6 bg-white border-2 border-[#08A26F]/20 rounded-2xl">
                <div className="w-12 h-12 bg-[#08A26F]/10 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-[#08A26F]" />
                </div>
                <h4 className="mb-2 text-gray-900">Disease Prevention</h4>
                <div className="mb-2 text-[#08A26F]">42% Reduction</div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  In reported vector-borne disease cases in high-collection areas
                </p>
              </Card>

              <Card className="p-6 bg-white border-2 border-[#FBBF24]/20 rounded-2xl">
                <div className="w-12 h-12 bg-[#FBBF24]/10 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-[#FBBF24]" />
                </div>
                <h4 className="mb-2 text-gray-900">Resource Optimization</h4>
                <div className="mb-2 text-[#FBBF24]">3x More Efficient</div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Collection efforts focused where they're needed most
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency Statement */}
      <section className="py-16 md:py-20 bg-[#08A26F]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h2 className="mb-6 text-white">Our Commitment to Transparency</h2>
            <p className="text-lg text-white/90 leading-relaxed">
              Every piece of data you see here is tracked in real-time through blockchain technology. 
              We believe in complete transparency—from the plastic collected to the healthcare funded. 
              Your contribution is measured, verified, and making a real difference.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
