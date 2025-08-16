import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Link, 
  Image, 
  Video, 
  FileText, 
  Check, 
  X, 
  Clock, 
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Hash,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Calendar,
  Coins
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  type: 'social_post' | 'video_content' | 'blog_post' | 'referral' | 'event';
  platform: string;
  deadline: string;
  reward: number;
  requirements: string[];
  status: 'pending' | 'in_progress' | 'submitted' | 'approved' | 'rejected';
}

interface Submission {
  taskId: string;
  contentUrl?: string;
  mediaFiles: File[];
  description: string;
  hashtags: string[];
  metrics?: {
    likes?: number;
    comments?: number;
    shares?: number;
    views?: number;
  };
  submittedAt?: Date;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
}

interface UrlPreview {
  title: string;
  description: string;
  image: string;
  platform: string;
}

const ContentSubmission: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [submission, setSubmission] = useState<Submission>({
    taskId: '',
    mediaFiles: [],
    description: '',
    hashtags: [],
    status: 'draft'
  });
  const [dragActive, setDragActive] = useState(false);
  const [urlPreview, setUrlPreview] = useState<UrlPreview | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock tasks data
  const availableTasks: Task[] = [
    {
      id: '1',
      title: 'Create Instagram Reel about our new feature',
      description: 'Create an engaging Instagram Reel showcasing our new budgeting feature. Show how easy it is to set up and track expenses.',
      type: 'social_post',
      platform: 'Instagram',
      deadline: '2024-01-15',
      reward: 50,
      requirements: [
        'Must be 15-30 seconds long',
        'Include #BudgetSmart hashtag',
        'Show actual app usage',
        'Tag @ourcompany'
      ],
      status: 'in_progress'
    },
    {
      id: '2',
      title: 'Write LinkedIn article about financial literacy',
      description: 'Write a 500-word article about the importance of financial literacy for young professionals.',
      type: 'blog_post',
      platform: 'LinkedIn',
      deadline: '2024-01-20',
      reward: 75,
      requirements: [
        'Minimum 500 words',
        'Include personal experience',
        'Mention our platform naturally',
        'Use professional tone'
      ],
      status: 'pending'
    },
    {
      id: '3',
      title: 'TikTok unboxing video',
      description: 'Create an unboxing video of our welcome package and share your first impressions.',
      type: 'video_content',
      platform: 'TikTok',
      deadline: '2024-01-18',
      reward: 40,
      requirements: [
        'Show unboxing process',
        'Share genuine reactions',
        'Use trending audio',
        'Include #Unboxing hashtag'
      ],
      status: 'pending'
    }
  ];

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
    setSubmission({
      taskId: task.id,
      mediaFiles: [],
      description: '',
      hashtags: [],
      status: 'draft'
    });
  };

  const handleUrlChange = (url: string) => {
    setSubmission(prev => ({ ...prev, contentUrl: url }));
    
    // Simulate URL preview generation
    if (url && (url.includes('instagram.com') || url.includes('tiktok.com') || url.includes('linkedin.com'))) {
      setTimeout(() => {
        setUrlPreview({
          title: 'Sample Content Title',
          description: 'This is a preview of the content...',
          image: '/api/placeholder/300/200',
          platform: url.includes('instagram') ? 'Instagram' : url.includes('tiktok') ? 'TikTok' : 'LinkedIn'
        });
      }, 1000);
    } else {
      setUrlPreview(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isDocument = file.type === 'application/pdf' || file.type.startsWith('text/');
      return isImage || isVideo || isDocument;
    });

    setSubmission(prev => ({
      ...prev,
      mediaFiles: [...prev.mediaFiles, ...validFiles]
    }));
  };

  const removeFile = (index: number) => {
    setSubmission(prev => ({
      ...prev,
      mediaFiles: prev.mediaFiles.filter((_, i) => i !== index)
    }));
  };

  const handleHashtagInput = (value: string) => {
    const hashtags = value.split(' ').filter(tag => tag.startsWith('#')).map(tag => tag.replace('#', ''));
    setSubmission(prev => ({ ...prev, hashtags }));
  };

  const handleSubmit = async () => {
    if (!selectedTask) return;
    
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setSubmission(prev => ({
        ...prev,
        status: 'submitted',
        submittedAt: new Date()
      }));
      setIsSubmitting(false);
      
      // Show success message
      alert('Submission successful! Your content is now under review.');
    }, 2000);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (file.type.startsWith('video/')) return <Video className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return <Instagram className="w-5 h-5" />;
      case 'tiktok': return <Video className="w-5 h-5" />;
      case 'linkedin': return <Linkedin className="w-5 h-5" />;
      case 'twitter': return <Twitter className="w-5 h-5" />;
      case 'youtube': return <Youtube className="w-5 h-5" />;
      default: return <Link className="w-5 h-5" />;
    }
  };

  if (!selectedTask) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Content</h1>
          <p className="text-gray-600">Choose a task to submit your content for review</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => handleTaskSelect(task)}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getPlatformIcon(task.platform)}
                  <span className="text-sm font-medium text-gray-600">{task.platform}</span>
                </div>
                <div className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    task.status === 'submitted' ? 'bg-purple-100 text-purple-800' :
                    task.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }
                `}>
                  {task.status.replace('_', ' ')}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    Due {new Date(task.deadline).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-green-600 font-medium">
                    <Coins className="w-4 h-4 mr-1" />
                    {task.reward} points
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-700">Requirements:</div>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {task.requirements.slice(0, 2).map((req, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-3 h-3 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                    {task.requirements.length > 2 && (
                      <li className="text-gray-400">+{task.requirements.length - 2} more...</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => setSelectedTask(null)}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          ← Back to Tasks
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Content</h1>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            {getPlatformIcon(selectedTask.platform)}
            <span className="ml-1">{selectedTask.platform}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            Due {new Date(selectedTask.deadline).toLocaleDateString()}
          </div>
          <div className="flex items-center text-green-600">
            <Coins className="w-4 h-4 mr-1" />
            {selectedTask.reward} points
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Task Details */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{selectedTask.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{selectedTask.description}</p>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements:</h4>
                <ul className="space-y-2">
                  {selectedTask.requirements.map((req, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Reward:</span>
                  <span className="font-medium text-green-600">{selectedTask.reward} points</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submission Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="space-y-6">
              {/* Content URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content URL *
                </label>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="url"
                    value={submission.contentUrl || ''}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://instagram.com/p/your-post..."
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Paste the URL of your published content (Instagram post, TikTok video, LinkedIn article, etc.)
                </p>
                
                {/* URL Preview */}
                {urlPreview && (
                  <div className="mt-4 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <img 
                        src={urlPreview.image} 
                        alt="Content preview"
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{urlPreview.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{urlPreview.description}</p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          {getPlatformIcon(urlPreview.platform)}
                          <span className="ml-1">{urlPreview.platform}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Media Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Files (Optional)
                </label>
                <div
                  className={`
                    border-2 border-dashed rounded-lg p-6 text-center transition-colors
                    ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                  `}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drag and drop files here, or{' '}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-xs text-gray-500">
                    Support for images, videos, and documents (PDF, TXT)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*,.pdf,.txt"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </div>

                {/* File List */}
                {submission.mediaFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {submission.mediaFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(file)}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={submission.description}
                  onChange={(e) => setSubmission(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your content, approach, and how it meets the task requirements..."
                />
              </div>

              {/* Hashtags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hashtags Used
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    onChange={(e) => handleHashtagInput(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="#BudgetSmart #FinTech #StudentLife"
                  />
                </div>
                {submission.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {submission.hashtags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Metrics (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Performance Metrics (Optional)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Likes</label>
                    <div className="relative">
                      <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Comments</label>
                    <div className="relative">
                      <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Shares</label>
                    <div className="relative">
                      <Share2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Views</label>
                    <div className="relative">
                      <Eye className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Add current metrics to help us track performance (you can update these later)
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={handleSubmit}
                  disabled={!submission.contentUrl || !submission.description || isSubmitting}
                  className={`
                    w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all
                    ${(!submission.contentUrl || !submission.description || isSubmitting)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    }
                  `}
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Submit for Review
                    </>
                  )}
                </button>
                
                {submission.status === 'submitted' && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Submission Successful!</p>
                        <p className="text-xs text-green-600 mt-1">
                          Your content is now under review. You'll be notified once it's approved.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentSubmission;
