import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'

import ListProvidersService from './ListProvidersService'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'

let fakeUsersRepository: FakeUsersRepository
let fakeCacheProvider: FakeCacheProvider

let listProviders: ListProvidersService

describe('ListProvidersService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeCacheProvider = new FakeCacheProvider()

    listProviders = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    )
  })

  it('should be able to list all providers', async () => {
    const firstUser = await fakeUsersRepository.create({
      name: 'Kang Seul-gi',
      email: 'seul-gi@email.com',
      password: 'fjkahsdf7843287346siudf',
    })

    const secondUser = await fakeUsersRepository.create({
      name: 'Zwei',
      email: 'zwei@email.com',
      password: 'hallowiegehts',
    })

    const loggedUser = await fakeUsersRepository.create({
      name: 'Logged User',
      email: 'logged@email.com',
      password: 'random-password-123',
    })

    const providers = await listProviders.execute({ user_id: loggedUser.id })

    expect(providers).toStrictEqual([firstUser, secondUser])
  })
})
