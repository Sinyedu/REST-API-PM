export interface User extends Document {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}
