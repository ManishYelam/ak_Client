import React from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Legend, CartesianGrid,
  LineChart, Line, AreaChart, Area, ComposedChart
} from "recharts";

// Enhanced color schemes
const COLOR_SCHEMES = {
  status: ["#10B981", "#EF4444", "#F59E0B", "#6B7280", "#3B82F6"],
  type: ["#8B5CF6", "#EC4899", "#06B6D4", "#84CC16", "#F97316"],
  payments: ["#6366F1", "#10B981", "#F59E0B"],
  cases: ["#60A5FA", "#34D399", "#FBBF24"]
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
        <p className="font-semibold text-gray-800">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Custom label for pie charts
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize="12"
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Graphs = ({ 
  caseStatusData = [], 
  caseTypeData = [], 
  paymentsData = [], 
  casesPerMonthData = [],
  loading = false 
}) => {
  
  // Default data for empty states
  const defaultCaseStatusData = [
    { name: 'Running', value: 0 },
    { name: 'Closed', value: 0 },
    { name: 'Pending', value: 0 }
  ];

  const defaultCaseTypeData = [
    { name: 'Fixed Deposit', value: 0 },
    { name: 'Savings', value: 0 },
    { name: 'Recurring', value: 0 }
  ];

  // Calculate statistics for summary cards
  const totalCases = caseStatusData.reduce((sum, item) => sum + item.value, 0);
  const totalPayments = paymentsData.reduce((sum, item) => sum + (item.amount || 0), 0);
  const activeCases = caseStatusData.find(item => item.name === 'Running')?.value || 0;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cases</p>
              <p className="text-2xl font-bold text-gray-900">{totalCases.toLocaleString()}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Cases</p>
              <p className="text-2xl font-bold text-gray-900">{activeCases.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Payments</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{(totalPayments / 100000).toFixed(1)}L
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Case Types</p>
              <p className="text-2xl font-bold text-gray-900">{caseTypeData.length}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pie Chart: Case Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Case Status Distribution</h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Total: {totalCases}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={caseStatusData.length > 0 ? caseStatusData : defaultCaseStatusData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                innerRadius={40}
                label={renderCustomizedLabel}
                labelLine={false}
              >
                {caseStatusData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLOR_SCHEMES.status[index % COLOR_SCHEMES.status.length]} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry) => (
                  <span style={{ color: entry.color, fontSize: '12px' }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
          {caseStatusData.length === 0 && (
            <div className="text-center text-gray-500 mt-4">
              No case status data available
            </div>
          )}
        </div>

        {/* Pie Chart: Case Type Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Case Type Distribution</h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Types: {caseTypeData.length}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={caseTypeData.length > 0 ? caseTypeData : defaultCaseTypeData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                innerRadius={40}
                label={renderCustomizedLabel}
                labelLine={false}
              >
                {caseTypeData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLOR_SCHEMES.type[index % COLOR_SCHEMES.type.length]} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry) => (
                  <span style={{ color: entry.color, fontSize: '12px' }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
          {caseTypeData.length === 0 && (
            <div className="text-center text-gray-500 mt-4">
              No case type data available
            </div>
          )}
        </div>

        {/* Bar + Line Chart: Cases Per Month */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Monthly Case Trends</h3>
            <div className="flex gap-2 text-sm">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Bars: Cases</span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">Line: Trend</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={casesPerMonthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="cases" 
                name="Monthly Cases" 
                fill="#60A5FA" 
                radius={[4, 4, 0, 0]}
                barSize={40}
              />
              <Line 
                type="monotone" 
                dataKey="cases" 
                name="Trend Line" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#8B5CF6' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
          {casesPerMonthData.length === 0 && (
            <div className="text-center text-gray-500 mt-4">
              No monthly case data available
            </div>
          )}
        </div>

        {/* Area Chart: Payments Over Time */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Payment Trends Over Time</h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Total: ₹{(totalPayments / 100000).toFixed(1)}L
            </span>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={paymentsData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
              />
              <Tooltip 
                content={<CustomTooltip />}
                formatter={(value) => [`₹${(value / 1000).toFixed(1)}K`, 'Amount']}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="amount" 
                name="Payment Amount" 
                stroke="#6366F1" 
                fillOpacity={1} 
                fill="url(#colorAmount)" 
                strokeWidth={3}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                name="Payment Trend" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
          {paymentsData.length === 0 && (
            <div className="text-center text-gray-500 mt-4">
              No payment data available
            </div>
          )}
        </div>

      </div>

      {/* Additional Insights Section */}
      {(caseStatusData.length > 0 || caseTypeData.length > 0) && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {((activeCases / totalCases) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Active Cases Rate</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {caseTypeData.length}
              </div>
              <div className="text-sm text-gray-600">Different Case Types</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {casesPerMonthData.length}
              </div>
              <div className="text-sm text-gray-600">Months Tracked</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Default props for empty states
Graphs.defaultProps = {
  caseStatusData: [],
  caseTypeData: [],
  paymentsData: [],
  casesPerMonthData: [],
  loading: false
};

export default Graphs;