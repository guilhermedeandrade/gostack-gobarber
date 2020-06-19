import { uuid } from 'uuidv4'

import User from '@modules/users/infra/typeorm/entities/User'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO'
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO'

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = []

  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    return except_user_id
      ? this.users.filter(user => user.id !== except_user_id)
      : this.users
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.email === email)

    return findUser
  }

  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.id === id)

    return findUser
  }

  public async create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = new User()

    Object.assign(user, { id: uuid(), name, email, password })

    this.users.push(user)

    return user
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(({ id }) => id === user.id)

    if (findIndex !== -1) {
      this.users[findIndex] = user
    }

    return user
  }
}

export default FakeUsersRepository
