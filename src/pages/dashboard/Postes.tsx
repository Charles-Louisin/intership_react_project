import { useState, useEffect } from 'react';
import { usePosts } from '../../context/PostContext';
import { Send, MessageSquare, Heart, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Postes = () => {
  const { posts, comments, addComment, loading} = usePosts();
  const [newComment, setNewComment] = useState('');
  const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({});
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setCurrentUser(user);
  }, []);

  useEffect(() => {
      const handleProfileUpdate = (event: CustomEvent) => {
        const updatedUser = event.detail;
        setCurrentUser(updatedUser);
      };
  
      window.addEventListener('profileUpdate', handleProfileUpdate as EventListener);
  
      return () => {
        window.removeEventListener('profileUpdate', handleProfileUpdate as EventListener);
      };
    }, []);

  const toggleComments = (postId: number) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleAddComment = async (postId: number) => {
    if (!newComment.trim()) return;
    try {
      await addComment(postId, newComment);
      setNewComment('');
      toast.success('Commentaire ajouté');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du commentaire');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-4 h-4 bg-orange-500 rounded-full"
              animate={{
                y: [0, -10, 0],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
        <p className="mt-4 text-gray-600">Chargement des publications...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Publications récentes</h1>

      <div className="space-y-6">
        {posts.map((post) => {
          const postComments = comments
            .filter(c => c.postId === post.id)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Post principal */}
              <div className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <img
                      src={post.user?.image || '/default-avatar.png'}
                      alt="User"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {post.user?.firstName || 'Anonyme'} {post.user?.lastName || ''}
                      </h3>
                      {post.user?.isVerified && (
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">@{post.user?.username || 'anonymous'}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <h2 className="text-lg font-semibold text-gray-900">{post.title}</h2>
                  <p className="text-gray-700 whitespace-pre-line">{post.body}</p>
                </div>

                {post.tags?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex space-x-4">
                    <button
                      className="flex items-center space-x-1 text-gray-500 hover:text-orange-500"
                    >
                      <ThumbsUp className="h-5 w-5" />
                      <span className="text-sm">{post.reactions.likes || 0}</span>
                    </button>
                    <button
                      className="flex items-center space-x-1 text-gray-500 hover:text-orange-500"
                    >
                      <ThumbsDown className="h-5 w-5" />
                      <span className="text-sm">{post.reactions.dislikes || 0}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center text-sm text-orange-600 hover:text-orange-700"
                  >
                    <MessageSquare className="h-5 w-5 mr-1" />
                    {postComments.length} commentaire{postComments.length !== 1 ? 's' : ''}
                    {expandedComments[post.id] ? (
                      <ChevronUp className="h-4 w-4 ml-1" />
                    ) : (
                      <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </button>
                </div>
              </div>

              {/* Section des commentaires */}
              <AnimatePresence>
                {expandedComments[post.id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-50 border-t border-gray-100"
                  >
                    <div className="p-6">
                      {/* Formulaire d'ajout de commentaire */}
                      <div className="mb-6">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <div className="relative h-10 w-10">
                              <img
                                src={currentUser?.image || '/default-avatar.png'}
                                alt={`${currentUser?.firstName || 'User'}'s avatar`}
                                className="h-full w-full rounded-full object-cover border-2 border-white shadow-sm"
                              />
                              {currentUser?.isVerified && (
                                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex-1 ">
                            <div className="relative">
                              <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Partagez votre pensée..."
                                rows={1}
                                className="w-full px-4 py-3 text-sm text-gray-800 bg-gray-50 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all duration-200 resize-none"
                              />

                              {newComment && (
                                <button
                                  onClick={() => setNewComment('')}
                                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              )}
                            </div>

                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-2 text-gray-400">
                                <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                  </svg>
                                </button>
                                <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </button>
                              </div>

                              <button
                                onClick={() => handleAddComment(post.id)}
                                disabled={!newComment.trim()}
                                className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center space-x-2 transition-all duration-200 ${newComment.trim()
                                    ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-md'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  }`}
                              >
                                <Send className="h-4 w-4" />
                                <span>Publier</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Liste des commentaires */}
                      <div className="space-y-3">
                        {postComments.length > 0 ? (
                          postComments.map((comment) => (
                            <motion.div
                              key={comment.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex gap-2.5 group"
                            >
                              {/* Avatar avec badge de vérification */}
                              <div className="relative flex-shrink-0 mt-0.5">
                                <img
                                  src={comment.user.image || '/default-avatar.png'}
                                  alt={`${comment.user.firstName}'s avatar`}
                                  className="h-7 w-7 rounded-full object-cover border border-gray-100"
                                />
                                {comment.user.isVerified && (
                                  <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5">
                                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                                    </svg>
                                  </div>
                                )}
                              </div>
                      
                              {/* Contenu du commentaire */}
                              <div className="flex-1 min-w-0">
                                <div className="inline-block bg-gray-50 rounded-xl px-3 py-2 group-hover:bg-gray-100 transition-colors">
                                  {/* En-tête compacte */}
                                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
                                    <span className="text-xs font-medium text-gray-900">
                                      {comment.user.firstName} {comment.user.lastName}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      @{comment.user.username}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                      
                                  {/* Texte du commentaire */}
                                  <p className="mt-1 text-sm text-gray-800 leading-snug">
                                    {comment.body}
                                  </p>
                                </div>
                      
                                {/* Actions (like, reply) - apparaissent au survol */}
                                <div className="mt-1 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button className="text-xs text-gray-500 hover:text-orange-500 flex items-center gap-1">
                                    <Heart className="h-3 w-3" />
                                    <span>Like</span>
                                  </button>
                                  <button className="text-xs text-gray-500 hover:text-orange-500 flex items-center gap-1">
                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                                    </svg>
                                    <span>Répondre</span>
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-3 text-sm text-gray-400">
                            <p>Soyez le premier à commenter</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Postes;