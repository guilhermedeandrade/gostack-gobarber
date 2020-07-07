import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'

import CreateUserService from './CreateUserService'

import AppError from '@shared/errors/AppError'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let fakeCacheProvider: FakeCacheProvider

let createUser: CreateUserService

describe('CreateAppointmentService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()
    fakeCacheProvider = new FakeCacheProvider()

    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    )
  })

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'Kang Seul-gi',
      email: 'seul-gi@email.com',
      password: 'fjkahsdf7843287346siudf',
    })

    expect(user).toHaveProperty('id')
  })

  it('should not be able to create a new user with an already used e-mail', async () => {
    const userEmail = 'seul-gi@email.com'

    await createUser.execute({
      name: 'Kang Seul-gi',
      email: userEmail,
      password: 'fjkahsdf7843287346siudf',
    })

    expect(
      createUser.execute({
        name: 'Kang Seul-gi',
        email: userEmail,
        password: 'fjkahsdf7843287346siudf',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
