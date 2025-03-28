import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useProducts } from '../../hooks/useProducts';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/ProductCard/card';
import { Badge } from '../../components/ui/ProductCard/badge';
import { Progress } from '../../components/ui/ProductCard/progress';
import { Button } from '../../components/ui/ProductCard/button';
import { useExpandable } from '../../hooks/use-expandable';
import { Input } from '../../components/ui/ProductCard/input';
import { useSearchParams } from 'react-router-dom';
import ProductDetails from '../../components/products/ProductDetails';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Check, Search } from 'lucide-react';
import { Product, ProductsResponse } from '../../types';

// Fix category mapping
const getCategories = (data: ProductsResponse): string[] => {
  return ['all', ...new Set(data.products.map((p: Product) => p.category))];
};

// Fix product filtering
const filterProducts = (data: ProductsResponse, selectedCategory: string): Product[] => {
  if (!data?.products) return [];
  return data.products.filter((product) => 
    product.category === selectedCategory || selectedCategory === 'all'
  );
};

const ProductCard = ({ product }: { product: any }) => {
  const { isExpanded, toggleExpand, animatedHeight, contentRef } = useExpandable();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart, isInCart } = useCart();

  const stockPercentage = Math.min((product.stock / 150) * 100, 100);
  const ratingPercentage = (product.rating / 5) * 100;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setTimeout(() => addToCart(product), 0);
    // toast.success(`${product.title} ajouté au panier`);
  };

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <Card
      className="relative overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-md h-full flex flex-col border border-gray-100"
      onClick={toggleExpand}
    >
      <CardHeader className="p-0">
        <div className="aspect-square w-full overflow-hidden bg-gray-50">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </CardHeader>

      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg font-semibold line-clamp-1">{product.title}</CardTitle>
          <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
            {product.category}
          </Badge>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>

        <div className="mt-auto space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xl font-bold text-gray-900">${product.price}</p>
              {product.discountPercentage > 0 && (
                <p className="text-xs text-green-600">-{product.discountPercentage}%</p>
              )}
            </div>
            <p className="text-xs text-gray-500">{product.brand}</p>
          </div>

          <motion.div
            style={{ height: animatedHeight }}
            className="overflow-hidden"
            transition={{ duration: 0.3 }}
            onLayoutAnimationComplete={() => contentRef.current && contentRef.current.scrollHeight}
          >
            <div ref={contentRef} className="pt-3 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Stock</p>
                  <Progress
                    value={stockPercentage}
                    className="h-2 bg-gray-100"
                    indicatorClassName="bg-orange-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">{product.stock} unités</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Note</p>
                  <Progress
                    value={ratingPercentage}
                    className="h-2 bg-gray-100"
                    indicatorClassName="bg-yellow-400"
                  />
                  <p className="text-xs text-gray-500 mt-1">{product.rating.toFixed(1)}/5</p>
                </div>
              </div>

              {product.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {product.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {isExpanded && (
                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    onClick={handleAddToCart}
                    disabled={isInCart(product.id)}
                    className={`w-full gap-2 ${
                      isInCart(product.id) 
                        ? 'bg-green-500 hover:bg-green-500' 
                        : 'bg-orange-500 hover:bg-orange-600'
                    }`}
                  >
                    {isInCart(product.id) ? (
                      <>
                        <Check size={16} />
                        Déjà au panier
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={16} />
                        Ajouter
                      </>
                    )}
                  </Button>

                  <Button 
                    variant="outline"
                    onClick={handleDetailsClick}
                    className="border-orange-300 text-orange-600 hover:bg-orange-50"
                  >
                    Voir détails
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </CardContent>

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
    </Card>
  );
};

const ITEMS_PER_PAGE = 12;

const Produits = () => {
  const { data, isLoading, error } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const updateSearchParams = (newParams: Record<string, string>) => {
    const current = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...current, ...newParams });
  };

  const currentPage = Number(searchParams.get('page') || '1');

  const categories = useMemo(() => {
    if (!data?.products) return [];
    return getCategories(data);
  }, [data]);

  const filteredProducts = useMemo(() => {
    if (!data?.products) return [];

    return filterProducts(data, selectedCategory);
  }, [data, searchTerm, selectedCategory]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (newPage: number) => {
    updateSearchParams({ page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    updateSearchParams({ 
      page: '1',
      search: searchTerm,
      category: selectedCategory 
    });
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlCategory = searchParams.get('category') || 'all';
    setSearchTerm(urlSearch);
    setSelectedCategory(urlCategory);
  }, []);

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Erreur lors du chargement des produits
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Nos Produits</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Découvrez notre sélection de produits de qualité
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="search"
            placeholder="Rechercher un produit..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        >
          {categories.map((category: string) => (
            <option key={category} value={category}>
              {category === 'all' ? 'Toutes catégories' : category}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Loader moderne avec animation */}
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce"></div>
          </div>
          
          {/* Squelettes de chargement */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="border border-gray-100 rounded-lg overflow-hidden">
                <div className="bg-gray-100 aspect-square w-full"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    className="border-orange-300 text-orange-600 hover:bg-orange-50"
                  >
                    Précédent
                  </Button>
                  
                  <span className="text-sm text-gray-600">
                    Page {currentPage} sur {totalPages}
                  </span>
                  
                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    className="border-orange-300 text-orange-600 hover:bg-orange-50"
                  >
                    Suivant
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">Aucun produit trouvé</div>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                variant="ghost"
                className="text-orange-600"
              >
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Produits;