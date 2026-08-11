export interface Product {
  _id: string;
  nameFr: string;
  nameAr: string;
  descriptionFr: string;
  descriptionAr: string;
  price: number;
  discountPrice: number | null;
  images: string[];
  stock: number;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
