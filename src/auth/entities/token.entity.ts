import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '@Users/entities';

@Entity()
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @ManyToOne(() => User, (user) => user.tokens, { onDelete: 'CASCADE' })
  user: User;
}
