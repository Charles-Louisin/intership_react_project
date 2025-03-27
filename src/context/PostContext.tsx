import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  image: string;
  username: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  user?: User;
  views?: number;
}

interface Comment {
  id: number;
  body: string;
  postId: number;
  user: User;
  createdAt: string;
}

interface PostContextType {
  posts: Post[];
  comments: Comment[];
  addComment: (postId: number, comment: string) => Promise<void>;
  loading: boolean;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllPages = async (endpoint: string, limit: number, total: number) => {
    const requests = [];
    for (let skip = 0; skip < total; skip += limit) {
      requests.push(fetch(`https://dummyjson.com/${endpoint}?limit=${limit}&skip=${skip}`));
    }
    const responses = await Promise.all(requests);
    const jsonData = await Promise.all(responses.map(r => r.json()));
    return jsonData.reduce((acc, curr) => [...acc, ...curr[endpoint]], []);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Récupérer les données en cache si elles existent
        const cachedData = localStorage.getItem('postsData');
        if (cachedData) {
          const { posts, comments, users } = JSON.parse(cachedData);
          setPosts(posts);
          setComments(comments);
          setUsers(users);
          setLoading(false);
          return;
        }

        // Récupérer toutes les données en parallèle
        const [allUsers, allPosts, allComments] = await Promise.all([
          fetchAllPages('users', 100, 208),  // 208 utilisateurs total
          fetchAllPages('posts', 100, 251),  // 251 posts total
          fetchAllPages('comments', 100, 340) // 340 commentaires total
        ]);

        // Créer un Map des utilisateurs pour un accès plus rapide
        const usersMap = new Map(allUsers.map((user: any) => [user.id, user]));

        // Associer les utilisateurs aux posts
        const postsWithUsers = allPosts.map((post: any) => ({
          ...post,
          user: usersMap.get(post.userId),
          views: Math.floor(Math.random() * 1000) // Simuler des vues
        }));

        // Associer les utilisateurs aux commentaires
        const commentsWithUsers = allComments.map((comment: any) => ({
          ...comment,
          user: usersMap.get(comment.user.id) || comment.user,
          createdAt: comment.createdAt || new Date().toISOString()
        }));

        // Sauvegarder dans le localStorage
        localStorage.setItem('postsData', JSON.stringify({
          posts: postsWithUsers,
          comments: commentsWithUsers,
          users: allUsers
        }));

        // Simuler un utilisateur connecté (à remplacer par votre système d'auth)
        localStorage.setItem('currentUser', JSON.stringify(allUsers[0]));

        setPosts(postsWithUsers);
        setComments(commentsWithUsers);
        setUsers(allUsers);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Erreur lors du chargement des données');
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const addComment = async (postId: number, body: string) => {
    // Récupérer l'utilisateur connecté du localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    const newComment: Comment = {
      id: Date.now(),
      body,
      postId,
      user: currentUser,
      createdAt: new Date().toISOString()
    };

    setComments(prev => {
      const updated = [newComment, ...prev]; // Ajouter le nouveau commentaire au début
      const cachedData = JSON.parse(localStorage.getItem('postsData') || '{}');
      localStorage.setItem('postsData', JSON.stringify({
        ...cachedData,
        comments: updated
      }));
      return updated;
    });

    toast.success("Commentaire ajouté avec succès!");
  };

  return (
    <PostContext.Provider value={{ posts, comments, addComment, loading }}>
      {children}
    </PostContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostContext);
  if (!context) throw new Error('usePosts must be used within a PostProvider');
  return context;
}
