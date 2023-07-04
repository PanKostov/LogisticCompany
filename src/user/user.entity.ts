import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  userName: string;

  @Column()
  password: string;

  @Column({ unique: true })
  egn: string;

  @Column()
  isEmployee: boolean;
}
