import { container } from 'tsyringe'
import { Request, Response } from 'express'

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService'

class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params
    const { day, month, year } = request.body

    const listProvidersDayAvailability = container.resolve(
      ListProviderDayAvailabilityService,
    )

    const availability = await listProvidersDayAvailability.execute({
      provider_id,
      day,
      month,
      year,
    })

    return response.json(availability)
  }
}

export default ProviderDayAvailabilityController
