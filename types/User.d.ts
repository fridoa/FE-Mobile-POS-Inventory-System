import { TRole } from "./Auth"; 

export interface IUser {
  _id?: string;
  name: string;
  username: string;
  role: TRole;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
