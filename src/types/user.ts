export interface LoginCredentials {
    username: string;
    password: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    token: string;
    image: string;
}

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  maidenName?: string;
  age?: number;
  gender?: string;
  email: string;
  phone?: string;
  username: string;
  birthDate?: string;
  image: string;
  bloodGroup?: string;
  [key: string]: any; // Allow string indexing
}
