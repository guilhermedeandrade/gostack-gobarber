import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider'

import UpdateUserAvatarService from './UpdateUserAvatarService'

import AppError from '@shared/errors/AppError'

describe('CreateAppointmentService', () => {
  it("should be able to update a user's avatar", async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeStorageProvider = new FakeStorageProvider()

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    )

    const user = await fakeUsersRepository.create({
      name: 'Kang Seul-gi',
      email: 'seul-gi@email.com',
      password: 'fjkahsdf7843287346siudf',
    })

    const avatarFilename = 'avatar.jpg'

    const updatedUser = await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename,
    })

    expect(updatedUser).toHaveProperty('avatar', avatarFilename)
  })

  it('should not be able to update the avatar of a nonexistent user', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeStorageProvider = new FakeStorageProvider()

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    )

    expect(
      updateUserAvatar.execute({
        user_id: 'nonexistent-id',
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should delete the old avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeStorageProvider = new FakeStorageProvider()

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile')

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    )

    const user = await fakeUsersRepository.create({
      name: 'Kang Seul-gi',
      email: 'seul-gi@email.com',
      password: 'fjkahsdf7843287346siudf',
    })

    const avatarFilename = 'avatar.jpg'

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename,
    })

    const updatedAvatarFilename = `new-${avatarFilename}`

    const updatedUser = await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: updatedAvatarFilename,
    })

    expect(deleteFile).toHaveBeenCalledTimes(1)
    expect(deleteFile).toHaveBeenCalledWith(avatarFilename)

    expect(updatedUser).toHaveProperty('avatar', updatedAvatarFilename)
  })
})
