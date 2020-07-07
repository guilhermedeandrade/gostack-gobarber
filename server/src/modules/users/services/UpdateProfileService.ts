import { injectable, inject } from 'tsyringe'

import User from '../infra/typeorm/entities/User'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'

import AppError from '@shared/errors/AppError'

interface IRequest {
  user_id: string
  name: string
  email: string
  oldPassword?: string
  password?: string
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    oldPassword,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id)

    if (!user) {
      throw new AppError('User not found')
    }

    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email)

    if (userWithUpdatedEmail && user.id !== userWithUpdatedEmail.id) {
      throw new AppError('This e-mail is already being used')
    }

    user.name = name
    user.email = email

    if (password && !oldPassword) {
      throw new AppError(
        'You cannot updated your password without providing the old one',
      )
    }

    if (password && oldPassword) {
      const isOldPasswordCorrect = await this.hashProvider.compareHash(
        oldPassword,
        user.password,
      )

      if (!isOldPasswordCorrect) {
        throw new AppError('Old password is invalid')
      }

      const newPasswordHashed = await this.hashProvider.generateHash(password)

      Object.assign(user, { password: newPasswordHashed })
    }

    await this.usersRepository.save(user)

    return user
  }
}

export default UpdateProfileService
