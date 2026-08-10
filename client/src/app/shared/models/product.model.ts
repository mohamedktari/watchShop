export interface Product {
  _id: string;
  nameFr: string;
  nameAr: string;
  descriptionFr: string;
  descriptionAr: string;
  price: number;
  images: string[];
  stock: number;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
