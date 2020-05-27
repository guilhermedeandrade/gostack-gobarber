import { injectable, inject } from 'tsyringe'
import path from 'path'

import IUserTokensRepository from '../repositories/IUserTokensRepository'
import IUsersRepository from '../repositories/IUsersRepository'

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider'

import AppError from '@shared/errors/AppError'

interface IRequest {
  email: string
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new AppError('This email is not associated to a registered user')
    }

    const { token } = await this.userTokensRepository.generate(user.id)

    const forgotPasswordTemplatePath = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    )

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[GoBarber] Recover password',
      templateData: {
        file: forgotPasswordTemplatePath,
        variables: {
          name: user.name,
          link: `http://localhost:3000/reset_password?token=${token}`,
        },
      },
    })
  }
}

export default SendForgotPasswordEmailService
