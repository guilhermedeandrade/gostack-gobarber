import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'

import ShowProfileService from './ShowProfileService'
import AppError from '@shared/errors/AppError'

let fakeUsersRepository: FakeUsersRepository

let showProfile: ShowProfileService

describe('ShowProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()

    showProfile = new ShowProfileService(fakeUsersRepository)
  })

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Kang Seul-gi',
      email: 'seul-gi@email.com',
      password: 'fjkahsdf7843287346siudf',
    })

    const profile = await showProfile.execute({
      user_id: user.id,
    })

    expect(profile).toHaveProperty('name', 'Kang Seul-gi')
    expect(profile).toHaveProperty('email', 'seul-gi@email.com')
  })

  it('should not be able to show the profile of a nonexistent user', async () => {
    await expect(
      showProfile.execute({
        user_id: 'nonexistent-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
