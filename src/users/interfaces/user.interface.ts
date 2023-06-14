import { BaseEntity } from '@Core/entities';

export interface IUser extends BaseEntity {
  firstName: string;
  secondName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
}
