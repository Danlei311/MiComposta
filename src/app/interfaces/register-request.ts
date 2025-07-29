export interface RegisterRequest {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  password: string | null;  // Contraseña opcional
}