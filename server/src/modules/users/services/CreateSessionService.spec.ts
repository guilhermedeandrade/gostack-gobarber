import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'

import CreateSessionService from './CreateSessionService'
import CreateUserService from './CreateUserService'
import AppError from '@shared/errors/AppError'

describe('CreateSessionService', () => {
  it('should be able to create a new session', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    )

    const createSession = new CreateSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    )

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
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    )

    const createSession = new CreateSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    )

    await createUser.execute({
      name: 'Kang Seul-gi',
      email: 'seul-gi@email.com',
      password: 'fjkahsdf7843287346siudf',
    })

    expect(
      createSession.execute({
        email: 'seul-gi@email.com',
        password: 'invalid-password',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create a session with a nonexistent user', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()

    const createSession = new CreateSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    )

    expect(
      createSession.execute({
        email: 'joe@exotic.com',
        password: 'tigerK!NG',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
