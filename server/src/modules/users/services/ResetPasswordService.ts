import { injectable, inject } from 'tsyringe'

import IUserTokensRepository from '../repositories/IUserTokensRepository'
import IUsersRepository from '../repositories/IUsersRepository'

import IHashProvider from '../providers/HashProvider/models/IHashProvider'

import AppError from '@shared/errors/AppError'
import { differenceInHours } from 'date-fns'

interface IRequest {
  token: string
  password: string
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token)

    if (!userToken) {
      throw new AppError('User token does not exist')
    }

    const user = await this.usersRepository.findById(userToken.user_id)

    if (!user) {
      throw new AppError('User does not exist')
    }

    if (differenceInHours(Date.now(), userToken.created_at) > 2) {
      throw new AppError('The token has expired')
    }

    const hashedPassword = await this.hashProvider.generateHash(password)

    user.password = hashedPassword

    await this.usersRepository.save(user)
  }
}

export default ResetPasswordService
