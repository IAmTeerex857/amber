import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowRightLeft,
  Calculator,
  DollarSign,
  Bitcoin,
  Gift,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Zap,
  Info
} from 'lucide-react';

interface ConversionOption {
  id: string;
  type: 'usd' | 'xlm' | 'gift_card' | 'voucher';
  name: string;
  symbol: string;
  icon: React.ReactNode;
  rate: number; // points per unit
  minAmount: number;
  maxAmount?: number;
  fees: number; // percentage
  processingTime: string;
  isAvailable: boolean;
  bonusRate?: number; // bonus percentage for large amounts
}

interface PointsConversionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userPoints: number;
  onConvert: (conversionData: any) => void;
}

const PointsConversionModal: React.FC<PointsConversionModalProps> = ({
  isOpen,
  onClose,
  userPoints,
  onConvert
}) => {
  const [selectedOption, setSelectedOption] = useState<ConversionOption | null>(null);
  const [pointsAmount, setPointsAmount] = useState<string>('');
  const [estimatedValue, setEstimatedValue] = useState<number>(0);
  const [fees, setFees] = useState<number>(0);
  const [finalAmount, setFinalAmount] = useState<number>(0);
  const [bonusAmount, setBonusAmount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const conversionOptions: ConversionOption[] = [
    {
      id: 'usd',
      type: 'usd',
      name: 'US Dollar',
      symbol: 'USD',
      icon: <DollarSign className="h-5 w-5" />,
      rate: 100, // 100 points = $1
      minAmount: 1000,
      maxAmount: 50000,
      fees: 2.5,
      processingTime: '1-2 business days',
      isAvailable: true,
      bonusRate: 5 // 5% bonus for amounts over $50
    },
    {
      id: 'xlm',
      type: 'xlm',
      name: 'Stellar Lumens',
      symbol: 'XLM',
      icon: <Bitcoin className="h-5 w-5" />,
      rate: 25, // 25 points = 1 XLM
      minAmount: 500,
      maxAmount: 25000,
      fees: 1.0,
      processingTime: 'Instant',
      isAvailable: true,
      bonusRate: 10 // 10% bonus for amounts over 100 XLM
    },
    {
      id: 'gift_card',
      type: 'gift_card',
      name: 'Gift Cards',
      symbol: 'GIFT',
      icon: <Gift className="h-5 w-5" />,
      rate: 100, // 100 points = $1 gift card
      minAmount: 1000,
      maxAmount: 10000,
      fees: 0,
      processingTime: 'Instant',
      isAvailable: true
    },
    {
      id: 'voucher',
      type: 'voucher',
      name: 'Store Vouchers',
      symbol: 'VOUCH',
      icon: <Gift className="h-5 w-5" />,
      rate: 95, // 95 points = $1 voucher (better rate)
      minAmount: 500,
      maxAmount: 5000,
      fees: 0,
      processingTime: '24 hours',
      isAvailable: true
    }
  ];

  // Real-time calculation effect
  useEffect(() => {
    if (selectedOption && pointsAmount) {
      const points = parseFloat(pointsAmount);
      if (!isNaN(points) && points > 0) {
        const baseValue = points / selectedOption.rate;
        const feeAmount = (baseValue * selectedOption.fees) / 100;
        const afterFees = baseValue - feeAmount;
        
        // Calculate bonus if eligible
        let bonus = 0;
        if (selectedOption.bonusRate && baseValue >= 50) { // Bonus threshold
          bonus = (afterFees * selectedOption.bonusRate) / 100;
        }
        
        setEstimatedValue(baseValue);
        setFees(feeAmount);
        setFinalAmount(afterFees + bonus);
        setBonusAmount(bonus);
      } else {
        setEstimatedValue(0);
        setFees(0);
        setFinalAmount(0);
        setBonusAmount(0);
      }
    }
  }, [pointsAmount, selectedOption]);

  const handleConvert = async () => {
    if (!selectedOption || !pointsAmount || isProcessing) return;
    
    const points = parseFloat(pointsAmount);
    if (points < selectedOption.minAmount || points > userPoints) return;

    setIsProcessing(true);

    // Simulate processing
    setTimeout(() => {
      onConvert({
        type: selectedOption.type,
        pointsAmount: points,
        estimatedValue,
        fees,
        finalAmount,
        bonusAmount,
        processingTime: selectedOption.processingTime
      });
      setIsProcessing(false);
      onClose();
    }, 2000);
  };

  const getOptionColor = (type: string) => {
    switch (type) {
      case 'usd': return 'border-green-200 hover:border-green-300 bg-green-50';
      case 'xlm': return 'border-blue-200 hover:border-blue-300 bg-blue-50';
      case 'gift_card': return 'border-purple-200 hover:border-purple-300 bg-purple-50';
      case 'voucher': return 'border-orange-200 hover:border-orange-300 bg-orange-50';
      default: return 'border-gray-200 hover:border-gray-300 bg-gray-50';
    }
  };

  const getValidationMessage = () => {
    if (!pointsAmount || !selectedOption) return null;
    
    const points = parseFloat(pointsAmount);
    if (isNaN(points)) return { type: 'error', message: 'Please enter a valid number' };
    if (points < selectedOption.minAmount) return { type: 'error', message: `Minimum ${selectedOption.minAmount} points required` };
    if (selectedOption.maxAmount && points > selectedOption.maxAmount) return { type: 'error', message: `Maximum ${selectedOption.maxAmount} points allowed` };
    if (points > userPoints) return { type: 'error', message: 'Insufficient points balance' };
    
    return { type: 'success', message: 'Conversion amount is valid' };
  };

  const validation = getValidationMessage();
  const canConvert = validation?.type === 'success';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ArrowRightLeft className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Convert Points</h2>
              <p className="text-sm text-gray-600">Available: {userPoints.toLocaleString()} points</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Conversion Options */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Conversion Type</h3>
              <div className="space-y-3">
                {conversionOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedOption(option)}
                    disabled={!option.isAvailable}
                    className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                      selectedOption?.id === option.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : option.isAvailable
                        ? getOptionColor(option.type)
                        : 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center">
                          {option.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{option.name}</h4>
                          <p className="text-sm text-gray-600">
                            {option.rate} points = 1 {option.symbol}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          {option.processingTime === 'Instant' && (
                            <Zap className="h-4 w-4 text-green-500" />
                          )}
                          <span className="text-sm text-gray-600">{option.processingTime}</span>
                        </div>
                        {option.fees > 0 && (
                          <p className="text-xs text-gray-500">{option.fees}% fee</p>
                        )}
                        {option.bonusRate && (
                          <p className="text-xs text-green-600">+{option.bonusRate}% bonus</p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {selectedOption && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Conversion Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rate:</span>
                      <span className="font-medium">{selectedOption.rate} points = 1 {selectedOption.symbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Min Amount:</span>
                      <span className="font-medium">{selectedOption.minAmount.toLocaleString()} points</span>
                    </div>
                    {selectedOption.maxAmount && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Max Amount:</span>
                        <span className="font-medium">{selectedOption.maxAmount.toLocaleString()} points</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processing Time:</span>
                      <span className="font-medium">{selectedOption.processingTime}</span>
                    </div>
                    {selectedOption.fees > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fees:</span>
                        <span className="font-medium">{selectedOption.fees}%</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Calculator */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Calculator</h3>
              
              {selectedOption ? (
                <div className="space-y-6">
                  {/* Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Points to Convert
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={pointsAmount}
                        onChange={(e) => setPointsAmount(e.target.value)}
                        placeholder={`Min ${selectedOption.minAmount}`}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <span className="text-gray-500 font-medium">points</span>
                      </div>
                    </div>
                    {validation && (
                      <div className={`mt-2 flex items-center space-x-2 text-sm ${
                        validation.type === 'error' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {validation.type === 'error' ? (
                          <AlertCircle className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                        <span>{validation.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Amount Buttons */}
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Quick amounts:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: '25%', value: Math.floor(userPoints * 0.25) },
                        { label: '50%', value: Math.floor(userPoints * 0.5) },
                        { label: '75%', value: Math.floor(userPoints * 0.75) }
                      ].map((quick) => (
                        <button
                          key={quick.label}
                          onClick={() => setPointsAmount(quick.value.toString())}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                        >
                          {quick.label}
                          <br />
                          <span className="text-xs text-gray-500">{quick.value.toLocaleString()}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Calculation Breakdown */}
                  {pointsAmount && estimatedValue > 0 && (
                    <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                      <h4 className="font-medium text-gray-900 flex items-center">
                        <Calculator className="h-4 w-4 mr-2" />
                        Conversion Preview
                      </h4>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Points to convert:</span>
                          <span className="font-medium">{parseFloat(pointsAmount).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Base value:</span>
                          <span className="font-medium">{estimatedValue.toFixed(4)} {selectedOption.symbol}</span>
                        </div>
                        {fees > 0 && (
                          <div className="flex justify-between text-red-600">
                            <span>Processing fee ({selectedOption.fees}%):</span>
                            <span>-{fees.toFixed(4)} {selectedOption.symbol}</span>
                          </div>
                        )}
                        {bonusAmount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Bonus ({selectedOption.bonusRate}%):</span>
                            <span>+{bonusAmount.toFixed(4)} {selectedOption.symbol}</span>
                          </div>
                        )}
                        <div className="border-t border-blue-200 pt-2">
                          <div className="flex justify-between font-semibold text-lg">
                            <span>You'll receive:</span>
                            <span className="text-blue-600">{finalAmount.toFixed(4)} {selectedOption.symbol}</span>
                          </div>
                        </div>
                      </div>

                      {bonusAmount > 0 && (
                        <div className="bg-green-100 border border-green-200 rounded-lg p-3">
                          <div className="flex items-start space-x-2">
                            <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                            <div className="text-sm">
                              <p className="font-medium text-green-800">Bonus Applied!</p>
                              <p className="text-green-700">
                                You're getting an extra {bonusAmount.toFixed(4)} {selectedOption.symbol} bonus for this conversion.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Processing Time Info */}
                  {selectedOption && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <Clock className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">Processing Time</p>
                          <p className="text-gray-600">
                            {selectedOption.processingTime === 'Instant' 
                              ? 'Your conversion will be processed immediately'
                              : `Your conversion will be processed within ${selectedOption.processingTime}`
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Select a conversion type to see the calculator</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConvert}
              disabled={!canConvert || isProcessing}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <ArrowRightLeft className="h-4 w-4" />
                  <span>Convert Points</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsConversionModal;
