import { container } from 'tsyringe'
import { Request, Response } from 'express'
import { classToClass } from 'class-transformer'

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService'

class ProviderAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const provider_id = request.user.id
    const { day, month, year } = request.query

    const listProvidersAppointments = container.resolve(
      ListProviderAppointmentsService,
    )

    const appointments = await listProvidersAppointments.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    })

    return response.json(classToClass(appointments))
  }
}

export default ProviderAppointmentsController
