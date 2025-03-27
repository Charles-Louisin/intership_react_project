export interface ProductDimensions {
    width: number;
    height: number;
    depth: number;
}

export interface ProductReview {
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
}

export interface ProductMeta {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
}

export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
    tags: string[];
    sku: string;
    weight: number;
    dimensions: ProductDimensions;
    warrantyInformation: string;
    shippingInformation: string;
    availabilityStatus: string;
    reviews: ProductReview[];
    returnPolicy: string;
    minimumOrderQuantity: number;
    meta: ProductMeta;
}

export interface ProductsResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
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
