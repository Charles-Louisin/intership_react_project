import { ProductReview } from '../types/product';

export const getStoredReviews = (productId: number): ProductReview[] => {
  const stored = localStorage.getItem(`product_reviews_${productId}`);
  return stored ? JSON.parse(stored) : [];
};

export const saveReview = (productId: number, review: ProductReview, existingReviews: ProductReview[]) => {
  const allReviews = [review, ...existingReviews];
  localStorage.setItem(`product_reviews_${productId}`, JSON.stringify(allReviews));
  return allReviews;
};
