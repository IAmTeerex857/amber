import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Bitcoin,
  Gift,
  Coins,
  ArrowRight,
  BarChart3,
  Zap,
  Target,
  Layers,
  Settings,
  Eye,
  Save,
  Download
} from 'lucide-react';

interface SimulationParams {
  fromCurrency: 'points';
  toCurrency: 'usd' | 'xlm' | 'gift_card' | 'voucher';
  amount: number;
  frequency: 'one-time' | 'daily' | 'weekly' | 'monthly';
  duration: number; // in days
  enableBonus: boolean;
  marketConditions: 'stable' | 'volatile' | 'bullish' | 'bearish';
}

interface SimulationResult {
  day: number;
  inputAmount: number;
  outputAmount: number;
  fees: number;
  bonus: number;
  marketRate: number;
  netAmount: number;
  cumulativeInput: number;
  cumulativeOutput: number;
  cumulativeFees: number;
  cumulativeBonus: number;
}

interface ConversionRate {
  currency: string;
  baseRate: number;
  fees: number;
  bonusThreshold: number;
  bonusRate: number;
  minAmount: number;
  maxAmount: number;
}

const TransactionSimulator: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentDay, setCurrentDay] = useState(0);
  const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([]);
  const [simulationSpeed, setSimulationSpeed] = useState<'slow' | 'medium' | 'fast'>('medium');
  
  const [params, setParams] = useState<SimulationParams>({
    fromCurrency: 'points',
    toCurrency: 'usd',
    amount: 1000,
    frequency: 'daily',
    duration: 30,
    enableBonus: true,
    marketConditions: 'stable'
  });

  // Mock conversion rates
  const conversionRates: Record<string, ConversionRate> = {
    usd: {
      currency: 'usd',
      baseRate: 100, // 100 points = $1
      fees: 2.5,
      bonusThreshold: 5000,
      bonusRate: 5,
      minAmount: 1000,
      maxAmount: 50000
    },
    xlm: {
      currency: 'xlm',
      baseRate: 25, // 25 points = 1 XLM
      fees: 1.0,
      bonusThreshold: 2500,
      bonusRate: 10,
      minAmount: 500,
      maxAmount: 25000
    },
    gift_card: {
      currency: 'gift_card',
      baseRate: 100,
      fees: 0,
      bonusThreshold: 0,
      bonusRate: 0,
      minAmount: 1000,
      maxAmount: 10000
    },
    voucher: {
      currency: 'voucher',
      baseRate: 95, // Better rate
      fees: 0,
      bonusThreshold: 0,
      bonusRate: 0,
      minAmount: 500,
      maxAmount: 5000
    }
  };

  const getMarketMultiplier = (day: number, conditions: string): number => {
    const baseMultiplier = 1.0;
    
    switch (conditions) {
      case 'stable':
        return baseMultiplier + (Math.sin(day * 0.1) * 0.02); // ±2% variation
      case 'volatile':
        return baseMultiplier + (Math.sin(day * 0.3) * 0.1) + (Math.random() - 0.5) * 0.1; // ±10% variation
      case 'bullish':
        return baseMultiplier + (day * 0.001) + (Math.sin(day * 0.2) * 0.03); // Trending up with noise
      case 'bearish':
        return baseMultiplier - (day * 0.001) + (Math.sin(day * 0.2) * 0.03); // Trending down with noise
      default:
        return baseMultiplier;
    }
  };

  const calculateConversion = (day: number): SimulationResult => {
    const rate = conversionRates[params.toCurrency];
    const marketMultiplier = getMarketMultiplier(day, params.marketConditions);
    const effectiveRate = rate.baseRate * marketMultiplier;
    
    const baseOutput = params.amount / effectiveRate;
    const feeAmount = (baseOutput * rate.fees) / 100;
    const afterFees = baseOutput - feeAmount;
    
    let bonusAmount = 0;
    if (params.enableBonus && rate.bonusThreshold > 0 && params.amount >= rate.bonusThreshold) {
      bonusAmount = (afterFees * rate.bonusRate) / 100;
    }
    
    const netAmount = afterFees + bonusAmount;
    
    // Calculate cumulative values
    const previousResult = simulationResults[simulationResults.length - 1];
    const cumulativeInput = (previousResult?.cumulativeInput || 0) + params.amount;
    const cumulativeOutput = (previousResult?.cumulativeOutput || 0) + netAmount;
    const cumulativeFees = (previousResult?.cumulativeFees || 0) + feeAmount;
    const cumulativeBonus = (previousResult?.cumulativeBonus || 0) + bonusAmount;

    return {
      day,
      inputAmount: params.amount,
      outputAmount: baseOutput,
      fees: feeAmount,
      bonus: bonusAmount,
      marketRate: effectiveRate,
      netAmount,
      cumulativeInput,
      cumulativeOutput,
      cumulativeFees,
      cumulativeBonus
    };
  };

  const runSimulation = () => {
    setIsRunning(true);
    setCurrentDay(0);
    setSimulationResults([]);
    
    const interval = setInterval(() => {
      setCurrentDay(prev => {
        const newDay = prev + 1;
        
        // Check if we should add a new conversion based on frequency
        let shouldConvert = false;
        switch (params.frequency) {
          case 'one-time':
            shouldConvert = newDay === 1;
            break;
          case 'daily':
            shouldConvert = true;
            break;
          case 'weekly':
            shouldConvert = newDay % 7 === 1;
            break;
          case 'monthly':
            shouldConvert = newDay % 30 === 1;
            break;
        }
        
        if (shouldConvert) {
          const result = calculateConversion(newDay);
          setSimulationResults(prev => [...prev, result]);
        }
        
        if (newDay >= params.duration) {
          setIsRunning(false);
          clearInterval(interval);
        }
        
        return newDay;
      });
    }, simulationSpeed === 'fast' ? 100 : simulationSpeed === 'medium' ? 300 : 500);

    return () => clearInterval(interval);
  };

  const pauseSimulation = () => {
    setIsRunning(false);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setCurrentDay(0);
    setSimulationResults([]);
  };

  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case 'usd': return <DollarSign className="h-4 w-4" />;
      case 'xlm': return <Bitcoin className="h-4 w-4" />;
      case 'gift_card': return <Gift className="h-4 w-4" />;
      case 'voucher': return <Gift className="h-4 w-4" />;
      default: return <Coins className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'usd') {
      return `$${amount.toFixed(2)}`;
    } else if (currency === 'points') {
      return `${amount.toLocaleString()} PTS`;
    } else {
      return `${amount.toFixed(4)} ${currency.toUpperCase()}`;
    }
  };

  const getMarketConditionColor = (condition: string) => {
    switch (condition) {
      case 'bullish': return 'text-green-600 bg-green-50';
      case 'bearish': return 'text-red-600 bg-red-50';
      case 'volatile': return 'text-orange-600 bg-orange-50';
      case 'stable': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const finalResult = simulationResults[simulationResults.length - 1];
  const totalReturn = finalResult ? ((finalResult.cumulativeOutput - finalResult.cumulativeInput / conversionRates[params.toCurrency].baseRate) / (finalResult.cumulativeInput / conversionRates[params.toCurrency].baseRate)) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transaction Simulator</h1>
          <p className="text-gray-600 mt-1">Preview and analyze conversion scenarios before execution</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={resetSimulation}
            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
          <button
            onClick={isRunning ? pauseSimulation : runSimulation}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span>{isRunning ? 'Pause' : 'Run'} Simulation</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Parameters Panel */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Settings className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Simulation Parameters</h3>
            </div>

            <div className="space-y-4">
              {/* Conversion Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conversion Type
                </label>
                <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <Coins className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Points</span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                  {getCurrencyIcon(params.toCurrency)}
                  <select
                    value={params.toCurrency}
                    onChange={(e) => setParams(prev => ({ ...prev, toCurrency: e.target.value as any }))}
                    className="bg-transparent border-none focus:ring-0 text-sm font-medium"
                  >
                    <option value="usd">USD</option>
                    <option value="xlm">XLM</option>
                    <option value="gift_card">Gift Cards</option>
                    <option value="voucher">Vouchers</option>
                  </select>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount per Conversion
                </label>
                <input
                  type="number"
                  value={params.amount}
                  onChange={(e) => setParams(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Min: {conversionRates[params.toCurrency].minAmount} points
                </p>
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conversion Frequency
                </label>
                <select
                  value={params.frequency}
                  onChange={(e) => setParams(prev => ({ ...prev, frequency: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="one-time">One-time</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Simulation Duration
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={params.duration}
                    onChange={(e) => setParams(prev => ({ ...prev, duration: parseFloat(e.target.value) || 1 }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="365"
                  />
                  <span className="text-sm text-gray-600">days</span>
                </div>
              </div>

              {/* Market Conditions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Market Conditions
                </label>
                <select
                  value={params.marketConditions}
                  onChange={(e) => setParams(prev => ({ ...prev, marketConditions: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="stable">Stable</option>
                  <option value="volatile">Volatile</option>
                  <option value="bullish">Bullish</option>
                  <option value="bearish">Bearish</option>
                </select>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getMarketConditionColor(params.marketConditions)}`}>
                    {params.marketConditions.charAt(0).toUpperCase() + params.marketConditions.slice(1)} Market
                  </span>
                </div>
              </div>

              {/* Enable Bonus */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Enable Bonus Rewards</p>
                  <p className="text-xs text-gray-500">Apply bonus rates for large conversions</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.enableBonus}
                    onChange={(e) => setParams(prev => ({ ...prev, enableBonus: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Simulation Speed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Simulation Speed
                </label>
                <div className="flex space-x-2">
                  {(['slow', 'medium', 'fast'] as const).map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setSimulationSpeed(speed)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        simulationSpeed === speed
                          ? 'bg-blue-100 text-blue-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {speed.charAt(0).toUpperCase() + speed.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="xl:col-span-2 space-y-6">
          {/* Progress Indicator */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Simulation Progress</h3>
              </div>
              <div className="text-sm text-gray-600">
                Day {currentDay} of {params.duration}
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((currentDay / params.duration) * 100, 100)}%` }}
              />
            </div>
            
            {isRunning && (
              <div className="flex items-center space-x-2 mt-2 text-sm text-blue-600">
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-600 border-t-transparent" />
                <span>Running simulation...</span>
              </div>
            )}
          </div>

          {/* Summary Stats */}
          {simulationResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Total Input</span>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {finalResult?.cumulativeInput.toLocaleString()} PTS
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">Total Output</span>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(finalResult?.cumulativeOutput || 0, params.toCurrency)}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Gift className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-600">Total Bonus</span>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(finalResult?.cumulativeBonus || 0, params.toCurrency)}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-gray-600">Net Return</span>
                </div>
                <p className={`text-xl font-bold ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
                </p>
              </div>
            </div>
          )}

          {/* Results Table */}
          {simulationResults.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Conversion Results</h3>
                </div>
                <div className="flex space-x-2">
                  <button className="flex items-center space-x-2 px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </button>
                  <button className="flex items-center space-x-2 px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Input</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Output</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fees</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bonus</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {simulationResults.slice(-10).map((result) => (
                      <tr key={result.day} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {result.day}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {result.inputAmount.toLocaleString()} PTS
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(result.outputAmount, params.toCurrency)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-red-600">
                          -{formatCurrency(result.fees, params.toCurrency)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600">
                          +{formatCurrency(result.bonus, params.toCurrency)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(result.netAmount, params.toCurrency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty State */}
          {simulationResults.length === 0 && !isRunning && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Simulate</h3>
              <p className="text-gray-600 mb-4">
                Configure your parameters and click "Run Simulation" to preview conversion scenarios
              </p>
              <button
                onClick={runSimulation}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Play className="h-4 w-4" />
                <span>Run Simulation</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionSimulator;
