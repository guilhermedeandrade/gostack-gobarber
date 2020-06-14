import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'

import UpdateProfileService from './UpdateProfileService'
import AppError from '@shared/errors/AppError'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider

let updateProfile: UpdateProfileService

describe('UpdateProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    )
  })

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Kang Seul-gi',
      email: 'seul-gi@email.com',
      password: 'fjkahsdf7843287346siudf',
    })

    const newName = 'New name'
    const newEmail = 'new@email.com'

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: newName,
      email: newEmail,
    })

    expect(updatedUser).toHaveProperty('name', newName)
    expect(updatedUser).toHaveProperty('email', newEmail)
  })

  it('should not be able to update the profile of a nonexistent user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'nonexistent-user-id',
        name: 'Kang Seul-gi',
        email: 'seul-gi@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should be able to update the name only', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Kang Seul-gi',
      email: 'seul-gi@email.com',
      password: 'fjkahsdf7843287346siudf',
    })

    const newName = 'New name'

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: newName,
      email: user.email,
    })

    expect(updatedUser).toHaveProperty('name', newName)
  })

  it("should not be able to update the email using another user's e-mail", async () => {
    const user = await fakeUsersRepository.create({
      name: 'Kang Seul-gi',
      email: 'seul-gi@email.com',
      password: 'fjkahsdf7843287346siudf',
    })

    const anotherUser = await fakeUsersRepository.create({
      name: 'Another User',
      email: 'another-user@email.com',
      password: 'kjsdfhaskj37632asdgkj',
    })

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: user.name,
        email: anotherUser.email,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should be able to update the password', async () => {
    const oldPassword = 'old-password'

    const user = await fakeUsersRepository.create({
      name: 'Kang Seul-gi',
      email: 'seul-gi@email.com',
      password: oldPassword,
    })

    const newPassword = 'new-password'

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: user.name,
      email: user.email,
      password: newPassword,
      oldPassword,
    })

    expect(updatedUser).toHaveProperty('password', newPassword)
  })

  it('should not be able to update the password when an invalid old password is provided', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Kang Seul-gi',
      email: 'seul-gi@email.com',
      password: 'fjkahsdf7843287346siudf',
    })

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: user.name,
        email: user.email,
        password: 'new-password',
        oldPassword: 'invalid-password',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
