import { Request, Response } from 'express'
import { omit } from 'remeda'
import { container } from 'tsyringe'

import CreateSessionService from '@modules/users/services/CreateSessionService'

class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body

    const createSession = container.resolve(CreateSessionService)

    const { user, token } = await createSession.execute({ email, password })

    const userWithoutPassword = omit(user, ['password'])

    return response.json({ user: userWithoutPassword, token })
  }
}

export default SessionsController
