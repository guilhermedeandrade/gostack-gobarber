import { Request, Response } from 'express'
import { omit } from 'remeda'
import { container } from 'tsyringe'

import CreateUserService from '@modules/users/services/CreateUserService'

class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body

    const createUser = container.resolve(CreateUserService)

    const user = await createUser.execute({ name, email, password })

    const userWithoutPassword = omit(user, ['password'])

    return response.status(201).json(userWithoutPassword)
  }
}

export default UsersController
