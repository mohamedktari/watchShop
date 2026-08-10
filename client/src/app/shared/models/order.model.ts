import { Product } from './product.model';

export type OrderStatus = 'EN_ATTENTE' | 'CONFIRMEE' | 'ANNULEE';

export interface Order {
  _id: string;
  product: Product;
  quantity: number;
  nom: string;
  prenom: string;
  telephone: string;
  ville: string;
  adresse: string;
  statut: OrderStatus;
  createdAt: string;
}

export interface NewOrderPayload {
  productId: string;
  quantity: number;
  nom: string;
  prenom: string;
  telephone: string;
  ville: string;
  adresse: string;
}
