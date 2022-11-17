import { number } from 'yup';

export type Image = {
  _id?: string;
  ref?: string;
  url?: string;
};

export interface IFood {
  _id?: string;
  name?: string;
  categoryId?: string;
  price?: number;
  images?: Image[];
  posterImage?: Image;
  description?: string;
  bestDeals?: boolean;
  popular?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IFoods {
  foods: IFood[];
  totalItems: number;
}

export interface ICategory {
  _id?: string;
  name?: string;
  image?: string;
  imageRef?: string;
  popular?: boolean;
  foods?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategories {
  categories: ICategory[];
  totalItems: number;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface ICart {
  // define cart type in here
}

export interface IUser {
  _id?: string;
  email?: string;
  name?: string;
  cart?: ICart[];
  createdAt?: Date;
  updatedAt?: Date;
  role?: string;
}
