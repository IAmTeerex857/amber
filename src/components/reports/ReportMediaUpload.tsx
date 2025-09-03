import React, { useState, useRef, useCallback } from 'react';
import {
  Upload,
  X,
  Image,
  Video,
  FileText,
  File,
  Camera,
  AlertCircle,
  CheckCircle,
  Loader,
  Edit3,
  Eye,
  Download,
  Trash2,
  Plus
} from 'lucide-react';

export interface MediaFile {
  id: string;
  file: File;
  type: 'image' | 'video' | 'document';
  preview?: string;
  caption?: string;
  uploadProgress?: number;
  uploadStatus?: 'pending' | 'uploading' | 'completed' | 'error';
  size: number;
  name: string;
  url?: string; // For completed uploads
}

interface ReportMediaUploadProps {
  files: MediaFile[];
  onFilesChange: (files: MediaFile[]) => void;
  acceptedTypes?: string[];
  maxFileSize?: number; // in MB
  maxFiles?: number;
  category?: string;
  title?: string;
  description?: string;
  showCaptions?: boolean;
  multiple?: boolean;
}

const ReportMediaUpload: React.FC<ReportMediaUploadProps> = ({
  files,
  onFilesChange,
  acceptedTypes = ['image/*', 'video/*', '.pdf', '.doc', '.docx', '.txt'],
  maxFileSize = 50, // 50MB default
  maxFiles = 10,
  category = 'general',
  title = 'Upload Files',
  description = 'Drag and drop files here, or click to browse',
  showCaptions = true,
  multiple = true
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const [editingCaption, setEditingCaption] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileType = (file: File): 'image' | 'video' | 'document' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    return 'document';
  };

  const getFileIcon = (type: 'image' | 'video' | 'document') => {
    switch (type) {
      case 'image': return Image;
      case 'video': return Video;
      case 'document': return FileText;
      default: return File;
    }
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`;
    }

    // Check file type
    const isValidType = acceptedTypes.some(type => {
      if (type.includes('*')) {
        return file.type.startsWith(type.replace('*', ''));
      }
      return file.name.toLowerCase().endsWith(type.toLowerCase());
    });

    if (!isValidType) {
      return `File type not supported. Accepted types: ${acceptedTypes.join(', ')}`;
    }

    return null;
  };

  const createFilePreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        resolve(undefined);
      }
    });
  };

  const processFiles = async (fileList: FileList | File[]) => {
    const filesToProcess = Array.from(fileList);
    
    // Check file count limit
    if (files.length + filesToProcess.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const newFiles: MediaFile[] = [];

    for (const file of filesToProcess) {
      const validation = validateFile(file);
      if (validation) {
        alert(`${file.name}: ${validation}`);
        continue;
      }

      const preview = await createFilePreview(file);
      const mediaFile: MediaFile = {
        id: `${Date.now()}-${Math.random()}`,
        file,
        type: getFileType(file),
        preview,
        caption: '',
        uploadProgress: 0,
        uploadStatus: 'pending',
        size: file.size,
        name: file.name
      };

      newFiles.push(mediaFile);
    }

    // Simulate upload process
    const updatedFiles = [...files, ...newFiles];
    onFilesChange(updatedFiles);

    // Simulate upload for each new file
    newFiles.forEach((mediaFile, index) => {
      simulateUpload(mediaFile.id);
    });
  };

  const simulateUpload = async (fileId: string) => {
    // Update status to uploading
    onFilesChange(prev => prev.map(file => 
      file.id === fileId 
        ? { ...file, uploadStatus: 'uploading' as const, uploadProgress: 0 }
        : file
    ));

    // Simulate progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      onFilesChange(prev => prev.map(file => 
        file.id === fileId 
          ? { ...file, uploadProgress: progress }
          : file
      ));
    }

    // Complete upload
    onFilesChange(prev => prev.map(file => 
      file.id === fileId 
        ? { 
            ...file, 
            uploadStatus: 'completed' as const, 
            uploadProgress: 100,
            url: `https://example.com/uploads/${file.name}` // Mock URL
          }
        : file
    ));
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      processFiles(droppedFiles);
    }
  }, [files, maxFiles, processFiles]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      processFiles(selectedFiles);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileId: string) => {
    onFilesChange(files.filter(file => file.id !== fileId));
  };

  const updateCaption = (fileId: string, caption: string) => {
    onFilesChange(files.map(file => 
      file.id === fileId ? { ...file, caption } : file
    ));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <Upload className={`h-12 w-12 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="text-gray-600 mt-1">{description}</p>
          </div>
          <div className="text-sm text-gray-500">
            <p>Supported formats: Images, Videos, PDFs, Documents</p>
            <p>Maximum file size: {maxFileSize}MB</p>
            <p>Maximum files: {maxFiles}</p>
          </div>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Choose Files
          </button>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">
            Uploaded Files ({files.length}/{maxFiles})
          </h4>
          
          <div className="grid grid-cols-1 gap-4">
            {files.map((file) => {
              const FileIcon = getFileIcon(file.type);
              
              return (
                <div key={file.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    {/* File Preview/Icon */}
                    <div className="flex-shrink-0">
                      {file.preview ? (
                        <div className="relative">
                          <img
                            src={file.preview}
                            alt={file.name}
                            className="h-16 w-16 object-cover rounded-lg cursor-pointer"
                            onClick={() => setShowPreview(file.preview!)}
                          />
                          <button
                            onClick={() => setShowPreview(file.preview!)}
                            className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 rounded-lg flex items-center justify-center transition-all"
                          >
                            <Eye className="h-5 w-5 text-white opacity-0 hover:opacity-100" />
                          </button>
                        </div>
                      ) : (
                        <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FileIcon className="h-8 w-8 text-gray-500" />
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(file.size)} • {file.type}
                          </p>
                        </div>
                        
                        {/* Status */}
                        <div className="flex items-center space-x-2">
                          {file.uploadStatus === 'uploading' && (
                            <div className="flex items-center space-x-2">
                              <Loader className="h-4 w-4 animate-spin text-blue-500" />
                              <span className="text-sm text-blue-600">{file.uploadProgress}%</span>
                            </div>
                          )}
                          {file.uploadStatus === 'completed' && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                          {file.uploadStatus === 'error' && (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </div>

                      {/* Upload Progress */}
                      {file.uploadStatus === 'uploading' && (
                        <div className="mt-2">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${file.uploadProgress || 0}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Caption */}
                      {showCaptions && file.uploadStatus === 'completed' && (
                        <div className="mt-3">
                          {editingCaption === file.id ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={file.caption || ''}
                                onChange={(e) => updateCaption(file.id, e.target.value)}
                                className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Add a caption..."
                                onBlur={() => setEditingCaption(null)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    setEditingCaption(null);
                                  }
                                }}
                                autoFocus
                              />
                              <button
                                onClick={() => setEditingCaption(null)}
                                className="text-green-600 hover:text-green-800"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-600 italic">
                                {file.caption || 'No caption'}
                              </p>
                              <button
                                onClick={() => setEditingCaption(file.id)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {file.url && (
                        <button
                          onClick={() => window.open(file.url, '_blank')}
                          className="p-2 text-gray-400 hover:text-blue-600"
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                        title="Remove file"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowPreview(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="h-8 w-8" />
            </button>
            <img
              src={showPreview}
              alt="Preview"
              className="max-w-full max-h-screen object-contain"
            />
          </div>
        </div>
      )}

      {/* Upload Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <h4 className="font-medium text-blue-800 mb-1">Upload Tips</h4>
            <ul className="text-blue-700 space-y-1">
              <li>• For events: Include photos of attendees, venue, and activities</li>
              <li>• For expenses: Upload clear receipt images or PDFs</li>
              <li>• For content: Include screenshots of your posts and engagement metrics</li>
              <li>• Add descriptive captions to help reviewers understand the context</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportMediaUpload;
