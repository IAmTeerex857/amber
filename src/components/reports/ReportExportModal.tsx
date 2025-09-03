import React, { useState } from 'react';
import {
  Download,
  FileText,
  Image,
  File,
  Calendar,
  Settings,
  Check,
  X,
  Mail,
  Link as LinkIcon,
  Loader,
  CheckCircle,
  AlertCircle,
  Eye,
  Clock,
  Users,
  Share2
} from 'lucide-react';

interface ExportOptions {
  format: 'pdf' | 'docx' | 'xlsx' | 'csv' | 'json';
  includeMedia: boolean;
  includeCharts: boolean;
  includePersonalInfo: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
  sections: {
    summary: boolean;
    metrics: boolean;
    activities: boolean;
    expenses: boolean;
    feedback: boolean;
    media: boolean;
  };
  template: 'standard' | 'executive' | 'detailed' | 'minimal';
  recipients?: string[];
  customFileName?: string;
}

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: 'monthly' | 'cumulative' | 'analytics' | 'custom';
  reportId?: string;
  reportTitle?: string;
  onExport: (options: ExportOptions) => Promise<void>;
  allowEmail?: boolean;
  allowSchedule?: boolean;
}

const ReportExportModal: React.FC<ReportExportModalProps> = ({
  isOpen,
  onClose,
  reportType,
  reportId,
  reportTitle = 'Report',
  onExport,
  allowEmail = true,
  allowSchedule = false
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    includeMedia: true,
    includeCharts: true,
    includePersonalInfo: true,
    sections: {
      summary: true,
      metrics: true,
      activities: true,
      expenses: true,
      feedback: true,
      media: true
    },
    template: 'standard',
    recipients: [],
    customFileName: ''
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [emailRecipients, setEmailRecipients] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');

  const formatOptions = [
    {
      id: 'pdf',
      name: 'PDF Document',
      description: 'Professional document format, perfect for sharing and printing',
      icon: FileText,
      size: '~2-5 MB',
      features: ['Professional formatting', 'Preserves layout', 'Universal compatibility']
    },
    {
      id: 'docx',
      name: 'Word Document',
      description: 'Editable document format for further customization',
      icon: File,
      size: '~1-3 MB',
      features: ['Fully editable', 'Comments support', 'Collaborative editing']
    },
    {
      id: 'xlsx',
      name: 'Excel Spreadsheet',
      description: 'Data-focused format with charts and analysis',
      icon: File,
      size: '~500 KB',
      features: ['Interactive charts', 'Data analysis', 'Formulas included']
    },
    {
      id: 'csv',
      name: 'CSV Data',
      description: 'Raw data export for analysis and integration',
      icon: File,
      size: '~50-100 KB',
      features: ['Raw data only', 'Database import', 'Lightweight format']
    }
  ];

  const templateOptions = [
    {
      id: 'standard',
      name: 'Standard Report',
      description: 'Balanced view with all sections included',
      preview: 'Complete report with executive summary, metrics, and details'
    },
    {
      id: 'executive',
      name: 'Executive Summary',
      description: 'High-level overview for leadership',
      preview: 'Key metrics, highlights, and strategic insights only'
    },
    {
      id: 'detailed',
      name: 'Detailed Analysis',
      description: 'Comprehensive report with all available data',
      preview: 'All data, media, charts, and granular breakdowns'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Essential information only',
      preview: 'Core metrics and summary information'
    }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportError(null);
    
    try {
      await onExport(exportOptions);
      
      // Simulate download URL generation
      const mockUrl = `https://example.com/downloads/${reportId}-${Date.now()}.${exportOptions.format}`;
      setDownloadUrl(mockUrl);
      setExportComplete(true);
      setCurrentStep(4);
    } catch (error) {
      setExportError(error instanceof Error ? error.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const updateSection = (section: keyof ExportOptions['sections'], value: boolean) => {
    setExportOptions(prev => ({
      ...prev,
      sections: { ...prev.sections, [section]: value }
    }));
  };

  const resetModal = () => {
    setCurrentStep(1);
    setExportComplete(false);
    setExportError(null);
    setDownloadUrl(null);
    setIsExporting(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Download className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Export Report</h3>
              <p className="text-sm text-gray-600">{reportTitle}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {[
              { step: 1, name: 'Format', icon: FileText },
              { step: 2, name: 'Options', icon: Settings },
              { step: 3, name: 'Review', icon: Eye },
              { step: 4, name: 'Download', icon: Download }
            ].map((item, index) => {
              const Icon = item.icon;
              const isActive = currentStep === item.step;
              const isCompleted = currentStep > item.step || exportComplete;
              
              return (
                <div key={item.step} className="flex items-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors
                    ${isActive ? 'bg-blue-600 border-blue-600 text-white' :
                      isCompleted ? 'bg-green-600 border-green-600 text-white' :
                      'border-gray-300 text-gray-400'
                    }
                  `}>
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {item.name}
                  </span>
                  {index < 3 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6">
          {/* Step 1: Format Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Choose Export Format</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formatOptions.map((format) => {
                    const Icon = format.icon;
                    return (
                      <div
                        key={format.id}
                        className={`
                          border rounded-lg p-4 cursor-pointer transition-all
                          ${exportOptions.format === format.id
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                        onClick={() => setExportOptions(prev => ({ ...prev, format: format.id as any }))}
                      >
                        <div className="flex items-start space-x-3">
                          <Icon className="h-8 w-8 text-blue-600 mt-1" />
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{format.name}</h5>
                            <p className="text-sm text-gray-600 mt-1">{format.description}</p>
                            <p className="text-xs text-gray-500 mt-2">Size: {format.size}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {format.features.map((feature, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                          {exportOptions.format === format.id && (
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Report Template</h4>
                <div className="space-y-3">
                  {templateOptions.map((template) => (
                    <label
                      key={template.id}
                      className={`
                        flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-colors
                        ${exportOptions.template === template.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}
                      `}
                    >
                      <input
                        type="radio"
                        name="template"
                        value={template.id}
                        checked={exportOptions.template === template.id}
                        onChange={(e) => setExportOptions(prev => ({ ...prev, template: e.target.value as any }))}
                        className="mt-1 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <div>
                        <h5 className="font-medium text-gray-900">{template.name}</h5>
                        <p className="text-sm text-gray-600">{template.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{template.preview}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Export Options */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Content Options</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={exportOptions.includeMedia}
                        onChange={(e) => setExportOptions(prev => ({ ...prev, includeMedia: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <span className="font-medium text-gray-900">Include Media Files</span>
                        <p className="text-sm text-gray-600">Images, videos, and documents</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={exportOptions.includeCharts}
                        onChange={(e) => setExportOptions(prev => ({ ...prev, includeCharts: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <span className="font-medium text-gray-900">Include Charts & Graphs</span>
                        <p className="text-sm text-gray-600">Visual data representations</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={exportOptions.includePersonalInfo}
                        onChange={(e) => setExportOptions(prev => ({ ...prev, includePersonalInfo: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <span className="font-medium text-gray-900">Include Personal Information</span>
                        <p className="text-sm text-gray-600">Names, emails, contact details</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Report Sections</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(exportOptions.sections).map(([key, value]) => (
                    <label key={key} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => updateSection(key as keyof ExportOptions['sections'], e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-medium text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">File Settings</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Custom File Name</label>
                    <input
                      type="text"
                      value={exportOptions.customFileName}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, customFileName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`${reportTitle}-${new Date().toISOString().split('T')[0]}`}
                    />
                  </div>
                  
                  {exportOptions.format === 'pdf' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date Range (Optional)</label>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="date"
                          value={exportOptions.dateRange?.start || ''}
                          onChange={(e) => setExportOptions(prev => ({ 
                            ...prev, 
                            dateRange: { ...prev.dateRange, start: e.target.value, end: prev.dateRange?.end || '' }
                          }))}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="date"
                          value={exportOptions.dateRange?.end || ''}
                          onChange={(e) => setExportOptions(prev => ({ 
                            ...prev, 
                            dateRange: { ...prev.dateRange, end: e.target.value, start: prev.dateRange?.start || '' }
                          }))}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {allowEmail && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Email Options (Optional)</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                      <input
                        type="text"
                        value={emailRecipients}
                        onChange={(e) => setEmailRecipients(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="email1@example.com, email2@example.com"
                      />
                      <p className="text-xs text-gray-500 mt-1">Separate multiple emails with commas</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Message</label>
                      <textarea
                        rows={3}
                        value={emailMessage}
                        onChange={(e) => setEmailMessage(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Optional message to include with the report..."
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-gray-900">Review Export Settings</h4>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-900">Format & Template</h5>
                    <p className="text-sm text-gray-600">
                      {formatOptions.find(f => f.id === exportOptions.format)?.name} • 
                      {' '}{templateOptions.find(t => t.id === exportOptions.template)?.name}
                    </p>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900">Content Options</h5>
                    <div className="text-sm text-gray-600">
                      {exportOptions.includeMedia && <span className="block">✓ Media files included</span>}
                      {exportOptions.includeCharts && <span className="block">✓ Charts & graphs included</span>}
                      {exportOptions.includePersonalInfo && <span className="block">✓ Personal info included</span>}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-900">Sections Included</h5>
                  <div className="text-sm text-gray-600 grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                    {Object.entries(exportOptions.sections)
                      .filter(([_, included]) => included)
                      .map(([section]) => (
                        <span key={section} className="block">
                          ✓ {section.charAt(0).toUpperCase() + section.slice(1)}
                        </span>
                      ))
                    }
                  </div>
                </div>
                
                {exportOptions.customFileName && (
                  <div>
                    <h5 className="font-medium text-gray-900">File Name</h5>
                    <p className="text-sm text-gray-600">{exportOptions.customFileName}.{exportOptions.format}</p>
                  </div>
                )}
                
                {emailRecipients && (
                  <div>
                    <h5 className="font-medium text-gray-900">Email Recipients</h5>
                    <p className="text-sm text-gray-600">{emailRecipients}</p>
                  </div>
                )}
              </div>
              
              {exportError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Export Failed</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">{exportError}</p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Download */}
          {currentStep === 4 && (
            <div className="text-center space-y-6">
              {isExporting ? (
                <div>
                  <Loader className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900">Generating Export...</h4>
                  <p className="text-gray-600">This may take a few moments depending on the report size.</p>
                </div>
              ) : exportComplete ? (
                <div>
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900">Export Complete!</h4>
                  <p className="text-gray-600 mb-6">Your report has been successfully generated.</p>
                  
                  <div className="space-y-3">
                    {downloadUrl && (
                      <button
                        onClick={() => window.open(downloadUrl, '_blank')}
                        className="flex items-center justify-center w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Download className="h-5 w-5 mr-2" />
                        Download Report
                      </button>
                    )}
                    
                    {emailRecipients && (
                      <p className="text-sm text-gray-600">
                        Report has also been sent to: {emailRecipients}
                      </p>
                    )}
                    
                    <button
                      onClick={handleClose}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {currentStep < 4 && !isExporting && (
          <div className="flex justify-between items-center p-6 border-t border-gray-200">
            <button
              onClick={currentStep === 1 ? handleClose : () => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </button>
            
            <button
              onClick={currentStep === 3 ? handleExport : () => setCurrentStep(currentStep + 1)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {currentStep === 3 ? 'Export Report' : 'Next'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportExportModal;
