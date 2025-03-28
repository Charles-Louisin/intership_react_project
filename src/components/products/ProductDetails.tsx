import React, { useState, useEffect } from 'react';
import { Product, ProductReview } from '../../types/product';
import Modal from '../ui/modal/Modal';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getStoredReviews, saveReview } from '../../services/reviewService';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface ProductDetailsProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, isOpen, onClose }) => {
  const [mainImage, setMainImage] = useState(product.thumbnail);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [localReviews, setLocalReviews] = useState(() => getStoredReviews(product.id));
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allReviews, setAllReviews] = useState<ProductReview[]>([]);
  const { addToCart, isInCart } = useCart();


   const [setCurrentUser] = useState<any>(null);
  
    useEffect(() => {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      setCurrentUser(user);
    }, []);

  useEffect(() => {
    // Combine API reviews with local reviews
    const storedReviews = getStoredReviews(product.id);
    const combinedReviews = [...storedReviews, ...product.reviews];
    
    // Sort by date (most recent first)
    const sortedReviews = combinedReviews.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    setAllReviews(sortedReviews);
  }, [product.id, product.reviews, localReviews]);

  useEffect(() => {
        const handleProfileUpdate = (event: CustomEvent) => {
          const updatedUser = event.detail;
          setCurrentUser(updatedUser);
          // Mettre à jour l'état local avec la nouvelle photo
          // Par exemple : setUserImage(updatedUser.image)
        };
    
        window.addEventListener('profileUpdate', handleProfileUpdate as EventListener);
    
        return () => {
          window.removeEventListener('profileUpdate', handleProfileUpdate as EventListener);
        };
      }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const newReview: ProductReview = {
        id: Date.now(),
        userId: user?.id || 0,
        productId: product.id,
        rating,
        comment,
        date: new Date().toISOString().split('T')[0],
        reviewerName: user ? `${user.firstName} ${user.lastName}` || 'Anonyme' : 'Anonyme',
        reviewerEmail: user?.email || '',
        createdAt: new Date().toISOString()
      };

      // Simuler un délai d'envoi
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedReviews = saveReview(product.id, newReview, localReviews);
      setLocalReviews(updatedReviews);
      setAllReviews([newReview, ...allReviews]);
      setComment('');
      setRating(5);
      toast.success('Votre commentaire a été publié avec succès !');
    } catch (error) {
      toast.error('Erreur lors de la publication du commentaire');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 space-y-8 max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col md:flex-row gap-8 bg-white rounded-xl">
          {/* Image Gallery */}
          <div className="w-full md:w-1/2">
            <img
              src={mainImage}
              alt={product.title}
              className="w-full h-[400px] object-cover rounded-xl shadow-sm"
            />
            <div className="grid grid-cols-4 gap-3 mt-4">
              {product.images.slice(0, 4).map((image: string, index: number) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.title} - ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg shadow-sm hover:opacity-80 transition-opacity cursor-pointer"
                  onClick={() => setMainImage(image)}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2 space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{product.title}</h2>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-xl">
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Prix</p>
                <p className="text-2xl font-bold text-green-600">${product.price}</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Réduction</p>
                <p className="text-2xl font-bold text-red-500">{product.discountPercentage}%</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Note</p>
                <p className="text-2xl font-bold text-yellow-500">{product.rating}/5</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Stock</p>
                <p className="text-2xl font-bold text-blue-600">{product.stock}</p>
              </div>
            </div>

            <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 min-w-[100px]">Marque:</span>
                <span className="font-medium">{product.brand}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 min-w-[100px]">Catégorie:</span>
                <span className="font-medium">{product.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 min-w-[100px]">SKU:</span>
                <span className="font-medium">{product.sku}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Dimensions</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Largeur</p>
                <p className="font-medium">{product.dimensions.width}cm</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Hauteur</p>
                <p className="font-medium">{product.dimensions.height}cm</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Profondeur</p>
                <p className="font-medium">{product.dimensions.depth}cm</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Informations</h3>
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Garantie</p>
                <p className="font-medium">{product.warrantyInformation}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Livraison</p>
                <p className="font-medium">{product.shippingInformation}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="flex justify-center">
          <button
            onClick={() => addToCart(product)}
            disabled={isInCart(product.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white transition-colors ${
              isInCart(product.id) 
                ? 'bg-green-500 cursor-not-allowed' 
                : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            {isInCart(product.id) ? (
              <>
                <Check className="h-5 w-5" />
                Déjà ajouté
              </>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5" />
                Ajouter au panier
              </>
            )}
          </button>
        </div>

        {/* Reviews Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
            Avis clients ({allReviews.length})
          </h3>
          <div className="space-y-4">
            {allReviews.map((review, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium text-gray-800">{review.reviewerName}</p>
                  <p className="text-sm text-gray-500">{review.date}</p>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-yellow-400">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </div>
                  <span className="text-sm text-gray-600">({review.rating}/5)</span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>

          {/* Add Review Form */}
          {user && (
            <form onSubmit={handleSubmitReview} className="mt-8 border-t pt-6">
              <h4 className="text-lg font-semibold mb-4">Ajouter un avis</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-2xl ${
                          star <= rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Votre commentaire
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    required
                    placeholder="Partagez votre expérience avec ce produit..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Publication en cours...
                    </>
                  ) : (
                    'Publier mon avis'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ProductDetails;
