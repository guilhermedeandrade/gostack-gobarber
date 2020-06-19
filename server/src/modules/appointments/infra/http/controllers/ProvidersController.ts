import { container } from 'tsyringe'
import { Request, Response } from 'express'

import ListProvidersService from '@modules/appointments/services/ListProvidersService'

class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listProviders = container.resolve(ListProvidersService)

    const providers = await listProviders.execute({ user_id: request.user.id })

    return response.json(providers)
  }
}

export default ProvidersController
