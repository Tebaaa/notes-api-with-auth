import { Column, Entity } from 'typeorm';

import { BaseEntity } from '@Core/entities';

@Entity()
export class User extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  secondName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
