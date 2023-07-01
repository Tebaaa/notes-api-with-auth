import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '@Core/entities';
import { Token } from '@Auth/entities';
import { Note } from '@Notes/entities';

import { IUser } from '../interfaces';

@Entity()
export class User extends BaseEntity implements IUser {
  @Column()
  firstName: string;

  @Column({ nullable: true })
  secondName?: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];

  @OneToMany(() => Note, (note) => note.user)
  notes: Note[];
}
