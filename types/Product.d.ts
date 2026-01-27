export interface IProduct {
  _id?: string;
  name: string;
  basePrice: number;
  price?: number;
  costPrice: number;
  stock: number;
  minStock: number;
  expiryDate?: Date;
  discount?: number;
  category: string | { _id: string; name: string };
  imageUrl?: string;
  imageFileId?: string;
  isActive?: boolean;
  sku?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
