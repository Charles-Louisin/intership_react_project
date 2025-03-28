export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnail: string;
  rating: number;
  stock: number;
  [key: string]: any;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductReview {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  comment: string;
  createdAt: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export enum ProductFilterType {
  CATEGORY = "Category",
  PRICE_RANGE = "Price Range",
  RATING = "Rating",
  BRAND = "Brand",
  TAGS = "Tags",
  STOCK = "Stock Status"
}

export enum PriceRange {
  UNDER_50 = "Under $50",
  UNDER_100 = "$50 - $100",
  UNDER_500 = "$100 - $500",
  UNDER_1000 = "$500 - $1000",
  ABOVE_1000 = "Above $1000"
}

export enum StockStatus {
  IN_STOCK = "In Stock",
  LOW_STOCK = "Low Stock",
  OUT_OF_STOCK = "Out of Stock"
}

export enum RatingFilter {
  FIVE_STARS = "5 stars",
  FOUR_PLUS = "4+ stars",
  THREE_PLUS = "3+ stars",
  TWO_PLUS = "2+ stars",
  ONE_PLUS = "1+ stars"
}
