export type Role = 'student' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  role: Role;
  department?: string;
  year?: string;
  address?: string;
  phoneNumber?: string;
  location?: { lat: number; lng: number };
  dateOfBirth?: string;
  createdAt: string;
}

export interface KitItem {
  id: string;
  name: string;
  image: string;
}

export interface Kit {
  id: string;
  name: string;
  description: string;
  price: number;
  items: KitItem[];
  image: string;
  category: string;
}

export type OrderStatus = 'Pending' | 'Packed' | 'Out for Delivery' | 'Delivered';

export interface OrderItem {
  id: string;
  kitId: string;
  kitName: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userDepartment: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: 'COD' | 'Online';
  transactionId?: string;
  address?: string;
  phoneNumber?: string;
  location?: { lat: number; lng: number };
  orderDate: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  role: Role | null;
  isAuthenticated: boolean;
}
