import React, { useState } from 'react';
import {
  MessageCircle, Send, Heart, Reply, MoreVertical,
  ThumbsUp, Flag, Edit3, Trash2, Pin, Clock, User
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userRole: 'organization' | 'president' | 'ambassador';
  userAvatar?: string;
  content: string;
  timestamp: string;
  editedAt?: string;
  likes: number;
  replies: Comment[];
  isPinned?: boolean;
  parentId?: string;
  contextType: 'campaign' | 'task' | 'poll' | 'suggestion' | 'discussion';
  contextId: string;
}

interface UnifiedCommentsProps {
  contextType: 'campaign' | 'task' | 'poll' | 'suggestion' | 'discussion';
  contextId: string;
  contextTitle?: string;
  allowComments?: boolean;
  allowReplies?: boolean;
  showContextHeader?: boolean;
  maxDepth?: number;
}

const UnifiedComments: React.FC<UnifiedCommentsProps> = ({
  contextType,
  contextId,
  contextTitle,
  allowComments = true,
  allowReplies = true,
  showContextHeader = false,
  maxDepth = 3
}) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showDropdownId, setShowDropdownId] = useState<string | null>(null);

  // Mock data for demonstration
  React.useEffect(() => {
    const mockComments: Comment[] = [
      {
        id: 'comment-1',
        userId: 'user-1',
        userName: 'Sarah Johnson',
        userRole: 'president',
        content: 'Great initiative! I think this could have significant impact on our community engagement metrics.',
        timestamp: '2024-01-22T10:30:00Z',
        likes: 5,
        replies: [
          {
            id: 'comment-1-1',
            userId: 'user-2',
            userName: 'Mike Chen',
            userRole: 'ambassador',
            content: 'Absolutely agree! I\'ve seen similar campaigns work well in other regions.',
            timestamp: '2024-01-22T11:15:00Z',
            likes: 2,
            replies: [],
            parentId: 'comment-1',
            contextType,
            contextId
          }
        ],
        isPinned: true,
        contextType,
        contextId
      },
      {
        id: 'comment-2',
        userId: 'user-3',
        userName: 'Lisa Park',
        userRole: 'ambassador',
        content: 'I have some experience with this type of content. Happy to share some best practices if anyone is interested.',
        timestamp: '2024-01-22T09:45:00Z',
        likes: 8,
        replies: [],
        contextType,
        contextId
      },
      {
        id: 'comment-3',
        userId: 'user-4',
        userName: 'Admin Team',
        userRole: 'organization',
        content: 'Thanks for the feedback everyone. We\'ll incorporate these suggestions into the final guidelines.',
        timestamp: '2024-01-22T12:00:00Z',
        likes: 3,
        replies: [],
        contextType,
        contextId
      }
    ];
    setComments(mockComments);
  }, [contextType, contextId]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'organization':
        return 'bg-purple-100 text-purple-800';
      case 'president':
        return 'bg-yellow-100 text-yellow-800';
      case 'ambassador':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'organization':
        return 'Org';
      case 'president':
        return 'President';
      case 'ambassador':
        return 'Ambassador';
      default:
        return 'User';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      userId: user.id || 'current-user',
      userName: user.name || 'Current User',
      userRole: user.role || 'ambassador',
      content: newComment,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: [],
      contextType,
      contextId
    };

    if (replyToId) {
      // Add as reply
      const updatedComments = comments.map(c => {
        if (c.id === replyToId) {
          return { ...c, replies: [...c.replies, { ...comment, parentId: replyToId }] };
        }
        return c;
      });
      setComments(updatedComments);
      setReplyToId(null);
    } else {
      // Add as top-level comment
      setComments([comment, ...comments]);
    }

    setNewComment('');
  };

  const handleLike = (commentId: string) => {
    const updateCommentLikes = (commentList: Comment[]): Comment[] => {
      return commentList.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, likes: comment.likes + 1 };
        }
        if (comment.replies.length > 0) {
          return { ...comment, replies: updateCommentLikes(comment.replies) };
        }
        return comment;
      });
    };
    setComments(updateCommentLikes(comments));
  };

  const handleEdit = (commentId: string, newContent: string) => {
    const updateComment = (commentList: Comment[]): Comment[] => {
      return commentList.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, content: newContent, editedAt: new Date().toISOString() };
        }
        if (comment.replies.length > 0) {
          return { ...comment, replies: updateComment(comment.replies) };
        }
        return comment;
      });
    };
    setComments(updateComment(comments));
    setEditingId(null);
    setEditContent('');
  };

  const handleDelete = (commentId: string) => {
    const deleteComment = (commentList: Comment[]): Comment[] => {
      return commentList.filter(comment => {
        if (comment.id === commentId) return false;
        if (comment.replies.length > 0) {
          comment.replies = deleteComment(comment.replies);
        }
        return true;
      });
    };
    setComments(deleteComment(comments));
  };

  const canEditComment = (comment: Comment) => {
    return user && (user.id === comment.userId || user.role === 'organization');
  };

  const canDeleteComment = (comment: Comment) => {
    return user && (user.id === comment.userId || user.role === 'organization');
  };

  const renderComment = (comment: Comment, depth = 0) => {
    const isEditing = editingId === comment.id;
    const showDropdown = showDropdownId === comment.id;

    return (
      <div key={comment.id} className={`${depth > 0 ? 'ml-8 mt-3' : 'mb-4'} ${depth >= maxDepth ? 'ml-4' : ''}`}>
        <div className={`bg-white rounded-lg border border-gray-200 p-4 ${comment.isPinned ? 'ring-2 ring-yellow-200' : ''}`}>
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">{comment.userName}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(comment.userRole)}`}>
                  {getRoleLabel(comment.userRole)}
                </span>
                {comment.isPinned && (
                  <div className="flex items-center space-x-1 text-yellow-600">
                    <Pin className="h-3 w-3" />
                    <span className="text-xs">Pinned</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{formatTimeAgo(comment.timestamp)}</span>
                {comment.editedAt && <span className="text-xs">(edited)</span>}
              </span>
              {(canEditComment(comment) || canDeleteComment(comment)) && (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdownId(showDropdown ? null : comment.id)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      {canEditComment(comment) && (
                        <button
                          onClick={() => {
                            setEditingId(comment.id);
                            setEditContent(comment.content);
                            setShowDropdownId(null);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                        >
                          <Edit3 className="h-3 w-3" />
                          <span>Edit</span>
                        </button>
                      )}
                      {canDeleteComment(comment) && (
                        <button
                          onClick={() => {
                            handleDelete(comment.id);
                            setShowDropdownId(null);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="mb-3">
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={3}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(comment.id, editContent)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditContent('');
                    }}
                    className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-800">{comment.content}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleLike(comment.id)}
                className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors"
              >
                <ThumbsUp className="h-4 w-4" />
                <span className="text-sm">{comment.likes}</span>
              </button>
              
              {allowReplies && depth < maxDepth && (
                <button
                  onClick={() => setReplyToId(replyToId === comment.id ? null : comment.id)}
                  className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <Reply className="h-4 w-4" />
                  <span className="text-sm">Reply</span>
                </button>
              )}

              <button className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors">
                <Flag className="h-4 w-4" />
                <span className="text-sm">Report</span>
              </button>
            </div>
            
            {comment.replies.length > 0 && (
              <span className="text-sm text-gray-500">
                {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
              </span>
            )}
          </div>

          {/* Reply Form */}
          {replyToId === comment.id && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <form onSubmit={handleSubmitComment} className="space-y-2">
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={2}
                  placeholder="Write a reply..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Send className="h-3 w-3" />
                    <span>Reply</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReplyToId(null);
                      setNewComment('');
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Render replies */}
        {comment.replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {comment.replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (!allowComments) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Context Header */}
      {showContextHeader && contextTitle && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-900">Comments for {contextTitle}</span>
            <span className="text-sm text-gray-500">({comments.length} comments)</span>
          </div>
        </div>
      )}

      {/* New Comment Form */}
      {user && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <form onSubmit={handleSubmitComment} className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={3}
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Posting as <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role || 'ambassador')}`}>
                  {getRoleLabel(user.role || 'ambassador')}
                </span>
              </div>
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Comment</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No comments yet</h3>
            <p className="text-gray-600">Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => renderComment(comment))
        )}
      </div>
    </div>
  );
};

export default UnifiedComments;
