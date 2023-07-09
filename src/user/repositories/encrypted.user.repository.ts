// import { Injectable } from '@nestjs/common/decorators';
// import { UserRepository } from './user.repository';
// import { User } from '../user.entity';
// import { Repository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Encryptor } from '../../other/encryptor';
// import { DefaultUserRepository } from './default.user.repository';

// @Injectable()
// export class EncryptedUserRepository implements UserRepository {
//   constructor(
//     @InjectRepository(User) private repo: Repository<User>,
//     private defaultUserRepository: DefaultUserRepository,
//     private encryptor: Encryptor,
//   ) {
//     this.encryptor = new Encryptor('Password used to generate key');
//   }

//   async create(user: User): Promise<User> {
//     const userCreated = await User.from(user).encryptFields(this.encryptor);
//     const persistedUser = await this.repo.save(userCreated);
//     return persistedUser.decryptFields(this.encryptor);
//   }

//   async update(user: Partial<User>): Promise<User> {
//     user.egn = user.egn && (await this.encryptor.encryptText(user.egn));
//     const userUpdated = User.from(user);
//     await this.repo.save(userUpdated);
//     return userUpdated.decryptFields(this.encryptor);
//   }

//   async findOne(id: number): Promise<User> {
//     const user = await this.defaultUserRepository.findOne(id);
//     return user.decryptFields(this.encryptor);
//   }

//   async findByEmail(email: string): Promise<User> {
//     const user = await this.defaultUserRepository.findByEmail(email);
//     return user.decryptFields(this.encryptor);
//   }

//   findByEgn(egn: string): Promise<User> {

//   }
// }
