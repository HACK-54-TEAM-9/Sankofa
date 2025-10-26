import { Card } from './ui/card';
import { ImpactMetric } from './ImpactMetric';
import { 
  Recycle, 
  Shield, 
  Users, 
  TrendingUp, 
  MapPin, 
  AlertTriangle,
  Activity,
  DollarSign
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
    { name: 'PET Bottles', value: 42, color: '#10b981' },
    { name: 'HDPE Containers', value: 28, color: '#14b8a6' },
    { name: 'Plastic Bags', value: 18, color: '#06b6d4' },
    { name: 'Other', value: 12, color: '#0ea5e9' },
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
      <section className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6 text-white">Our Impact in Numbers: Sankofa-Coin Data & Predictive Health</h1>
            <p className="text-xl text-emerald-50">
              Transparency through data. Every transaction tracked, every impact measured, every community protected.
            </p>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-gray-900">Key Impact Metrics</h2>
            <p className="text-lg text-gray-600">
              Real-time data showing our collective impact across Ghana
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto mb-12">
            <ImpactMetric
              icon={Recycle}
              value="2,847"
              label="Tons Plastic Collected"
              color="green"
            />
            <ImpactMetric
              icon={Shield}
              value="12,430"
              label="People with NHIS Access"
              color="blue"
            />
            <ImpactMetric
              icon={Users}
              value="8,652"
              label="Active Collectors"
              color="orange"
            />
            <ImpactMetric
              icon={DollarSign}
              value="GH₵ 1.2M"
              label="Healthcare Funds Distributed"
              color="green"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            <Card className="p-6 border-2">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="h-5 w-5 text-emerald-600" />
                <h3 className="text-gray-900">Daily Collection Rate</h3>
              </div>
              <div className="text-2xl text-emerald-700 mb-1">18.4 tons/day</div>
              <p className="text-sm text-gray-600">↑ 23% from last month</p>
            </Card>

            <Card className="p-6 border-2">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h3 className="text-gray-900">Active Hubs</h3>
              </div>
              <div className="text-2xl text-blue-700 mb-1">127 Hubs</div>
              <p className="text-sm text-gray-600">Across 8 regions</p>
            </Card>

            <Card className="p-6 border-2">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <div className="text-2xl text-orange-700 mb-1">GH₵ 842K</div>
              <p className="text-sm text-gray-600">Paid to Collectors this month</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Monthly Collection Trend */}
            <Card className="p-6 md:p-8">
              <h3 className="mb-6 text-gray-900">Monthly Plastic Collection Trend</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyCollectionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis label={{ value: 'Tons', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="tons" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Consistent growth in plastic collection shows increasing community engagement
              </p>
            </Card>

            <div className="grid gap-8 md:grid-cols-2">
              {/* NHIS Enrollment */}
              <Card className="p-6 md:p-8">
                <h3 className="mb-6 text-gray-900">NHIS Enrollment Growth</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={nhisEnrollmentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="enrolled" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Steady increase in healthcare access through Sankofa savings
                </p>
              </Card>

              {/* Plastic Type Distribution */}
              <Card className="p-6 md:p-8">
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
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {plasticTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
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
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="mb-4 text-gray-900">Predictive Health Intelligence</h2>
              <p className="text-lg text-gray-600">
                AI-powered risk mapping directs collection efforts to high-risk zones
              </p>
            </div>

            {/* How Our AI Works */}
            <div className="mb-12 bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl border-2 border-blue-200">
              <h3 className="mb-6 text-center text-gray-900">How Our AI Works</h3>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white mb-4 mx-auto">
                    1
                  </div>
                  <h4 className="mb-2 text-gray-900">Data Collection</h4>
                  <p className="text-sm text-gray-600">
                    Gathers plastic type, weight, GPS location from every Hub transaction
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white mb-4 mx-auto">
                    2
                  </div>
                  <h4 className="mb-2 text-gray-900">Pattern Analysis</h4>
                  <p className="text-sm text-gray-600">
                    Combines with flood history, rainfall data, and sanitation reports
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white mb-4 mx-auto">
                    3
                  </div>
                  <h4 className="mb-2 text-gray-900">Risk Scoring</h4>
                  <p className="text-sm text-gray-600">
                    Creates environmental risk scores to predict disease hotspots
                  </p>
                </div>
              </div>
            </div>

            {/* Risk Zones Map Visualization */}
            <Card className="p-6 md:p-8 mb-8">
              <h3 className="mb-6 text-gray-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Environmental Risk Zones
              </h3>
              
              {/* Simple visual map representation */}
              <div className="mb-6 bg-gradient-to-br from-emerald-100 to-blue-100 p-8 rounded-xl relative overflow-hidden" style={{ minHeight: '300px' }}>
                {/* Simplified Ghana outline with risk zones */}
                <div className="relative h-full flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Interactive map showing real-time risk zones across Ghana
                    </p>
                  </div>
                  
                  {/* Risk zone indicators */}
                  <div className="absolute top-4 left-4 bg-red-500 h-16 w-16 rounded-full opacity-60 animate-pulse"></div>
                  <div className="absolute top-12 right-8 bg-red-500 h-12 w-12 rounded-full opacity-60 animate-pulse"></div>
                  <div className="absolute bottom-20 left-16 bg-yellow-500 h-10 w-10 rounded-full opacity-60"></div>
                  <div className="absolute bottom-12 right-20 bg-yellow-500 h-10 w-10 rounded-full opacity-60"></div>
                  <div className="absolute top-32 right-32 bg-green-500 h-8 w-8 rounded-full opacity-60"></div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-6 justify-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-red-500"></div>
                  <span className="text-sm text-gray-700">High Risk - Priority Collection</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-yellow-500"></div>
                  <span className="text-sm text-gray-700">Medium Risk - Monitored</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-700">Low Risk - Normal Operations</span>
                </div>
              </div>

              {/* Risk Zones Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-2">Region</th>
                      <th className="text-left py-3 px-2">Risk Level</th>
                      <th className="text-left py-3 px-2">Plastic Accumulation</th>
                      <th className="text-left py-3 px-2">Population</th>
                      <th className="text-left py-3 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riskZones.map((zone, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-2 text-gray-900">{zone.name}</td>
                        <td className="py-3 px-2">
                          <span className={`inline-block px-2 py-1 rounded text-xs ${
                            zone.risk === 'High' ? 'bg-red-100 text-red-700' :
                            zone.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {zone.risk}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-gray-600">{zone.plasticAccum}</td>
                        <td className="py-3 px-2 text-gray-600">{zone.population}</td>
                        <td className="py-3 px-2 text-gray-600">{zone.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Impact of Predictive Intelligence */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200">
                <h4 className="mb-2 text-gray-900">Targeted Prevention</h4>
                <div className="mb-2 text-emerald-700">68% Faster</div>
                <p className="text-sm text-gray-600">
                  Response time to high-risk zones reduced through predictive modeling
                </p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
                <h4 className="mb-2 text-gray-900">Disease Prevention</h4>
                <div className="mb-2 text-blue-700">42% Reduction</div>
                <p className="text-sm text-gray-600">
                  In reported vector-borne disease cases in high-collection areas
                </p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200">
                <h4 className="mb-2 text-gray-900">Resource Optimization</h4>
                <div className="mb-2 text-orange-700">3x More Efficient</div>
                <p className="text-sm text-gray-600">
                  Collection efforts focused where they're needed most
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency Statement */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-4 text-white">Our Commitment to Transparency</h2>
            <p className="text-lg text-emerald-50">
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
