import { Column, Entity } from 'typeorm';

import { BaseEntity } from '@Core/entities';

import { IUser } from '../interfaces';

@Entity()
export class User extends BaseEntity implements IUser {
  @Column()
  firstName: string;

  @Column()
  secondName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
