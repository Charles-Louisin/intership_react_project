import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useProducts } from '../../hooks/useProducts';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/ProductCard/card';
import { Badge } from '../../components/ui/ProductCard/badge';
import { Progress } from '../../components/ui/ProductCard/progress';
import { Button } from '../../components/ui/ProductCard/button';
import { useExpandable } from '../../hooks/use-expandable';
import { Product } from '../../types/product';
import { Input } from '../../components/ui/ProductCard/input';
import { useSearchParams } from 'react-router-dom';
import ProductDetails from '../../components/products/ProductDetails';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Check } from 'lucide-react';

const ProductCard = ({ product }: { product: any }) => {
  const { isExpanded, toggleExpand, animatedHeight, contentRef } = useExpandable();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart, isInCart } = useCart();

  // Calcul du pourcentage du stock (en supposant un stock maximum de 150)
  const stockPercentage = Math.min((product.stock / 150) * 100, 100);
  // Calcul du pourcentage du rating
  const ratingPercentage = (product.rating / 5) * 100;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    // toast.success('Produit ajouté au panier');
  };

  return (
    <Card
      className={`transition-all duration-300 cursor-pointer relative
        ${isExpanded ?
          'shadow-2xl z-50 bg-white absolute top-0 left-0 right-0 max-h-none' :
          'hover:shadow-lg h-full max-h-[500px] md:max-h-[550px]'
        }`}
      onClick={toggleExpand}
    >
      <CardHeader className="p-3 md:p-4">
        <div className="aspect-[4/3] w-full overflow-hidden rounded-lg">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex justify-between items-start mt-4">
          <div>
            <CardTitle className="text-xl">{product.title}</CardTitle>
            <p className="text-sm text-gray-500">{product.brand}</p>
          </div>
          <Badge variant="secondary" className="bg-orange-100 text-orange-600">
            {product.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-3 md:p-4">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-lg font-bold">${product.price}</p>
              {product.discountPercentage > 0 && (
                <p className="text-sm text-green-600">-{product.discountPercentage}%</p>
              )}
            </div>
          </div>



          <motion.div
            style={{ height: animatedHeight }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div ref={contentRef} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Stock</p>
                  <div className="w-full">
                    <Progress
                      value={stockPercentage}
                      className="h-2 bg-gray-200"
                      indicatorClassName="bg-orange-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">{product.stock} unités</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Rating</p>
                  <div className="w-full">
                    <Progress
                      value={ratingPercentage}
                      className="h-2 bg-gray-200"
                      indicatorClassName="bg-yellow-400"
                    />
                    <p className="text-xs text-gray-500 mt-1">{product.rating.toFixed(1)}/5</p>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p>SKU: {product.sku}</p>
                <p>Stock: {product.availabilityStatus}</p>
                {product.tags && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {product.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {selectedProduct && (
                <ProductDetails
                  product={selectedProduct}
                  isOpen={isModalOpen}
                  onClose={() => {
                    setIsModalOpen(false);
                    setSelectedProduct(null);
                  }}
                />
              )}

              {/* Bouton "Plus de détails" uniquement visible quand la carte est étendue */}
              {isExpanded && (
                <>
                  {/* Boutons d'action */}
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddToCart}
                      disabled={isInCart(product.id)}
                      className={`w-full flex items-center justify-center gap-2 ${isInCart(product.id)
                          ? 'bg-green-500 cursor-not-allowed'
                          : 'bg-orange-500 hover:bg-orange-600'
                        } text-white`}
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
                    </Button>
                  </div>
                  <div className="flex justify-center mt-4">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                        setIsModalOpen(true);
                      }}
                      variant="outline"
                      className="w-full bg-orange-500 text-white hover:bg-orange-600"
                    >
                      Plus de détails
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

const ITEMS_PER_PAGE = 30;

const Produits = () => {
  const { data, isLoading, error } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Garder les paramètres existants lors de la mise à jour
  const updateSearchParams = (newParams: Record<string, string>) => {
    const current = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...current, ...newParams });
  };

  // Utiliser la page depuis l'URL ou défaut à 1
  const currentPage = Number(searchParams.get('page') || '1');

  // Extraire toutes les catégories uniques
  const categories = useMemo(() => {
    if (!data?.products) return [];
    return Array.from(new Set(data.products.map(product => product.category)));
  }, [data]);

  // Filtrer les produits
  const filteredProducts = useMemo(() => {
    if (!data?.products) return [];

    return data.products.filter(product => {
      const matchesSearch = searchTerm === '' ||
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'all' ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [data, searchTerm, selectedCategory]);

  // Calculer la pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, currentPage]);

  // Fonction de changement de page modifiée
  const handlePageChange = (newPage: number) => {
    updateSearchParams({ page: newPage.toString() });
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Reset la page quand les filtres changent
  useEffect(() => {
    updateSearchParams({
      page: '1',
      search: searchTerm,
      category: selectedCategory
    });
  }, [searchTerm, selectedCategory]);

  // Synchroniser les filtres avec l'URL au chargement
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlCategory = searchParams.get('category') || 'all';

    setSearchTerm(urlSearch);
    setSelectedCategory(urlCategory);
  }, []);

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Une erreur est survenue</div>;

  return (
    <div className="container mx-auto p-4 max-w-[1400px]">
      <h1 className="text-2xl font-bold mb-6">Nos Produits</h1>

      {/* Barre de recherche et filtres */}
      <div className="mb-6 w-full md:w-[80%] lg:w-[60%] mx-auto space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
        <div className="relative flex-grow">
          <Input
            type="search"
            placeholder="Rechercher un produit..."
            className="w-[95%] md:w-full mx-auto pl-10 pr-4 py-2.5 border-2 rounded-xl 
            focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <select
          className="w-[95%] md:w-[200px] mx-auto px-4 py-2.5 border-2 rounded-xl 
          focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">Toutes les catégories</option>
          {categories?.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Grille des produits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {paginatedProducts.map((product) => (
          <div className="w-[100%] md:w-full mx-auto relative" key={product.id}>
            <div style={{ minHeight: '480px' }}>
              <ProductCard product={product} />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Précédent
          </Button>
          <span className="text-gray-600">
            Page {currentPage} sur {totalPages}
          </span>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Suivant
          </Button>
        </div>
      )}

      {/* Message si aucun résultat */}
      {filteredProducts.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          Aucun produit ne correspond à votre recherche
        </div>
      )}
    </div>
  );
};

export default Produits;