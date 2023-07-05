import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Blacklist {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;
}
