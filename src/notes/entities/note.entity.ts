import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from '@Core/entities';
import { User } from '@Users/entities';

@Entity()
export class Note extends BaseEntity {
  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ default: false })
  isArchived: boolean;

  @ManyToOne(() => User, (user) => user.notes, { onDelete: 'CASCADE' })
  user: User;
}
