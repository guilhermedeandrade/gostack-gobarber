import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'

import CreateSessionService from './CreateSessionService'
import CreateUserService from './CreateUserService'

import AppError from '@shared/errors/AppError'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let fakeCacheProvider: FakeCacheProvider

let createUser: CreateUserService
let createSession: CreateSessionService

describe('CreateSessionService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()
    fakeCacheProvider = new FakeCacheProvider()

    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    )

    createSession = new CreateSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    )
  })

  it('should be able to create a new session', async () => {
    const userPassword = 'fjkahsdf7843287346siudf'

    const user = await createUser.execute({
      name: 'Kang Seul-gi',
      email: 'seul-gi@email.com',
      password: userPassword,
    })

    const session = await createSession.execute({
      email: 'seul-gi@email.com',
      password: userPassword,
    })

    expect(session).toHaveProperty('token')
    expect(session.user).toEqual(user)
  })

  it('should not be able to create a session with an invalid password', async () => {
    await createUser.execute({
      name: 'Kang Seul-gi',
      email: 'seul-gi@email.com',
      password: 'fjkahsdf7843287346siudf',
    })

    await expect(
      createSession.execute({
        email: 'seul-gi@email.com',
        password: 'invalid-password',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create a session with a nonexistent user', async () => {
    await expect(
      createSession.execute({
        email: 'joe@exotic.com',
        password: 'tigerK!NG',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
