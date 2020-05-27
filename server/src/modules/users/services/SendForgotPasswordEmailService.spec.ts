import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository'
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider'

import SendForgotPasswordEmailService from './SendForgotPasswordEmailService'

import AppError from '@shared/errors/AppError'

let fakeUsersRepository: FakeUsersRepository
let fakeUserTokensRepository: FakeUserTokensRepository
let fakeMailProvider: FakeMailProvider

let sendForgotPasswordEmail: SendForgotPasswordEmailService

describe('SendForgotPasswordEmailService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeUserTokensRepository = new FakeUserTokensRepository()
    fakeMailProvider = new FakeMailProvider()

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeMailProvider,
    )
  })

  it('should be able to send forgot password email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail')

    const userEmail = 'seul-gi@email.com'

    await fakeUsersRepository.create({
      name: 'Kang Seul-gi',
      email: userEmail,
      password: 'fjkahsdf7843287346siudf',
    })

    await sendForgotPasswordEmail.execute({ email: userEmail })

    expect(sendMail).toHaveBeenCalled()
  })

  it('should not be able to recover the password of a nonexistent user', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'nonexistent-user@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate')

    const userEmail = 'seul-gi@email.com'

    const user = await fakeUsersRepository.create({
      name: 'Kang Seul-gi',
      email: userEmail,
      password: 'fjkahsdf7843287346siudf',
    })

    await sendForgotPasswordEmail.execute({ email: userEmail })

    expect(generateToken).toHaveBeenCalledTimes(1)
    expect(generateToken).toHaveBeenCalledWith(user.id)
  })
})
