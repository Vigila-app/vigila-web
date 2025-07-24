export interface UnitI {
  id: string;
  userId: string;
  name?: string;
  description?: string;
  active?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
