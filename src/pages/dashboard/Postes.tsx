import React, { useState } from 'react';
import { XCard } from '../../components/ui/PostCard/x-gradient-card';
import { usePosts } from '../../context/PostContext';
import { Send } from 'lucide-react';

const Postes = () => {
  const { posts, comments, addComment, loading } = usePosts();
  const [newComment, setNewComment] = useState('');
  const [selectedPost, setSelectedPost] = useState<number | null>(null);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  const handleAddComment = async (postId: number) => {
    if (!newComment.trim()) return;
    await addComment(postId, newComment);
    setNewComment('');
    setSelectedPost(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Publications</h1>
      
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => {
          const postComments = comments
            .filter(c => c.postId === post.id)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          
          return (
            <div key={post.id} className="flex flex-col w-full bg-white rounded-xl shadow-lg p-4">
              {/* Post principal */}
              <div className="mb-4">
                <XCard
                  authorName={`${post.user?.firstName ?? 'Anonymous'} ${post.user?.lastName ?? ''}`}
                  authorHandle={post.user?.username ?? 'unknown'}
                  authorImage={post.user?.image ?? ''}
                  content={[post.title, post.body]}
                  isVerified={true}
                  timestamp={new Date().toLocaleDateString()}
                  tags={post.tags}
                  reactions={post.reactions}
                  views={post.views}
                  showLogo={false}
                  hideFooter={true}
                />
              </div>

              {/* Section des commentaires */}
              <div className="mt-4 border-t border-gray-200 pt-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">
                  {postComments.length} Commentaire{postComments.length !== 1 ? 's' : ''}
                </h3>
                
                {/* Formulaire d'ajout de commentaire */}
                {selectedPost === post.id ? (
                  <div className="mb-4 flex gap-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Ajouter un commentaire..."
                      className="flex-1 px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedPost(post.id)}
                    className="mb-4 text-orange-500 hover:text-orange-600 text-sm flex items-center gap-2"
                  >
                    <span>Ajouter un commentaire</span>
                  </button>
                )}

                {/* Liste des commentaires */}
                <div className="space-y-3 pl-4 border-l-2 border-gray-100">
                  {postComments.map((comment) => (
                    <div key={comment.id} className="relative">
                      <div className="absolute -left-[21px] top-3 w-4 h-4 bg-orange-100 border-2 border-orange-500 rounded-full"></div>
                      <XCard
                        authorName={`${comment.user.firstName} ${comment.user.lastName}`}
                        authorHandle={comment.user.username}
                        authorImage={comment.user.image}
                        content={[comment.body]}
                        isVerified={false}
                        timestamp={new Date(comment.createdAt).toLocaleString()}
                        className="scale-95 origin-left"
                        showLogo={false}
                        hideFooter={true}
                        hideReactions={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Postes;