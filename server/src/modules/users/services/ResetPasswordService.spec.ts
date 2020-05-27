import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository'

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'

import ResetPasswordService from './ResetPasswordService'
import AppError from '@shared/errors/AppError'

let fakeUsersRepository: FakeUsersRepository
let fakeUserTokensRepository: FakeUserTokensRepository

let fakeHashProvider: FakeHashProvider

let resetPassword: ResetPasswordService

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeUserTokensRepository = new FakeUserTokensRepository()
    fakeHashProvider = new FakeHashProvider()

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    )
  })

  it('should be able to reset password', async () => {
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')

    const { id } = await fakeUsersRepository.create({
      name: 'Kang Seul-gi',
      email: 'seul-gi@email.com',
      password: 'fjkahsdf7843287346siudf',
    })

    const { token } = await fakeUserTokensRepository.generate(id)

    const newPassword = 'n3w-p@ssw0rd'

    await resetPassword.execute({ token, password: newPassword })

    const updatedUser = await fakeUsersRepository.findById(id)

    expect(generateHash).toHaveBeenCalledWith(newPassword)
    expect(updatedUser).toHaveProperty('password', newPassword)
  })

  it('should not be able to reset password with a nonexistent token', async () => {
    await expect(
      resetPassword.execute({
        token: 'nonexistent-token',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to reset password of a nonexistent user', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'nonexistent-user-id',
    )

    await expect(
      resetPassword.execute({
        token,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to reset password if 2 hours have passed', async () => {
    const { id } = await fakeUsersRepository.create({
      name: 'Kang Seul-gi',
      email: 'seul-gi@email.com',
      password: 'fjkahsdf7843287346siudf',
    })

    const { token } = await fakeUserTokensRepository.generate(id)

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date()

      const hours = customDate.getHours() + 3

      return customDate.setHours(hours)
    })

    await expect(
      resetPassword.execute({
        token,
        password: 'n3w-p@ssw0rd',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
