import { User } from '../user.entity';

export interface UserRepository {
  create(user: User): Promise<User>;

  update(user: Partial<User>): Promise<User>;

  findOne(id: number): Promise<User>;

  findByEmail(email: string): Promise<User>;

  findByEgn(egn: string): Promise<User>;
}
